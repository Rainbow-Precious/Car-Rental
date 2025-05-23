import React, { useEffect, useState } from 'react';

const TeacherTest: React.FC = () => {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [tokenValue, setTokenValue] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Auth token exists:', !!token);
    console.log('Auth token value:', token);
    
    setHasToken(!!token);
    setTokenValue(token || '');
    
    // Set a test token for demonstration
    if (!token) {
      const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvbW9ub29hcmU0QGdtYWlsLmNvbSIsImVtYWlsIjoib21vbm9vYXJlNEBnbWFpbC5jb20iLCJqdGkiOiI1N2UyMDkzYy01Y2QwLTRhYWUtOThiYy1jMmQxODFlNGZhZWMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImIwYWNiZDM1LTZjMzUtNGQxMS1hODMzLTVmNDkzYWZlZDQ2OCIsIlRlbmFudElkIjoiZWFlYmQyZmItMjVkMi00YjVjLWIyYzItMDRkZjBkZmQ5N2M3IiwidGVuYW50X2lkIjoiZWFlYmQyZmItMjVkMi00YjVjLWIyYzItMDRkZjBkZmQ5N2M3IiwiQWRtaW5JZCI6ImIwYWNiZDM1LTZjMzUtNGQxMS1hODMzLTVmNDkzYWZlZDQ2OCIsIlNjaG9vbE5hbWUiOiJvYWhpbWlyZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiUm9sZSI6IkFkbWluIiwiSXNWZXJpZmllZCI6IlRydWUiLCJleHAiOjE3NDgwNzk4NTUsImlzcyI6IkNCVEFwcEFQSSIsImF1ZCI6IkNCVEFwcEFQSVVzZXJzIn0.tZNNG_tqWlAVW4lb3k-e4nRptMZjAiX3lVmAB4-ePVE';
      localStorage.setItem('authToken', testToken);
      console.log('Set test token');
      setHasToken(true);
      setTokenValue(testToken);
    }
  }, []);

  const handleManualTokenAdd = () => {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvbW9ub29hcmU0QGdtYWlsLmNvbSIsImVtYWlsIjoib21vbm9vYXJlNEBnbWFpbC5jb20iLCJqdGkiOiI1N2UyMDkzYy01Y2QwLTRhYWUtOThiYy1jMmQxODFlNGZhZWMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImIwYWNiZDM1LTZjMzUtNGQxMS1hODMzLTVmNDkzYWZlZDQ2OCIsIlRlbmFudElkIjoiZWFlYmQyZmItMjVkMi00YjVjLWIyYzItMDRkZjBkZmQ5N2M3IiwidGVuYW50X2lkIjoiZWFlYmQyZmItMjVkMi00YjVjLWIyYzItMDRkZjBkZmQ5N2M3IiwiQWRtaW5JZCI6ImIwYWNiZDM1LTZjMzUtNGQxMS1hODMzLTVmNDkzYWZlZDQ2OCIsIlNjaG9vbE5hbWUiOiJvYWhpbWlyZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiUm9sZSI6IkFkbWluIiwiSXNWZXJpZmllZCI6IlRydWUiLCJleHAiOjE3NDgwNzk4NTUsImlzcyI6IkNCVEFwcEFQSSIsImF1ZCI6IkNCVEFwcEFQSVVzZXJzIn0.tZNNG_tqWlAVW4lb3k-e4nRptMZjAiX3lVmAB4-ePVE';
    localStorage.setItem('authToken', testToken);
    console.log('Manually set test token');
    setHasToken(true);
    setTokenValue(testToken);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6">Auth Token Test</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-white font-semibold mb-2">Token Status:</h3>
          <p className="text-gray-300">
            {hasToken ? (
              <span className="text-green-500">✓ Auth token exists</span>
            ) : (
              <span className="text-red-500">✗ Auth token is missing</span>
            )}
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-white font-semibold mb-2">Token Value (first 20 chars):</h3>
          <p className="text-gray-300 break-all">
            {tokenValue ? tokenValue.substring(0, 20) + '...' : 'No token'}
          </p>
        </div>
        
        <button
          onClick={handleManualTokenAdd}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
        >
          Manually Add Test Token
        </button>
      </div>
    </div>
  );
};

export default TeacherTest; 