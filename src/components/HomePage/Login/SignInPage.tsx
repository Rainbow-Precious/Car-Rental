import React, { useState } from "react";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";
import { SetupStage } from "../../SetupWizard/SetupWizard";
import { apiService } from "../../../utils/api";
import { showError, showSuccess, showLoading, dismissToast, dismissAllToasts } from "../../../utils/toast";
import Spinner from "../../common/Spinner";

export default function SignInPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      showError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    const loadingToastId = showLoading("Signing in...");

    try {
      const response = await apiService.login({ email, password });

      // Check for successful response
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
            isEmailConfirmed: userData.isEmailConfirmed
          }));
        }

        // Check setup status from API
        try {
          const setupStatusResponse = await apiService.getSetupStatus();
          
          if (setupStatusResponse.data.statusCode === 200) {
            const isSetupComplete = setupStatusResponse.data.data;
            
            if (!isSetupComplete) {
              // Setup is not complete, check the current progress
              try {
                const progressResponse = await apiService.getSetupProgress();
                
                if (progressResponse.data.statusCode === 200) {
                  const progressData = progressResponse.data.data;
                  localStorage.setItem('setupProgress', progressData.currentStage.toString());
                  
                  // Store any existing IDs for resuming the setup
                  if (progressData.campusId) {
                    localStorage.setItem('setupCampusId', progressData.campusId);
                    
                    // We'll need to fetch the campus name - for now store the school name as fallback
                    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                    localStorage.setItem('setupCampusName', userInfo.schoolName || 'Your Campus');
                  }
                  
                  if (progressData.classId) {
                    localStorage.setItem('setupClassId', progressData.classId);
                    localStorage.setItem('setupClassName', 'Your Class'); // Fallback name
                  }
                  
                  // Map the current stage to the appropriate step
                  let initialStep;
                  switch(progressData.currentStage) {
                    case 0:
                      initialStep = 'campus'; // Campus setup needed
                      break;
                    case 1:
                      initialStep = 'class'; // Class setup needed
                      break;
                    case 2:
                      initialStep = 'arm'; // Arm setup needed
                      break;
                    default:
                      initialStep = 'campus'; // Default to first step
                  }
                  
                  // Redirect to the proper setup stage
                  navigate('/setup', { state: { initialStage: initialStep } });
                } else {
                  // Fall back to the simpler check
                  checkWithSavedProgress();
                }
              } catch (progressErr) {
                console.error("Error checking setup progress:", progressErr);
                // Fall back to the simpler check
                checkWithSavedProgress();
              }
            } else {
              // Setup is complete, go to dashboard
              localStorage.setItem('isSetupComplete', 'true');
              navigate("/dashboard");
            }
          } else {
            // If status check fails, fall back to the userData from login
            fallbackSetupCheck(userData);
          }
        } catch (err) {
          console.error("Error checking setup status:", err);
          // Fall back to login response data if the status check fails
          fallbackSetupCheck(userData);
        }
      } else {
        dismissToast(loadingToastId);
        console.log("Login failed with status:", response.data.statusCode);
        showError(response.data.message || "Login failed. Please check your credentials.");
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
        
        if (err.response.status === 400 || err.response.status === 401) {
          // Extract error message from standardized API response format
          const errorMessage = err.response.data.message || "Invalid email or password";
          showError(errorMessage);
          
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
          showError(err.response.data.message || "Login failed. Please try again.");
        }
      } else if (err.message) {
        showError(err.message);
      } else {
        showError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback function if the setup-status API fails
  const fallbackSetupCheck = (userData: any) => {
    // Check setup status from login response
    if (userData.isSetupComplete === false) {
      // Map setupProgress to the appropriate stage
      let initialStep;
      switch(userData.setupProgress) {
        case 0:
          initialStep = 'campus'; // First step
          break;
        case 1:
          initialStep = 'class'; // Second step
          break;
        case 2:
          initialStep = 'arm'; // Third step
          break;
        default:
          initialStep = 'campus'; // Default to first step
      }
      
      // Store setupProgress in localStorage for persistence
      localStorage.setItem('setupProgress', userData.setupProgress.toString());
      
      // Redirect to setup wizard with the appropriate stage
      navigate('/setup', { state: { initialStage: initialStep } });
    } else {
      // Setup is complete, go to dashboard
      localStorage.setItem('isSetupComplete', 'true');
      navigate("/dashboard");
    }
  };

  // Check with saved progress
  const checkWithSavedProgress = () => {
    // Check for setupProgress in localStorage or start from beginning
    const savedProgress = localStorage.getItem('setupProgress');
    const setupProgress = savedProgress ? parseInt(savedProgress, 10) : 0;
    
    // Map setupProgress to the appropriate stage
    let initialStep;
    switch(setupProgress) {
      case 0:
        initialStep = 'campus'; // First step
        break;
      case 1:
        initialStep = 'class'; // Second step
        break;
      case 2:
        initialStep = 'arm'; // Third step
        break;
      default:
        initialStep = 'campus'; // Default to first step
    }
    
    // Store setupProgress in localStorage for persistence
    localStorage.setItem('setupProgress', setupProgress.toString());
    
    // Redirect to setup wizard with the appropriate stage
    navigate('/setup', { state: { initialStage: initialStep } });
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
          
          {/* Add an error message display area */}
          <div id="login-error-message" className="text-red-500 text-sm min-h-[20px]"></div>
          
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
