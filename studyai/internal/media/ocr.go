package media

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"time"
)

// OCRService extracts text from images using a Vision API (Gemini/Google)
type OCRService struct {
	apiKey string
}

func NewOCRService() *OCRService {
	return &OCRService{
		apiKey: os.Getenv("GEMINI_API_KEY"),
	}
}

// ExtractTextFromImage uses the Google Vision REST API to extract text from an image.
// The incoming `imageData` should be a base64-encoded image string (no data: prefix).
func (o *OCRService) ExtractTextFromImage(imageData string) (string, error) {
	if o.apiKey == "" {
		return "", errors.New("GEMINI_API_KEY not set")
	}

	// Build request for Google Vision API (DOCUMENT_TEXT_DETECTION)
	reqBody := map[string]interface{}{
		"requests": []map[string]interface{}{
			{
				"image": map[string]string{
					"content": imageData,
				},
				"features": []map[string]string{
					{"type": "DOCUMENT_TEXT_DETECTION"},
				},
			},
		},
	}

	bodyBytes, _ := json.Marshal(reqBody)

	// Use the Vision REST endpoint with the provided API key.
	url := "https://vision.googleapis.com/v1/images:annotate?key=" + o.apiKey
	httpReq, _ := http.NewRequest("POST", url, bytes.NewBuffer(bodyBytes))
	httpReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result struct {
		Responses []struct {
			FullTextAnnotation struct {
				Text string `json:"text"`
			} `json:"fullTextAnnotation"`
			TextAnnotations []struct {
				Description string `json:"description"`
			} `json:"textAnnotations"`
		} `json:"responses"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	if len(result.Responses) == 0 {
		return "", errors.New("no text extracted from image")
	}

	// Prefer fullTextAnnotation if available, otherwise fallback to first textAnnotation
	if result.Responses[0].FullTextAnnotation.Text != "" {
		return result.Responses[0].FullTextAnnotation.Text, nil
	}
	if len(result.Responses[0].TextAnnotations) > 0 {
		return result.Responses[0].TextAnnotations[0].Description, nil
	}

	return "", errors.New("no text extracted from image")
}
