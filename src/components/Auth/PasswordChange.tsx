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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
        <div className="text-center mb-8">
          <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <h1 className="text-2xl font-bold text-white mt-4">Change Your Password</h1>
          <p className="text-gray-400 mt-2">
            Please set a new password to continue to your dashboard
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
              New Password
            </label>
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
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          {/* Password requirements checklist */}
          <div className="text-sm text-gray-400">
            <p className="mb-2">Password requirements:</p>
            <ul className="space-y-1 pl-5 list-disc">
              <li className={passwordRequirements.minLength ? "text-green-500" : ""}>
                At least 8 characters
              </li>
              <li className={passwordRequirements.hasUpperCase ? "text-green-500" : ""}>
                At least one uppercase letter
              </li>
              <li className={passwordRequirements.hasLowerCase ? "text-green-500" : ""}>
                At least one lowercase letter
              </li>
              <li className={passwordRequirements.hasDigit ? "text-green-500" : ""}>
                At least one number
              </li>
              <li className={passwordRequirements.hasSpecialChar ? "text-green-500" : ""}>
                At least one special character
              </li>
            </ul>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-300 flex items-center justify-center"
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
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange; 