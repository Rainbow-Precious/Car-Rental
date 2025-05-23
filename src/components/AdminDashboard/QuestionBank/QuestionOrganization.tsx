import React from 'react';

const QuestionOrganization: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Question Organization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Tags Management
          </h3>
          <p className="text-gray-400 mb-4">Organize your questions with tags for easy filtering and grouping.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">algebra</span>
            <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">equations</span>
            <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">physics</span>
            <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">calculus</span>
            <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">grammar</span>
            <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">literature</span>
          </div>
          <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Manage Tags
          </button>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Question Pools
          </h3>
          <p className="text-gray-400 mb-4">Create groups of questions to easily add to exams and quizzes.</p>
          <ul className="space-y-2 mb-4">
            <li className="bg-gray-600 p-2 rounded flex justify-between items-center">
              <span className="text-white">Final Exam Questions</span>
              <span className="text-xs bg-gray-500 px-2 py-0.5 rounded">42 questions</span>
            </li>
            <li className="bg-gray-600 p-2 rounded flex justify-between items-center">
              <span className="text-white">Practice Problems</span>
              <span className="text-xs bg-gray-500 px-2 py-0.5 rounded">28 questions</span>
            </li>
            <li className="bg-gray-600 p-2 rounded flex justify-between items-center">
              <span className="text-white">Pop Quiz Material</span>
              <span className="text-xs bg-gray-500 px-2 py-0.5 rounded">15 questions</span>
            </li>
          </ul>
          <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Pool
          </button>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-700 rounded-lg p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          Subject Hierarchy
        </h3>
        <p className="text-gray-400 mb-4">Organize your questions by subject and topic.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-600 p-3 rounded">
            <h4 className="font-medium text-white mb-2">Mathematics</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Algebra</li>
              <li>• Geometry</li>
              <li>• Calculus</li>
              <li>• Statistics</li>
            </ul>
          </div>
          <div className="bg-gray-600 p-3 rounded">
            <h4 className="font-medium text-white mb-2">Science</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Physics</li>
              <li>• Chemistry</li>
              <li>• Biology</li>
              <li>• Earth Science</li>
            </ul>
          </div>
          <div className="bg-gray-600 p-3 rounded">
            <h4 className="font-medium text-white mb-2">English</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Grammar</li>
              <li>• Literature</li>
              <li>• Writing</li>
              <li>• Comprehension</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-medium flex items-center transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Subject Structure
          </button>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import/Export
        </h3>
        <p className="text-gray-400 mb-4">Bulk manage your questions with import and export functionality.</p>
        
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium flex items-center transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import from CSV
          </button>
          <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-medium flex items-center transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to CSV
          </button>
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded font-medium flex items-center transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Import from Word
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionOrganization; 