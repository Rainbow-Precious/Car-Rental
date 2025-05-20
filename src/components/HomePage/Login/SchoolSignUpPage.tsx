import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";
import axios from "axios";

export default function SchoolSignUpPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    schoolName: "",
    firstName: "",
    middleName: "", // Optional field
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const validateForm = () => {
    // Password validation
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    // Password should contain at least one number, one uppercase, one lowercase and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return false;
    }

    // Password confirmation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Terms agreement
    if (!form.terms) {
      setError("You must agree to the Terms and Conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://159.65.31.191/api/Tenant/register-admin', 
        form  // Using the form state directly since it now matches the API schema
      );

      // Check for successful response
      if (response.data.statusCode === 200) {
        // Save email for OTP verification
        localStorage.setItem('verificationEmail', form.email);
        // Navigate to OTP verification page
        navigate('/verify-otp');
      } else {
        // Handle API error responses
        setError(response.data.message || "An error occurred during registration");
      }
    } catch (err: any) {
      // Handle network or unexpected errors
      console.error("Registration error:", err);
      
      if (err.response && err.response.data) {
        // API error with response
        setError(err.response.data.message || "Registration failed. Please try again.");
      } else if (err.request) {
        // Network error
        setError("Network error. Please check your internet connection and try again.");
      } else {
        // Other errors
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
          <main className="flex flex-1 items-center justify-center w-full py-8">
            <div className="px-4 w-full">
              <div className="flex items-center justify-center w-full max-w-2xl mx-auto">
                <div className="w-full bg-gray-900 p-8 rounded shadow-xl">
                  <h2 className="text-2xl font-bold text-center mb-6">
                    Register as a School
                  </h2>
                  
                  {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <h3 className="text-lg font-semibold border-b border-gray-700 pb-1">School Information</h3>
                    <input
                      name="schoolName"
                      type="text"
                      placeholder="School Name*"
                      value={form.schoolName}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                      disabled={loading}
                    />
                    
                    <h3 className="text-lg font-semibold border-b border-gray-700 pb-1 mt-6">Administrator Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        name="firstName"
                        type="text"
                        placeholder="First Name*"
                        value={form.firstName}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                        disabled={loading}
                      />
                      <input
                        name="middleName"
                        type="text"
                        placeholder="Middle Name (Optional)"
                        value={form.middleName}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        disabled={loading}
                      />
                      <input
                        name="lastName"
                        type="text"
                        placeholder="Last Name*"
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                        disabled={loading}
                      />
                    </div>
                    <input
                      name="email"
                      type="email"
                      placeholder="Email Address*"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                      disabled={loading}
                    />
                    <input
                      name="phoneNumber"
                      type="tel"
                      placeholder="Phone Number*"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                      disabled={loading}
                    />
                    
                    <h3 className="text-lg font-semibold border-b border-gray-700 pb-1 mt-6">Account Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="password"
                        type="password"
                        placeholder="Password*"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                        disabled={loading}
                      />
                      <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password*"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Password must be at least 8 characters and include uppercase letters, lowercase letters, numbers, and special characters.
                    </div>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        name="terms"
                        type="checkbox"
                        checked={form.terms}
                        onChange={handleChange}
                        className="accent-yellow-500"
                        required
                        disabled={loading}
                      />
                      <span>I agree to the Terms and Conditions*</span>
                    </label>
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
                          Processing...
                        </>
                      ) : (
                        "Register School"
                      )}
                    </button>
                  </form>
                  <p className="text-center text-sm text-gray-400 mt-4">
                    Already have an account?{" "}
                    <Link
                      to="/signin"
                      className="text-yellow-400 hover:underline"
                    >
                      Sign In
                    </Link>
                  </p>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    Need to register as an organization?{" "}
                    <Link
                      to="/signup/organization"
                      className="text-yellow-400 hover:underline"
                    >
                      Register as Organization
                    </Link>
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