import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardContainer from './WizardContainer';
import { apiService } from '../../utils/api';
import { showError, showSuccess, showInfo, showWarning, showLoading, dismissToast } from '../../utils/toast';

const SetupComplete: React.FC = () => {
  const navigate = useNavigate();
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [setupVerified, setSetupVerified] = useState(false);

  // When component mounts, verify setup is complete using the API
  useEffect(() => {
    const verifySetupStatus = async () => {
      try {
        setIsMarkingComplete(true);
        const loadingToastId = showLoading('Verifying setup completion...');
        
        // Check setup status with API
        const response = await apiService.getSetupStatus();
        
        if (response.data.statusCode === 200) {
          const isSetupComplete = response.data.data;
          dismissToast(loadingToastId);
          
          if (isSetupComplete) {
            // Setup is verified as complete
            setSetupVerified(true);
            showSuccess('Setup verified as complete!');
            // Mark as complete in localStorage
            localStorage.setItem('isSetupComplete', 'true');
          } else {
            // API indicates setup is not complete
            showWarning('Setup verification indicates setup is not complete. This is unusual. You may continue to the dashboard.');
          }
        } else {
          dismissToast(loadingToastId);
          showError(response.data.message || 'Failed to verify setup status.');
        }
        
        setIsMarkingComplete(false);
      } catch (err: any) {
        console.error('Failed to verify setup status:', err);
        showError('Failed to verify setup status. You can still proceed to dashboard.');
        setIsMarkingComplete(false);
      }
    };

    verifySetupStatus();
  }, []);

  const handleGoToDashboard = () => {
    // Clear setup progress since it's complete
    localStorage.removeItem('setupProgress');
    showInfo('Redirecting to dashboard...');
    navigate('/dashboard');
  };

  return (
    <WizardContainer
      currentStep={3}
      totalSteps={3}
      onNext={handleGoToDashboard}
      hideBackButton={true}
      nextButtonText={isMarkingComplete ? "Verifying..." : "Go to Dashboard"}
      isNextDisabled={isMarkingComplete}
    >
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-500 rounded-full w-20 h-20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Setup Complete!</h2>
        
        <p className="text-gray-300 mb-8">
          Congratulations! You have successfully set up your school on MYSTAR CBT.
          You're now ready to start managing your students, teachers, and exams.
        </p>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-8 text-left">
          <h3 className="text-lg font-semibold mb-3">What's Next?</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Add more classes and arms as needed</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Invite teachers to join your school</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Register your students</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Create your first exam</span>
            </li>
          </ul>
        </div>
      </div>
    </WizardContainer>
  );
};

export default SetupComplete; 