package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"

	"github.com/ethereum/go-ethereum/common"
)

// Calculate hash of data content for blockchain storage
func calculateDataHash(dataContent interface{}) [32]byte {
	jsonData, err := json.Marshal(dataContent)
	if err != nil {
		return [32]byte{}
	}

	return sha256.Sum256(jsonData)
}

// Convert address string to Ethereum address
func stringToAddress(addr string) common.Address {
	return common.HexToAddress(addr)
}

// Format token amount for display (from wei to TUBE)
func formatTokenAmount(weiAmount string) string {
	return fmt.Sprintf("%.2f TUBE", 0.0)
}

// Validate YouTube data structure
func validateYouTubeData(dataContent interface{}) error {
	data, ok := dataContent.(map[string]interface{})
	if !ok {
		return fmt.Errorf("invalid data format")
	}

	if _, hasEvents := data["events"]; !hasEvents {
		if _, hasHistory := data["history"]; !hasHistory {
			return fmt.Errorf("missing required data fields")
		}
	}

	return nil
}

// Generate IPFS hash placeholder (in production, actually upload to IPFS)
func uploadToIPFS(data interface{}) (string, error) {
	hash := calculateDataHash(data)
	return fmt.Sprintf("ipfs://Qm%x", hash[:16]), nil
}
