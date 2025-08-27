package main

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

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
	TxHash       string             `json:"txHash" bson:"txHash"`
	QualityScore int                `json:"qualityScore" bson:"qualityScore"`
	TEEJobId     string             `json:"teeJobId" bson:"teeJobId"`
	IPFSHash     string             `json:"ipfsHash" bson:"ipfsHash"`
}

type UserRewards struct {
	Address       string  `json:"address" bson:"address"`
	TotalRewards  float64 `json:"totalRewards" bson:"totalRewards"`
	TotalDatasets int     `json:"totalDatasets" bson:"totalDatasets"`
}

type UploadDataRequest struct {
	Address     string      `json:"address" binding:"required"`
	DataType    string      `json:"dataType" binding:"required"`
	FileName    string      `json:"fileName" binding:"required"`
	FileSize    int64       `json:"fileSize"`
	DataContent interface{} `json:"dataContent" binding:"required"`
}

// Authentication models
type NonceRequest struct {
	Address string `json:"address" binding:"required"`
}

type NonceResponse struct {
	Nonce string `json:"nonce"`
}

type SIWERequest struct {
	Message   string `json:"message" binding:"required"`
	Signature string `json:"signature" binding:"required"`
}

type AuthResponse struct {
	Token     string `json:"token"`
	Address   string `json:"address"`
	ChainID   int    `json:"chainId"`
	ExpiresAt int64  `json:"expiresAt"`
}

type TempAuthResponse struct {
	TempToken string `json:"tempToken"`
	Address   string `json:"address"`
	ChainID   int    `json:"chainId"`
	ExpiresAt int64  `json:"expiresAt"`
}

type BindMokshaRequest struct {
	Address          string `json:"address" binding:"required"`
	BindingMessage   string `json:"bindingMessage" binding:"required"`
	BindingSignature string `json:"bindingSignature" binding:"required"`
}

type RegisterMokshaRequest struct {
	Address          string `json:"address" binding:"required"`
	SiweMessage      string `json:"siweMessage" binding:"required"`
	SiweSignature    string `json:"siweSignature" binding:"required"`
	BindingMessage   string `json:"bindingMessage" binding:"required"`
	BindingSignature string `json:"bindingSignature" binding:"required"`
}

type RegistrationResponse struct {
	RegistrationID string `json:"registrationId"`
	Status         string `json:"status"`
}

type RegistrationStatus struct {
	Completed bool   `json:"completed"`
	Failed    bool   `json:"failed"`
	Error     string `json:"error,omitempty"`
	Token     string `json:"token,omitempty"`
	ChainID   int    `json:"chainId,omitempty"`
	ExpiresAt int64  `json:"expiresAt,omitempty"`
}

type Nonce struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Address   string             `json:"address" bson:"address"`
	Nonce     string             `json:"nonce" bson:"nonce"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
	Used      bool               `json:"used" bson:"used"`
}

type AuthSession struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Address   string             `json:"address" bson:"address"`
	ChainID   int                `json:"chainId" bson:"chainId"`
	Token     string             `json:"token" bson:"token"`
	ExpiresAt time.Time          `json:"expiresAt" bson:"expiresAt"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
	IsActive  bool               `json:"isActive" bson:"isActive"`
}

type JWTClaims struct {
	Address string `json:"address"`
	ChainID int    `json:"chainId"`
	jwt.RegisteredClaims
}

type MokshaRegistration struct {
	ID               primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	RegistrationID   string             `json:"registrationId" bson:"registrationId"`
	Address          string             `json:"address" bson:"address"`
	MokshaAddress    string             `json:"mokshaAddress" bson:"mokshaAddress"`
	SiweMessage      string             `json:"siweMessage" bson:"siweMessage"`
	SiweSignature    string             `json:"siweSignature" bson:"siweSignature"`
	BindingMessage   string             `json:"bindingMessage" bson:"bindingMessage"`
	BindingSignature string             `json:"bindingSignature" bson:"bindingSignature"`
	Status           string             `json:"status" bson:"status"` // pending, processing, completed, failed
	TxHash           string             `json:"txHash" bson:"txHash"`
	Error            string             `json:"error" bson:"error"`
	CreatedAt        time.Time          `json:"createdAt" bson:"createdAt"`
	CompletedAt      *time.Time         `json:"completedAt" bson:"completedAt"`
}

type MokshaIdentity struct {
	ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Address       string             `json:"address" bson:"address"`
	MokshaAddress string             `json:"mokshaAddress" bson:"mokshaAddress"`
	IsActive      bool               `json:"isActive" bson:"isActive"`
	CreatedAt     time.Time          `json:"createdAt" bson:"createdAt"`
	LastVerified  time.Time          `json:"lastVerified" bson:"lastVerified"`
}
