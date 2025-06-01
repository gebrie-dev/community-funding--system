
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";
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
  const { signup, loading } = useAuth();
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
        const userData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        };
        await signup(userData);
        // Show success message and redirect to login
        setError("Registration successful! Please login to continue.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        if (error.response?.data) {
          const errorData = error.response.data;
          if (typeof errorData === "object") {
            const errorMessages = Object.entries(errorData)
              .map(([key, value]) => `${key}: ${value.join(", ")}`)
              .join("\n");
            setError(errorMessages);
          } else {
            setError(errorData);
          }
        } else {
          setError(error.message || "Failed to register user");
        }
      }
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
              <img
                src="/icons/logo.png"
                alt="Community Logo"
                className="logo"
              />
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
                placeholder="Confirm password"
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
                    <Loader2 className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
