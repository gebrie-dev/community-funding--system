 

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaShieldAlt,
  FaGoogle,
  FaFacebook,
  FaSpinner
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Enhanced form validation
  useEffect(() => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email) && password.length >= 4;
    setIsFormValid(isValid);
  }, [formData]);

  // Log user changes for debugging
  useEffect(() => {
    console.log("Context user updated:", user);
  }, [user]);

  // Enhanced input handler
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  }, [error]);

  // Enhanced focus handlers
  const handleFocus = useCallback((field) => {
    setFocusedField(field);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  // Enhanced password visibility toggle
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Enhanced form submission with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { email, password } = formData;
      
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      if (!isFormValid) {
        throw new Error("Please enter a valid email and password (minimum 6 characters)");
      }

      console.log("Submitting login with:", { email, password });
      const userData = await login(email.trim(), password);
      console.log("Login response:", userData);
      
      if (!userData || typeof userData.is_staff === "undefined") {
        throw new Error("User data not available");
      }

      // Enhanced navigation with smooth transition
      const targetRoute = userData.is_staff ? "/admin" : "/dashboard";
      navigate(targetRoute, {
        state: { isInternal: userData.is_staff },
        replace: true
      });

    } catch (err) {
      console.error("Login error:", err);
      
      // Enhanced error parsing
      try {
        const errorData = JSON.parse(err.message);
        if (errorData.email) {
          setError(errorData.email[0] || "Email is required");
        } else if (errorData.password) {
          setError(errorData.password[0] || "Password is required");
        } else if (errorData.error) {
          setError(errorData.error || "Invalid credentials");
        } else {
          setError("An error occurred. Please try again.");
        }
      } catch {
        setError(err.message || "Invalid email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handlers (placeholder for future implementation)
  const handleSocialLogin = useCallback((provider) => {
    console.log(`Social login with ${provider} - Coming soon!`);
    // TODO: Implement social login
  }, []);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-header">
            <Link to="/" className="logo-link" aria-label="Go to homepage">
              <img
                src="http://localhost:8000/icons/logo.png"
                alt="Company Logo"
                className="logo"
                onError={(e) => {
                  e.target.src = "/images/placeholder.png";
                  e.target.alt = "Logo placeholder";
                }}
                loading="lazy"
              />
            </Link>
            <div className="auth-switch">
              <span>Don't have an account?</span>
              <Link to="/signup" className="auth-link">
                Sign Up
              </Link>
            </div>
          </div>

          <div className="login-form-container">
            <div className="welcome-section">
              <h1>Welcome Back!</h1>
              <p className="login-subtitle">
                Sign in to access your community dashboard
              </p>
            </div>

            {/* Enhanced Social Login Section */}
            <div className="social-auth">
              <button
                type="button"
                className="social-button google"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                aria-label="Sign in with Google"
              >
                <FaGoogle className="social-icon" />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="social-button facebook"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                aria-label="Sign in with Facebook"
              >
                <FaFacebook className="social-icon" />
                <span>Facebook</span>
              </button>
            </div>

            <div className="login-divider">
              <span>or continue with email</span>
            </div>

            {/* Enhanced Error Display */}
            {error && (
              <div className="error-message" role="alert" aria-live="polite">
                <FaShieldAlt aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {/* Enhanced Form */}
            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className={`input-with-icon ${focusedField === 'email' ? 'focused' : ''}`}>
                  {/* <FaEnvelope className="input-icon ml-2" aria-hidden="true" /> */}
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    aria-describedby={error ? "error-message" : undefined}
                    className={error && error.toLowerCase().includes('email') ? 'error' : ''}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className={`input-with-icon ${focusedField === 'password' ? 'focused' : ''}`}>
                  {/* <FaLock className="input-icon" aria-hidden="true" /> */}
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    minLength="4"
                    aria-describedby="password-requirements"
                    className={error && error.toLowerCase().includes('password') ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex="0"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div id="password-requirements" className="sr-only">
                  Password must be at least 6 characters long
                </div>
              </div>

              <div className="form-options">
                <Link to="/reset-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={`login-button ${!isFormValid && !isLoading ? 'disabled' : ''}`}
                disabled={isLoading || !isFormValid}
                aria-describedby="login-status"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
              
              <div id="login-status" className="sr-only" aria-live="polite">
                {isLoading ? "Signing in, please wait" : ""}
              </div>
            </form>
          </div>
        </div>

        <div className="login-right">
          <div className="login-illustration">
            <img
              src="http://localhost:8000/images/login-illustration.png"
              alt="Community illustration showing people connecting and collaborating"
              onError={(e) => {
                e.target.src = "/images/placeholder.png";
                e.target.alt = "Illustration placeholder";
              }}
              loading="lazy"
            />
          </div>
          <div className="login-message">
            <h2>Join Our Community</h2>
            <p>
              Connect with like-minded individuals, share ideas, and grow
              together in a supportive environment.
            </p>
            <div className="security-badge">
              <FaShieldAlt aria-hidden="true" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
