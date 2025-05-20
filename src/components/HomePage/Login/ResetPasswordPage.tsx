import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";
import { apiService } from "../../../utils/api";
import { showError, showSuccess, showLoading, dismissToast } from "../../../utils/toast";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTokenValidating, setIsTokenValidating] = useState<boolean>(true);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  // Validate token when component mounts
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsTokenValidating(false);
        return;
      }

      setIsTokenValidating(true);
      try {
        const response = await apiService.validateResetToken({ token });
        
        if (response.data.statusCode === 200) {
          setIsTokenValid(true);
          // Set the email if it's returned from the API
          if (response.data.data && response.data.data.email) {
            setEmail(response.data.data.email);
          }
        } else {
          setIsTokenValid(false);
          showError("Invalid or expired token. Please request a new password reset link.");
        }
      } catch (err) {
        console.error("Token validation error:", err);
        setIsTokenValid(false);
        showError("Invalid or expired token. Please request a new password reset link.");
      } finally {
        setIsTokenValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (password: string) => {
    // Password must be at least 8 characters and include a number and a special character
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: hasMinLength && hasNumber && hasSpecialChar,
      message: !hasMinLength 
        ? "Password must be at least 8 characters" 
        : !hasNumber 
          ? "Password must include at least one number" 
          : !hasSpecialChar 
            ? "Password must include at least one special character" 
            : ""
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate passwords
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      showError(passwordValidation.message);
      return;
    }
    
    if (password !== confirmPassword) {
      showError("Passwords don't match");
      return;
    }
    
    if (!email.trim()) {
      showError("Email is required");
      return;
    }

    setIsLoading(true);
    const loadingToastId = showLoading("Resetting your password...");
    
    try {
      const response = await apiService.resetPassword({
        token: token!,
        email,
        newPassword: password
      });
      
      dismissToast(loadingToastId);
      
      if (response.data.statusCode === 200) {
        setSuccess(true);
        showSuccess("Password reset successful! Redirecting to login...");
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } else {
        showError(response.data.message || "Failed to reset password. Please try again.");
      }
    } catch (err: any) {
      console.error("Password reset error:", err);
      dismissToast(loadingToastId);
      
      if (err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError("An error occurred while resetting your password. Please try again.");
      }
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
                    Reset Password
                  </h2>
                  
                  {isTokenValidating ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                      <p className="text-gray-300">Validating your reset link...</p>
                    </div>
                  ) : !token || !isTokenValid ? (
                    <div className="text-center">
                      <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded">
                        <p className="text-red-200">
                          Invalid or expired password reset link.
                        </p>
                      </div>
                      <p className="text-gray-400 mb-4">
                        The password reset link is invalid or has expired. Please request a new link.
                      </p>
                      <Link
                        to="/forgot-password"
                        className="text-yellow-400 hover:underline"
                      >
                        Request New Reset Link
                      </Link>
                    </div>
                  ) : success ? (
                    <div className="text-center">
                      <div className="flex justify-center mb-6">
                        <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-green-400 text-xl font-semibold mb-2">
                        Password Reset Successful!
                      </p>
                      <p className="text-gray-400 mb-4">
                        Your password has been reset successfully. You will be redirected to the login page.
                      </p>
                      <Link
                        to="/signin"
                        className="text-yellow-400 hover:underline"
                      >
                        Go to Sign In
                      </Link>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-400 text-center mb-6">
                        Please create a new password for your account.
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                            required
                            disabled={isLoading || !!email} // Disable if email is pre-filled from token validation
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                            required
                            disabled={isLoading}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Password must be at least 8 characters and include numbers and special characters.
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                            required
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
                              Resetting Password...
                            </>
                          ) : (
                            "Reset Password"
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
};

export default ResetPasswordPage;