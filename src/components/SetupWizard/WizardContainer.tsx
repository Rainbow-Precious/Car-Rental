import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface WizardContainerProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  hideBackButton?: boolean;
  nextButtonText?: string;
}

const WizardContainer: React.FC<WizardContainerProps> = ({
  currentStep,
  totalSteps,
  children,
  onNext,
  onBack,
  isNextDisabled = false,
  isBackDisabled = false,
  hideBackButton = false,
  nextButtonText = 'Next'
}) => {
  const navigate = useNavigate();
  const [progressWidth, setProgressWidth] = useState('0%');

  // Calculate progress percentage
  useEffect(() => {
    const percentage = Math.floor((currentStep / totalSteps) * 100);
    setProgressWidth(`${percentage}%`);
  }, [currentStep, totalSteps]);

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="w-full py-6 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 rounded-full w-7 h-7 flex items-center justify-center text-black font-extrabold shadow-md">
              *
            </div>
            <h1 className="text-2xl font-bold text-white">MYSTAR CBT</h1>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-yellow-400">Step {currentStep} of {totalSteps}</span>
          <span className="ml-auto text-sm font-medium text-gray-400">{Math.floor((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: progressWidth }}
          ></div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container mx-auto px-4 py-10 flex flex-col">
        <div className="w-full max-w-2xl mx-auto bg-gray-900 rounded-lg p-8 shadow-lg">
          {children}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="container mx-auto px-4 py-6">
        <div className="w-full max-w-2xl mx-auto flex justify-between">
          {!hideBackButton && (
            <button 
              onClick={onBack}
              disabled={isBackDisabled}
              className={`px-6 py-2 rounded ${
                isBackDisabled 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              Back
            </button>
          )}
          <div className={hideBackButton ? 'w-full flex justify-end' : ''}>
            <button 
              onClick={onNext}
              disabled={isNextDisabled}
              className={`px-6 py-2 rounded ${
                isNextDisabled 
                  ? 'bg-yellow-700 text-gray-300 cursor-not-allowed' 
                  : 'bg-yellow-500 hover:bg-yellow-400 text-black font-semibold'
              }`}
            >
              {nextButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardContainer; 