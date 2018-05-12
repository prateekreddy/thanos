pragma solidity ^0.4.23;

import "./User.sol";

contract OnBoarding {
    mapping(bytes32=>address) public users;
    address owner;
    
    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }
    
    constructor(address _owner) {
        owner = _owner;
    }
    
    function createUser(bytes32 userId, address userKey) public onlyOwner {
        require(users[userId] != 0x00);
        address user = new User(userId, userKey);
        require(user != 0x00);
        users[userId] = user;
    }
}