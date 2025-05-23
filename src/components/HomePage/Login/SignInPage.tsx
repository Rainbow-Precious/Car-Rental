import React, { useState } from "react";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";
import { SetupStage } from "../../SetupWizard/SetupWizard";
import { apiService } from "../../../utils/api";
import { showError, showSuccess, showLoading, dismissToast, dismissAllToasts } from "../../../utils/toast";
import Spinner from "../../common/Spinner";
import axios from 'axios';

export default function SignInPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);
    const loadingToastId = showLoading("Signing in...");

    try {
      const response = await axios.post('http://159.65.31.191/api/Tenant/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.statusCode === 200) {
        dismissToast(loadingToastId);
        showSuccess("Login successful!");
        
        const userData = response.data.data;
        
        // Save auth token and user data
        if (userData.token) {
          localStorage.setItem('authToken', userData.token);
          
          // Save user information for later use
          localStorage.setItem('userInfo', JSON.stringify({
            firstName: userData.firstName,
            lastName: userData.lastName,
            tenantId: userData.tenantId,
            role: userData.role,
            schoolName: userData.schoolName,
            email: userData.email,
            isVerified: userData.isVerified,
            isEmailConfirmed: userData.isEmailConfirmed,
            mustChangePassword: userData.mustChangePassword
          }));
        }

        // Check user role and mustChangePassword flag
        if (userData.mustChangePassword) {
          // Redirect to auth handler which will show password change form
          navigate('/auth');
        } else {
          // No password change needed, redirect based on role
          if (userData.role === 'Admin') {
            navigate('/dashboard');
          } else if (userData.role === 'Teacher') {
            navigate('/teacher/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        }
      } else {
        dismissToast(loadingToastId);
        console.log("Login failed with status:", response.data.statusCode);
        setError(response.data.message || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      dismissToast(loadingToastId);
      
      // Clear any existing toasts to ensure error is visible
      dismissAllToasts();
      
      // Handle API error response
      if (err.response) {
        console.log("Error response status:", err.response.status);
        console.log("Error response data:", err.response.data);
        
        // Special handling for 401 responses that contain user data with mustChangePassword
        if (err.response.status === 401 && err.response.data.data && err.response.data.data.mustChangePassword) {
          console.log("Teacher must change password on first login");
          
          const userData = err.response.data.data;
          
          // Save auth token and user data even though it's a 401
          if (userData.token) {
            localStorage.setItem('authToken', userData.token);
            
            // Save user information for password change flow
            localStorage.setItem('userInfo', JSON.stringify({
              firstName: userData.firstName,
              lastName: userData.lastName,
              tenantId: userData.tenantId,
              role: userData.role,
              schoolName: userData.schoolName,
              email: userData.email,
              isVerified: userData.isVerified,
              isEmailConfirmed: userData.isEmailConfirmed,
              mustChangePassword: userData.mustChangePassword,
              token: userData.token
            }));
            
            showSuccess("Please change your password to continue");
            // Redirect to auth handler for password change
            navigate('/auth');
            return;
          }
        }
        
        if (err.response.status === 400 || err.response.status === 401) {
          // Extract error message from standardized API response format
          const errorMessage = err.response.data.message || "Invalid email or password";
          setError(errorMessage);
          
          // Add visual indication on the password field
          const passwordInput = document.getElementById('password') as HTMLInputElement;
          if (passwordInput) {
            passwordInput.classList.add('border-red-500');
            // Remove the red border after a few seconds
            setTimeout(() => {
              passwordInput.classList.remove('border-red-500');
            }, 3000);
          }
        } else {
          setError(err.response.data.message || "Login failed. Please try again.");
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelectAccountType = () => {
    return (
      <div className="w-full bg-gray-900 p-8 rounded shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          Sign In to Your Account
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Please select your account type to continue
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setSelectedOption("school")}
            className="bg-gray-800 border border-gray-700 hover:border-yellow-500 px-6 py-8 rounded text-left hover:bg-gray-800/50 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-white mb-2">School</h3>
            <p className="text-gray-400 text-sm">
              Sign in to your school administrator account
            </p>
          </button>
          <button
            onClick={() => setSelectedOption("organization")}
            className="bg-gray-800 border border-gray-700 hover:border-yellow-500 px-6 py-8 rounded text-left hover:bg-gray-800/50 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Organization
            </h3>
            <p className="text-gray-400 text-sm">
              Sign in to your organization account
            </p>
          </button>
        </div>
        <p className="text-sm text-gray-400 text-center mt-8">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    );
  };

  const renderLoginForm = (accountType: string) => {
    return (
      <div className="w-full bg-gray-900 p-8 rounded shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedOption(null)}
            className="text-gray-400 hover:text-white flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h2 className="text-2xl font-bold text-center flex-1 pr-16">
            {accountType === "school" ? "School Login" : "Organization Login"}
          </h2>
        </div>
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500 transition-colors duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="text-gray-400 hover:text-yellow-400"
            >
              Forgot Password?
            </Link>
          </div>
          
          <button
            type="submit"
            className={`bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400 flex justify-center items-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <Spinner size="sm" />
                <span className="ml-2">Signing In...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link
            to={`/signup/${accountType}`}
            className="text-yellow-400 hover:underline"
          >
            Sign Up as {accountType === "school" ? "School" : "Organization"}
          </Link>
        </p>
      </div>
    );
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
                {selectedOption === null
                  ? renderSelectAccountType()
                  : renderLoginForm(selectedOption)}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
