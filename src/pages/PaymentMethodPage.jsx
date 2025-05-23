"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../components/Logo"
import Button from "../components/Button"
import { ArrowLeft } from "lucide-react"
import "./PaymentMethodPage.css"

const PaymentMethodPage = () => {
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [amount, setAmount] = useState("500")
  const [currency, setCurrency] = useState("birr")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleMethodSelect = (method) => {
    setSelectedMethod(method)
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value)
  }

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedMethod) {
      alert("Please select a payment method")
      return
    }

    setLoading(true)

    try {
      // Mock payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))
      navigate("/payment-success")
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-method-page">
      <div className="payment-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>

        <div className="payment-title">
          <Logo />
          <h1>Community Funding System</h1>
        </div>
      </div>

      <div className="payment-container">
        <h2>Select your payment method</h2>

        <div className="payment-methods">
          <div
            className={`payment-method ${selectedMethod === "telebirr" ? "selected" : ""}`}
            onClick={() => handleMethodSelect("telebirr")}
          >
            <img src="/images/telebirr-logo.png" alt="Telebirr" />
          </div>

          <div
            className={`payment-method ${selectedMethod === "paypal" ? "selected" : ""}`}
            onClick={() => handleMethodSelect("paypal")}
          >
            <img src="/images/paypal-logo.png" alt="PayPal" />
          </div>
        </div>

        <div className="amount-container">
        
         <label>phone number</label>

          <label>Amount</label>
          <div className="amount-input-group">
            <input type="text" value={amount} onChange={handleAmountChange} className="amount-input" />
            <select value={currency} onChange={handleCurrencyChange} className="currency-select">
              <option value="birr">birr</option>
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
            </select>
          </div>
        </div>

        <Button onClick={handleSubmit} className="continue-button" disabled={loading || !selectedMethod}>
          {loading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  )
}

export default PaymentMethodPage

