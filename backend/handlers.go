package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Upload user contribution data with blockchain integration
func uploadData(c *gin.Context) {
	var req UploadDataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	authAddress, _ := c.Get("address")
	if authAddress != req.Address {
		c.JSON(http.StatusForbidden, gin.H{"error": "Address mismatch"})
		return
	}

	dataHash := calculateDataHash(req.DataContent)

	qualityScore := calculateQualityScore(req.DataContent)

	var txHash string
	if ethClient != nil && dataPoolAddress != (common.Address{}) {
		contributorAddr := common.HexToAddress(req.Address)
		hash, err := submitContributionToChain(
			contributorAddr,
			req.DataType,
			dataHash,
			"",
		)
		if err != nil {
			log.Printf("Blockchain submission failed: %v", err)
		} else {
			txHash = hash.Hex()

			jobId, err := createTEEValidationJob(dataHash, req.DataType)
			if err != nil {
				log.Printf("TEE job creation failed: %v", err)
			} else {
				log.Printf("TEE validation job created: %x", jobId)
			}
		}
	}

	collection := db.Collection("user_contributions")

	contribution := UserContribution{
		Address:      req.Address,
		DataType:     req.DataType,
		FileName:     req.FileName,
		FileSize:     req.FileSize,
		DataContent:  req.DataContent,
		RewardAmount: float64(qualityScore) * 100, // Base reward * quality
		Timestamp:    time.Now(),
		Status:       "pending_validation",
		TxHash:       txHash,
		QualityScore: int(qualityScore),
	}

	result, err := collection.InsertOne(context.Background(), contribution)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload data"})
		return
	}

	contribution.ID = result.InsertedID.(primitive.ObjectID)

	go func() {
		time.Sleep(5 * time.Second)
		if err := validateContribution(dataHash, qualityScore); err != nil {
			log.Printf("Validation failed: %v", err)
		}
	}()

	c.JSON(http.StatusCreated, gin.H{"message": "Data uploaded successfully", "data": contribution, "txHash": txHash})
}

// Get all contributions for a user
func getUserContributions(c *gin.Context) {
	address := c.Param("address")

	authAddress, _ := c.Get("address")
	if authAddress != address {
		c.JSON(http.StatusForbidden, gin.H{"error": "Address mismatch"})
		return
	}

	collection := db.Collection("user_contributions")
	cursor, err := collection.Find(context.Background(), bson.M{"address": address})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contributions"})
		return
	}
	defer cursor.Close(context.Background())

	var contributions []UserContribution
	if err = cursor.All(context.Background(), &contributions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode contributions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": contributions})
}

// Get total rewards for a user
func getUserRewards(c *gin.Context) {
	address := c.Param("address")

	authAddress, _ := c.Get("address")
	if authAddress != address {
		c.JSON(http.StatusForbidden, gin.H{"error": "Address mismatch"})
		return
	}

	collection := db.Collection("user_contributions")
	pipeline := []bson.M{
		{"$match": bson.M{"address": address}},
		{"$group": bson.M{
			"_id":           "$address",
			"totalRewards":  bson.M{"$sum": "$rewardAmount"},
			"totalDatasets": bson.M{"$sum": 1},
		}},
	}

	cursor, err := collection.Aggregate(context.Background(), pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate rewards"})
		return
	}
	defer cursor.Close(context.Background())

	var results []bson.M
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode rewards"})
		return
	}

	if len(results) == 0 {
		c.JSON(http.StatusOK, gin.H{"data": UserRewards{
			Address:       address,
			TotalRewards:  0,
			TotalDatasets: 0,
		}})
		return
	}

	result := results[0]
	rewards := UserRewards{
		Address:       address,
		TotalRewards:  result["totalRewards"].(float64),
		TotalDatasets: int(result["totalDatasets"].(int32)),
	}

	c.JSON(http.StatusOK, gin.H{"data": rewards})
}
