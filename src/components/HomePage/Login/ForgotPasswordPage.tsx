import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";
import { apiService } from "../../../utils/api";
import { showError, showSuccess, showLoading, dismissToast } from "../../../utils/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      showError("Please enter your email address");
      return;
    }
    
    if (!validateEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    const loadingToastId = showLoading("Sending password reset link...");
    
    try {
      const response = await apiService.forgotPassword({ email });
      
      dismissToast(loadingToastId);
      
      if (response.data.statusCode === 200) {
        // Success - but don't confirm whether an account exists for security
        setSent(true);
        showSuccess("If an account exists with this email, a password reset link has been sent");
      } else {
        // Don't expose whether the email exists
        setSent(true);
        showSuccess("If an account exists with this email, a password reset link has been sent");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      dismissToast(loadingToastId);
      
      // For security, we show the same message even if there's an error
      setSent(true);
      showSuccess("If an account exists with this email, a password reset link has been sent");
    } finally {
      setIsLoading(false);
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
                    Forgot Password
                  </h2>
                  
                  {sent ? (
                    <div className="text-center">
                      <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded">
                        <p className="text-green-200">
                          If an account with that email exists, a password reset link has been sent.
                        </p>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Please check your email inbox (and spam folder) for instructions to reset your password.
                      </p>
                      <Link
                        to="/signin"
                        className="text-yellow-400 hover:underline"
                      >
                        Return to Sign In
                      </Link>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-400 text-center mb-6">
                        Enter your email address and we'll send you instructions to reset your password.
                      </p>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="Enter your email"
                            className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        
                        <button
                          type="submit"
                          className={`w-full ${
                            isLoading
                              ? "bg-yellow-600 cursor-not-allowed"
                              : "bg-yellow-500 hover:bg-yellow-600"
                          } text-black font-semibold py-2 rounded-md transition-all duration-200 flex justify-center items-center`}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            "Send Reset Link"
                          )}
                        </button>
                      </form>
                      
                      <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                          Remember your password?{" "}
                          <Link to="/signin" className="text-yellow-400 hover:underline">
                            Sign In
                          </Link>
                        </p>
                      </div>
                    </>
                  )}
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