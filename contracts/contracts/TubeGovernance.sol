// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TubeToken.sol";

/**
 * @title TubeGovernance
 * @dev DAO governance contract for TubeDAO
 * Implements voting mechanisms for data licensing and platform decisions
 */
contract TubeGovernance is Ownable, ReentrancyGuard {
    TubeToken public immutable tubeToken;
    
    enum ProposalType {
        DATA_LICENSING,
        PARAMETER_CHANGE,
        TREASURY_ALLOCATION,
        CREATOR_INSIGHTS
    }
    
    enum ProposalStatus {
        PENDING,
        ACTIVE,
        PASSED,
        REJECTED,
        EXECUTED,
        CANCELLED
    }
    
    struct Proposal {
        uint256 id;
        address proposer;
        ProposalType proposalType;
        string title;
        string description;
        string ipfsHash;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        ProposalStatus status;
        bool executed;
        bytes executionData;
    }
    
    struct Vote {
        bool hasVoted;
        uint8 support;
        uint256 weight;
    }
    
    uint256 public proposalCounter;
    uint256 public constant VOTING_PERIOD = 3 days;
    uint256 public constant VOTING_DELAY = 1 days;
    uint256 public constant PROPOSAL_THRESHOLD = 10000 * 10**18; // 10,000 tokens to propose
    uint256 public constant QUORUM_PERCENTAGE = 4; // 4% of total supply
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(address => uint256) public latestProposalIds;
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        uint8 support,
        uint256 weight
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    
    modifier onlyTokenHolder() {
        require(tubeToken.balanceOf(msg.sender) > 0, "Must hold TUBE tokens");
        _;
    }
    
    constructor(address _tubeToken) Ownable(msg.sender) {
        require(_tubeToken != address(0), "Invalid token address");
        tubeToken = TubeToken(_tubeToken);
    }
    
    /**
     * @dev Create a new proposal
     */
    function propose(
        ProposalType proposalType,
        string memory title,
        string memory description,
        string memory ipfsHash,
        bytes memory executionData
    ) external onlyTokenHolder nonReentrant returns (uint256) {
        require(tubeToken.balanceOf(msg.sender) >= PROPOSAL_THRESHOLD, "Below proposal threshold");
        require(bytes(title).length > 0, "Title required");
        require(bytes(description).length > 0, "Description required");
        
        if (latestProposalIds[msg.sender] != 0) {
            ProposalStatus status = proposals[latestProposalIds[msg.sender]].status;
            require(
                status != ProposalStatus.PENDING && status != ProposalStatus.ACTIVE,
                "Already has active proposal"
            );
        }
        
        uint256 proposalId = ++proposalCounter;
        uint256 startTime = block.timestamp + VOTING_DELAY;
        uint256 endTime = startTime + VOTING_PERIOD;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            proposalType: proposalType,
            title: title,
            description: description,
            ipfsHash: ipfsHash,
            startTime: startTime,
            endTime: endTime,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            status: ProposalStatus.PENDING,
            executed: false,
            executionData: executionData
        });
        
        latestProposalIds[msg.sender] = proposalId;
        
        emit ProposalCreated(
            proposalId,
            msg.sender,
            proposalType,
            title,
            startTime,
            endTime
        );
        
        return proposalId;
    }
    
    /**
     * @dev Cast vote on a proposal
     */
    function castVote(uint256 proposalId, uint8 support) external onlyTokenHolder nonReentrant {
        require(support <= 2, "Invalid vote type");
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal not found");
        
        _updateProposalStatus(proposalId);
        
        require(proposal.status == ProposalStatus.ACTIVE, "Voting not active");
        require(!votes[proposalId][msg.sender].hasVoted, "Already voted");
        
        uint256 weight = tubeToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");
        
        votes[proposalId][msg.sender] = Vote({
            hasVoted: true,
            support: support,
            weight: weight
        });
        
        if (support == 0) {
            proposal.againstVotes += weight;
        } else if (support == 1) {
            proposal.forVotes += weight;
        } else {
            proposal.abstainVotes += weight;
        }
        
        emit VoteCast(msg.sender, proposalId, support, weight);
    }
    
    /**
     * @dev Execute a passed proposal
     */
    function execute(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal not found");
        
        _updateProposalStatus(proposalId);
        
        require(proposal.status == ProposalStatus.PASSED, "Proposal not passed");
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        proposal.status = ProposalStatus.EXECUTED;
        
        if (proposal.proposalType == ProposalType.DATA_LICENSING) {
            _executeDataLicensing(proposal.executionData);
        } else if (proposal.proposalType == ProposalType.PARAMETER_CHANGE) {
            _executeParameterChange(proposal.executionData);
        } else if (proposal.proposalType == ProposalType.TREASURY_ALLOCATION) {
            _executeTreasuryAllocation(proposal.executionData);
        } else if (proposal.proposalType == ProposalType.CREATOR_INSIGHTS) {
            _executeCreatorInsights(proposal.executionData);
        }
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Cancel a proposal (only proposer or owner)
     */
    function cancel(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal not found");
        require(
            msg.sender == proposal.proposer || msg.sender == owner(),
            "Not authorized"
        );
        require(
            proposal.status == ProposalStatus.PENDING || proposal.status == ProposalStatus.ACTIVE,
            "Cannot cancel"
        );
        
        proposal.status = ProposalStatus.CANCELLED;
        emit ProposalCancelled(proposalId);
    }
    
    /**
     * @dev Update proposal status based on time and votes
     */
    function _updateProposalStatus(uint256 proposalId) internal {
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.status == ProposalStatus.PENDING && block.timestamp >= proposal.startTime) {
            proposal.status = ProposalStatus.ACTIVE;
        }
        
        if (proposal.status == ProposalStatus.ACTIVE && block.timestamp > proposal.endTime) {
            uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
            uint256 quorum = (tubeToken.totalSupply() * QUORUM_PERCENTAGE) / 100;
            
            if (totalVotes >= quorum && proposal.forVotes > proposal.againstVotes) {
                proposal.status = ProposalStatus.PASSED;
            } else {
                proposal.status = ProposalStatus.REJECTED;
            }
        }
    }
    
    /**
     * @dev Execute data licensing proposal
     */
    function _executeDataLicensing(bytes memory data) internal {
        // Implementation for data licensing execution
        // This would interact with DataPool contract
    }
    
    /**
     * @dev Execute parameter change proposal
     */
    function _executeParameterChange(bytes memory data) internal {
        // Implementation for parameter changes
    }
    
    /**
     * @dev Execute treasury allocation proposal
     */
    function _executeTreasuryAllocation(bytes memory data) internal {
        // Implementation for treasury allocation
    }
    
    /**
     * @dev Execute creator insights proposal
     */
    function _executeCreatorInsights(bytes memory data) internal {
        // Implementation for creator insights access
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }
    
    /**
     * @dev Get vote details
     */
    function getVote(uint256 proposalId, address voter) external view returns (Vote memory) {
        return votes[proposalId][voter];
    }
    
    /**
     * @dev Check if proposal reached quorum
     */
    function hasReachedQuorum(uint256 proposalId) external view returns (bool) {
        Proposal memory proposal = proposals[proposalId];
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        uint256 quorum = (tubeToken.totalSupply() * QUORUM_PERCENTAGE) / 100;
        return totalVotes >= quorum;
    }
}
