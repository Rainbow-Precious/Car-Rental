import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";
import { apiService } from "../../../utils/api";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  // Timer for resend button
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("verificationEmail");
    
    if (!storedEmail) {
      // Redirect to signup if no email found
      navigate("/signup");
      return;
    }
    
    setEmail(storedEmail);

    // Set up countdown for resend button
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up timer
    return () => clearInterval(timer);
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP code");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.verifyEmail({
        email: email,
        otpCode: otp
      });

      // Check response
      if (response.data.statusCode === 200) {
        setSuccess("Email verified successfully!");
        
        // Store authentication token if provided
        if (response.data.data && response.data.data.token) {
          localStorage.setItem('authToken', response.data.data.token);
        }
        
        // Redirect to dashboard or sign-in after a short delay
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setError(response.data.message || "Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message || "Verification failed. Please try again.");
      } else if (err.request) {
        setError("Network error. Please check your internet connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await apiService.resendVerificationOtp({ email });
      
      // Check response
      if (response.data.statusCode === 200) {
        setSuccess("OTP code has been resent to your email!");
      } else {
        setError(response.data.message || "Failed to resend OTP. Please try again.");
      }
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      
      // Start timer again
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message || "Failed to resend OTP. Please try again.");
      } else if (err.request) {
        setError("Network error. Please check your internet connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col text-white">
      <Navigation />
      <div className="flex justify-center flex-1">
        <div className="max-w-5xl w-full bg-black flex flex-col flex-1">
          {/* Main Content */}
          <main className="flex flex-1 items-center justify-center w-full">
            <div className="px-4 w-full">
              <div className="flex items-center justify-center w-full max-w-md">
                <div className="w-full bg-gray-900 p-8 rounded shadow-xl">
                  <h2 className="text-2xl font-bold text-center mb-6">
                    Verify Your Email
                  </h2>
                  
                  {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                      <p>{error}</p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
                      <p>{success}</p>
                    </div>
                  )}
                  
                  <p className="text-gray-400 text-center mb-6">
                    We've sent a verification code to <span className="text-yellow-400">{email}</span>. Please enter the code below to verify your email address.
                  </p>
                  
                  <form className="space-y-4" onSubmit={handleVerify}>
                    <input
                      type="text"
                      placeholder="Enter Verification Code"
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500 text-center text-lg tracking-wider"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.trim())}
                      maxLength={6}
                      required
                      disabled={loading}
                    />
                    
                    <button
                      type="submit"
                      className={`w-full ${
                        loading 
                          ? "bg-yellow-600 cursor-not-allowed" 
                          : "bg-yellow-500 hover:bg-yellow-600"
                      } text-black font-semibold py-2 rounded-md transition-colors duration-200 flex justify-center items-center`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm mb-2">
                      Didn't receive a code?
                    </p>
                    <button
                      onClick={handleResendOtp}
                      className={`text-sm ${
                        canResend
                          ? "text-yellow-400 hover:underline cursor-pointer"
                          : "text-gray-600 cursor-not-allowed"
                      }`}
                      disabled={!canResend || loading}
                    >
                      {canResend ? "Resend Code" : `Resend code in ${countdown}s`}
                    </button>
                  </div>
                  
                  <p className="text-center text-sm text-gray-400 mt-8">
                    Return to{" "}
                    <button
                      onClick={() => navigate("/signin")}
                      className="text-yellow-400 hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
} 