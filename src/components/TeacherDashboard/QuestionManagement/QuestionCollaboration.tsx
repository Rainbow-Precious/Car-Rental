import React, { useState } from 'react';

// Mock data for collaborators
const collaborators = [
  { id: 1, name: 'John Smith', email: 'john.smith@school.edu', role: 'Teacher', department: 'Mathematics', status: 'Active', image: null },
  { id: 2, name: 'Sarah Williams', email: 'sarah.w@school.edu', role: 'Teacher', department: 'Science', status: 'Active', image: null },
  { id: 3, name: 'David Johnson', email: 'david.j@school.edu', role: 'Teacher', department: 'English', status: 'Pending', image: null },
];

// Mock data for recent activities
const recentActivities = [
  { id: 1, user: 'Sarah Williams', action: 'commented on', question: 'What is the formula for calculating the area of a circle?', time: '1 hour ago' },
  { id: 2, user: 'John Smith', action: 'suggested an edit to', question: 'Solve for x: 3x + 7 = 22', time: '3 hours ago' },
  { id: 3, user: 'Admin', action: 'approved your', question: 'Who wrote "Pride and Prejudice"?', time: '1 day ago' },
  { id: 4, user: 'Sarah Williams', action: 'shared', question: 'What is photosynthesis?', time: '2 days ago' },
  { id: 5, user: 'David Johnson', action: 'requested access to', question: 'List the first 10 prime numbers', time: '3 days ago' },
];

// Mock comments for a question
const comments = [
  { id: 1, user: 'John Smith', text: 'The wording in this question might be confusing for students. Consider rephrasing.', time: '2 days ago' },
  { id: 2, user: 'You', text: 'Good point. I will update it to be more clear.', time: '1 day ago' },
  { id: 3, user: 'Sarah Williams', text: 'The answer options should include a common misconception as a distractor.', time: '12 hours ago' },
];

const QuestionCollaboration: React.FC = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-6">
      {/* Collaborators Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">My Collaborators</h2>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-medium flex items-center transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Invite Collaborator
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {collaborators.map((collaborator) => (
                <tr key={collaborator.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {collaborator.image ? (
                          <img className="h-10 w-10 rounded-full" src={collaborator.image} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                            {collaborator.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{collaborator.name}</div>
                        <div className="text-sm text-gray-400">{collaborator.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white">{collaborator.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white">{collaborator.department}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      collaborator.status === 'Active' 
                        ? 'bg-green-800 text-green-100' 
                        : 'bg-yellow-800 text-yellow-100'
                    }`}>
                      {collaborator.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-3">Manage</button>
                    <button className="text-red-400 hover:text-red-300">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Shared Questions Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Question Discussion</h2>
        
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start">
            <h3 className="text-white font-medium">What is the formula for calculating the area of a circle?</h3>
            <span className="bg-blue-600 text-xs text-white px-2 py-1 rounded">Multiple Choice</span>
          </div>
          <p className="text-gray-300 mt-2 text-sm">Options: A) πr, B) 2πr, C) πr², D) 2πr²</p>
          <div className="flex items-center mt-2 text-xs text-gray-400">
            <span className="mr-4">Mathematics</span>
            <span className="mr-4">Difficulty: Easy</span>
            <span>Created: May 12, 2025</span>
          </div>
        </div>
        
        <div className="space-y-4 mb-4">
          <h4 className="text-white font-medium">Comments</h4>
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between mb-1">
                <span className={`font-medium ${comment.user === 'You' ? 'text-yellow-500' : 'text-white'}`}>{comment.user}</span>
                <span className="text-xs text-gray-400">{comment.time}</span>
              </div>
              <p className="text-gray-300 text-sm">{comment.text}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
            Add Your Comment
          </label>
          <textarea
            id="comment"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your comment here..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <div className="mt-2 flex justify-end">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-medium transition-colors">
              Post Comment
            </button>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Feed */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium text-sm">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">{activity.user}</span>
                    {' '}<span className="text-gray-300">{activity.action}</span>{' '}
                    <span className="text-yellow-500">"{activity.question}"</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                </div>
                <div className="flex-shrink-0">
                  <button className="text-gray-400 hover:text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-yellow-500 hover:text-yellow-400 font-medium inline-flex items-center">
            View all activity
            <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Sharing Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
          <h3 className="text-lg font-semibold text-white mb-3">Share Questions</h3>
          <p className="text-gray-400 mb-4">Share your questions with other teachers to get feedback and collaborate.</p>
          
          <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-medium transition-colors flex items-center justify-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Selected Questions
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
          <h3 className="text-lg font-semibold text-white mb-3">Request Access</h3>
          <p className="text-gray-400 mb-4">Request access to other teachers' question banks to enhance your collection.</p>
          
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Request Question Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCollaboration; 