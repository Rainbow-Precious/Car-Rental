import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CampusSetup from './CampusSetup';
import ClassSetup from './ClassSetup';
import ArmSetup from './ArmSetup';
import SetupComplete from './SetupComplete';
import { apiService } from '../../utils/api';
import { showError, showInfo, showLoading, dismissToast } from '../../utils/toast';
import Spinner from '../common/Spinner';

// Setup stages from API
export enum SetupStage {
  Campus = 'campus',
  Class = 'class',
  Arm = 'arm',
  Complete = 'complete'
}

// Map numeric progress to stage
const progressToStage = (progress: number): SetupStage => {
  switch(progress) {
    case 0: return SetupStage.Campus;
    case 1: return SetupStage.Class;
    case 2: return SetupStage.Arm;
    case 3: return SetupStage.Complete;
    default: return SetupStage.Campus;
  }
};

// Map stage to numeric progress
const stageToProgress = (stage: SetupStage): number => {
  switch(stage) {
    case SetupStage.Campus: return 0;
    case SetupStage.Class: return 1;
    case SetupStage.Arm: return 2;
    case SetupStage.Complete: return 3;
    default: return 0;
  }
};

interface SetupWizardProps {
  initialStage?: SetupStage;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ initialStage = SetupStage.Campus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Stored data from previous steps
  const [campusId, setCampusId] = useState<string>('');
  const [campusName, setCampusName] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  
  // Initialize with state from location or localStorage or prop
  const getInitialStage = (): SetupStage => {
    // First check URL state (from redirect)
    if ((location.state as any)?.initialStage) {
      return (location.state as any).initialStage as SetupStage;
    }
    
    // Then check localStorage
    const savedProgress = localStorage.getItem('setupProgress');
    if (savedProgress !== null) {
      return progressToStage(parseInt(savedProgress, 10));
    }
    
    // Default to provided initialStage prop
    return initialStage;
  };
  
  const [currentStage, setCurrentStage] = useState<SetupStage>(getInitialStage());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and setup status on component mount
  useEffect(() => {
    const checkAuthAndSetup = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/signin');
        return;
      }
      
      const loadingToastId = showLoading('Checking setup status...');
      
      // Check if setup is already complete
      try {
        const response = await apiService.getSetupStatus();
        
        if (response.data.statusCode === 200) {
          const isSetupComplete = response.data.data;
          
          if (isSetupComplete) {
            // Setup is already complete, redirect to dashboard
            dismissToast(loadingToastId);
            showInfo('Setup is already complete. Redirecting to dashboard...');
            localStorage.setItem('isSetupComplete', 'true');
            navigate('/dashboard');
            return; // Don't continue with the rest of the function
          }
          
          // If we're still here, check the current progress
          try {
            const progressResponse = await apiService.getSetupProgress();
            
            if (progressResponse.data.statusCode === 200) {
              const progressData = progressResponse.data.data;
              
              // Set the correct stage based on API response
              const currentStage = progressToStage(progressData.currentStage);
              setCurrentStage(currentStage);
              localStorage.setItem('setupProgress', progressData.currentStage.toString());
              
              dismissToast(loadingToastId);
              showInfo(`Resuming setup at ${currentStage} stage...`);
              
              // Store IDs for existing entities
              if (progressData.campusId) {
                setCampusId(progressData.campusId);
                localStorage.setItem('setupCampusId', progressData.campusId);
                
                // We'll temporarily use school name as campus name - ideally we'd make an API call to get the actual campus name
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                setCampusName(userInfo.schoolName || 'Your Campus');
                localStorage.setItem('setupCampusName', userInfo.schoolName || 'Your Campus');
              }
              
              if (progressData.classId) {
                setClassId(progressData.classId);
                localStorage.setItem('setupClassId', progressData.classId);
                setClassName('Your Class'); // Fallback name
                localStorage.setItem('setupClassName', 'Your Class');
              }
            } else {
              dismissToast(loadingToastId);
            }
          } catch (progressErr) {
            console.error('Failed to check setup progress:', progressErr);
            dismissToast(loadingToastId);
            // Continue with localStorage data if available
          }
        } else {
          dismissToast(loadingToastId);
        }
      } catch (err) {
        console.error('Failed to check setup status:', err);
        dismissToast(loadingToastId);
        showError('Failed to check setup status. Using available cached data.');
        // Continue with the wizard anyway
      }
    };
    
    checkAuthAndSetup();

    // Try to restore saved IDs from localStorage if any
    const savedCampusId = localStorage.getItem('setupCampusId');
    const savedCampusName = localStorage.getItem('setupCampusName');
    const savedClassId = localStorage.getItem('setupClassId');
    const savedClassName = localStorage.getItem('setupClassName');
    
