// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {DailyCheckIn} from "../src/DailyCheckIn.sol";

contract DailyCheckInTest is Test {
    DailyCheckIn internal checkIn;
    address internal user = address(0xBEEF);

    function setUp() public {
        checkIn = new DailyCheckIn();
        vm.deal(user, 1 ether);
    }

    function test_CheckInEmitsAndStoresDay() public {
        vm.warp(2 days + 10);
        vm.prank(user);
        checkIn.checkIn();

        assertEq(checkIn.lastCheckInDay(user), 2);
    }

    function test_RevertsOnSecondCheckInSameDay() public {
        vm.warp(5 days + 1 hours);

        vm.startPrank(user);
        checkIn.checkIn();
        vm.expectRevert(DailyCheckIn.AlreadyCheckedInToday.selector);
        checkIn.checkIn();
        vm.stopPrank();
    }

    function test_AllowsCheckInNextDay() public {
        vm.warp(9 days + 10);
        vm.prank(user);
        checkIn.checkIn();

        vm.warp(10 days + 5);
        vm.prank(user);
        checkIn.checkIn();

        assertEq(checkIn.lastCheckInDay(user), 10);
    }

    function test_RevertsWhenValueSent() public {
        vm.warp(3 days + 7);
        vm.prank(user);
        vm.expectRevert(DailyCheckIn.ValueNotAllowed.selector);
        checkIn.checkIn{value: 1 wei}();
    }
}
