import React from 'react';

// Mock data for analytics
const analyticsData = {
  questionPerformance: [
    { id: 'q1', text: 'What is the value of π (pi) to two decimal places?', correctRate: 78, avgTime: 45, attempts: 320 },
    { id: 'q2', text: 'Which of these is not a primary color?', correctRate: 92, avgTime: 30, attempts: 305 },
    { id: 'q3', text: 'What is the capital of France?', correctRate: 88, avgTime: 25, attempts: 350 },
    { id: 'q4', text: 'Solve for x: 2x + 5 = 13', correctRate: 65, avgTime: 60, attempts: 290 },
    { id: 'q5', text: 'Who wrote "Romeo and Juliet"?', correctRate: 82, avgTime: 35, attempts: 310 },
  ],
  difficultyDistribution: [
    { difficulty: 'Easy', count: 95, color: 'from-green-500 to-green-600' },
    { difficulty: 'Medium', count: 62, color: 'from-yellow-500 to-yellow-600' },
    { difficulty: 'Hard', count: 15, color: 'from-red-500 to-red-600' },
  ],
  subjectPerformance: [
    { subject: 'Mathematics', correctRate: 72, avgTime: 55 },
    { subject: 'Science', correctRate: 68, avgTime: 50 },
    { subject: 'English', correctRate: 80, avgTime: 40 },
    { subject: 'History', correctRate: 75, avgTime: 45 },
    { subject: 'Geography', correctRate: 70, avgTime: 48 },
  ]
};

const QuestionAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">74%</h3>
              <p className="text-sm font-medium opacity-80">Average Correct Rate</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">45s</h3>
              <p className="text-sm font-medium opacity-80">Average Response Time</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">8,753</h3>
              <p className="text-sm font-medium opacity-80">Total Question Attempts</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Question Performance Table */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">My Top Performing Questions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Question Text
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Correct Rate
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Avg. Time (sec)
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Attempts
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {analyticsData.questionPerformance.map((question) => (
                <tr key={question.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white text-sm">{question.text}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-700 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            question.correctRate >= 80 ? 'bg-green-500' : 
                            question.correctRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${question.correctRate}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm">{question.correctRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{question.avgTime}s</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{question.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Difficulty & Subject Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">My Question Difficulty Distribution</h3>
          <div className="space-y-4">
            {analyticsData.difficultyDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.difficulty}</span>
                  <span className="text-white font-medium">{item.count} questions</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`bg-gradient-to-r ${item.color} h-2.5 rounded-full`} 
                    style={{ width: `${(item.count / 172) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Performance by Difficulty</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-700 rounded p-3">
                <div className="text-green-400 text-xl font-bold">80%</div>
                <div className="text-xs text-gray-400 mt-1">Easy Questions</div>
              </div>
              <div className="bg-gray-700 rounded p-3">
                <div className="text-yellow-400 text-xl font-bold">65%</div>
                <div className="text-xs text-gray-400 mt-1">Medium Questions</div>
              </div>
              <div className="bg-gray-700 rounded p-3">
                <div className="text-red-400 text-xl font-bold">48%</div>
                <div className="text-xs text-gray-400 mt-1">Hard Questions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Subject Performance</h3>
          
          <div className="space-y-4">
            {analyticsData.subjectPerformance.map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">{item.subject}</span>
                  <span className={`text-sm font-medium ${
                    item.correctRate >= 80 ? 'text-green-400' : 
                    item.correctRate >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>{item.correctRate}% correct</span>
                </div>
                
                <div className="w-full bg-gray-600 rounded-full h-1.5 mb-1">
                  <div 
                    className={`h-1.5 rounded-full ${
                      item.correctRate >= 80 ? 'bg-green-500' : 
                      item.correctRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.correctRate}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Avg. response time: {item.avgTime}s</span>
                  <span>Questions: {Math.floor(Math.random() * 30) + 20}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Improvement Suggestions</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Mathematics Questions
            </h4>
            <p className="text-gray-300 mt-2 text-sm">Your math questions have a lower correct rate (72%) compared to English (80%). Consider reviewing the algebra questions which students are struggling with the most.</p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Response Time
            </h4>
            <p className="text-gray-300 mt-2 text-sm">The average response time for science questions (50s) is higher than other subjects. Consider breaking down complex questions into clearer steps or providing more context.</p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Question Distribution
            </h4>
            <p className="text-gray-300 mt-2 text-sm">Only 9% of your questions are marked as Hard difficulty. Consider creating more challenging questions to better prepare students for advanced concepts.</p>
          </div>
        </div>
      </div>

      {/* Generate Report Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium flex items-center transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Generate Detailed Analytics Report
        </button>
      </div>
    </div>
  );
};

export default QuestionAnalytics; 