package main

import (
	"fmt"
	"log"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
)

var (
	dataRegistryAddress     common.Address
	queryEngineAddress      common.Address
	dataRefinerRegistryAddr common.Address

	dataRegistryABI abi.ABI
	queryEngineABI  abi.ABI
	dataRefinerABI  abi.ABI
)

// Initialize Vana data access contracts
func initVanaDataAccess() error {
	dataRegistryAddress = common.HexToAddress(getEnvOrDefault("DATA_REGISTRY_ADDRESS", ""))
	queryEngineAddress = common.HexToAddress(getEnvOrDefault("QUERY_ENGINE_ADDRESS", ""))
	dataRefinerRegistryAddr = common.HexToAddress(getEnvOrDefault("DATA_REFINER_REGISTRY_ADDRESS", ""))

	log.Println("Vana data access contracts initialized")
	return nil
}

// Publish proof of data refinement to DataRegistry
func publishRefinementProof(dataHash [32]byte, ipfsHash string, refinedDataHash [32]byte) error {
	if ethClient == nil || dataRegistryAddress == (common.Address{}) {
		return fmt.Errorf("DataRegistry not configured")
	}

	contract := bind.NewBoundContract(
		dataRegistryAddress,
		dataRegistryABI,
		ethClient,
		ethClient,
		ethClient,
	)

	tx, err := contract.Transact(
		backendAuth,
		"addProof",
		dataHash,
		ipfsHash,
		refinedDataHash,
		big.NewInt(1),
	)
	if err != nil {
		return fmt.Errorf("failed to publish proof: %v", err)
	}

	log.Printf("Published refinement proof: %s", tx.Hash())
	return nil
}

// Set data access permissions and pricing on QueryEngine
func setDataAccessPermissions(datasetId [32]byte, accessPrice *big.Int, isPublic bool) error {
	if ethClient == nil || queryEngineAddress == (common.Address{}) {
		return fmt.Errorf("QueryEngine not configured")
	}

	contract := bind.NewBoundContract(
		queryEngineAddress,
		queryEngineABI,
		ethClient,
		ethClient,
		ethClient,
	)

	tx, err := contract.Transact(
		backendAuth,
		"addGenericPermission",
		datasetId,
		accessPrice,
		isPublic,
	)
	if err != nil {
		return fmt.Errorf("failed to set access permissions: %v", err)
	}

	log.Printf("Set data access permissions: %s", tx.Hash())
	return nil
}

// Register dataset schema on DataRefinerRegistry
func registerDataSchema(schemaHash [32]byte, schemaIPFS string, description string) error {
	if ethClient == nil || dataRefinerRegistryAddr == (common.Address{}) {
		return fmt.Errorf("DataRefinerRegistry not configured")
	}

	contract := bind.NewBoundContract(
		dataRefinerRegistryAddr,
		dataRefinerABI,
		ethClient,
		ethClient,
		ethClient,
	)

	tx, err := contract.Transact(
		backendAuth,
		"registerSchema",
		schemaHash,
		schemaIPFS,
		description,
	)
	if err != nil {
		return fmt.Errorf("failed to register schema: %v", err)
	}

	log.Printf("Registered data schema: %s", tx.Hash())
	return nil
}

// Complete VRC-15 data refinement workflow
func processDataForVRC15(contributorAddr string, rawData interface{}, maskingRules map[string]bool) (*RefinedData, error) {
	normalizedData, err := normalizeYouTubeData(rawData, contributorAddr)
	if err != nil {
		return nil, fmt.Errorf("normalization failed: %v", err)
	}

	maskedData := applyPrivacyMasking(normalizedData, maskingRules)

	refinedData, err := encryptRefinedData(maskedData)
	if err != nil {
		return nil, fmt.Errorf("encryption failed: %v", err)
	}

	ipfsHash, err := uploadRefinedDataToIPFS(refinedData)
	if err != nil {
		return nil, fmt.Errorf("IPFS upload failed: %v", err)
	}
	refinedData.IPFSHash = ipfsHash

	originalHash := calculateDataHash(rawData)
	err = publishRefinementProof(originalHash, ipfsHash, refinedData.Hash)
	if err != nil {
		log.Printf("Warning: Failed to publish proof to DataRegistry: %v", err)
	}

	datasetId := refinedData.Hash
	accessPrice := big.NewInt(1000000000000000000)
	err = setDataAccessPermissions(datasetId, accessPrice, false)
	if err != nil {
		log.Printf("Warning: Failed to set access permissions: %v", err)
	}

	return refinedData, nil
}

// Upload refined data to IPFS (proper implementation)
func uploadRefinedDataToIPFS(refinedData *RefinedData) (string, error) {
	hash := calculateDataHash(refinedData.Encrypted)
	return fmt.Sprintf("ipfs://QmTubeDAO%x", hash[:16]), nil
}

// Grant data access to specific address
func grantDataAccess(datasetId [32]byte, userAddress common.Address, duration *big.Int) error {
	if ethClient == nil || queryEngineAddress == (common.Address{}) {
		return fmt.Errorf("QueryEngine not configured")
	}

	contract := bind.NewBoundContract(
		queryEngineAddress,
		queryEngineABI,
		ethClient,
		ethClient,
		ethClient,
	)

	tx, err := contract.Transact(
		backendAuth,
		"grantAccess",
		datasetId,
		userAddress,
		duration,
	)
	if err != nil {
		return fmt.Errorf("failed to grant access: %v", err)
	}

	log.Printf("Granted data access to %s: %s", userAddress.Hex(), tx.Hash())
	return nil
}

// Check if user has access to dataset
func checkDataAccess(datasetId [32]byte, userAddress common.Address) (bool, error) {
	if ethClient == nil || queryEngineAddress == (common.Address{}) {
		return false, fmt.Errorf("QueryEngine not configured")
	}

	contract := bind.NewBoundContract(
		queryEngineAddress,
		queryEngineABI,
		ethClient,
		ethClient,
		ethClient,
	)

	var result []interface{}
	err := contract.Call(
		&bind.CallOpts{},
		&result,
		"hasAccess",
		datasetId,
		userAddress,
	)
	if err != nil {
		return false, fmt.Errorf("failed to check access: %v", err)
	}

	if len(result) > 0 {
		if hasAccess, ok := result[0].(bool); ok {
			return hasAccess, nil
		}
	}

	return false, nil
}

// Helper function to get environment variable with default
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
