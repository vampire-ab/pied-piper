// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// Sepolia scroll -> 0xacBF7eAA5bF7c3B52401327edeAc5D8936e45606
contract LoomGroom {
    struct DailyReading {
        uint256 heartRate;
        uint256 steps;
        uint256 sleepDuration;
    }
    struct Stats {
        uint256 height; // cm
        uint256 weight; // kg
    }

    struct UserData {
        DailyReading[] details;
        Stats[] moreDetails;
    }

    // events
    event MoreUserDetails(address userId, uint256 height, uint256 weight);
    event UserDetails(
        address userId,
        uint256 heartRate,
        uint256 steps,
        uint256 sleepDuration
    );

    mapping(address => UserData) userData;

    function updateState(uint256 height, uint256 weight) external {
        userData[msg.sender].moreDetails.push(Stats(height, weight));
        emit MoreUserDetails(msg.sender, height, weight);
    }

    function updateDailyReading(DailyReading calldata _details) external {
        userData[msg.sender].details.push(_details);
        emit UserDetails(
            msg.sender,
            _details.heartRate,
            _details.steps,
            _details.sleepDuration
        );
    }
}
