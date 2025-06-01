
import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Logo from "../components/Logo"
import Button from "../components/Button"
import { ArrowLeft, CreditCard, Smartphone, Shield, CheckCircle } from "lucide-react"
import "./PaymentMethodPage.css"
import { api } from "../utils/api"
import { API_ENDPOINTS } from "../config/api"

const PaymentMethodPage = () => {
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [amount, setAmount] = useState("500")
  const [currency, setCurrency] = useState("ETB")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const detailsRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Get campaign_id and amount from navigation state if available
  const campaignAmount = location.state?.amount || 500
  const campaignId = location.state?.campaignId || "1"

  useEffect(() => {
    if (campaignAmount && !amount) {
      setAmount(String(campaignAmount))
    }
  }, [campaignAmount])

  useEffect(() => {
    if (selectedMethod?.requiresDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [selectedMethod])

  const paymentMethods = [
    {
      id: "chapa",
      name: "Chapa",
      description: "Fast, secure mobile money payments",
      icon: <Smartphone size={24} />,
      color: "#22c55e",
      requiresDetails: true, // Show payment details section for Chapa
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with credit card or PayPal account",
      icon: <CreditCard size={24} />,
      color: "#22c55e",
      requiresDetails: false, // No payment details section for PayPal
    },
  ]

  const handleMethodSelect = (method) => {
    setSelectedMethod(method)
    setErrors({})
    setPhoneNumber("") // Clear fields when switching methods
    setEmail("")
  }

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setAmount(value)
    if (errors.amount) {
      setErrors({ ...errors, amount: "" })
    }
  }

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "")
    if (value.length > 0) {
      if (value.startsWith("0")) {
        value = value.substring(1)
      }
      if (!value.startsWith("9")) {
        value = "9" + value
      }
      value = value.substring(0, 9)
      value = value.replace(/(\d{1})(\d{0,2})(\d{0,3})(\d{0,3})/, (match, p1, p2, p3, p4) => {
        let formatted = p1
        if (p2) formatted += ` ${p2}`
        if (p3) formatted += ` ${p3}`
        if (p4) formatted += ` ${p4}`
        return formatted
      })
    }
    setPhoneNumber(value)
    if (errors.phoneNumber) {
      setErrors({ ...errors, phoneNumber: "" })
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors({ ...errors, email: "" })
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!selectedMethod) {
      newErrors.method = "Please select a payment method"
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }

    if (selectedMethod?.id === "chapa") {
      if (!phoneNumber || phoneNumber.replace(/\s/g, "").length < 9) {
        newErrors.phoneNumber = "Please enter a valid Ethiopian phone number"
      }
      if (!email || !validateEmail(email)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        campaign_id: campaignId,
        amount: Number.parseFloat(amount).toFixed(2),
        payment_method: selectedMethod.id,
      }

      if (selectedMethod.id === "chapa") {
        payload.phone_number = `+251${phoneNumber.replace(/\s/g, "")}`
        payload.email = email
      }

      const response = await api.post(`${API_ENDPOINTS.donate}`, payload)

      if (response.checkout_url) {
        window.location.href = response.checkout_url
      } else {
        throw new Error("No checkout URL provided in response")
      }
    } catch (error) {
      console.error("Payment failed:", error)
      setErrors({ submit: error.message || "Payment initiation failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="payment-method-page">
      <div className="payment-content">
        <div className="payment-header">
          <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <div className="payment-title">
            <Logo />
            <div className="title-content">
              <h1>Secure Payment</h1>
              <p>Complete your donation safely</p>
            </div>
          </div>
          <div className="security-badge">
            <Shield size={16} />
            <span>SSL Secured</span>
          </div>
        </div>

        <div className="payment-container">
          <div className="payment-summary">
            <h2>Donation Summary</h2>
            <div className="summary-item">
              <span>Amount:</span>
              <span className="amount-display">
                {formatCurrency(amount || campaignAmount)} {currency}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="payment-form">
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
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="currency-select"
                  >
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                {errors.amount && <div className="error-message">{errors.amount}</div>}
              </div>
            </div>

            <div className="form-section">
              <h3>Select Payment Method</h3>
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`payment-method ${selectedMethod?.id === method.id ? "selected" : ""}`}
                    onClick={() => handleMethodSelect(method)}
                  >
                    <div className="method-icon" style={{ color: method.color }}>
                      {method.icon}
                    </div>
                    <div className="method-info">
                      <h4>{method.name}</h4>
                      <p>{method.description}</p>
                    </div>
                    <div className="method-check">
                      {selectedMethod?.id === method.id && <CheckCircle size={20} />}
                    </div>
                  </div>
                ))}
              </div>
              {errors.method && <div className="error-message">{errors.method}</div>}
            </div>

            {selectedMethod?.requiresDetails && (
              <div className="form-section" ref={detailsRef}>
                <h3>Payment Details</h3>
                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    <Phone size={16} /> Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="+251 9XX XXX XXX"
                    className={`input ${errors.phoneNumber ? "error" : ""}`}
                  />
                  {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} /> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="example@domain.com"
                    className={`input ${errors.email ? "error" : ""}`}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="continue-button"
              disabled={loading || !selectedMethod}
            >
              {loading ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  Processing...
                </div>
              ) : (
                "Donate"
              )}
            </Button>
            {errors.submit && <div className="error-message">{errors.submit}</div>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodPage