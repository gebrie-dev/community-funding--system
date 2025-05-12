// src/pages/ContactPage.jsx
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the form data to a server
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  return (
    <div className="contact-page">
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
              <p> ASTU Street</p>
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
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>
              
              <Button type="submit" className="submit-button">
                <Send size={18} />
                <span>Send Message</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;