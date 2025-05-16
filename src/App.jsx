"use client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Added useAuth import
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CampaignCreationPage from "./pages/CampaignCreationPage";
import SuccessPage from "./pages/SuccessPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetSuccessPage from "./pages/ResetSuccessPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import CampaignsPage from "./pages/CampaignsPage"; // Added import for CampaignsPage
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";

// Admin page imports
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminMessagesPage from "./pages/AdminMessagesPage";

import "./App.css";
import Footer from "./components/Footer";

// The ProtectedRoute component needs to be inside a component that has access to the AuthContext
// So we need to move it inside the App component or create a separate component file for it
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

// Admin route protection - only users with admin role can access
const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // Add debugging
  console.log("AdminRoute - Current User:", currentUser);

  // Check if user is logged in and has admin role
  if (!currentUser) {
    console.log("No user logged in, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    console.log("User is not an admin, redirecting to home");
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
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/reset-success" element={<ResetSuccessPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />{" "}
              {/* Added route for /campaigns */}
              <Route path="/campaign/:id" element={<CampaignDetailsPage />} />
              {/* Protected routes */}
              <Route
                path="/create-campaign"
                element={
                  <ProtectedRoute>
                    <CampaignCreationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/success"
                element={
                  <ProtectedRoute>
                    <SuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-method"
                element={
                  <ProtectedRoute>
                    <PaymentMethodPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute>
                    <PaymentSuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/campaigns"
                element={
                  <AdminRoute>
                    <AdminCampaigns />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminRoute>
                    <AdminReports />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/withdrawals"
                element={
                  <AdminRoute>
                    <AdminWithdrawals />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <AdminRoute>
                    <AdminMessagesPage />
                  </AdminRoute>
                }
              />
              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
            <Footer />
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
