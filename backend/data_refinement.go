package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"time"
)

// YouTube data schema definition following VRC-15
type YouTubeDataSchema struct {
	Version       string                 `json:"version"`
	Contributor   string                 `json:"contributor"`
	Timestamp     int64                  `json:"timestamp"`
	DataType      string                 `json:"dataType"`
	WatchHistory  []WatchHistoryEntry    `json:"watchHistory,omitempty"`
	SearchHistory []SearchHistoryEntry   `json:"searchHistory,omitempty"`
	Subscriptions []SubscriptionEntry    `json:"subscriptions,omitempty"`
	Metadata      map[string]interface{} `json:"metadata"`
}

type WatchHistoryEntry struct {
	VideoID        string    `json:"videoId"`
	Title          string    `json:"title,omitempty"`
	ChannelName    string    `json:"channelName,omitempty"`
	WatchTime      time.Time `json:"watchTime"`
	Duration       int       `json:"duration,omitempty"`
	PercentWatched float64   `json:"percentWatched,omitempty"`
}

type SearchHistoryEntry struct {
	Query        string    `json:"query"`
	Timestamp    time.Time `json:"timestamp"`
	ResultClicks []string  `json:"resultClicks,omitempty"`
}

type SubscriptionEntry struct {
	ChannelID    string    `json:"channelId"`
	ChannelName  string    `json:"channelName"`
	SubscribedAt time.Time `json:"subscribedAt"`
}

type RefinedData struct {
	Schema    YouTubeDataSchema `json:"schema"`
	Hash      [32]byte          `json:"hash"`
	Encrypted []byte            `json:"encrypted"`
	IPFSHash  string            `json:"ipfsHash"`
	AccessKey []byte            `json:"accessKey"`
}

// Normalize raw YouTube data to predefined schema
func normalizeYouTubeData(rawData interface{}, contributor string) (*YouTubeDataSchema, error) {
	data, ok := rawData.(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid data format")
	}

	schema := &YouTubeDataSchema{
		Version:     "1.0",
		Contributor: contributor,
		Timestamp:   time.Now().Unix(),
		DataType:    "youtube_takeout",
		Metadata:    make(map[string]interface{}),
	}

	// Normalize watch history
	if watchHistory, exists := data["MyActivity"]; exists {
		if activities, ok := watchHistory.([]interface{}); ok {
			for _, activity := range activities {
				if activityMap, ok := activity.(map[string]interface{}); ok {
					entry := normalizeWatchHistoryEntry(activityMap)
					if entry != nil {
						schema.WatchHistory = append(schema.WatchHistory, *entry)
					}
				}
			}
		}
	}

	// Normalize search history
	if searchHistory, exists := data["SearchHistory"]; exists {
		if searches, ok := searchHistory.([]interface{}); ok {
			for _, search := range searches {
				if searchMap, ok := search.(map[string]interface{}); ok {
					entry := normalizeSearchHistoryEntry(searchMap)
					if entry != nil {
						schema.SearchHistory = append(schema.SearchHistory, *entry)
					}
				}
			}
		}
	}

	// Normalize subscriptions
	if subscriptions, exists := data["Subscriptions"]; exists {
		if subs, ok := subscriptions.([]interface{}); ok {
			for _, sub := range subs {
				if subMap, ok := sub.(map[string]interface{}); ok {
					entry := normalizeSubscriptionEntry(subMap)
					if entry != nil {
						schema.Subscriptions = append(schema.Subscriptions, *entry)
					}
				}
			}
		}
	}

	// Extract metadata
	schema.Metadata["originalFields"] = len(data)
	schema.Metadata["processedAt"] = time.Now().Unix()
	schema.Metadata["dataQuality"] = calculateDataQuality(schema)

	return schema, nil
}

// Apply privacy masking based on user preferences
func applyPrivacyMasking(schema *YouTubeDataSchema, maskingRules map[string]bool) *YouTubeDataSchema {
	masked := *schema

	if maskingRules["titles"] {
		for i := range masked.WatchHistory {
			masked.WatchHistory[i].Title = "[MASKED]"
		}
	}

	if maskingRules["channelNames"] {
		for i := range masked.WatchHistory {
			masked.WatchHistory[i].ChannelName = "[MASKED]"
		}
		for i := range masked.Subscriptions {
			masked.Subscriptions[i].ChannelName = "[MASKED]"
		}
	}

	if maskingRules["searchQueries"] {
		for i := range masked.SearchHistory {
			masked.SearchHistory[i].Query = "[MASKED]"
		}
	}

	if maskingRules["timestamps"] {
		// Keep only month/year for privacy
		for i := range masked.WatchHistory {
			original := masked.WatchHistory[i].WatchTime
			masked.WatchHistory[i].WatchTime = time.Date(original.Year(), original.Month(), 1, 0, 0, 0, 0, time.UTC)
		}
	}

	return &masked
}

// Encrypt refined data for access control
func encryptRefinedData(data *YouTubeDataSchema) (*RefinedData, error) {
	// Serialize the schema
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("failed to serialize data: %v", err)
	}

	// Generate encryption key
	key := make([]byte, 32) // AES-256
	if _, err := io.ReadFull(rand.Reader, key); err != nil {
		return nil, fmt.Errorf("failed to generate encryption key: %v", err)
	}

	// Encrypt data
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, fmt.Errorf("failed to create cipher: %v", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("failed to create GCM: %v", err)
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, fmt.Errorf("failed to generate nonce: %v", err)
	}

	encrypted := gcm.Seal(nonce, nonce, jsonData, nil)

	// Calculate hash
	hash := sha256.Sum256(jsonData)

	return &RefinedData{
		Schema:    *data,
		Hash:      hash,
		Encrypted: encrypted,
		AccessKey: key,
	}, nil
}

// Helper functions for normalization
func normalizeWatchHistoryEntry(data map[string]interface{}) *WatchHistoryEntry {
	entry := &WatchHistoryEntry{}

	if title, ok := data["title"].(string); ok {
		// Extract video ID from YouTube URLs
		if strings.Contains(title, "youtube.com/watch") {
			parts := strings.Split(title, "v=")
			if len(parts) > 1 {
				entry.VideoID = strings.Split(parts[1], "&")[0]
			}
		}
		entry.Title = title
	}

	if timestamp, ok := data["time"].(string); ok {
		if t, err := time.Parse(time.RFC3339, timestamp); err == nil {
			entry.WatchTime = t
		}
	}

	if entry.VideoID != "" || entry.Title != "" {
		return entry
	}
	return nil
}

func normalizeSearchHistoryEntry(data map[string]interface{}) *SearchHistoryEntry {
	entry := &SearchHistoryEntry{}

	if query, ok := data["query"].(string); ok {
		entry.Query = query
	}

	if timestamp, ok := data["time"].(string); ok {
		if t, err := time.Parse(time.RFC3339, timestamp); err == nil {
			entry.Timestamp = t
		}
	}

	if entry.Query != "" {
		return entry
	}
	return nil
}

func normalizeSubscriptionEntry(data map[string]interface{}) *SubscriptionEntry {
	entry := &SubscriptionEntry{}

	if channelName, ok := data["channelName"].(string); ok {
		entry.ChannelName = channelName
	}

	if channelId, ok := data["channelId"].(string); ok {
		entry.ChannelID = channelId
	}

	if timestamp, ok := data["subscribedAt"].(string); ok {
		if t, err := time.Parse(time.RFC3339, timestamp); err == nil {
			entry.SubscribedAt = t
		}
	}

	if entry.ChannelName != "" || entry.ChannelID != "" {
		return entry
	}
	return nil
}

// Calculate data quality score for refined data
func calculateDataQuality(schema *YouTubeDataSchema) float64 {
	score := 0.0
	maxScore := 5.0

	// Check watch history completeness
	if len(schema.WatchHistory) > 0 {
		score += 1.0
		if len(schema.WatchHistory) > 100 {
			score += 0.5 // Bonus for substantial data
		}
	}

	// Check search history
	if len(schema.SearchHistory) > 0 {
		score += 1.0
	}

	// Check subscriptions
	if len(schema.Subscriptions) > 0 {
		score += 1.0
	}

	// Check data richness
	hasTimestamps := false
	hasChannelInfo := false
	for _, entry := range schema.WatchHistory {
		if !entry.WatchTime.IsZero() {
			hasTimestamps = true
		}
		if entry.ChannelName != "" {
			hasChannelInfo = true
		}
	}

	if hasTimestamps {
		score += 1.0
	}
	if hasChannelInfo {
		score += 0.5
	}

	return (score / maxScore) * 10
}
