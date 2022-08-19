// We require the Hardhat Runtime Environment explicitly here. This is optional;
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.

import { ethers, run } from "hardhat";
import { delay } from "./actions/helper";

//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled

  const levelFactory = await ethers.getContractFactory("LevelFactory");
  const level = await levelFactory.deploy();
  await level.deployed();
  console.log(`Level contract deployed to: ${level.address}\n`);

  const [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

  const TestToken = await ethers.getContractFactory("TestToken");
  const initialSupply = ethers.utils.parseEther("100000000");

  const testToken = await TestToken.deploy(initialSupply);
  console.log(`Tx hash: ${testToken.deployTransaction.hash}`);
  await testToken.deployed();
  console.log(`Token contract deployed to: ${testToken.address}\n`);

  testToken.transfer("0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44", ethers.utils.parseEther("1000000"));

  const auditorConfig = [
    ["0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44", owner.address],
    ["0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44", owner.address],
    testToken.address,
    level.address,
  ];
  const Auditorium = await ethers.getContractFactory("Auditorium");
  const auditorium = await Auditorium.deploy(
    ["0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44", owner.address],
    ["0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44", owner.address],
    testToken.address,
    level.address
  );

  await auditorium.deployed();
//   await delay(1000 * 60);
//   console.group("Verify Contract... \n");
//   await run("verify:verify", {
//     address: auditorium.address,
//     constructorArguments: auditorConfig,
//     contract: "contracts/Auditorium.sol:Auditorium",
//   });
//   await level.transferOwnership(auditorium.address);
//   console.groupEnd();

//   await level.transferOwnership(auditorium.address);
//   console.log(`Auditorium contract deployed to: ${auditorium.address}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
