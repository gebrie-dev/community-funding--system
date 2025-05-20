"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGithub();
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in with GitHub.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-header">
            <Link to="/" className="logo-link">
              <img
                src="/icons/logo.png"
                alt="Community Logo"
                className="logo"
              />
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

            {error && <div className="error-message">{error}</div>}

            <div className="social-auth">
              <button
                type="button"
                className="social-button"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <FaGoogle />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="social-button"
                onClick={handleGithubSignIn}
                disabled={loading}
              >
                <FaGithub />
                <span>GitHub</span>
              </button>
            </div>

            <div className="login-divider">
              <span>Or continue with email</span>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
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
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
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
