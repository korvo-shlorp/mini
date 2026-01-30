package ai

// Chat sends a raw user message to the configured LLM and returns the reply.
// It reuses the existing callLLM helper in this package.
func Chat(message string) (string, error) {
    prompt := "User: " + message + "\n\nRespond concisely. Mention uncertainty and do not guarantee outcomes." 
    return callLLM(prompt)
}
