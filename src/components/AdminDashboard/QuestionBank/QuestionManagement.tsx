import React, { useState } from 'react';

// Mock data for questions
const mockQuestions = [
  {
    id: '1',
    text: 'What is the value of π (pi) to two decimal places?',
    type: 'Multiple Choice',
    subject: 'Mathematics',
    difficulty: 'Easy',
    lastModified: '2025-05-15',
    status: 'Active',
    tags: ['math', 'numbers', 'constants']
  },
  {
    id: '2',
    text: 'Explain the process of photosynthesis in plants.',
    type: 'Essay',
    subject: 'Science',
    difficulty: 'Medium',
    lastModified: '2025-05-14',
    status: 'Active',
    tags: ['biology', 'plants', 'energy']
  },
  {
    id: '3',
    text: 'Is the statement "Water boils at 100°C at sea level" true or false?',
    type: 'True/False',
    subject: 'Science',
    difficulty: 'Easy',
    lastModified: '2025-05-13',
    status: 'Active',
    tags: ['physics', 'water', 'temperature']
  },
  {
    id: '4',
    text: 'What year did World War II end?',
    type: 'Multiple Choice',
    subject: 'History',
    difficulty: 'Easy',
    lastModified: '2025-05-12',
    status: 'Active',
    tags: ['history', 'wars', '20th century']
  },
  {
    id: '5',
    text: 'Solve the equation 2x + 5 = 13',
    type: 'Short Answer',
    subject: 'Mathematics',
    difficulty: 'Easy',
    lastModified: '2025-05-11',
    status: 'Active',
    tags: ['algebra', 'equations']
  },
  {
    id: '6',
    text: 'Write a short essay on the themes in Shakespeare\'s "Macbeth".',
    type: 'Essay',
    subject: 'English',
    difficulty: 'Hard',
    lastModified: '2025-05-10',
    status: 'Inactive',
    tags: ['literature', 'shakespeare', 'drama']
  },
  {
    id: '7',
    text: 'What are the three primary colors?',
    type: 'Multiple Choice',
    subject: 'Art',
    difficulty: 'Easy',
    lastModified: '2025-05-09',
    status: 'Active',
    tags: ['art', 'colors', 'basics']
  },
];

const difficultyColors = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400'
};

const typeIcons = {
  'Multiple Choice': (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'Essay': (
    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  'True/False': (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  'Short Answer': (
    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  )
};

const subjects = [
  'All Subjects',
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Art',
];

const questionTypes = [
  'All Types',
  'Multiple Choice',
  'Essay',
  'True/False',
  'Short Answer',
];

const difficulties = [
  'All Difficulties',
  'Easy',
  'Medium',
  'Hard',
];

const QuestionManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  
  // Filter questions based on search and filters
  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'All Subjects' || question.subject === selectedSubject;
    const matchesType = selectedType === 'All Types' || question.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'All Difficulties' || question.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSubject && matchesType && matchesDifficulty;
  });
  
  const handleSelectAll = () => {
    if (selectedQuestions.length === filteredQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    }
  };
  
  const handleSelectQuestion = (id: string) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter(qId => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };
  
  const truncateText = (text: string, maxLength: number = 80) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search questions or tags..."
                className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            
            <select
              className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {questionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Bulk Actions */}
        {selectedQuestions.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-300">
              {selectedQuestions.length} {selectedQuestions.length === 1 ? 'question' : 'questions'} selected
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm py-1 px-3 rounded transition-colors">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Tag
              </button>
              <button className="bg-gray-600 hover:bg-gray-500 text-white text-sm py-1 px-3 rounded transition-colors">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-500 text-white text-sm py-1 px-3 rounded transition-colors">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              <button className="bg-red-600 hover:bg-red-500 text-white text-sm py-1 px-3 rounded transition-colors">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Questions Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="py-3 px-4 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-yellow-500 rounded border-gray-600 focus:ring-yellow-500 focus:ring-offset-gray-800"
                      checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Question
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Difficulty
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Modified
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No questions match your search criteria
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-yellow-500 rounded border-gray-600 focus:ring-yellow-500 focus:ring-offset-gray-800"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={() => handleSelectQuestion(question.id)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-start">
                        <div className="text-sm font-medium text-white">
                          {truncateText(question.text)}
                        </div>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {question.tags.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {typeIcons[question.type as keyof typeof typeIcons]}
                        <span className="ml-2 text-sm text-white">{question.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-white">{question.subject}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${difficultyColors[question.difficulty as keyof typeof difficultyColors]}`}>
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-300">{question.lastModified}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="text-indigo-400 hover:text-indigo-300" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-yellow-400 hover:text-yellow-300" title="Duplicate">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="text-red-400 hover:text-red-300" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-700/50 px-4 py-3 flex items-center justify-between border-t border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing <span className="font-medium">1</span> to <span className="font-medium">7</span> of{' '}
                <span className="font-medium">7</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button aria-current="page" className="z-10 bg-yellow-500 border-yellow-500 text-black relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionManagement; 