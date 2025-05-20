import React from "react";

const Settings: React.FC = () => {
  return (
    <div className="px-4 py-8 bg-gray-900 text-white min-h-screen w-screen flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">Settings</h1>
          <p className="text-sm text-gray-400">
            Last Updated: 01:52 PM WAT, Tuesday, May 20, 2025
          </p>
        </div>
        {/* Split into two columns on desktop */}
        <div className="flex flex-col md:flex-row md:space-x-6 w-full">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {/* Account Details Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">
                Account Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                    disabled
                  />
                </div>
                <button className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-200">
                  Update Account Details
                </button>
              </div>
            </div>
            {/* Security Settings Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">
                Security Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium">
                      Two-Factor Authentication (2FA)
                    </label>
                    <p className="text-sm text-gray-400">
                      Enable 2FA to secure your CBT account with an additional
                      verification step.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed">
                    <input type="checkbox" className="sr-only peer" disabled />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-yellow-500 transition duration-200"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition duration-200"></div>
                  </label>
                </div>
                <button className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-200">
                  Change Password
                </button>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex-1 space-y-6 mt-6 md:mt-0">
            {/* Notification Preferences Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    Email Notifications
                  </label>
                  <label className="relative inline-flex items-center cursor-not-allowed">
                    <input type="checkbox" className="sr-only peer" disabled />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-yellow-500 transition duration-200"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition duration-200"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    SMS Notifications
                  </label>
                  <label className="relative inline-flex items-center cursor-not-allowed">
                    <input type="checkbox" className="sr-only peer" disabled />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-yellow-500 transition duration-200"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition duration-200"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notification Types
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 disabled:opacity-75"
                        disabled
                      />
                      <label className="text-sm">Exam Schedule Updates</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 disabled:opacity-75"
                        disabled
                      />
                      <label className="text-sm">Student Activity Alerts</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 disabled:opacity-75"
                        disabled
                      />
                      <label className="text-sm">
                        System Maintenance Notices
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Theme Settings Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">
                Theme Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Theme Preference
                  </label>
                  <select
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                    disabled
                  >
                    <option value="dark">Dark (Default)</option>
                    <option value="light">Light</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <button className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-200">
                  Apply Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
