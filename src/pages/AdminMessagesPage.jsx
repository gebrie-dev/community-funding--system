import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import {
  getAllMessages,
  getMessagesByStatus,
  getMessagesByCategory,
  getMessagesByPriority,
  markMessageAsRead,
} from "../firebase/messages";
import Navbar from "../components/Navbar";
import { Mail, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import "./AdminMessagesPage.css";

const AdminMessagesPage = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const { addNotification } = useNotification();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      addNotification(
        "You do not have permission to access this page",
        "error"
      );
      return;
    }

    loadMessages();
  }, [currentUser, filter, categoryFilter, priorityFilter]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      let messagesData;

      // First get messages based on status
      if (filter === "all") {
        messagesData = await getAllMessages();
      } else {
        messagesData = await getMessagesByStatus(filter);
      }

      // Then filter by category if needed
      if (categoryFilter !== "all") {
        messagesData = messagesData.filter(
          (msg) => msg.category === categoryFilter
        );
      }

      // Finally filter by priority if needed
      if (priorityFilter !== "all") {
        messagesData = messagesData.filter(
          (msg) => msg.priority === priorityFilter
        );
      }

      // Sort messages by priority and date
      messagesData.sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setMessages(messagesData);
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Failed to load messages. Please try again.");
      addNotification("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId);
      setMessages(
        messages.map((message) =>
          message.id === messageId
            ? { ...message, status: "read", readAt: new Date() }
            : message
        )
      );
      addNotification("Message marked as read", "success");
    } catch (error) {
      console.error("Error marking message as read:", error);
      addNotification("Failed to mark message as read", "error");
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className={`admin-messages-page ${darkMode ? "dark" : ""}`}>
        <Navbar />
        <div className="admin-messages-container">
          <h1>Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-messages-page ${darkMode ? "dark" : ""}`}>
      <Navbar />

      <div className="admin-messages-container">
        <div className="admin-messages-header">
          <h1>Contact Messages</h1>
          <div className="filter-controls">
            <div className="filter-group">
              <label>Status:</label>
              <div className="filter-buttons">
                <button
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All Messages
                </button>
                <button
                  className={filter === "unread" ? "active" : ""}
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </button>
                <button
                  className={filter === "read" ? "active" : ""}
                  onClick={() => setFilter("read")}
                >
                  Read
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label>Category:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Priority:</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-container">
            <AlertCircle size={24} />
            <p>{error}</p>
            <button onClick={loadMessages} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <Loader2 className="animate-spin" size={32} />
            <span>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <Mail size={48} />
            <h2>No Messages</h2>
            <p>There are no messages to display.</p>
          </div>
        ) : (
          <div className="messages-grid">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-card ${message.status} ${
                  message.priority
                } ${darkMode ? "dark" : ""}`}
              >
                <div className="message-header">
                  <div className="message-info">
                    <h3>{message.subject}</h3>
                    <div className="message-meta">
                      <span className="message-category">
                        {message.category}
                      </span>
                      <span className={`message-priority ${message.priority}`}>
                        {message.priority}
                      </span>
                      <span className="message-date">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="message-status">
                    {message.status === "unread" ? (
                      <button
                        className="mark-read-button"
                        onClick={() => handleMarkAsRead(message.id)}
                        title="Mark as read"
                      >
                        <XCircle size={20} className="unread" />
                      </button>
                    ) : (
                      <CheckCircle size={20} className="read" />
                    )}
                  </div>
                </div>

                <div className="message-content">
                  <div className="sender-info">
                    <strong>{message.userName}</strong>
                    <span>{message.userEmail}</span>
                  </div>
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
