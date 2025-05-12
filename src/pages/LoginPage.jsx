"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";
import SocialButton from "../components/SocialButton";
import { AlertCircle, Loader2 } from "lucide-react";
import "./LoginPage.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login, signInWithGoogle, signInWithFacebook, loading } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(credentials.email, credentials.password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError("");
    try {
      if (provider === "Google") {
        await signInWithGoogle();
      } else if (provider === "Facebook") {
        await signInWithFacebook();
      }
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`login-page ${darkMode ? "dark" : ""}`}>
      <div className="login-container">
        <div className="login-left">
          <div className="login-header">
            <Link to="/" className="logo-link">
              <Logo />
            </Link>
            <div className="auth-switch">
              <span>Don't have an account?</span>
              <Link to="/signup" className="auth-link">
                Sign up!
              </Link>
            </div>
          </div>

          <div className="login-form-container">
            <h1>Welcome Back!</h1>
            <p className="login-subtitle">Sign in to continue your journey</p>

            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="social-login">
              <SocialButton
                icon={<img src="/icons/google.svg" alt="Google" />}
                provider="Google"
                onClick={() => handleSocialLogin("Google")}
                disabled={loading}
              />
              <SocialButton
                icon={<img src="/icons/facebook.svg" alt="Facebook" />}
                provider="Facebook"
                onClick={() => handleSocialLogin("Facebook")}
                disabled={loading}
              />
            </div>

            <div className="divider">
              <span>Or continue with email</span>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={loading}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/reset-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="login-button" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Signing In...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="login-right">
          <div className="login-illustration">
            <img src="/images/login-illustration.png" alt="Secure Login" />
          </div>
          <div className="login-message">
            <div className="security-badge">
              <span>Secure & Trusted</span>
            </div>
            <h2>Support, Fund, and Grow Together!</h2>
            <p>
              Create or contribute to community-driven projects and make a
              difference today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
