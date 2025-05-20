import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthCheckProps {
  children: React.ReactNode;
}

/**
 * A component that checks if the user is authenticated and selectively prevents 
 * using the browser back button only on the main dashboard page.
 * 
 * Usage:
 * <AuthCheck>
 *   <YourProtectedComponent />
 * </AuthCheck>
 */
const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardPage = location.pathname === '/dashboard';

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/signin', { replace: true });
      return;
    }

    // Only block navigation on the main dashboard page
    if (isDashboardPage) {
      window.history.pushState(null, '', window.location.pathname);
      
      const preventNavigation = (event: PopStateEvent) => {
        event.preventDefault();
        window.history.pushState(null, '', window.location.pathname);
        
        // Show logout confirmation dialog
        const shouldLogout = window.confirm(
          "You cannot go back from the dashboard. Would you like to logout instead?"
        );
        
        if (shouldLogout) {
          // Clear authentication data
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
          localStorage.removeItem('isSetupComplete');
          
          // Navigate to signin page
          navigate('/signin', { replace: true });
        }
      };
      
      window.addEventListener('popstate', preventNavigation);
      
      return () => {
        window.removeEventListener('popstate', preventNavigation);
      };
    }
  }, [navigate, location.pathname, isDashboardPage]);

  return <>{children}</>;
};

export default AuthCheck; 