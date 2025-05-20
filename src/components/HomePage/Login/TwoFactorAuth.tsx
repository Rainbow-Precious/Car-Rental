import React from "react";

const TwoFactorAuth: React.FC = () => {
  return (
    <div className="space-y-6 p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-yellow-400">Two-Factor Authentication (2FA)</h1>
        <p className="text-sm text-gray-400">
          Last Updated: 01:10 PM WAT, Tuesday, May 20, 2025
        </p>
      </div>

      {/* Enable 2FA Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Enable 2FA for CBT Access</h2>
        <p className="text-sm text-gray-300 mb-4">
          Secure your account for managing CBT exams, student records, and more by enabling 2FA.
          Scan the QR code below with an authenticator app (e.g., Google Authenticator) to set up.
        </p>
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-600 rounded-md flex items-center justify-center">
              <span className="text-gray-400 text-sm">[Static QR Code Placeholder]</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Secret Key (Manual Setup)</label>
            <input
              type="text"
              value="ABCD-EFGH-IJKL-MNOP"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Verify Setup Code</label>
            <div className="flex space-x-2">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-10 h-10 p-2 rounded bg-gray-700 text-white border border-gray-600 text-center disabled:opacity-75"
                  disabled
                />
              ))}
            </div>
          </div>
          <button className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-200">
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Verify 2FA Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Verify 2FA Code</h2>
        <p className="text-sm text-gray-300 mb-4">
          Enter the 6-digit code from your authenticator app to access CBT features securely.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">2FA Code</label>
            <div className="flex space-x-2">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-10 h-10 p-2 rounded bg-gray-700 text-white border border-gray-600 text-center disabled:opacity-75"
                  disabled
                />
              ))}
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-200">
              Verify Code
            </button>
            <button className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-500 transition duration-200">
              Resend Code
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Code requested at: 01:10 PM WAT, Tuesday, May 20, 2025
          </p>
        </div>
      </div>

      {/* Recovery Options */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Recovery Options</h2>
        <p className="text-sm text-gray-300 mb-4">
          Set up recovery options to regain access to your CBT account if you lose your 2FA device.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Recovery Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Recovery Phone Number</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <button className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-200">
            Save Recovery Options
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;