import React from 'react';

const StudentDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
              C
            </div>
            <h1 className="ml-3 text-xl font-bold">Student Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                S
              </div>
              <span className="text-sm font-medium">Student</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upcoming Exams Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold">Upcoming Exams</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-700 rounded-md">
                <p className="text-yellow-500 font-medium">Mathematics - Term Test</p>
                <p className="text-sm text-gray-300">Tomorrow at 9:00 AM</p>
              </div>
              <div className="p-3 bg-gray-700 rounded-md">
                <p className="text-yellow-500 font-medium">English - Quiz</p>
                <p className="text-sm text-gray-300">Friday at 11:30 AM</p>
              </div>
            </div>
            <button className="mt-4 text-sm text-yellow-500 hover:text-yellow-400 flex items-center">
              View all exams
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Recent Results Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-semibold">Recent Results</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-700 rounded-md">
                <p className="text-yellow-500 font-medium">Science - Mid-term</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-300">Score: 85%</p>
                  <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">Passed</span>
                </div>
              </div>
              <div className="p-3 bg-gray-700 rounded-md">
                <p className="text-yellow-500 font-medium">History - Quiz</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-300">Score: 72%</p>
                  <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">Passed</span>
                </div>
              </div>
            </div>
            <button className="mt-4 text-sm text-yellow-500 hover:text-yellow-400 flex items-center">
              View all results
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Class Schedule Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold">Today's Schedule</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-700 rounded-md">
                <p className="text-yellow-500 font-medium">Mathematics</p>
                <p className="text-sm text-gray-300">10:00 AM - 11:30 AM</p>
              </div>
              <div className="p-3 bg-gray-700 rounded-md">
                <p className="text-yellow-500 font-medium">English</p>
                <p className="text-sm text-gray-300">1:00 PM - 2:30 PM</p>
              </div>
            </div>
            <button className="mt-4 text-sm text-yellow-500 hover:text-yellow-400 flex items-center">
              View full schedule
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard; 