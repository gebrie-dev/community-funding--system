import { Link } from "react-router-dom"
import Logo from "../components/Logo"
import Button from "../components/Button"
import { CheckCircle } from "lucide-react"
import "./ResetSuccessPage.css"

const ResetSuccessPage = () => {
  return (
    <div className="reset-success-page">
      <div className="success-header">
        <Logo />
      </div>

      <div className="success-container">
        <div className="success-icon">
          <CheckCircle size={48} color="#22c55e" />
        </div>

        <h2>Password Reseted Successfully!</h2>

        <Link to="/login">
          <Button className="login-button">Go to Login</Button>
        </Link>
      </div>
    </div>
  )
}

export default ResetSuccessPage

