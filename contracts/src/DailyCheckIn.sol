// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DailyCheckIn {
    error ValueNotAllowed();
    error AlreadyCheckedInToday();

    event CheckedIn(address indexed user, uint256 dayId, uint256 timestamp);

    mapping(address => uint256) public lastCheckInDay;

    function checkIn() external payable {
        if (msg.value != 0) revert ValueNotAllowed();

        uint256 dayId = block.timestamp / 1 days;
        if (lastCheckInDay[msg.sender] == dayId) revert AlreadyCheckedInToday();

        lastCheckInDay[msg.sender] = dayId;
        emit CheckedIn(msg.sender, dayId, block.timestamp);
    }
}
