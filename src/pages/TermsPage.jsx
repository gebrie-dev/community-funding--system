import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import "./TermsPage.css";

const TermsPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`terms-page ${darkMode ? "dark" : ""}`}>
      <Navbar />
      <div className="terms-container">
        <div className="terms-header">
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="terms-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Community Funding, you agree to be bound by
              these Terms of Service and all applicable laws and regulations. If
              you do not agree with any of these terms, you are prohibited from
              using or accessing this platform.
            </p>
          </section>

          <section>
            <h2>2. User Accounts</h2>
            <h3>2.1 Account Creation</h3>
            <ul>
              <li>You must be at least 18 years old to create an account</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h3>2.2 Account Responsibilities</h3>
            <ul>
              <li>Keep your login credentials secure</li>
              <li>Update your information as needed</li>
              <li>Comply with all applicable laws</li>
              <li>Not share your account with others</li>
            </ul>
          </section>

          <section>
            <h2>3. Campaign Guidelines</h2>
            <h3>3.1 Campaign Creation</h3>
            <ul>
              <li>Provide accurate campaign information</li>
              <li>Set realistic funding goals</li>
              <li>Use appropriate campaign categories</li>
              <li>Include relevant documentation</li>
            </ul>

            <h3>3.2 Campaign Management</h3>
            <ul>
              <li>Regular updates to donors</li>
              <li>Proper use of funds</li>
              <li>Timely delivery of rewards</li>
              <li>Transparent communication</li>
            </ul>
          </section>

          <section>
            <h2>4. Donation Terms</h2>
            <ul>
              <li>All donations are final and non-refundable</li>
              <li>Payment processing fees may apply</li>
              <li>Tax receipts provided where applicable</li>
              <li>Secure payment processing</li>
            </ul>
          </section>

          <section>
            <h2>5. Platform Rules</h2>
            <ul>
              <li>No fraudulent activities</li>
              <li>No harassment or abuse</li>
              <li>No spam or misleading content</li>
              <li>No unauthorized commercial use</li>
            </ul>
          </section>

          <section>
            <h2>6. Intellectual Property</h2>
            <p>
              All content on the platform, including but not limited to text,
              graphics, logos, and software, is the property of Community
              Funding or its content suppliers and is protected by international
              copyright laws.
            </p>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              Community Funding is not liable for any direct, indirect,
              incidental, special, or consequential damages resulting from your
              use of or inability to use the platform.
            </p>
          </section>

          <section>
            <h2>8. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes via email or platform
              notifications.
            </p>
          </section>

          <section>
            <h2>9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and
              access to the platform at our sole discretion, without notice, for
              conduct that we believe violates these Terms of Service or is
              harmful to other users, us, or third parties, or for any other
              reason.
            </p>
          </section>

          <section>
            <h2>10. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="contact-info">
              <p>Email: legal@communityfunding.com</p>
              <p>Phone: +251 914080045</p>
              <p>Address: ASTU Street, Funding City, FC 12345</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
