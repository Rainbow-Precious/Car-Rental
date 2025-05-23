import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PasswordChangeProps {
  token: string;
  userData: {
    role: string;
    mustChangePassword: boolean;
  };
}

const PasswordChange: React.FC<PasswordChangeProps> = ({ token, userData }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasDigit: false,
    hasSpecialChar: false
  });
  
  const navigate = useNavigate();
  
  // Check if user needs to change password
  useEffect(() => {
    // If admin and doesn't need to change password, redirect to admin dashboard
    if (userData.role === 'Admin' && !userData.mustChangePassword) {
      navigate('/dashboard');
    }
    // If teacher/student and doesn't need to change password, redirect to their dashboard
    else if ((userData.role === 'Teacher' || userData.role === 'Student') && !userData.mustChangePassword) {
      if (userData.role === 'Teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [userData, navigate]);
  
  // Password validation
  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasDigit: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordRequirements(requirements);
    
    return (
      requirements.minLength &&
      requirements.hasUpperCase &&
      requirements.hasLowerCase &&
      requirements.hasDigit &&
      requirements.hasSpecialChar
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validatePassword(newPassword)) {
      setError('Password does not meet all requirements');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.post(
        'http://159.65.31.191/api/Tenant/change-password-first-time',
        {
          currentPassword,
          newPassword,
          confirmNewPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.statusCode === 200) {
        // Redirect based on role
        if (userData.role === 'Admin') {
          navigate('/dashboard');
        } else if (userData.role === 'Teacher') {
          navigate('/teacher/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        setError(response.data.message || 'Failed to change password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while changing password');
    } finally {
      setLoading(false);
    }
  };
  
  // If no need to change password, don't render the component
  if ((userData.role === 'Admin' && !userData.mustChangePassword) ||
      ((userData.role === 'Teacher' || userData.role === 'Student') && !userData.mustChangePassword)) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>
      
      {/* Main container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Glass morphism card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 rounded-3xl"></div>
          
          {/* Header section */}
          <div className="relative text-center mb-8">
            {/* Icon container with animated rings */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse opacity-30"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
            
            {/* Title with gradient text */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-3">
              Secure Your Account
            </h1>
            <p className="text-gray-300 text-lg font-medium">
              Create a strong password to protect your account
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto mt-4"></div>
          </div>
          
          {/* Error message with enhanced styling */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl text-red-300 shadow-lg animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
          
          {/* Form with enhanced styling */}
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {/* Current Password Field */}
            <div className="group">
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-300 mb-2 transition-colors group-focus-within:text-yellow-400">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-400 transition-all duration-300 hover:bg-white/15"
                  placeholder="Enter your current password"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/0 to-yellow-400/0 group-focus-within:from-yellow-400/10 group-focus-within:via-yellow-400/5 group-focus-within:to-yellow-400/10 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>
            
            {/* New Password Field */}
            <div className="group">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-300 mb-2 transition-colors group-focus-within:text-yellow-400">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-400 transition-all duration-300 hover:bg-white/15"
                  placeholder="Create a strong password"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/0 to-yellow-400/0 group-focus-within:from-yellow-400/10 group-focus-within:via-yellow-400/5 group-focus-within:to-yellow-400/10 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Confirm Password Field */}
            <div className="group">
              <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-300 mb-2 transition-colors group-focus-within:text-yellow-400">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-400 transition-all duration-300 hover:bg-white/15"
                  placeholder="Confirm your new password"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/0 to-yellow-400/0 group-focus-within:from-yellow-400/10 group-focus-within:via-yellow-400/5 group-focus-within:to-yellow-400/10 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Enhanced Password requirements */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Password Requirements</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'minLength', text: 'At least 8 characters', met: passwordRequirements.minLength },
                  { key: 'hasUpperCase', text: 'One uppercase letter', met: passwordRequirements.hasUpperCase },
                  { key: 'hasLowerCase', text: 'One lowercase letter', met: passwordRequirements.hasLowerCase },
                  { key: 'hasDigit', text: 'One number', met: passwordRequirements.hasDigit },
                  { key: 'hasSpecialChar', text: 'One special character', met: passwordRequirements.hasSpecialChar }
                ].map((requirement) => (
                  <div key={requirement.key} className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                    requirement.met 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                      requirement.met 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-600 text-gray-400'
                    }`}>
                      {requirement.met ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      )}
                    </div>
                    <span className={`font-medium transition-colors duration-300 ${
                      requirement.met ? 'text-green-300' : 'text-gray-300'
                    }`}>
                      {requirement.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enhanced Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/25 focus:outline-none focus:ring-4 focus:ring-yellow-500/30 disabled:opacity-70 disabled:hover:scale-100"
              >
                <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl px-8 py-4 transition-all duration-300 group-hover:from-yellow-300 group-hover:via-yellow-400 group-hover:to-yellow-500">
                  {loading ? (
                    <div className="flex items-center justify-center text-black font-bold">
                      <div className="relative">
                        <div className="w-6 h-6 border-3 border-black/20 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <span className="ml-3 text-lg">Securing Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-black font-bold">
                      <svg className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                      </svg>
                      <span className="text-lg">Secure My Account</span>
                    </div>
                  )}
                </div>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </button>
            </div>
          </form>
          
          {/* Bottom decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-b-3xl"></div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-float-${i % 3 + 1}`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 10}%`,
                animationDelay: `${i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(270deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 8s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 7s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default PasswordChange; 