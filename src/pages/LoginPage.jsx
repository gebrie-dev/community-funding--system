"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithFacebook } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setIsLoading(true);
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setError("");
      setIsLoading(true);
      await signInWithFacebook();
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in with Facebook. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-header">
            <Link to="/" className="logo-link">
              <img src="/icons/logo.png" alt="Logo" className="logo" />
            </Link>
            <div className="auth-switch">
              <span>Don't have an account?</span>
              <Link to="/signup" className="auth-link">
                Sign up
              </Link>
            </div>
          </div>

          <div className="login-form-container">
            <h1>Welcome Back!</h1>
            <p className="login-subtitle">
              Sign in to access your community dashboard
            </p>

            {error && (
              <div className="error-message">
                <FaShieldAlt />
                <span>{error}</span>
              </div>
            )}

            <div className="social-auth">
              <button
                className="social-button google"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <img
                  src="/icons/google.svg"
                  alt="Google"
                  className="social-icon"
                />
                <span>Continue with Google</span>
              </button>
              <button
                className="social-button facebook"
                onClick={handleFacebookSignIn}
                disabled={isLoading}
              >
                <img
                  src="/icons/facebook.svg"
                  alt="Facebook"
                  className="social-icon"
                />
                <span>Continue with Facebook</span>
              </button>
            </div>

            <div className="login-divider">
              <span>or continue with email</span>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>

        <div className="login-right">
          <div className="login-illustration">
            <img
              src="/images/login-illustration.png"
              alt="Login Illustration"
            />
          </div>
          <div className="login-message">
            <h2>Join Our Community</h2>
            <p>
              Connect with like-minded individuals, share ideas, and grow
              together in a supportive environment.
            </p>
            <div className="security-badge">
              <FaShieldAlt /> Secure & Private
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
