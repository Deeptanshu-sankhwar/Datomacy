package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/spruceid/siwe-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	VANA_MOKSHA_CHAIN_ID = 14800
	VANA_MOKSHA_RPC      = "https://rpc.moksha.vana.org"
	JWT_EXPIRY_HOURS     = 24
	TEMP_TOKEN_EXPIRY_MINUTES = 30
	NONCE_EXPIRY_MINUTES = 10
)

var (
	jwtSecret         []byte
	ethClient         *ethclient.Client
	registryContract  common.Address
	registryABI       abi.ABI
)

func initAuth(database *mongo.Database) {
	
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))
	if len(jwtSecret) == 0 {
		log.Fatal("JWT_SECRET environment variable is required")
	}

	var err error
	ethClient, err = ethclient.Dial(VANA_MOKSHA_RPC)
	if err != nil {
		log.Fatal("Failed to connect to Vana Moksha:", err)
	}

	registryContractAddr := os.Getenv("REGISTRY_CONTRACT_ADDRESS")
	if registryContractAddr == "" {
		log.Fatal("REGISTRY_CONTRACT_ADDRESS environment variable is required")
	}
	registryContract = common.HexToAddress(registryContractAddr)

	registryABIJSON := `[
		{
			"inputs": [{"name": "member", "type": "address"}],
			"name": "isMember",
			"outputs": [{"name": "", "type": "bool"}],
			"stateMutability": "view",
			"type": "function"
		}
	]`

	registryABI, err = abi.JSON(strings.NewReader(registryABIJSON))
	if err != nil {
		log.Fatal("Failed to parse Registry ABI:", err)
	}

	log.Println("Auth system initialized with Vana Moksha connection")
}

// Generate a nonce for SIWE authentication
func generateNonce(c *gin.Context) {
	var req NonceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := db.Collection("nonces")
	expiredFilter := bson.M{
		"address":   req.Address,
		"createdAt": bson.M{"$lt": time.Now().Add(-NONCE_EXPIRY_MINUTES * time.Minute)},
	}
	collection.DeleteMany(context.Background(), expiredFilter)

	nonce := strings.ReplaceAll(uuid.New().String(), "-", "")[:20]
	nonceDoc := Nonce{
		Address:   req.Address,
		Nonce:     nonce,
		CreatedAt: time.Now(),
		Used:      false,
	}

	_, err := collection.InsertOne(context.Background(), nonceDoc)
	if err != nil {
		log.Printf("Failed to store nonce: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate nonce"})
		return
	}

	c.JSON(http.StatusOK, NonceResponse{Nonce: nonce})
}

// Verify SIWE signature and return temporary token
func verifySIWE(c *gin.Context) {
	var req SIWERequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	message, err := siwe.ParseMessage(req.Message)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid SIWE message format"})
		return
	}

	collection := db.Collection("nonces")
	var nonceDoc Nonce
	err = collection.FindOne(context.Background(), bson.M{
		"address": message.GetAddress().Hex(),
		"nonce":   message.GetNonce(),
		"used":    false,
		"createdAt": bson.M{"$gte": time.Now().Add(-NONCE_EXPIRY_MINUTES * time.Minute)},
	}).Decode(&nonceDoc)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired nonce"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify nonce"})
		}
		return
	}

	publicKey, err := message.VerifyEIP191(req.Signature)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid signature"})
		return
	}

	if publicKey == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid signature"})
		return
	}

	collection.UpdateOne(context.Background(),
		bson.M{"_id": nonceDoc.ID},
		bson.M{"$set": bson.M{"used": true}})

	identityCollection := db.Collection("moksha_identities")
	var identity MokshaIdentity
	err = identityCollection.FindOne(context.Background(), bson.M{
		"address":  message.GetAddress().Hex(),
		"isActive": true,
	}).Decode(&identity)

	if err == nil {
		log.Printf("User %s already has Moksha identity, proceeding with full auth", message.GetAddress().Hex())
		token, expiresAt, err := generateJWT(message.GetAddress().Hex(), message.GetChainID())
		if err != nil {
			log.Printf("Failed to generate JWT: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate authentication token"})
			return
		}

		sessionCollection := db.Collection("auth_sessions")
		session := AuthSession{
			Address:   message.GetAddress().Hex(),
			ChainID:   message.GetChainID(),
			Token:     token,
			ExpiresAt: time.Unix(expiresAt, 0),
			CreatedAt: time.Now(),
			IsActive:  true,
		}
		sessionCollection.InsertOne(context.Background(), session)

		c.JSON(http.StatusOK, AuthResponse{
			Token:     token,
			Address:   message.GetAddress().Hex(),
			ChainID:   message.GetChainID(),
			ExpiresAt: expiresAt,
		})
		return
	}

	log.Printf("User %s needs Moksha registration (identity not found: %v)", message.GetAddress().Hex(), err)

	tempToken, tempExpiresAt, err := generateTempToken(message.GetAddress().Hex(), message.GetChainID())
	if err != nil {
		log.Printf("Failed to generate temp token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate temporary token"})
		return
	}

	c.JSON(http.StatusAccepted, TempAuthResponse{
		TempToken: tempToken,
		Address:   message.GetAddress().Hex(),
		ChainID:   message.GetChainID(),
		ExpiresAt: tempExpiresAt,
	})
}

