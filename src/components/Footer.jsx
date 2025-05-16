import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  FileText,
  HelpCircle,
} from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer className={`footer ${darkMode ? "dark" : ""}`}>
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            We are dedicated to connecting communities and making a positive
            impact through collective action and support.
          </p>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/campaigns">Campaigns</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul className="contact-info">
            <li>
              <Mail size={18} />
              <span>info@communityfunding.com</span>
            </li>
            <li>
              <Phone size={18} />
              <span>+251 914080045</span>
            </li>
            <li>
              <MapPin size={18} />
              <span>ASTU Street, Funding City, FC 12345</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal & Support</h3>
          <ul className="legal-links">
            <li>
              <Link to="/privacy-policy">
                <Shield size={18} />
                <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link to="/terms">
                <FileText size={18} />
                <span>Terms of Service</span>
              </Link>
            </li>
            <li>
              <Link to="/faq">
                <HelpCircle size={18} />
                <span>FAQ</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Community Funding. All rights
          reserved.
        </p>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/faq">FAQ</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
