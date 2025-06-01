import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import "./ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
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

  const validateForm = () => {
    const newErrors = {};

    if (!passwords.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);

      try {
        // Mock API call to reset password
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate("/reset-success");
      } catch (error) {
        console.error("Password reset failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="reset-password-page">
      <h1>Reset Your Password</h1>

      <div className="reset-container">
        <form onSubmit={handleSubmit} className="reset-form">
          <Input
            type="password"
            placeholder="new password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            required
          />
          {errors.newPassword && (
            <span className="error-message">{errors.newPassword}</span>
          )}

          <Input
            type="password"
            placeholder="confirm password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}

          <Button type="submit" className="reset-button" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
