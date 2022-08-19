// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.

import { ethers, run } from "hardhat";
import { delay } from "./actions/helper";

//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  const dayToSeconds = 24 * 60 * 60;
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled

  const levelFactory = await ethers.getContractFactory("LevelFactory");
  const level = await levelFactory.deploy();
  await level.deployed();
  await delay(1000 * 60);
  console.group("Verify Contract... \n");
  await run("verify:verify", {
    address: level.address,
    constructorArguments: [],
    contract: "contracts/LevelFactory.sol:LevelFactory",
  });
  console.groupEnd();

  const [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

  const TestToken = await ethers.getContractFactory("TestToken");
  const initialSupply = ethers.utils.parseEther("100000000");

  const testToken = await TestToken.deploy(initialSupply);
  console.log(`Tx hash: ${testToken.deployTransaction.hash}`);
  await testToken.deployed();
  console.log(`Token Contract deployed to: ${testToken.address}\n`);

  testToken.transfer("0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44", ethers.utils.parseEther("1000000"));

  const Auditorium = await ethers.getContractFactory("Auditorium");
  const auditorConfig = [
    ["0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44", owner.address],
    ["0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44", owner.address],
    testToken.address,
    level.address,
  ];
  const auditorium = await Auditorium.deploy(
    ["0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44", owner.address],
    ["0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44", owner.address],
    testToken.address,
    level.address
  );
  await auditorium.deployed();
  await delay(1000 * 60);
  console.group("Verify Contract... \n");
  await run("verify:verify", {
    address: testToken.address,
    constructorArguments:auditorConfig,
    contract: "contracts/TestToken.sol:TestToken",
  });
  await level.transferOwnership(auditorium.address);
  console.groupEnd();
  console.log(`Level contract deployed to: ${auditorium.address}\n`);

  // testToken.transfer(auditorium.address, ethers.utils.parseEther("1000000"));
  const rewardAmount = ethers.utils.parseEther("10000");
  await testToken.approve(auditorium.address, ethers.constants.MaxUint256);

  let res = await auditorium.propose(7 * dayToSeconds, rewardAmount, 3, 2);
  // console.log("Propose result: ", res);
  res = await auditorium.propose(7 * dayToSeconds, rewardAmount, 3, 2);
  const d_rest = await res.wait();
  const txEvent = d_rest.events?.find((e) => e.event === "Propose");
  const proposalId = (txEvent?.args?.proposalId).toNumber();
  console.log("Propose ID: ", proposalId);

  const proposals = await auditorium.getAllProposal();
  console.log("all Proposals: ", proposals);

  await auditorium.approve(proposalId);

  let proposal = await auditorium.getProposal(proposalId);
  console.log("Proposal: ", proposal);

  await auditorium.acceptTask(proposalId, false);
  await auditorium.connect(addr1).acceptTask(proposalId, true);
  const proposalAuditors = await auditorium.getProposalAuditor(proposalId);

  console.log("Proposal Auditors: ", proposalAuditors);

  await auditorium.unlockReward(proposalId);
  proposal = await auditorium.getProposal(proposalId);
  console.log("Proposal: ", proposal);

  let balance = await testToken.balanceOf(owner.address);
  console.log("Owner balance: ", ethers.utils.formatEther(balance));
  await auditorium.cliamFund(proposalId);
  balance = await testToken.balanceOf(owner.address);
  console.log("Owner balance: ", ethers.utils.formatEther(balance));

  // res = await auditorium.propose(7 * dayToSeconds, rewardAmount, 3, 2);
  // console.log("Propose result: ", res);

  //   const Bank = await ethers.getContractFactory("Bank");
  //   const bank = await Bank.deploy(raiStone.address);

  //   console.group("\nDeploying Bank Contract... \n");
  //   console.log(`Tx hash: ${raiStone.deployTransaction.hash}`);
  //   await bank.deployed();
  //   console.log(`Contract deployed to: ${raiStone.address}\n`);
  //   console.groupEnd();

  //   await delay(1000 * 60);

  //   console.group("Verify Contract... \n");
  //   await run("verify:verify", {
  //     address: bank.address,
  //     constructorArguments: [raiStone.address],
  //     contract: "contracts/Bank.sol:Bank",
  //   });
  //   console.groupEnd();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
