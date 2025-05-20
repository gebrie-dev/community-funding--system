import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import "./ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hello! I'm your Community Assistant. I can help you find campaigns, answer questions about donations, or guide you through creating your own campaign. How can I assist you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: "user",
      content: inputValue.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await getBotResponse(inputValue.trim());
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: response,
        },
      ]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button
          className="chatbot-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Community Assistant</h3>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.content}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const getBotResponse = async (message) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! How can I help you today? You can ask me about:\n- Finding campaigns\n- Making donations\n- Creating your own campaign\n- Platform features";
  }

  // Campaign related queries
  if (lowerMessage.includes("campaign")) {
    if (lowerMessage.includes("find") || lowerMessage.includes("search")) {
      return "You can find campaigns by:\n1. Using the search bar at the top\n2. Browsing categories on the Campaigns page\n3. Using filters for specific types (Medical, Education, Emergency)\nWhat type of campaign are you looking for?";
    }
    if (lowerMessage.includes("create") || lowerMessage.includes("start")) {
      return "To create a campaign:\n1. Click 'Launch Campaign' in the navigation\n2. Fill in campaign details (title, description, goal)\n3. Add images and documents\n4. Set your fundraising target\n5. Submit for review\nWould you like me to guide you through any specific step?";
    }
    return "I can help you with campaigns! Would you like to:\n- Find existing campaigns\n- Create a new campaign\n- Learn about campaign categories\nWhat would you like to know?";
  }

  // Donation related queries
  if (lowerMessage.includes("donate") || lowerMessage.includes("donation")) {
    if (lowerMessage.includes("how")) {
      return "To make a donation:\n1. Browse campaigns and select one\n2. Click the 'Donate' button\n3. Choose your donation amount\n4. Select payment method\n5. Complete the transaction\nWould you like to know about our payment methods?";
    }
    if (lowerMessage.includes("payment") || lowerMessage.includes("pay")) {
      return "We accept various payment methods:\n- Credit/Debit Cards\n- PayPal\n- Bank Transfer\n- Digital Wallets\nAll transactions are secure and encrypted.";
    }
    return "I can help you with donations! Would you like to know:\n- How to donate\n- Payment methods\n- Donation tracking\nWhat would you like to learn about?";
  }

  // Platform features
  if (lowerMessage.includes("feature") || lowerMessage.includes("help")) {
    return "Our platform offers:\n- Campaign creation and management\n- Secure donation processing\n- Progress tracking\n- Community engagement\n- Campaign analytics\nWhat specific feature would you like to know more about?";
  }

  // Emergency or urgent queries
  if (lowerMessage.includes("emergency") || lowerMessage.includes("urgent")) {
    return "For emergency campaigns:\n1. Go to the Campaigns page\n2. Use the 'Emergency' filter\n3. Sort by 'Most Urgent'\nWould you like me to help you find emergency campaigns?";
  }

  // Default response
  return "I'm here to help! You can ask me about:\n- Finding campaigns\n- Making donations\n- Creating your own campaign\n- Platform features\nWhat would you like to know?";
};

export default ChatBot;
