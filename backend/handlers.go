package main

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Register a new wallet address
func registerWallet(c *gin.Context) {
	var req RegisterWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := db.Collection("registered_addresses")

	var existing RegisteredAddress
	err := collection.FindOne(context.Background(), bson.M{"address": req.Address}).Decode(&existing)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "Address already registered", "data": existing})
		return
	}

	registration := RegisteredAddress{
		Address:   req.Address,
		Timestamp: time.Now(),
	}

	result, err := collection.InsertOne(context.Background(), registration)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register address"})
		return
	}

	registration.ID = result.InsertedID.(primitive.ObjectID)
	c.JSON(http.StatusCreated, gin.H{"message": "Address registered successfully", "data": registration})
}

// Get user registration data
func getUserData(c *gin.Context) {
	address := c.Param("address")

	collection := db.Collection("registered_addresses")
	var user RegisteredAddress

	err := collection.FindOne(context.Background(), bson.M{"address": address}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// Upload user contribution data
func uploadData(c *gin.Context) {
	var req UploadDataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := db.Collection("user_contributions")

	contribution := UserContribution{
		Address:      req.Address,
		DataType:     req.DataType,
		FileName:     req.FileName,
		FileSize:     req.FileSize,
		DataContent:  req.DataContent,
		RewardAmount: 1.0,
		Timestamp:    time.Now(),
		Status:       "processed",
	}

	result, err := collection.InsertOne(context.Background(), contribution)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload data"})
		return
	}

	contribution.ID = result.InsertedID.(primitive.ObjectID)
	c.JSON(http.StatusCreated, gin.H{"message": "Data uploaded successfully", "data": contribution})
}

// Get all contributions for a user
func getUserContributions(c *gin.Context) {
	address := c.Param("address")

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
