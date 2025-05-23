import React, { useState } from 'react';
import TeacherLayout from './Layout/TeacherLayout';
import QuestionDashboard from './QuestionManagement/QuestionDashboard';
import QuestionManagement from './QuestionManagement/QuestionManagement';
import QuestionCreation from './QuestionManagement/QuestionCreation';
import QuestionOrganization from './QuestionManagement/QuestionOrganization';
import QuestionAnalytics from './QuestionManagement/QuestionAnalytics';
import QuestionCollaboration from './QuestionManagement/QuestionCollaboration';

const TeachersDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <QuestionDashboard />;
      case 'manage':
        return <QuestionManagement />;
      case 'create':
        return <QuestionCreation />;
      case 'organize':
        return <QuestionOrganization />;
      case 'analytics':
        return <QuestionAnalytics />;
      case 'collaborate':
        return <QuestionCollaboration />;
      default:
        return <QuestionDashboard />;
    }
  };

  return (
    <TeacherLayout title="Teacher Question Management">
      <div className="flex flex-col h-full">
        <div className="p-4 md:p-6 border-b border-gray-700">
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center">
            <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Teacher Question Management
          </h1>
          <p className="text-gray-400 mt-1">Create, manage, and organize questions for your classes and exams</p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="overflow-x-auto">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 md:px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-3 md:px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'manage'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Manage Questions
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-3 md:px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'create'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Question
              </button>
              <button
                onClick={() => setActiveTab('organize')}
                className={`px-3 md:px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'organize'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Organization
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 md:px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('collaborate')}
                className={`px-3 md:px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'collaborate'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Collaboration
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto bg-gray-900 p-4 md:p-6">
          {renderTabContent()}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeachersDashboard; 