// Check if address is a member of the Registry contract
func checkRegistryMembership(address string) (bool, error) {
	memberAddress := common.HexToAddress(address)

	data, err := registryABI.Pack("isMember", memberAddress)
	if err != nil {
		return false, fmt.Errorf("failed to pack function call: %v", err)
	}

	result, err := ethClient.CallContract(context.Background(), ethereum.CallMsg{
		To:   &registryContract,
		Data: data,
	}, nil)
	if err != nil {
		return false, fmt.Errorf("failed to call contract: %v", err)
	}

	var isMember bool
	err = registryABI.UnpackIntoInterface(&isMember, "isMember", result)
	if err != nil {
		return false, fmt.Errorf("failed to unpack result: %v", err)
	}

	return isMember, nil
}

// Generate JWT token
func generateJWT(address string, chainID int) (string, int64, error) {
	expiresAt := time.Now().Add(JWT_EXPIRY_HOURS * time.Hour)

	claims := JWTClaims{
		Address: address,
		ChainID: chainID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "tubedao-backend",
			Subject:   address,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", 0, err
	}

	return tokenString, expiresAt.Unix(), nil
}

// Generate temporary token for binding process
func generateTempToken(address string, chainID int) (string, int64, error) {
	expiresAt := time.Now().Add(TEMP_TOKEN_EXPIRY_MINUTES * time.Minute)

	claims := JWTClaims{
		Address: address,
		ChainID: chainID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "tubedao-backend-temp",
			Subject:   address,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", 0, err
	}

	return tokenString, expiresAt.Unix(), nil
}

// JWT middleware for protected routes
func jwtMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token required"})
			c.Abort()
			return
		}

		token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})

		if err != nil {
			log.Printf("JWT middleware: token parsing failed: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(*JWTClaims)
		if !ok || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		if claims.Issuer != "tubedao-backend-temp" && claims.ChainID != VANA_MOKSHA_CHAIN_ID {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid chain ID in token"})
			c.Abort()
			return
		}

		if claims.Issuer != "tubedao-backend-temp" {
			sessionCollection := db.Collection("auth_sessions")
			var session AuthSession
			err = sessionCollection.FindOne(context.Background(), bson.M{
				"address":   claims.Address,
				"token":     tokenString,
				"isActive":  true,
				"expiresAt": bson.M{"$gte": time.Now()},
			}).Decode(&session)

			if err != nil {
				if err == mongo.ErrNoDocuments {
					c.JSON(http.StatusUnauthorized, gin.H{"error": "Session expired or invalid"})
				} else {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify session"})
				}
				c.Abort()
				return
			}
		}

		if claims.Issuer != "tubedao-backend-temp" {
			isMember, err := checkRegistryMembership(claims.Address)
			if err != nil {
				log.Printf("Failed to re-verify membership for %s: %v", claims.Address, err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify membership"})
				c.Abort()
				return
			}

			if !isMember {
				sessionCollection := db.Collection("auth_sessions")
				sessionCollection.UpdateOne(context.Background(),
					bson.M{"token": tokenString},
					bson.M{"$set": bson.M{"isActive": false}})

				c.JSON(http.StatusForbidden, gin.H{"error": "Registry membership required"})
				c.Abort()
				return
			}
		}

		c.Set("address", claims.Address)
		c.Set("chainId", claims.ChainID)
		c.Next()
	}
}

// Logout - invalidate session
func logout(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusOK, gin.H{"message": "Already logged out"})
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		c.JSON(http.StatusOK, gin.H{"message": "Already logged out"})
		return
	}

	sessionCollection := db.Collection("auth_sessions")
	sessionCollection.UpdateMany(context.Background(),
		bson.M{"token": tokenString},
		bson.M{"$set": bson.M{"isActive": false}})

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// Bind Moksha identity for existing users
func bindMokshaIdentity(c *gin.Context) {
	var req BindMokshaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address, exists := c.Get("address")
	if !exists {
		log.Printf("bindMokshaIdentity: address not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	log.Printf("bindMokshaIdentity: processing request for address %s", address)

	// Verify binding signature
	// TODO: Add signature verification for binding message

	// Check if user already has identity
	identityCollection := db.Collection("moksha_identities")
	var identity MokshaIdentity
	err := identityCollection.FindOne(context.Background(), bson.M{
		"address":  address,
		"isActive": true,
	}).Decode(&identity)

	if err == nil {
		// User already has identity, generate final token
		token, expiresAt, err := generateJWT(address.(string), VANA_MOKSHA_CHAIN_ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, AuthResponse{
			Token:     token,
			Address:   address.(string),
			ChainID:   VANA_MOKSHA_CHAIN_ID,
			ExpiresAt: expiresAt,
		})
		return
	}

	// User needs registration
	c.JSON(http.StatusAccepted, gin.H{
		"error":              "registration required",
		"registrationNeeded": true,
	})
}

// Register with Moksha network
func registerWithMoksha(c *gin.Context) {
	var req RegisterMokshaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify SIWE signature
	// TODO: Add SIWE signature verification

	// Verify binding signature  
	// TODO: Add binding signature verification

	// Generate registration ID
	registrationID := uuid.New().String()

	// Generate Moksha address (for demo purposes, using a derived address)
	// In production, this would be handled by your relayer
	mokshaAddress := generateMokshaAddress(req.Address)

	// Store registration request
	registrationCollection := db.Collection("moksha_registrations")
	registration := MokshaRegistration{
		RegistrationID:   registrationID,
		Address:          req.Address,
		MokshaAddress:    mokshaAddress,
		SiweMessage:      req.SiweMessage,
		SiweSignature:    req.SiweSignature,
		BindingMessage:   req.BindingMessage,
		BindingSignature: req.BindingSignature,
		Status:           "pending",
		CreatedAt:        time.Now(),
	}

	_, err := registrationCollection.InsertOne(context.Background(), registration)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create registration"})
		return
	}

	// Start relayer process (async)
	go processRegistration(registrationID)

	c.JSON(http.StatusOK, RegistrationResponse{
		RegistrationID: registrationID,
		Status:         "pending",
	})
}

// Check registration status
func checkRegistrationStatus(c *gin.Context) {
	registrationID := c.Param("registrationId")

	registrationCollection := db.Collection("moksha_registrations")
	var registration MokshaRegistration
	err := registrationCollection.FindOne(context.Background(), bson.M{
		"registrationId": registrationID,
	}).Decode(&registration)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Registration not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check registration"})
		}
		return
	}

	if registration.Status == "completed" {
		// Generate final auth token
		token, expiresAt, err := generateJWT(registration.Address, VANA_MOKSHA_CHAIN_ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, RegistrationStatus{
			Completed: true,
			Failed:    false,
			Token:     token,
			ChainID:   VANA_MOKSHA_CHAIN_ID,
			ExpiresAt: expiresAt,
		})
		return
	}

	if registration.Status == "failed" {
		c.JSON(http.StatusOK, RegistrationStatus{
			Completed: false,
			Failed:    true,
			Error:     registration.Error,
		})
		return
	}

	// Still processing
	c.JSON(http.StatusOK, RegistrationStatus{
		Completed: false,
		Failed:    false,
	})
}

