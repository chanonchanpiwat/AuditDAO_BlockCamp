// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ILevelFactory.sol";

contract Auditorium is AccessControl, ReentrancyGuard {
    event Propose(address indexed sender, uint256 proposalId);
    event Approve(address indexed sender, uint256 proposalId);
    event Refund(address indexed sender, uint256 amount);
    event Reward(address[] indexed inspector, uint256 proposalId, uint256 reward);

    IERC20 private token;
    ILevelFactory levelFactory;
    uint256 public timeout = 7 days;
    mapping(address => uint256) balanceOf;
    // mapping(uint256 => Proposal) proposals;

    Proposal[] public proposals;
    mapping(uint256 => ProposalAuditor) proposalAuditors;
    mapping(uint256 => mapping(address => bool)) isReEntry;
    mapping(uint256 => mapping(address => bool)) isCliamed;
    mapping(address => uint256) userBalance;
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER");

    enum Status {
        rejected,
        pending,
        aprroved,
        refunded,
        completed
    }

    struct Auditor {
        address auditor;
        uint256 level;
    }

    struct ProposalAuditor {
        uint256 highAuditMax;
        uint256 midAuditMax;
        address[] highAuditors;
        address[] midAuditors;
    }

    struct Proposal {
        address proposer;
        uint256 start;
        uint256 period;
        Status state;
        uint256 bounty;
    }

    constructor(
        address[] memory approver,
        address[] memory proposer,
        IERC20 _token,
        ILevelFactory _levelFactory
    ) {
        levelFactory = _levelFactory;
        token = IERC20(_token);
        for (uint256 i = 0; i < approver.length; ++i) {
            _setupRole(APPROVER_ROLE, approver[i]);
        }
        for (uint256 i = 0; i < proposer.length; ++i) {
            _setupRole(PROPOSER_ROLE, proposer[i]);
        }
    }

    modifier onlyApprover() {
        require(hasRole(APPROVER_ROLE, msg.sender), "Approver role is required");
        _;
    }

    modifier onlyProposer() {
        require(hasRole(PROPOSER_ROLE, msg.sender), "Proposer role is required");
        _;
    }

    //role
    function setTimeout(uint256 _timeout) external onlyApprover {
        timeout = _timeout;
    }

    //msg.sender
    function _deposit(address from, uint256 _amount) internal {
        require(token.balanceOf(from) >= _amount, "Insufficient token balance");
        require(token.allowance(from, address(this)) >= _amount, "Contract must be approved");
        token.transferFrom(from, address(this), _amount);
    }

    function propose(
        uint256 _period,
        uint256 _amount,
        uint256 _highAuditMax,
        uint256 _midAuditMax
    ) external returns (uint256 proposalId_) {
        _deposit(msg.sender, _amount);

        Proposal memory proposal = Proposal(msg.sender, _period, _amount, Status.pending, _amount);

        proposals.push(proposal);

        uint256 proposalId = proposals.length - 1;

        proposalAuditors[proposalId] = ProposalAuditor({
            highAuditMax: _highAuditMax,
            midAuditMax: _midAuditMax,
            highAuditors: new address[](0),
            midAuditors: new address[](0)
        });
        emit Propose(msg.sender, proposalId);
        return proposalId;
    }

    function approve(uint256 proposalId) external onlyApprover {
        Proposal storage proposal = proposals[proposalId];
        proposal.start = block.timestamp;
        proposal.state = Status.aprroved;
        emit Approve(msg.sender, proposalId);
    }

    function acceptTask(uint256 _proposalId, bool isHighAudit) external {
        require(proposals[_proposalId].state == Status.aprroved, "Proposal is not pending");
        require(!isReEntry[_proposalId][msg.sender], "You have already accepted this task");

        uint256 highAudiorMax = proposalAuditors[_proposalId].highAuditMax;
        address[] storage highAuditors = proposalAuditors[_proposalId].highAuditors;

        uint256 lowAuditorMax = proposalAuditors[_proposalId].midAuditMax;
        address[] storage midAuditors = proposalAuditors[_proposalId].midAuditors;

        if (isHighAudit && highAudiorMax - highAuditors.length > 0) {
            proposalAuditors[_proposalId].highAuditMax--;
            proposalAuditors[_proposalId].highAuditors.push(msg.sender);
        } else if (!isHighAudit && lowAuditorMax - midAuditors.length > 0) {
            proposalAuditors[_proposalId].midAuditMax--;
            proposalAuditors[_proposalId].midAuditors.push(msg.sender);
        }
        isReEntry[_proposalId][msg.sender] = true;
    }

    function sumWeight(address[] memory auditors) internal view returns (uint256, uint256[] memory) {
        uint256 sum = 0;
        uint256[] memory weights = new uint256[](auditors.length);
        for (uint256 i = 0; i < auditors.length; ++i) {
            uint256 level = levelFactory.getUserLV(auditors[i]) / 100;
            if (level >= 10) {
                sum += 3;
                weights[i] = 3;
            } else if (level >= 5) {
                sum += 2;
                weights[i] = 2;
            } else if (level >= 0) {
                sum += 1;
                weights[i] = 1;
            }
        }
        return (sum, weights);
    }

    function unlockReward(uint256 _proposalId) external onlyApprover {
        require(
            proposals[_proposalId].start <= proposals[_proposalId].start + proposals[_proposalId].period,
            "Out of time"
        );
        require(proposals[_proposalId].state == Status.aprroved, "Proposal must be approved");

        uint256 heightAuditorReward = (proposals[_proposalId].bounty * 60) / 100;
        address[] storage highAuditors = proposalAuditors[_proposalId].highAuditors;
        (uint256 highAuditorSumWeight, uint256[] memory highAuditorsWeight) = sumWeight(highAuditors);
        uint256 rewardPerHighAuditor = heightAuditorReward / highAuditorSumWeight;
        for (uint256 i = 0; i < highAuditors.length; i++) {
            userBalance[highAuditors[i]] += highAuditorsWeight[i] * rewardPerHighAuditor;
            levelFactory.fillExp(highAuditors[i], 20);
        }

        uint256 midAuditorReward = (proposals[_proposalId].bounty * 40) / 100;
        address[] storage midAuditors = proposalAuditors[_proposalId].midAuditors;
        (uint256 midAuditorSumWeight, uint256[] memory midAuditorsWeight) = sumWeight(midAuditors);
        uint256 rewardPerMidAuditor = midAuditorReward / midAuditorSumWeight;
        for (uint256 i = 0; i < midAuditors.length; i++) {
            userBalance[midAuditors[i]] += midAuditorsWeight[i] * rewardPerMidAuditor;
            levelFactory.fillExp(highAuditors[i], 20);
        }

        proposals[_proposalId].state = Status.completed;
    }

    function cliamFund(uint256 _proposalId) external nonReentrant {
        require(proposals[_proposalId].state == Status.completed, "Proposal must be approved");
        require(userBalance[msg.sender] >= 0, "Insufficient balance");
        token.transfer(msg.sender, userBalance[msg.sender]);
        userBalance[msg.sender] = 0;
    }

    function setRefundState(uint256 _proposalId) external onlyApprover {
        proposals[_proposalId].state = Status.refunded;
    }

    function _refund(uint256 _amount) internal {
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient token balance");
        emit Refund(msg.sender, _amount);
    }

    function refund(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.proposer == msg.sender, "can withdraw only your deposition");
        require(proposal.state != Status.refunded, "you have been defunded");
        uint256 amount = proposal.bounty;
        if (proposal.state == Status.rejected) {
            proposal.state = Status.refunded;
            _refund(amount);
        } else if (proposal.start + proposal.period > block.timestamp) {
            proposal.state = Status.refunded;
            _refund(amount);
        } else if (proposal.start + timeout > block.timestamp) {
            proposal.state = Status.refunded;
            _refund(amount);
        } else {
            revert("contract are under audited process");
        }
    }

    function getAllProposal() external view returns (Proposal[] memory) {
        return proposals;
    }

    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }

    function getProposalAuditor(uint256 _proposalId) external view returns (ProposalAuditor memory) {
        return proposalAuditors[_proposalId];
    }
}
