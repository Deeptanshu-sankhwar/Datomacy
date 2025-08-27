package main

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"log"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

var (
	tubeTokenAddress   common.Address
	dataPoolAddress    common.Address
	governanceAddress  common.Address
	teeIntegrationAddr common.Address

	tubeTokenABI abi.ABI
	dataPoolABI  abi.ABI

	backendPrivateKey *ecdsa.PrivateKey
	backendAuth       *bind.TransactOpts
)

var _, _, _ = tubeTokenAddress, governanceAddress, tubeTokenABI

// Initialize blockchain connections and contracts
func initBlockchain() error {
	tubeTokenAddress = common.HexToAddress(os.Getenv("TUBE_TOKEN_ADDRESS"))
	dataPoolAddress = common.HexToAddress(os.Getenv("DATA_POOL_ADDRESS"))
	governanceAddress = common.HexToAddress(os.Getenv("GOVERNANCE_ADDRESS"))
	teeIntegrationAddr = common.HexToAddress(os.Getenv("TEE_INTEGRATION_ADDRESS"))

	privateKeyHex := os.Getenv("BACKEND_PRIVATE_KEY")
	if privateKeyHex != "" {
		var err error
		backendPrivateKey, err = crypto.HexToECDSA(privateKeyHex)
		if err != nil {
			return fmt.Errorf("failed to parse private key: %v", err)
		}

		backendAuth, err = bind.NewKeyedTransactorWithChainID(backendPrivateKey, big.NewInt(VANA_MOKSHA_CHAIN_ID))
		if err != nil {
			return fmt.Errorf("failed to create transactor: %v", err)
		}
	}

	log.Println("Blockchain integration initialized")
	return nil
}

// Submit data contribution to smart contract
func submitContributionToChain(
	contributor common.Address,
	dataType string,
	dataHash [32]byte,
	ipfsHash string,
) (common.Hash, error) {
	contract := bind.NewBoundContract(
		dataPoolAddress,
		dataPoolABI,
		ethClient,
		ethClient,
		ethClient,
	)

	tx, err := contract.Transact(
		backendAuth,
		"submitDataContribution",
		dataType,
		dataHash,
		ipfsHash,
		[]byte{},
	)
	if err != nil {
		return common.Hash{}, fmt.Errorf("failed to submit contribution: %v", err)
	}

	return tx.Hash(), nil
}

// Validate contribution through TEE integration
func validateContribution(contributionHash [32]byte, qualityScore uint8) error {
	contract := bind.NewBoundContract(
		dataPoolAddress,
		dataPoolABI,
		ethClient,
		ethClient,
		ethClient,
	)

	tx, err := contract.Transact(
		backendAuth,
		"validateContribution",
		contributionHash,
		big.NewInt(int64(qualityScore)),
	)
	if err != nil {
		return fmt.Errorf("failed to validate contribution: %v", err)
	}

	log.Printf("Contribution validated: %s, tx: %s", contributionHash, tx.Hash())
	return nil
}

// Check token balance for a user
func getTokenBalance(address common.Address) (*big.Int, error) {
	contract := bind.NewBoundContract(
		tubeTokenAddress,
		tubeTokenABI,
		ethClient,
		ethClient,
		ethClient,
	)

	var result []interface{}
	err := contract.Call(
		&bind.CallOpts{},
		&result,
		"balanceOf",
		address,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get balance: %v", err)
	}

	if len(result) > 0 {
		if balance, ok := result[0].(*big.Int); ok {
			return balance, nil
		}
	}

	return big.NewInt(0), nil
}

// Get contributor score from smart contract
func getContributorScore(address common.Address) (*big.Int, error) {
	contract := bind.NewBoundContract(
		tubeTokenAddress,
		tubeTokenABI,
		ethClient,
		ethClient,
		ethClient,
	)

	var result []interface{}
	err := contract.Call(
		&bind.CallOpts{},
		&result,
		"getContributorScore",
		address,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get contributor score: %v", err)
	}

	if len(result) > 0 {
		if score, ok := result[0].(*big.Int); ok {
			return score, nil
		}
	}

	return big.NewInt(0), nil
}

// Create TEE validation job
func createTEEValidationJob(dataHash [32]byte, dataType string) ([32]byte, error) {
	contract := bind.NewBoundContract(
		teeIntegrationAddr,
		dataPoolABI,
		ethClient,
		ethClient,
		ethClient,
	)

	tx, err := contract.Transact(
		backendAuth,
		"createValidationJob",
		dataHash,
		dataType,
	)
	if err != nil {
		return [32]byte{}, fmt.Errorf("failed to create validation job: %v", err)
	}

	receipt, err := bind.WaitMined(context.Background(), ethClient, tx)
	if err != nil {
		return [32]byte{}, fmt.Errorf("failed to wait for transaction: %v", err)
	}

	if len(receipt.Logs) > 0 {
		if len(receipt.Logs[0].Topics) > 1 {
			var jobId [32]byte
			copy(jobId[:], receipt.Logs[0].Topics[1].Bytes())
			return jobId, nil
		}
	}

	return [32]byte{}, fmt.Errorf("job ID not found in transaction logs")
}

// Calculate quality score based on data analysis
func calculateQualityScore(dataContent interface{}) uint8 {
	score := uint8(5)

	if data, ok := dataContent.(map[string]interface{}); ok {
		if events, exists := data["events"]; exists {
			if eventList, ok := events.([]interface{}); ok && len(eventList) > 100 {
				score += 2
			}
		}

		if metadata, exists := data["metadata"]; exists && metadata != nil {
			score += 1
		}

		if premium, exists := data["premium"]; exists && premium == true {
			score += 2
		}
	}

	if score > 10 {
		score = 10
	}

	return score
}
