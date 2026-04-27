// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {DailyCheckIn} from "../src/DailyCheckIn.sol";

contract DailyCheckInScript is Script {
    function run() public returns (DailyCheckIn deployed) {
        vm.startBroadcast();
        deployed = new DailyCheckIn();
        vm.stopBroadcast();
    }
}
