// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TubeDAO Registry
 * @dev Manages membership for TubeDAO platform
 * @author TubeDAO Team
 */
contract Registry is Ownable, ReentrancyGuard {
    
    // Events
    event MemberRegistered(address indexed member, uint256 timestamp);
    event MemberRemoved(address indexed member, uint256 timestamp);
    event RegistrationFeeUpdated(uint256 oldFee, uint256 newFee);
    
    // State variables
    mapping(address => bool) public members;
    mapping(address => uint256) public registrationTimestamp;
    mapping(address => uint256) public reputation;
    
    uint256 public registrationFee = 0; // Free registration
    uint256 public totalMembers;
    
    // Modifiers
    modifier onlyMember() {
        require(members[msg.sender], "Registry: Caller is not a member");
        _;
    }
    
    modifier onlyNonMember() {
        require(!members[msg.sender], "Registry: Caller is already a member");
        _;
    }
    
    /**
     * @dev Constructor - sets the initial owner
     */
    constructor() Ownable(msg.sender) {
        // Register the contract deployer as the first member
        _registerMember(msg.sender);
    }
    
    /**
     * @dev Register as a new member (free registration)
     */
    function register() external onlyNonMember nonReentrant {
        _registerMember(msg.sender);
    }
    
    /**
     * @dev Register a member by owner (no fee required)
     */
    function registerMember(address member) external onlyOwner {
        require(!members[member], "Registry: Address is already a member");
        _registerMember(member);
    }
    
    /**
     * @dev Remove a member (owner only)
     */
    function removeMember(address member) external onlyOwner {
        require(members[member], "Registry: Address is not a member");
        require(member != owner(), "Registry: Cannot remove owner");
        
        members[member] = false;
        totalMembers--;
        
        emit MemberRemoved(member, block.timestamp);
    }
    
    /**
     * @dev Check if an address is a member
     */
    function isMember(address member) external view returns (bool) {
        return members[member];
    }
    
    /**
     * @dev Get member registration timestamp
     */
    function getRegistrationTimestamp(address member) external view returns (uint256) {
        require(members[member], "Registry: Address is not a member");
        return registrationTimestamp[member];
    }
    
    /**
     * @dev Get member reputation score
     */
    function getReputation(address member) external view returns (uint256) {
        require(members[member], "Registry: Address is not a member");
        return reputation[member];
    }
    
    /**
     * @dev Update member reputation (owner only)
     */
    function updateReputation(address member, uint256 newReputation) external onlyOwner {
        require(members[member], "Registry: Address is not a member");
        reputation[member] = newReputation;
    }
    
    /**
     * @dev Update registration fee (owner only)
     */
    function updateRegistrationFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = registrationFee;
        registrationFee = newFee;
        emit RegistrationFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Withdraw any ETH sent to contract (owner only)
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Registry: No ETH to withdraw");
        
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Get total number of members
     */
    function getTotalMembers() external view returns (uint256) {
        return totalMembers;
    }
    
    /**
     * @dev Internal function to register a member
     */
    function _registerMember(address member) internal {
        members[member] = true;
        registrationTimestamp[member] = block.timestamp;
        reputation[member] = 100; // Default reputation score
        totalMembers++;
        
        emit MemberRegistered(member, block.timestamp);
    }
    
    /**
     * @dev Emergency function to pause registrations (owner only)
     */
    function emergencyPause() external onlyOwner {
        // This would require implementing Pausable from OpenZeppelin
        // For now, we'll just revert with a message
        revert("Registry: Emergency pause not implemented");
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // Accept ETH without any logic
    }
}
