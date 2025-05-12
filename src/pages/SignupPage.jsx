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
import "./SignupPage.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const { signup, signInWithGoogle, signInWithFacebook, loading } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

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
    setError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (validateForm()) {
      try {
        await signup(
          `${formData.firstName} ${formData.lastName}`,
          formData.email,
          formData.password
        );
        navigate("/");
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleSocialSignup = async (provider) => {
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
    <div className={`signup-page ${darkMode ? "dark" : ""}`}>
      <div className="signup-container">
        <div className="signup-left">
          <div className="community-image">
            <img src="/images/community-funding.png" alt="Community" />
            <div className="overlay-badges">
              <div className="badge trusted">
                <span>Trusted & Secure Platform</span>
              </div>
              <div className="badge impact">
                <span>Impacting Lives</span>
              </div>
            </div>
          </div>
        </div>

        <div className="signup-right">
          <div className="signup-header">
            <Link to="/" className="logo-link">
              <Logo />
            </Link>
            <div className="auth-switch">
              <span>Already have an account?</span>
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </div>
          </div>

          <div className="signup-form-container">
            <h1>Join Our Community!</h1>
            <p className="signup-subtitle">
              Create an account to start making a difference
            </p>

            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="social-signup">
              <SocialButton
                icon={<img src="/icons/google.svg" alt="Google" />}
                provider="Google"
                onClick={() => handleSocialSignup("Google")}
                disabled={loading}
              />
              <SocialButton
                icon={<img src="/icons/facebook.svg" alt="Facebook" />}
                provider="Facebook"
                onClick={() => handleSocialSignup("Facebook")}
                disabled={loading}
              />
            </div>

            <div className="divider">
              <span>Or sign up with email</span>
            </div>

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="name-fields">
                <Input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  error={errors.firstName}
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  error={errors.lastName}
                />
              </div>

              <Input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                error={errors.email}
              />

              <Input
                type="password"
                placeholder="Create a password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                error={errors.password}
              />

              <Input
                type="password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                error={errors.confirmPassword}
              />

              <Button
                type="submit"
                className="signup-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="terms-agreement">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="terms-link">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="terms-link">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
