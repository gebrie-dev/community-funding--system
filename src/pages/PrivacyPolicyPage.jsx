import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import "./PrivacyPolicyPage.css";

const PrivacyPolicyPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`privacy-policy-page ${darkMode ? "dark" : ""}`}>
      <Navbar />
      <div className="privacy-policy-container">
        <div className="privacy-policy-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="privacy-policy-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              At Community Funding, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our platform.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <ul>
              <li>Name and contact information</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing and payment information</li>
              <li>Profile information</li>
            </ul>

            <h3>2.2 Usage Information</h3>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Pages visited</li>
              <li>Time spent on pages</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To provide and maintain our service</li>
              <li>To process your transactions</li>
              <li>To send you important updates</li>
              <li>To improve our platform</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>4. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your
              information with:
            </p>
            <ul>
              <li>Service providers</li>
              <li>Payment processors</li>
              <li>Legal authorities when required</li>
            </ul>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your
              personal information, including:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage</li>
            </ul>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2>7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to improve your
              experience on our platform. You can control cookie settings
              through your browser preferences.
            </p>
          </section>

          <section>
            <h2>8. Children's Privacy</h2>
            <p>
              Our platform is not intended for children under 13. We do not
              knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page.
            </p>
          </section>

          <section>
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <div className="contact-info">
              <p>Email: privacy@communityfunding.com</p>
              <p>Phone: +251 914080045</p>
              <p>Address: ASTU Street, Funding City, FC 12345</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
