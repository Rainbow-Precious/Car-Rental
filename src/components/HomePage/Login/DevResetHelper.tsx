import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * This component is a development utility to help test the reset password functionality locally.
 * It allows pasting a production reset URL and extracts the token and email for local testing.
 */
const DevResetHelper: React.FC = () => {
  const [prodUrl, setProdUrl] = useState('');
  const navigate = useNavigate();

  const extractAndRedirect = () => {
    try {
      // Create a URL object to parse the components
      const url = new URL(prodUrl);
      
      // Get the search params (everything after the ?)
      const params = new URLSearchParams(url.search);
      
      // Extract token and email
      const token = params.get('token');
      const email = params.get('email');
      
      if (!token) {
        alert('No token found in the URL');
        return;
      }
      
      // Construct a local URL with the same parameters
      const localResetUrl = `/reset-password?token=${token}${email ? `&email=${email}` : ''}`;
      
      // Navigate to the local reset page
      navigate(localResetUrl);
    } catch (err) {
      alert('Invalid URL format. Please paste a complete URL.');
    }
  };
  
  // Always show the tool (temporarily removing the hostname check for debugging)
  // const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  // if (!isDevelopment) {
  //   return null;
  // }

  return (
    <div className="fixed bottom-4 right-4 bg-red-600 p-4 rounded-lg shadow-lg max-w-md z-[9999]">
      <h3 className="text-white font-semibold mb-2">Development Reset Tool</h3>
      <p className="text-white text-sm mb-2">
        Paste a production reset link to test locally:
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={prodUrl}
          onChange={(e) => setProdUrl(e.target.value)}
          placeholder="Paste production reset URL"
          className="bg-black border border-gray-700 text-white p-2 rounded flex-1 text-sm"
        />
        <button
          onClick={extractAndRedirect}
          className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-medium"
        >
          Test Locally
        </button>
      </div>
    </div>
  );
};

export default DevResetHelper; 