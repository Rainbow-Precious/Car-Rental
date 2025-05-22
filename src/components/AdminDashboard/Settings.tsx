import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './Layout/AdminLayout';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  // Simple authentication check
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/signin');
    }
  }, [navigate]);
  
  return (
    <AdminLayout title="Settings" showBackButton={true}>
      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto">
        {/* Tabs Navigation (not fixed, scrolls with content) */}
        <div className="bg-gray-900 rounded-lg mb-6 p-4 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-0">
              <button 
                onClick={() => setActiveTab('account')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'account' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Account
              </button>
              <button 
                onClick={() => setActiveTab('security')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'security' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Security
              </button>
              <button 
                onClick={() => setActiveTab('notifications')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'notifications' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Notifications
              </button>
              <button 
                onClick={() => setActiveTab('theme')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'theme' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Theme
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Last Updated: 01:52 PM WAT, Tuesday, May 20, 2025
            </p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex flex-col md:flex-row md:space-x-6 w-full">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {/* Account Details Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-yellow-500 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Account Details</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Middle Name <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="David"
                      className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Smith"
                      className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="john.smith@example.com"
                      className="w-full p-2 pl-10 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="+1 (234) 567-8901"
                      className="w-full p-2 pl-10 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
            {/* Security Settings Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-yellow-500 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Security Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-white">
                        Two-Factor Authentication (2FA)
                      </label>
                      <p className="text-sm text-gray-400 mt-1">
                        Enable 2FA to secure your CBT account with an additional
                        verification step.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-gradient-to-r from-yellow-500 to-yellow-600 transition duration-200"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition duration-200"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex-1 space-y-6 mt-6 md:mt-0">
            {/* Notification Preferences Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-yellow-500 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Email Notifications
                    </label>
                    <p className="text-xs text-gray-400 mt-1">Receive important updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-gradient-to-r from-yellow-500 to-yellow-600 transition duration-200"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition duration-200"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-white">
                      SMS Notifications
                    </label>
                    <p className="text-xs text-gray-400 mt-1">Receive important updates via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-gradient-to-r from-yellow-500 to-yellow-600 transition duration-200"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition duration-200"></div>
                  </label>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-3 text-white">
                    Notification Types
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-500 rounded focus:ring-yellow-500 focus:ring-2"
                        defaultChecked
                      />
                      <label className="text-sm ml-3 text-white">Exam Schedule Updates</label>
                    </div>
                    <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-500 rounded focus:ring-yellow-500 focus:ring-2"
                        defaultChecked
                      />
                      <label className="text-sm ml-3 text-white">Student Activity Alerts</label>
                    </div>
                    <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-500 rounded focus:ring-yellow-500 focus:ring-2"
                      />
                      <label className="text-sm ml-3 text-white">System Maintenance Notices</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
            
            {/* Theme Settings Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-yellow-500 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Theme Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Theme Preference
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border-2 border-yellow-500 bg-gray-900 rounded-lg p-3 flex flex-col items-center cursor-pointer">
                      <div className="w-full h-10 bg-black rounded mb-2"></div>
                      <span className="text-sm font-medium">Dark</span>
                    </div>
                    <div className="border border-gray-700 bg-gray-900 rounded-lg p-3 flex flex-col items-center cursor-pointer">
                      <div className="w-full h-10 bg-white rounded mb-2"></div>
                      <span className="text-sm font-medium">Light</span>
                    </div>
                    <div className="border border-gray-700 bg-gray-900 rounded-lg p-3 flex flex-col items-center cursor-pointer">
                      <div className="w-full h-10 bg-gradient-to-r from-gray-800 to-white rounded mb-2"></div>
                      <span className="text-sm font-medium">System</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Accent Color
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 ring-2 ring-white cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 cursor-pointer"></div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center">
                    Apply Theme
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
