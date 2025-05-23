import React, { useState } from 'react';
import AdminLayout from '../Layout/AdminLayout';
import QuestionDashboard from './QuestionDashboard';
import QuestionManagement from './QuestionManagement';
import QuestionCreation from './QuestionCreation';
import QuestionOrganization from './QuestionOrganization';
import QuestionAnalytics from './QuestionAnalytics';
import QuestionCollaboration from './QuestionCollaboration';

const QuestionBank: React.FC = () => {
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
    <AdminLayout title="Question Bank">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Question Bank
            </h1>
            <p className="text-gray-400 mt-1">Create, manage, and organize your exam questions</p>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-gray-800 border-b border-gray-700">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'manage'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Manage Questions
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'create'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Question
              </button>
              <button
                onClick={() => setActiveTab('organize')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'organize'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Organization
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('collaborate')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'collaborate'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Collaboration
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuestionBank; 