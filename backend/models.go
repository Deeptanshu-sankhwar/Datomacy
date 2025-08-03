package main

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RegisteredAddress struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Address   string             `json:"address" bson:"address"`
	Timestamp time.Time          `json:"timestamp" bson:"timestamp"`
}

type UserContribution struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Address      string             `json:"address" bson:"address"`
	DataType     string             `json:"dataType" bson:"dataType"`
	FileName     string             `json:"fileName" bson:"fileName"`
	FileSize     int64              `json:"fileSize" bson:"fileSize"`
	DataContent  interface{}        `json:"dataContent" bson:"dataContent"`
	RewardAmount float64            `json:"rewardAmount" bson:"rewardAmount"`
	Timestamp    time.Time          `json:"timestamp" bson:"timestamp"`
	Status       string             `json:"status" bson:"status"`
}

type UserRewards struct {
	Address       string  `json:"address" bson:"address"`
	TotalRewards  float64 `json:"totalRewards" bson:"totalRewards"`
	TotalDatasets int     `json:"totalDatasets" bson:"totalDatasets"`
}

type RegisterWalletRequest struct {
	Address string `json:"address" binding:"required"`
}

type UploadDataRequest struct {
	Address     string      `json:"address" binding:"required"`
	DataType    string      `json:"dataType" binding:"required"`
	FileName    string      `json:"fileName" binding:"required"`
	FileSize    int64       `json:"fileSize"`
	DataContent interface{} `json:"dataContent" binding:"required"`
}
