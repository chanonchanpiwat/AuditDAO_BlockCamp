// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ILevelFactory.sol";

contract LevelFactory is ILevelFactory, Ownable {
    mapping(address => uint256) public auditor;

    function fillExp(address target, uint256 _amount) external override onlyOwner {
        auditor[target] += _amount;
    }

    function drainExp(address target, uint256 _amount) external override onlyOwner {
        auditor[target] -= _amount;
    }

    function getUserLV(address target) external view override returns (uint256) {
        return auditor[target];
    }
}
