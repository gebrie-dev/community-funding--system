"use client"

import { useState, useEffect, useRef } from "react"
import { Send, X, MessageSquare, Lightbulb } from "lucide-react"
import "./ChatbotRecommendation.css"

const ChatbotRecommendation = ({ formData, onSuggestionApply }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! I'm your campaign assistant. I can help you create a more effective campaign. Ask me anything!",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)

  // Auto-generate suggestions based on form data
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      generateSuggestions(formData)
    }
  }, [formData])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateSuggestions = (data) => {
    // This would ideally use the AI SDK to generate suggestions
    // For now, we'll use predefined suggestions based on form data
    const newSuggestions = []

    if (data.title && data.title.length < 10) {
      newSuggestions.push({
        type: "title",
        content: "Your title is quite short. Consider adding more details to grab attention.",
      })
    }

    if (data.description && data.description.length < 100) {
      newSuggestions.push({
        type: "description",
        content: "Adding more details to your description can help donors understand your cause better.",
      })
    }

    if (data.goal && Number.parseInt(data.goal) > 10000) {
      newSuggestions.push({
        type: "goal",
        content: "For larger goals, consider breaking down how the funds will be used to build trust.",
      })
    }

    if (data.category === "Emergency") {
      newSuggestions.push({
        type: "emergency",
        content: "For emergency campaigns, adding time-sensitive information can create urgency.",
        example: "We need to act within the next 48 hours to provide immediate relief.",
      })
    }

    if (!data.image) {
      newSuggestions.push({
        type: "image",
        content: "Campaigns with images receive 2x more donations. Add a compelling photo.",
      })
    }

    setSuggestions(newSuggestions)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = { role: "user", content: inputValue }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // In a real implementation, this would use the AI SDK
      // For now, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a contextual response based on the user's message
      let responseContent = "I'm sorry, I don't have enough information to help with that specific question."

      const lowerCaseInput = inputValue.toLowerCase()
      if (lowerCaseInput.includes("title") || lowerCaseInput.includes("headline")) {
        responseContent =
          "Great titles are clear, specific, and evoke emotion. For example, instead of 'Help My Project', try 'Provide Clean Water to 500 Children in Juba'. This specifies the impact and location."
      } else if (lowerCaseInput.includes("description") || lowerCaseInput.includes("write")) {
        responseContent =
          "For your description, structure it in 3 parts: 1) The problem you're solving, 2) Your specific solution, and 3) The impact donors will make. Use short paragraphs and include personal stories when possible."
      } else if (
        lowerCaseInput.includes("goal") ||
        lowerCaseInput.includes("amount") ||
        lowerCaseInput.includes("money")
      ) {
        responseContent =
          "Set a realistic funding goal based on your actual needs. Break down how funds will be used to build trust. If your needs are large, consider setting milestone goals."
      } else if (
        lowerCaseInput.includes("image") ||
        lowerCaseInput.includes("photo") ||
        lowerCaseInput.includes("picture")
      ) {
        responseContent =
          "Use high-quality, authentic images that show the people or cause you're helping. Avoid stock photos. Images that show faces tend to perform better than objects or landscapes."
      } else if (lowerCaseInput.includes("example") || lowerCaseInput.includes("successful")) {
        responseContent =
          "Successful campaigns typically have: clear goals, compelling stories, regular updates, and personal connection to the cause. They also actively share on social media and engage with their supporters."
      }

      const assistantMessage = { role: "assistant", content: responseContent }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplySuggestion = (suggestion) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion)
    }

    // Add a message about applying the suggestion
    setMessages((prev) => [
      ...prev,
      { role: "user", content: `I want to improve my ${suggestion.type}.` },
      {
        role: "assistant",
        content: `Great! I've provided a suggestion for your ${suggestion.type}. ${suggestion.content} ${suggestion.example ? `\n\nExample: "${suggestion.example}"` : ""}`,
      },
    ])
  }

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
          <span className="sr-only">Open campaign assistant</span>
        </button>
      ) : (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Lightbulb size={18} />
              <h3>Campaign Assistant</h3>
            </div>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <X size={18} />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role === "assistant" ? "assistant" : "user"}`}>
                <div className="message-content">{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-content loading">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {suggestions.length > 0 && (
            <div className="suggestion-container">
              <h4>Suggestions to improve your campaign:</h4>
              <div className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <p>{suggestion.content}</p>
                    <button className="apply-suggestion" onClick={() => handleApplySuggestion(suggestion)}>
                      Get Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for campaign tips..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()}>
              <Send size={18} />
              <span className="sr-only">Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChatbotRecommendation
