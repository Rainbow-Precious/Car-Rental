import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PasswordChange from './PasswordChange';

interface UserData {
  token: string;
  expiryDate: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  role: string;
  schoolName: string;
  email: string;
  isVerified: boolean;
  isEmailConfirmed: boolean;
  mustChangePassword: boolean;
  isSetupComplete: boolean;
  setupProgress: number;
}

const AuthHandler: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check for userData in localStorage or from API response
    const storedUser = localStorage.getItem('userData');
    
    if (storedUser) {
      try {
        const parsedUserData = JSON.parse(storedUser) as UserData;
        setUserData(parsedUserData);
        
        // Ensure token is stored as authToken for API calls
        if (parsedUserData.token) {
          localStorage.setItem('authToken', parsedUserData.token);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Clear invalid data
        localStorage.removeItem('userData');
        navigate('/signin');
      }
    } else {
      // If no user data found, check if we're in the login response
      const params = new URLSearchParams(location.search);
      const loginData = params.get('loginData');
      
      if (loginData) {
        try {
          const parsedLoginData = JSON.parse(decodeURIComponent(loginData)) as { data: UserData };
          const newUserData = parsedLoginData.data;
          
          // Save user data to localStorage
          localStorage.setItem('userData', JSON.stringify(newUserData));
          
          // Ensure token is stored as authToken for API calls
          if (newUserData.token) {
            localStorage.setItem('authToken', newUserData.token);
          }
          
          setUserData(newUserData);
        } catch (error) {
          console.error('Failed to parse login data:', error);
          navigate('/signin');
        }
      } else {
        // No user data available, redirect to login
        navigate('/signin');
      }
    }
    
    setLoading(false);
  }, [navigate, location]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-yellow-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!userData) {
    // Redirect to login if no userData and not already redirecting
    navigate('/signin');
    return null;
  }
  
  // Determine where to route the user
  
  // 1. Check if user must change password
  if (userData.mustChangePassword) {
    return <PasswordChange token={userData.token} userData={userData} />;
  }
  
  // 2. If not, redirect to the appropriate dashboard based on role
  useEffect(() => {
    if (!userData.mustChangePassword) {
      switch (userData.role) {
        case 'Admin':
          navigate('/dashboard');
          break;
        case 'Teacher':
          navigate('/teacher/dashboard');
          break;
        case 'Student':
          navigate('/student/dashboard');
          break;
        default:
          // Fallback for unknown roles
          navigate('/dashboard');
      }
    }
  }, [userData, navigate]);
  
  // Just a loading screen while redirecting
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 text-yellow-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-white">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default AuthHandler; 