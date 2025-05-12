import { Link } from "react-router-dom"
import Logo from "../components/Logo"
import Button from "../components/Button"
import "./SuccessPage.css"

const SuccessPage = () => {
  return (
    <div className="success-page">
      <div className="success-header">
        <Logo />
        <h1>Community Funding System</h1>
      </div>

      <div className="success-container">
        <div className="success-content">
          <h2>Created Successfully</h2>

          <Link to="/campaign/1">
            <Button className="view-button">view</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage

