// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TubeToken
 * @dev VRC-20 compliant data token for TubeDAO on Vana Network
 * Implements proof-of-contribution based minting for YouTube data contributors
 */
contract TubeToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    uint256 public constant INITIAL_MINT = 100_000_000 * 10**18;

    uint256 public baseRewardPerContribution = 100 * 10**18;
    uint256 public qualityMultiplier = 10;
    
    mapping(address => bool) public validators;
    mapping(address => uint256) public contributorScores;
    mapping(bytes32 => bool) public processedContributions;
    mapping(address => uint256) public lastContributionTime;
    
    event ContributionValidated(address indexed contributor, bytes32 contributionHash, uint256 score);
    event RewardMinted(address indexed contributor, uint256 amount, string dataType);
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event QualityScoreUpdated(address indexed contributor, uint256 newScore);
    
    modifier onlyValidator() {
        require(validators[msg.sender], "TubeToken: caller is not a validator");
        _;
    }
    
    modifier contributionNotProcessed(bytes32 _contributionHash) {
        require(!processedContributions[_contributionHash], "TubeToken: contribution already processed");
        _;
    }
    
    constructor() ERC20("TubeDAO Token", "TUBE") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_MINT);
        validators[msg.sender] = true;
        emit ValidatorAdded(msg.sender);
    }
    
    /**
     * @dev Mint tokens based on proof of contribution
     * @param contributor Address of the data contributor
     * @param contributionHash Unique hash of the contribution
     * @param qualityScore Quality score (0-10) of the contribution
     * @param dataType Type of YouTube data contributed
     */
    function mintForContribution(
        address contributor,
        bytes32 contributionHash,
        uint256 qualityScore,
        string memory dataType
    ) external onlyValidator contributionNotProcessed(contributionHash) nonReentrant {
        require(contributor != address(0), "TubeToken: invalid contributor");
        require(qualityScore <= qualityMultiplier, "TubeToken: quality score too high");
        require(totalSupply() < MAX_SUPPLY, "TubeToken: max supply reached");
        
        processedContributions[contributionHash] = true;
        
        uint256 reward = (baseRewardPerContribution * qualityScore) / qualityMultiplier;
        
        uint256 timeSinceLastContribution = block.timestamp - lastContributionTime[contributor];
        if (timeSinceLastContribution < 1 days) {
            reward = (reward * 110) / 100; // 10% bonus for daily contributors
        }
        
        if (totalSupply() + reward > MAX_SUPPLY) {
            reward = MAX_SUPPLY - totalSupply();
        }
        
        contributorScores[contributor] += qualityScore;
        lastContributionTime[contributor] = block.timestamp;
        
        _mint(contributor, reward);
        
        emit ContributionValidated(contributor, contributionHash, qualityScore);
        emit RewardMinted(contributor, reward, dataType);
        emit QualityScoreUpdated(contributor, contributorScores[contributor]);
    }
    
    /**
     * @dev Add a new validator (only owner)
     */
    function addValidator(address validator) external onlyOwner {
        require(validator != address(0), "TubeToken: invalid validator");
        require(!validators[validator], "TubeToken: already a validator");
        validators[validator] = true;
        emit ValidatorAdded(validator);
    }
    
    /**
     * @dev Remove a validator (only owner)
     */
    function removeValidator(address validator) external onlyOwner {
        require(validators[validator], "TubeToken: not a validator");
        validators[validator] = false;
        emit ValidatorRemoved(validator);
    }
    
    /**
     * @dev Update base reward per contribution (only owner)
     */
    function updateBaseReward(uint256 newReward) external onlyOwner {
        require(newReward > 0, "TubeToken: reward must be positive");
        baseRewardPerContribution = newReward;
    }
    
    /**
     * @dev Get contributor's total quality score
     */
    function getContributorScore(address contributor) external view returns (uint256) {
        return contributorScores[contributor];
    }
    
    /**
     * @dev Check if contribution has been processed
     */
    function isContributionProcessed(bytes32 contributionHash) external view returns (bool) {
        return processedContributions[contributionHash];
    }
    
    /**
     * @dev Get circulating supply (for Vana integration)
     */
    function circulatingSupply() external view returns (uint256) {
        return totalSupply();
    }
    
    /**
     * @dev Override decimals to ensure VRC-20 compatibility
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
