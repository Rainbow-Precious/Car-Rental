import React, { useState } from 'react';

// Mock data for collaborators
const collaborators = [
  { id: 1, name: 'John Doe', email: 'john.doe@school.edu', role: 'Teacher', department: 'Mathematics', status: 'Active', image: null },
  { id: 2, name: 'Emma Wilson', email: 'emma.w@school.edu', role: 'Teacher', department: 'Science', status: 'Active', image: null },
  { id: 3, name: 'Michael Brown', email: 'michael.b@school.edu', role: 'Teacher', department: 'English', status: 'Pending', image: null },
  { id: 4, name: 'Sarah Johnson', email: 'sarah.j@school.edu', role: 'Head Teacher', department: 'Mathematics', status: 'Active', image: null },
];

// Mock data for recent activities
const recentActivities = [
  { id: 1, user: 'Emma Wilson', action: 'created', question: 'What is the formula for calculating the area of a circle?', time: '2 hours ago' },
  { id: 2, user: 'John Doe', action: 'edited', question: 'Solve for x: 3x + 7 = 22', time: '5 hours ago' },
  { id: 3, user: 'Sarah Johnson', action: 'commented on', question: 'Who wrote "Pride and Prejudice"?', time: '1 day ago' },
  { id: 4, user: 'John Doe', action: 'approved', question: 'What is photosynthesis?', time: '2 days ago' },
  { id: 5, user: 'Emma Wilson', action: 'rejected', question: 'List the first 10 prime numbers', time: '3 days ago' },
];

const QuestionCollaboration: React.FC = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('Teacher');

  return (
    <div className="space-y-6">
      {/* Collaborators Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Collaborators</h2>
            <p className="text-gray-400 mt-1">Invite teachers to collaborate on your question bank</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="Teacher">Teacher</option>
              <option value="Head Teacher">Head Teacher</option>
              <option value="Reviewer">Reviewer</option>
            </select>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-medium transition-colors">
              Invite
            </button>
          </div>
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
                    <button className="text-indigo-400 hover:text-indigo-300 mr-3">Edit</button>
                    <button className="text-red-400 hover:text-red-300">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Activity Feed */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        
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
      
      {/* Collaboration Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-black mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Comments & Feedback</h3>
          <p className="text-gray-400">Discuss and provide feedback on questions to improve quality.</p>
          <button className="mt-4 text-yellow-500 hover:text-yellow-400 text-sm font-medium flex items-center">
            View Comments
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Approval Workflow</h3>
          <p className="text-gray-400">Ensure quality with multi-stage approval process for questions.</p>
          <button className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center">
            Review Pending Approvals
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Team Assignments</h3>
          <p className="text-gray-400">Assign specific subjects or question types to different team members.</p>
          <button className="mt-4 text-green-400 hover:text-green-300 text-sm font-medium flex items-center">
            Manage Assignments
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCollaboration; 