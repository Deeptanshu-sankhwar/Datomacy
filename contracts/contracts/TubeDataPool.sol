// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./TubeToken.sol";

/**
 * @title TubeDataPool
 * @dev Data Liquidity Pool for TubeDAO - manages data contributions and validation
 * Integrates with Vana's DataRegistry and TEE Pool infrastructure
 */
contract TubeDataPool is Ownable, ReentrancyGuard {
    TubeToken public immutable tubeToken;
    
    address public dataRegistry;
    address public teePool;
    
    struct DataContribution {
        address contributor;
        string dataType;
        bytes32 dataHash;
        uint256 timestamp;
        uint256 qualityScore;
        bool validated;
        bool rewarded;
        string ipfsHash;
    }
    
    struct ProofOfContribution {
        bytes32 contributionHash;
        bytes signature;
        uint256 nonce;
        uint256 timestamp;
    }
    
    mapping(bytes32 => DataContribution) public contributions;
    mapping(address => bytes32[]) public contributorHistory;
    mapping(address => uint256) public contributorNonce;
    
    event DataSubmitted(address indexed contributor, bytes32 indexed contributionHash, string dataType);
    event DataValidated(bytes32 indexed contributionHash, uint256 qualityScore);
    event DataRewarded(address indexed contributor, bytes32 indexed contributionHash, uint256 tokens);
    event VanaIntegrationUpdated(address dataRegistry, address teePool);
    
    constructor(address _tubeToken) Ownable(msg.sender) {
        require(_tubeToken != address(0), "Invalid token address");
        tubeToken = TubeToken(_tubeToken);
    }
    
    /**
     * @dev Submit data contribution with proof
     */
    function submitDataContribution(
        string memory dataType,
        bytes32 dataHash,
        string memory ipfsHash,
        bytes memory signature
    ) external nonReentrant {
        require(bytes(dataType).length > 0, "Invalid data type");
        require(dataHash != bytes32(0), "Invalid data hash");
        
        bytes32 contributionHash = keccak256(
            abi.encodePacked(
                msg.sender,
                dataType,
                dataHash,
                contributorNonce[msg.sender]++
            )
        );
        
        require(signature.length > 0, "Invalid signature");
        
        contributions[contributionHash] = DataContribution({
            contributor: msg.sender,
            dataType: dataType,
            dataHash: dataHash,
            timestamp: block.timestamp,
            qualityScore: 0,
            validated: false,
            rewarded: false,
            ipfsHash: ipfsHash
        });
        
        contributorHistory[msg.sender].push(contributionHash);
        
        emit DataSubmitted(msg.sender, contributionHash, dataType);
    }
    
    /**
     * @dev Validate data contribution (called by TEE or validator)
     */
    function validateContribution(
        bytes32 contributionHash,
        uint256 qualityScore
    ) external onlyOwner {
        DataContribution storage contribution = contributions[contributionHash];
        require(contribution.contributor != address(0), "Contribution not found");
        require(!contribution.validated, "Already validated");
        require(qualityScore <= 10, "Invalid quality score");
        
        contribution.qualityScore = qualityScore;
        contribution.validated = true;
        
        emit DataValidated(contributionHash, qualityScore);
        
        if (qualityScore > 0) {
            _rewardContribution(contributionHash);
        }
    }
    
    /**
     * @dev Internal function to reward validated contributions
     */
    function _rewardContribution(bytes32 contributionHash) internal {
        DataContribution storage contribution = contributions[contributionHash];
        require(contribution.validated, "Not validated");
        require(!contribution.rewarded, "Already rewarded");
        
        contribution.rewarded = true;
        
        string memory dataType = contribution.dataType;
        uint256 qualityScore = contribution.qualityScore;
        
        if (keccak256(bytes(dataType)) == keccak256(bytes("premium"))) {
            qualityScore = (qualityScore * 15) / 10; // 50% bonus
            if (qualityScore > 10) qualityScore = 10;
        }
        
        tubeToken.mintForContribution(
            contribution.contributor,
            contributionHash,
            qualityScore,
            dataType
        );
        
        emit DataRewarded(contribution.contributor, contributionHash, qualityScore * 100 * 10**18);
    }
    
    /**
     * @dev Set Vana integration addresses (only owner)
     */
    function setVanaIntegration(address _dataRegistry, address _teePool) external onlyOwner {
        dataRegistry = _dataRegistry;
        teePool = _teePool;
        emit VanaIntegrationUpdated(_dataRegistry, _teePool);
    }
    
    /**
     * @dev Get contribution details
     */
    function getContribution(bytes32 contributionHash) external view returns (DataContribution memory) {
        return contributions[contributionHash];
    }
    
    /**
     * @dev Get contributor's contribution history
     */
    function getContributorHistory(address contributor) external view returns (bytes32[] memory) {
        return contributorHistory[contributor];
    }
    
    /**
     * @dev Calculate contribution hash (for verification)
     */
    function calculateContributionHash(
        address contributor,
        string memory dataType,
        bytes32 dataHash,
        uint256 nonce
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(contributor, dataType, dataHash, nonce));
    }
}
