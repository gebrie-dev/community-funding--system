import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const EmailVerificationPage = () => {
  const [status, setStatus] = useState("loading");
  const { verifyEmail } = useAuth();
  const [params] = useSearchParams();
  const oobCode = params.get("oobCode");

  useEffect(() => {
    const verify = async () => {
      if (!oobCode) {
        setStatus("invalid");
        return;
      }

      try {
        const result = await verifyEmail(oobCode);
        if (result.error) throw new Error(result.error);
        setStatus("success");
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    verify();
  }, [oobCode, verifyEmail]);

  return (
    <div className="email-verification-page">
      {status === "loading" && (
        <div className="verification-status loading">
          <Loader2 className="animate-spin" size={48} />
          <h2>Verifying your email...</h2>
        </div>
      )}

      {status === "success" && (
        <div className="verification-status success">
          <CheckCircle2 size={48} className="text-green-500" />
          <h2>Email Verified Successfully!</h2>
          <p>You can now access all platform features.</p>
          <Link to="/dashboard" className="dashboard-link">
            Go to Dashboard
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="verification-status error">
          <XCircle size={48} className="text-red-500" />
          <h2>Verification Failed</h2>
          <p>The verification link is invalid or expired.</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {status === "invalid" && (
        <div className="verification-status invalid">
          <XCircle size={48} className="text-yellow-500" />
          <h2>Invalid Verification Link</h2>
          <p>Please check your email for the correct verification link.</p>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationPage;