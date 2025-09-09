package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var db *mongo.Database

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	log.Printf("Starting backend")

	initMongoDB()
	initAuth(db)

	// Initialize blockchain integration
	if err := initBlockchain(); err != nil {
		log.Printf("Blockchain initialization failed: %v", err)
	}

	// Initialize VRC-15 data access integration
	if err := initVanaDataAccess(); err != nil {
		log.Printf("Vana data access initialization failed: %v", err)
	}

	r := gin.Default()

	// Custom CORS middleware to handle all origins properly
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := r.Group("/api")
	{
		// Authentication endpoints
		api.POST("/auth/nonce", generateNonce)
		api.POST("/auth/verify", verifySIWE)
		api.POST("/auth/bind-moksha", jwtMiddleware(), bindMokshaIdentity)
		api.POST("/auth/register-moksha", registerWithMoksha)
		api.GET("/auth/registration-status/:registrationId", checkRegistrationStatus)
		api.POST("/auth/logout", logout)
		api.GET("/auth/status", jwtMiddleware(), authStatus)

		// Protected endpoints
		protected := api.Group("/events", jwtAuthMiddleware())
		{
			protected.POST("/upload", uploadBatchedEvents)
			protected.POST("/upload-data", uploadData)
			protected.GET("/user/:address/contributions", getUserContributions)
			protected.GET("/user/:address/rewards", getUserRewards)
		}
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(r.Run(":" + port))
}

func initMongoDB() {
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI environment variable is required")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	db = client.Database("tubedao")

	log.Println("Connected to MongoDB")
}
