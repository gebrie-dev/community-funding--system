// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <Navbar />

      <div className="not-found-container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
