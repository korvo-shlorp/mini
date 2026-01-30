// package ai

// import (
// 	"bytes"
// 	"encoding/json"
// 	"errors"
// 	"net/http"
// 	"os"
// 	"time"
// )

// const geminiURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="

// type geminiRequest struct {
// 	Contents []geminiContent `json:"contents"`
// }

// type geminiContent struct {
// 	Role  string        `json:"role"`
// 	Parts []geminiPart  `json:"parts"`
// }

// type geminiPart struct {
// 	Text string `json:"text"`
// }

// type geminiResponse struct {
// 	Candidates []struct {
// 		Content struct {
// 			Parts []struct {
// 				Text string `json:"text"`
// 			} `json:"parts"`
// 		} `json:"content"`
// 	} `json:"candidates"`
// }

// func callLLM(prompt string) (string, error) {
// 	apiKey := os.Getenv("GEMINI_API_KEY")
// 	if apiKey == "" {
// 		return "", errors.New("GEMINI_API_KEY not set")
// 	}

// 	reqBody := geminiRequest{
// 		Contents: []geminiContent{
// 			{
// 				Role: "user",
// 				Parts: []geminiPart{
// 					{
// 						Text: "You are an educational advisory AI. You must not guarantee outcomes or give professional advice.\n\n" + prompt,
// 					},
// 				},
// 			},
// 		},
// 	}

// 	bodyBytes, err := json.Marshal(reqBody)
// 	if err != nil {
// 		return "", err
// 	}

// 	req, err := http.NewRequest(
// 		"POST",
// 		geminiURL+apiKey,
// 		bytes.NewBuffer(bodyBytes),
// 	)
// 	if err != nil {
// 		return "", err
// 	}

// 	req.Header.Set("Content-Type", "application/json")

// 	client := &http.Client{Timeout: 15 * time.Second}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		return "", err
// 	}
// 	defer resp.Body.Close()

// 	var parsed geminiResponse
// 	if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
// 		return "", err
// 	}

// 	if len(parsed.Candidates) == 0 ||
// 		len(parsed.Candidates[0].Content.Parts) == 0 {
// 		return "", errors.New("no AI response")
// 	}

// 	return parsed.Candidates[0].Content.Parts[0].Text, nil
// }








package ai

import (
    "bytes"
    "encoding/json"
    "errors"
    "fmt"
    "log"
    "net/http"
    "os"
    "time"
)

const groqURL = "https://api.groq.com/openai/v1/chat/completions"

type chatRequest struct {
    Model    string        `json:"model"`
    Messages []chatMessage `json:"messages"`
    Temperature float32   `json:"temperature,omitempty"`
}

type chatMessage struct {
    Role    string `json:"role"`
    Content string `json:"content"`
}

type chatResponse struct {
    Choices []struct {
        Message chatMessage `json:"message"`
    } `json:"choices"`
}

func callLLM(prompt string) (string, error) {
    apiKey := os.Getenv("GROQ_API_KEY")
    if apiKey == "" {
        log.Println("GROQ_API_KEY not set; LLM call will fail and caller should fallback")
        return "", errors.New("GROQ_API_KEY not set")
    }

    reqBody := chatRequest{
        Model: "llama-3.1-8b-instant",
        Temperature: 0.3, // low randomness = safer explanations
        Messages: []chatMessage{
            {
                Role: "system",
                Content: "You are an educational advisory AI. You must explain decisions clearly, mention uncertainty, and never guarantee outcomes.",
            },
            {
                Role:    "user",
                Content: prompt,
            },
        },
    }

    bodyBytes, _ := json.Marshal(reqBody)

    req, _ := http.NewRequest("POST", groqURL, bytes.NewBuffer(bodyBytes))
    req.Header.Set("Authorization", "Bearer "+apiKey)
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{Timeout: 10 * time.Second}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    if resp.StatusCode < 200 || resp.StatusCode >= 300 {
        return "", fmt.Errorf("LLM API returned status %d", resp.StatusCode)
    }

    var parsed chatResponse
    if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
        return "", err
    }

    if len(parsed.Choices) == 0 {
        return "", errors.New("no response from Groq")
    }

    return parsed.Choices[0].Message.Content, nil
}

