import { Link } from "react-router-dom"
import Logo from "../components/Logo"
import Button from "../components/Button"
import "./PaymentSuccessPage.css"

const PaymentSuccessPage = () => {
  return (
    <div className="payment-success-page">
      <div className="success-header">
        <Logo />
        <h1>Community Funding System</h1>
      </div>

      <div className="success-container">
        <h2>Your Payment is Successful!</h2>

        <div className="thank-you-container">
          <div className="thank-you-text">
            <h3>Thank You</h3>
          </div>
          <div className="thank-you-image">
            <img src="/images/thank-you.png" alt="Thank you" />
          </div>
        </div>

        <Link to="/receipt">
          <Button className="receipt-button">view receipt</Button>
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccessPage

