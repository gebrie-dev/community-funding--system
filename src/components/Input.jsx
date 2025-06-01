import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Input.css";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`input-container ${className}`}>
      {type === "password" ? (
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            required={required}
            className="custom-input"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          className="custom-input"
        />
      )}
    </div>
  );
};

export default Input;