// Process registration with relayer (mock implementation)
func processRegistration(registrationID string) {
	registrationCollection := db.Collection("moksha_registrations")
	
	// Update status to processing
	registrationCollection.UpdateOne(context.Background(),
		bson.M{"registrationId": registrationID},
		bson.M{"$set": bson.M{"status": "processing"}})

	// Simulate relayer processing time
	time.Sleep(10 * time.Second)

	// Get registration
	var registration MokshaRegistration
	err := registrationCollection.FindOne(context.Background(), bson.M{
		"registrationId": registrationID,
	}).Decode(&registration)

	if err != nil {
		return
	}

	// Simulate successful registration
	// In production, this would interact with your Moksha relayer
	txHash := "0x" + uuid.New().String()
	completedAt := time.Now()

	// Update registration as completed
	registrationCollection.UpdateOne(context.Background(),
		bson.M{"registrationId": registrationID},
		bson.M{"$set": bson.M{
			"status":      "completed",
			"txHash":      txHash,
			"completedAt": completedAt,
		}})

	// Create Moksha identity
	identityCollection := db.Collection("moksha_identities")
	identity := MokshaIdentity{
		Address:       registration.Address,
		MokshaAddress: registration.MokshaAddress,
		IsActive:      true,
		CreatedAt:     completedAt,
		LastVerified:  completedAt,
	}

	identityCollection.InsertOne(context.Background(), identity)

	log.Printf("Registration completed for %s -> %s", registration.Address, registration.MokshaAddress)
}

// Generate Moksha address (mock implementation)
func generateMokshaAddress(address string) string {
	// In production, this would be handled by your relayer
	// For demo purposes, we'll just modify the address
	return "0x" + strings.ToLower(address[2:12]) + "moksha" + address[12:]
}

// Check auth status
func authStatus(c *gin.Context) {
	address, exists := c.Get("address")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"authenticated": false})
		return
	}

	chainId, _ := c.Get("chainId")
	c.JSON(http.StatusOK, gin.H{
		"authenticated": true,
		"address":       address,
		"chainId":       chainId,
	})
}