    if (savedCampusId) setCampusId(savedCampusId);
    if (savedCampusName) setCampusName(savedCampusName);
    if (savedClassId) setClassId(savedClassId);
    if (savedClassName) setClassName(savedClassName);
  }, [navigate]);

  // Update setupProgress in localStorage
  const updateProgress = (newStage: SetupStage) => {
    const newProgress = stageToProgress(newStage);
    localStorage.setItem('setupProgress', newProgress.toString());
    setCurrentStage(newStage);
    showInfo(`Moving to ${newStage} stage...`);
  };

  // Handle stage transitions
  const handleCampusComplete = (campusId: string, campusName: string) => {
    // Store campus data for later
    setCampusId(campusId);
    setCampusName(campusName);
    
    // Save to localStorage for persistence in case of refresh
    localStorage.setItem('setupCampusId', campusId);
    localStorage.setItem('setupCampusName', campusName);
    
    updateProgress(SetupStage.Class);
  };

  const handleClassComplete = (classId: string, className: string) => {
    // Store class data for arm setup
    setClassId(classId);
    setClassName(className);
    
    // Save to localStorage for persistence
    localStorage.setItem('setupClassId', classId);
    localStorage.setItem('setupClassName', className);
    
    updateProgress(SetupStage.Arm);
  };

  const handleArmComplete = () => {
    updateProgress(SetupStage.Complete);
    
    // Mark setup as complete in localStorage
    localStorage.setItem('isSetupComplete', 'true');
    
    // Clear the individual step data since setup is now complete
    localStorage.removeItem('setupCampusId');
    localStorage.removeItem('setupCampusName');
    localStorage.removeItem('setupClassId');
    localStorage.removeItem('setupClassName');
  };

  const handleBackToClass = () => {
    updateProgress(SetupStage.Class);
  };

  const handleBackToCampus = () => {
    updateProgress(SetupStage.Campus);
  };

  // Render the appropriate step based on current stage
  const renderCurrentStep = () => {
    // First check if we need to make an immediate API call to check progress
    // This is useful when the component is mounted directly without going through login
    const checkProgressAndRender = async () => {
      try {
        const progressResponse = await apiService.getSetupProgress();
        
        if (progressResponse.data.statusCode === 200) {
          const progressData = progressResponse.data.data;
          
          // Set the correct stage based on API response
          const newStage = progressToStage(progressData.currentStage);
          setCurrentStage(newStage);
          localStorage.setItem('setupProgress', progressData.currentStage.toString());
          
          // Store IDs for existing entities
          if (progressData.campusId) {
            setCampusId(progressData.campusId);
            localStorage.setItem('setupCampusId', progressData.campusId);
            
            // We'll temporarily use school name as campus name
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            setCampusName(userInfo.schoolName || 'Your Campus');
            localStorage.setItem('setupCampusName', userInfo.schoolName || 'Your Campus');
          }
          
          if (progressData.classId) {
            setClassId(progressData.classId);
            localStorage.setItem('setupClassId', progressData.classId);
            setClassName('Your Class'); // Fallback name
            localStorage.setItem('setupClassName', 'Your Class');
          }
        }
      } catch (err) {
        console.error('Failed to check progress:', err);
      }
    };

    // Now render based on the current stage
    switch (currentStage) {
      case SetupStage.Campus:
        // Check if we already have a campusId from the progress API
        if (campusId) {
          // If we already have a campus, automatically proceed to the class setup
          setTimeout(() => {
            updateProgress(SetupStage.Class);
          }, 100);
          return (
            <div className="flex items-center justify-center h-screen">
              <Spinner size="lg" text="Campus already set up. Proceeding to next step..." />
            </div>
          );
        }
        return <CampusSetup onComplete={handleCampusComplete} />;
        
      case SetupStage.Class:
        // Check if we already have a classId from the progress API
        if (classId) {
          // If we already have a class, automatically proceed to the arm setup
          setTimeout(() => {
            updateProgress(SetupStage.Arm);
          }, 100);
          return (
            <div className="flex items-center justify-center h-screen">
              <Spinner size="lg" text="Class already set up. Proceeding to next step..." />
            </div>
          );
        }
        return (
          <>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 max-w-3xl mx-auto">
                <p>{error}</p>
              </div>
            )}
            {campusId ? (
              <ClassSetup 
                onComplete={handleClassComplete} 
                onBack={handleBackToCampus} 
                campusId={campusId}
                campusName={campusName}
              />
            ) : (
              <div className="text-center p-8">
                <p className="text-red-400">Campus data is missing. Please refresh to check your progress.</p>
                <button 
                  onClick={checkProgressAndRender}
                  className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
                >
                  Check Progress
                </button>
              </div>
            )}
          </>
        );
        
      case SetupStage.Arm:
        return (
          <>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 max-w-3xl mx-auto">
                <p>{error}</p>
              </div>
            )}
            {classId ? (
              <ArmSetup 
                onComplete={handleArmComplete} 
                onBack={handleBackToClass} 
                classId={classId}
                className={className}
              />
            ) : (
              <div className="text-center p-8">
                <p className="text-red-400">Class data is missing. Please refresh to check your progress.</p>
                <button 
                  onClick={checkProgressAndRender}
                  className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
                >
                  Check Progress
                </button>
              </div>
            )}
          </>
        );
        
      case SetupStage.Complete:
        return <SetupComplete />;
        
      default:
        return <CampusSetup onComplete={handleCampusComplete} />;
    }
  };

  return (
    <div>
      {renderCurrentStep()}
    </div>
  );
};

export default SetupWizard; 