import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  // Simple authentication check
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/signin');
    }
  }, [navigate]);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-300">Admin settings page. This page is under construction.</p>
      </div>
    </div>
  );
};

export default Settings; 