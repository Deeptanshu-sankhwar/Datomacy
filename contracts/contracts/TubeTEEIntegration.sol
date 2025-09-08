// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TubeTEEIntegration
 * @dev TEE (Trusted Execution Environment) integration for privacy-preserving data processing
 * Implements Vana's TEE Pool interface for secure data validation
 */
contract TubeTEEIntegration is Ownable, ReentrancyGuard {
    struct TEENode {
        address nodeAddress;
        string endpoint;
        bool isActive;
        uint256 stake;
        uint256 reputation;
        uint256 jobsCompleted;
    }
    
    struct ValidationJob {
        bytes32 jobId;
        address requester;
        bytes32 dataHash;
        string dataType;
        uint256 timestamp;
        bool completed;
        uint256 qualityScore;
        address assignedNode;
    }
    
    address public dataPoolAddress;
    mapping(address => TEENode) public teeNodes;
    mapping(bytes32 => ValidationJob) public validationJobs;
    mapping(address => bytes32[]) public nodeJobs;
    
    address[] public activeNodes;
    uint256 public minStakeRequired = 1000 * 10**18; // 1000 tokens minimum stake
    uint256 public jobCounter;
    
    event TEENodeRegistered(address indexed node, string endpoint, uint256 stake);
    event TEENodeDeactivated(address indexed node);
    event ValidationJobCreated(bytes32 indexed jobId, address requester, bytes32 dataHash);
    event ValidationCompleted(bytes32 indexed jobId, uint256 qualityScore, address node);
    event DataAttested(bytes32 indexed dataHash, address attester, uint256 timestamp);
    
    modifier onlyDataPool() {
        require(msg.sender == dataPoolAddress, "Only DataPool can call");
        _;
    }
    
    modifier onlyActiveTEE() {
        require(teeNodes[msg.sender].isActive, "Not an active TEE node");
        _;
    }
    
    constructor(address _dataPoolAddress) Ownable(msg.sender) {
        require(_dataPoolAddress != address(0), "Invalid DataPool address");
        dataPoolAddress = _dataPoolAddress;
    }
    
    /**
     * @dev Register as a TEE node
     */
    function registerTEENode(string memory endpoint) external payable nonReentrant {
        require(msg.value >= minStakeRequired, "Insufficient stake");
        require(bytes(endpoint).length > 0, "Invalid endpoint");
        require(!teeNodes[msg.sender].isActive, "Node already registered");
        
        teeNodes[msg.sender] = TEENode({
            nodeAddress: msg.sender,
            endpoint: endpoint,
            isActive: true,
            stake: msg.value,
            reputation: 100,
            jobsCompleted: 0
        });
        
        activeNodes.push(msg.sender);
        emit TEENodeRegistered(msg.sender, endpoint, msg.value);
    }
    
    /**
     * @dev Create validation job for data contribution
     */
    function createValidationJob(
        bytes32 dataHash,
        string memory dataType
    ) external onlyDataPool returns (bytes32) {
        bytes32 jobId = keccak256(abi.encodePacked(dataHash, jobCounter++, block.timestamp));
        
        // Select TEE node (round-robin for simplicity, use reputation-based in production)
        address selectedNode = selectTEENode();
        require(selectedNode != address(0), "No available TEE nodes");
        
        validationJobs[jobId] = ValidationJob({
            jobId: jobId,
            requester: msg.sender,
            dataHash: dataHash,
            dataType: dataType,
            timestamp: block.timestamp,
            completed: false,
            qualityScore: 0,
            assignedNode: selectedNode
        });
        
        nodeJobs[selectedNode].push(jobId);
        emit ValidationJobCreated(jobId, msg.sender, dataHash);
        
        return jobId;
    }
    
    /**
     * @dev Submit validation result (called by TEE node)
     */
    function submitValidationResult(
        bytes32 jobId,
        uint256 qualityScore,
        bytes memory proof
    ) external onlyActiveTEE nonReentrant {
        ValidationJob storage job = validationJobs[jobId];
        require(job.assignedNode == msg.sender, "Not assigned to this node");
        require(!job.completed, "Job already completed");
        require(qualityScore <= 10, "Invalid quality score");
        require(proof.length > 0, "Invalid proof");
        
        job.completed = true;
        job.qualityScore = qualityScore;
        
        TEENode storage node = teeNodes[msg.sender];
        node.jobsCompleted++;
        if (qualityScore >= 7) {
            node.reputation += 1;
        }
        
        emit ValidationCompleted(jobId, qualityScore, msg.sender);
        
    }
    
    /**
     * @dev Attest data integrity (for Vana DataRegistry integration)
     */
    function attestData(
        bytes32 dataHash,
        bytes memory signature
    ) external onlyActiveTEE {
        require(signature.length > 0, "Invalid signature");
        
        emit DataAttested(dataHash, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Select TEE node for job assignment
     */
    function selectTEENode() internal view returns (address) {
        if (activeNodes.length == 0) return address(0);
        
        uint256 index = jobCounter % activeNodes.length;
        address selected = activeNodes[index];
        
        if (teeNodes[selected].isActive) {
            return selected;
        }
        
        for (uint256 i = 0; i < activeNodes.length; i++) {
            if (teeNodes[activeNodes[i]].isActive) {
                return activeNodes[i];
            }
        }
        
        return address(0);
    }
    
    /**
     * @dev Deactivate TEE node
     */
    function deactivateTEENode() external onlyActiveTEE {
        TEENode storage node = teeNodes[msg.sender];
        node.isActive = false;
        
        for (uint256 i = 0; i < activeNodes.length; i++) {
            if (activeNodes[i] == msg.sender) {
                activeNodes[i] = activeNodes[activeNodes.length - 1];
                activeNodes.pop();
                break;
            }
        }
        
        if (node.stake > 0) {
            uint256 stakeToReturn = node.stake;
            node.stake = 0;
            payable(msg.sender).transfer(stakeToReturn);
        }
        
        emit TEENodeDeactivated(msg.sender);
    }
    
    /**
     * @dev Update minimum stake requirement (owner only)
     */
    function updateMinStake(uint256 newMinStake) external onlyOwner {
        minStakeRequired = newMinStake;
    }
    
    /**
     * @dev Get active TEE nodes count
     */
    function getActiveNodeCount() external view returns (uint256) {
        return activeNodes.length;
    }
    
    /**
     * @dev Get job details
     */
    function getJob(bytes32 jobId) external view returns (ValidationJob memory) {
        return validationJobs[jobId];
    }
    
    /**
     * @dev Get node's assigned jobs
     */
    function getNodeJobs(address node) external view returns (bytes32[] memory) {
        return nodeJobs[node];
    }
}
