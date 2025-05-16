// src/pages/ContactPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { addContactMessage } from "../firebase/messages";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Mail, Phone, MapPin, Send, Loader2, AlertCircle } from "lucide-react";
import "./ContactPage.css";

const ContactPage = () => {
  const { darkMode } = useTheme();
  const { addNotification } = useNotification();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addNotification("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);

    try {
      await addContactMessage({
        ...formData,
        userId: currentUser?.uid || null,
        userName: currentUser?.name || formData.name,
        userEmail: currentUser?.email || formData.email,
      });

      setSuccess(true);
      addNotification(
        "Message sent successfully! We will get back to you soon.",
        "success"
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "Failed to send message. Please try again.";

      if (error.code === "permission-denied") {
        errorMessage =
          "You don't have permission to send messages. Please log in.";
      } else if (error.code === "unavailable") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.code === "invalid-argument") {
        errorMessage = "Invalid form data. Please check your inputs.";
      }

      addNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`contact-page ${darkMode ? "dark" : ""}`}>
      <Navbar />

      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with us!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <Mail size={24} />
              </div>
              <h3>Email Us</h3>
              <p>info@communityfunding.com</p>
              <p>support@communityfunding.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Phone size={24} />
              </div>
              <h3>Call Us</h3>
              <p>+251 914080045</p>
              <p>+251 714080045</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <MapPin size={24} />
              </div>
              <h3>Visit Us</h3>
              <p>ASTU Street</p>
              <p>Funding City, FC 12345</p>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send us a message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                  disabled={loading || success}
                  required
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? "error" : ""}
                  disabled={loading || success}
                  required
                  placeholder="Enter message subject"
                />
                {errors.subject && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{errors.subject}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? "error" : ""}
                  disabled={loading || success}
                  required
                  placeholder="Type your message here..."
                  rows="5"
                ></textarea>
                {errors.message && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{errors.message}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="submit-button"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Sending Message...</span>
                  </>
                ) : success ? (
                  <>
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
