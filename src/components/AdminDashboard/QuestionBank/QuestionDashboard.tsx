import React from 'react';

// Mock data
const questionStats = {
  total: 245,
  byType: [
    { type: 'Multiple Choice', count: 148, color: 'from-blue-500 to-blue-600' },
    { type: 'True/False', count: 42, color: 'from-green-500 to-green-600' },
    { type: 'Essay', count: 35, color: 'from-purple-500 to-purple-600' },
    { type: 'Short Answer', count: 20, color: 'from-pink-500 to-pink-600' },
  ],
  bySubject: [
    { subject: 'Mathematics', count: 68, color: 'from-red-500 to-red-600' },
    { subject: 'Science', count: 57, color: 'from-blue-500 to-blue-600' },
    { subject: 'English', count: 45, color: 'from-green-500 to-green-600' },
    { subject: 'History', count: 38, color: 'from-yellow-500 to-yellow-600' },
    { subject: 'Geography', count: 25, color: 'from-purple-500 to-purple-600' },
    { subject: 'Others', count: 12, color: 'from-gray-500 to-gray-600' },
  ],
  recentActivity: [
    { id: 1, action: 'Created new question', questionType: 'Multiple Choice', subject: 'Mathematics', date: '2 hours ago' },
    { id: 2, action: 'Updated question', questionType: 'Essay', subject: 'English', date: '5 hours ago' },
    { id: 3, action: 'Deleted question', questionType: 'True/False', subject: 'Science', date: '1 day ago' },
    { id: 4, action: 'Created new question', questionType: 'Short Answer', subject: 'History', date: '2 days ago' },
  ]
};

const QuestionDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-lg text-black">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{questionStats.total}</h3>
              <p className="text-sm font-medium opacity-80">Total Questions</p>
            </div>
            <div className="bg-yellow-400/30 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">6</h3>
              <p className="text-sm font-medium opacity-80">Subjects</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">4</h3>
              <p className="text-sm font-medium opacity-80">Question Types</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">14</h3>
              <p className="text-sm font-medium opacity-80">Exams Using Questions</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Questions by Type */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Questions by Type</h3>
          <div className="space-y-4">
            {questionStats.byType.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.type}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${item.color} h-2 rounded-full`} 
                    style={{ width: `${(item.count / questionStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Questions by Subject */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Questions by Subject</h3>
          <div className="grid grid-cols-2 gap-4">
            {questionStats.bySubject.map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3 flex items-center">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color} mr-2`}></div>
                <div className="flex-1">
                  <h4 className="text-sm text-white">{item.subject}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{item.count} questions</span>
                    <span className="text-xs text-gray-400">{Math.round((item.count / questionStats.total) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Action</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Type</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Subject</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {questionStats.recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white">{activity.action}</td>
                  <td className="px-4 py-3 text-gray-300">{activity.questionType}</td>
                  <td className="px-4 py-3 text-gray-300">{activity.subject}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Question
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Questions
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Questions
        </button>
      </div>
    </div>
  );
};

export default QuestionDashboard; 