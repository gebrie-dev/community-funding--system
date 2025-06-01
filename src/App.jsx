"use client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CampaignCreationPage from "./pages/CampaignCreationPage";
import SuccessPage from "./pages/SuccessPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import WithdrawPage from "./pages/WithdrawPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetSuccessPage from "./pages/ResetSuccessPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import CampaignsPage from "./pages/CampaignsPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { useLocation } from "react-router-dom";

// Admin page imports
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminMessagesPage from "./pages/AdminMessagesPage";

import "./App.css";
import Footer from "./components/Footer";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // Check if user is logged in
  if (!currentUser) {
    console.log("No user logged in, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check if user is a staff member
  if (!currentUser.is_staff) {
    console.log("User is not a staff member, redirecting to home");
    console.log(currentUser)
    return <Navigate to="/" replace />;
  }

  // Check if the navigation includes a specific state (e.g., from internal system navigation)
  // Example: Assume internal navigation passes a state like { isInternal: true }
  if (!location.state?.isInternal) {
    console.log("Direct access to /admin not allowed, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("Admin access granted");
  return children;
};
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
         <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-success" element={<ResetSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/email-verified" element={<EmailVerificationPage />} />

        {/* Campaign-Related Routes */}
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
        <Route path="/campaigns/:id/payment" element={<PaymentMethodPage />} />
        <Route
          path="/campaigns/:id/withdraw"
          element={
            // Add authentication check, e.g., <ProtectedRoute element={<WithdrawPage />} />
            <WithdrawPage />
          }
        />
        <Route
          path="/create-campaign"
          element={
            // Add authentication check, e.g., <ProtectedRoute element={<CampaignCreationPage />} />
            <CampaignCreationPage />
          }
        />

        {/* Payment and Success Routes */}
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />

        {/* User Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            // Add authentication check, e.g., <ProtectedRoute element={<DashboardPage />} />
            <DashboardPage />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            // Add admin authorization check, e.g., <ProtectedRoute element={<AdminDashboard />} role="admin" />
            <AdminDashboard />
          }
        />
        <Route
          path="/admin/campaigns"
          element={
            // Add admin authorization check
            <AdminCampaigns />
          }
        />
        <Route
          path="/admin/users"
          element={
            // Add admin authorization check
            <AdminUsers />
          }
        />
        <Route
          path="/admin/reports"
          element={
            // Add admin authorization check
            <AdminReports />
          }
        />
        <Route
          path="/admin/withdrawals"
          element={
            // Add admin authorization check
            <AdminWithdrawals />
          }
        />
        <Route
          path="/admin/messages"
          element={
            // Add admin authorization check
            <AdminMessagesPage />
          }
        />

        {/* Catch-All Route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </Router>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;