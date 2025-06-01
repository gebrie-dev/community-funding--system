"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Shield, CheckCircle, Mail, Phone } from 'lucide-react';
import "./withdrawPage.css";
import { api } from "../utils/api";
import { API_ENDPOINTS } from "../config/api";

export default function WithdrawPage() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState("500");
  const [currency, setCurrency] = useState("ETB");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  const detailsRef = useRef(null);

  useEffect(() => {
    if (selectedMethod && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [selectedMethod]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate('/'); // Redirect to homepage after 5 seconds
      }, 5000);
      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [successMessage, navigate]);

  const paymentMethods = [
    {
      id: "chapa",
      name: "Chapa",
      description: "Fast, secure mobile money payments",
      icon: <Smartphone size={24} />,
      color: "#22c55e",
      requiresPhone: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with credit card or PayPal account",
      icon: <CreditCard size={24} />,
      color: "#0070ba",
      requiresEmail: true,
      requiresPhone: false,
    },
  ];

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setErrors({});
    setPhoneNumber("");
    setEmail("");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
    if (errors.amount) {
      setErrors({ ...errors, amount: "" });
    }
  };

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 0) {
      if (value.startsWith("0")) {
        value = value.substring(1);
      }
      if (!value.startsWith("9")) {
        value = "9" + value;
      }
      value = value.substring(0, 9);
      if (value.length >= 1) {
        value = value.replace(/(\d{1})(\d{0,2})(\d{0,3})(\d{0,3})/, (match, p1, p2, p3, p4) => {
          let formatted = p1;
          if (p2) formatted += ` ${p2}`;
          if (p3) formatted += ` ${p3}`;
          if (p4) formatted += ` ${p4}`;
          return formatted;
        });
      }
    }
    setPhoneNumber(value);
    if (errors.phoneNumber) {
      setErrors({ ...errors, phoneNumber: "" });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: "" });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedMethod) {
      newErrors.method = "Please select a withdrawal method";
    }
    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    if (selectedMethod?.requiresPhone && (!phoneNumber || phoneNumber.replace(/\s/g, "").length < 9)) {
      newErrors.phoneNumber = "Please enter a valid Ethiopian phone number";
    }
    if (selectedMethod?.requiresEmail && (!email || !validateEmail(email))) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!campaignId) {
      newErrors.campaign = "Campaign ID is missing from the URL";
    }
    if (!['ETB', 'USD'].includes(currency)) {
      newErrors.currency = "Please select a valid currency (ETB or USD)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Prepare the payload
    const payload = {
      campaign_id: campaignId,
      amount: Number.parseFloat(amount).toFixed(2),
      convert_to: currency.toLowerCase() === 'etb' ? 'birr' : 'usd',
      payment_method: selectedMethod.id,
      ...(selectedMethod.id === 'paypal' && { recipient_email: email }),
      ...(selectedMethod.id === 'chapa' && { recipient_phone: `+251${phoneNumber.replace(/\s/g, "")}` }),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`${API_ENDPOINTS.withdraw}`, payload);

      // Success response
      setErrors({});
      setSuccessMessage("Withdrawal request submitted successfully!");
      console.log("Withdrawal successful:", response.data);
    } catch (error) {
      console.error("Withdrawal failed:", error);
      if (error.response) {
        setErrors({ submit: error.response.data.error || "Withdrawal failed. Please try again." });
      } else {
        setErrors({ submit: "Network error. Please check your connection and try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="withdraw-page">
      <div className="withdraw-content">
        <div className="withdraw-header">
          <button className="back-button" aria-label="Go back">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="withdraw-title">
            <div className="logo">
              <div className="logo-icon"></div>
            </div>
            <div className="title-content">
              <h1>Secure Withdrawal</h1>
              <p>Complete your withdrawal safely</p>
            </div>
          </div>
          <div className="security-badge">
            <Shield size={16} />
            <span>SSL Secured</span>
          </div>
        </div>
        <div className="withdraw-container">
          <div className="withdraw-summary">
            <h2>Withdrawal Summary</h2>
            <div className="summary-item">
              <span>Amount:</span>
              <span className="amount-display">
                {formatCurrency(amount)} {currency}
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="withdraw-form">
            <div className="form-section">
              <h3>Amount</h3>
              <div className="form-group">
                <div className="amount-input-group">
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className={`amount-input ${errors.amount ? "error" : ""}`}
                    placeholder="0.00"
                  />
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="currency-select">
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                {errors.amount && <div className="error-message">{errors.amount}</div>}
              </div>
            </div>
            <div className="form-section">
              <h3>Select Withdrawal Method</h3>
              <div className="withdraw-methods">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`withdraw-method ${selectedMethod?.id === method.id ? "selected" : ""}`}
                    onClick={() => handleMethodSelect(method)}
                  >
                    <div className="method-icon" style={{ color: method.color }}>
                      {method.icon}
                    </div>
                    <div className="method-info">
                      <h4>{method.name}</h4>
                      <p>{method.description}</p>
                    </div>
                    <div className="method-check">{selectedMethod?.id === method.id && <CheckCircle size={20} />}</div>
                  </div>
                ))}
              </div>
              {errors.method && <div className="error-message">{errors.method}</div>}
            </div>
            {selectedMethod && (
              <div ref={detailsRef} className="withdraw-details">
                <h3 className="details-title">
                  <div className="details-icon" style={{ backgroundColor: selectedMethod.color }}>
                    !
                  </div>
                  {selectedMethod.name} Details
                </h3>
                <div className="details-container">
                  {selectedMethod.requiresEmail && (
                    <div className="form-group">
                      <label htmlFor="email" className="field-label">
                        <Mail size={16} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`text-input ${errors.email ? "error" : ""}`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <div className="error-message">{errors.email}</div>}
                      <div className="input-help">
                        {selectedMethod.id === "paypal"
                          ? "We'll send payment confirmation to this email immediately"
                          : "Receipt and transaction details will be sent here"}
                      </div>
                    </div>
                  )}
                  {selectedMethod.requiresPhone && (
                    <div className="form-group">
                      <label htmlFor="phone" className="field-label">
                        <Phone size={16} />
                        Phone Number
                      </label>
                      <div className="phone-input-container">
                        <div className="country-code">+251</div>
                        <input
                          type="text"
                          id="phone"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          className={`phone-input ${errors.phoneNumber ? "error" : ""}`}
                          placeholder="9XX XXX XXX"
                        />
                      </div>
                      {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
                      <div className="input-help">Enter your Ethiopian mobile number for Chapa payment</div>
                    </div>
                  )}
                </div>
                <div className="security-info">
                  <div className="security-header">
                    <Shield size={16} />
                    Security Features
                  </div>
                  <div className="security-features">
                    <div className="security-item">
                      <CheckCircle size={12} />
                      256-bit SSL encryption
                    </div>
                    <div className="security-item">
                      <CheckCircle size={12} />
                      PCI DSS compliant
                    </div>
                    <div className="security-item">
                      <CheckCircle size={12} />
                      Fraud protection
                    </div>
                    <div className="security-item">
                      <CheckCircle size={12} />
                      Secure data storage
                    </div>
                  </div>
                </div>
              </div>
            )}
            {errors.submit && (
              <div className="submit-error">
                <div className="error-message">{errors.submit}</div>
              </div>
            )}
            {errors.campaign && (
              <div className="submit-error">
                <div className="error-message">{errors.campaign}</div>
              </div>
            )}
            <button type="submit" className="continue-button" disabled={loading || !selectedMethod}>
              {loading ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  Processing...
                </div>
              ) : (
                "Complete Withdrawal"
              )}
            </button>
          </form>
        </div>
      </div>
      {successMessage && (
        <div className="success-popup">
          <div className="success-card">
            <CheckCircle size={40} className="success-icon" />
            <h2>Withdrawal Successful!</h2>
            <p>{successMessage}</p>
            <p>Redirecting to homepage in 5 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
}