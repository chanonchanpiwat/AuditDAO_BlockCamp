// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// Function
// //Defi owner()
// -fillExp
// -drainExp

// //External
// -getUserLv

interface ILevelFactory {
    function fillExp(address target, uint256 _amount) external;

    function drainExp(address target, uint256 _amount) external;

    function getUserLV(address target) external view returns (uint256);
}
