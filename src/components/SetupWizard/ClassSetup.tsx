import React, { useState } from 'react';
import WizardContainer from './WizardContainer';
import { apiService } from '../../utils/api';
import { showError, showSuccess, showLoading, dismissToast } from '../../utils/toast';

interface ClassSetupProps {
  onComplete: (classId: string, className: string) => void;
  onBack: () => void;
  campusId: string;
  campusName: string;
}

const ClassSetup: React.FC<ClassSetupProps> = ({ onComplete, onBack, campusId, campusName }) => {
  const [formData, setFormData] = useState({
    className: '',
    description: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'className' && error) setError(null);
  };

  const validateForm = () => {
    if (!formData.className.trim()) {
      setError('Class name is required');
      showError('Class name is required');
      return false;
    } else if (formData.className.length < 2) {
      setError('Class name must be at least 2 characters');
      showError('Class name must be at least 2 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const loadingToastId = showLoading('Creating class...');

    try {
      const response = await apiService.createClass({ 
        name: formData.className,
        campusId: campusId,
        description: formData.description || undefined
      });

      if (response.data.statusCode === 201) {
        const { entityId, entityName } = response.data.data;
        dismissToast(loadingToastId);
        showSuccess(`Class ${entityName} created successfully!`);
        onComplete(entityId, entityName);
      } else {
        dismissToast(loadingToastId);
        showError(response.data.message || 'Failed to create class. Please try again.');
      }
    } catch (err: any) {
      console.error('Class setup error:', err);
      dismissToast(loadingToastId);
      
      if (err.response?.data?.message) {
        showError(err.response.data.message);
      } else if (err.message) {
        showError(err.message);
      } else {
        showError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WizardContainer
      currentStep={2}
      totalSteps={3}
      onNext={handleSubmit}
      onBack={onBack}
      isNextDisabled={isLoading}
      nextButtonText={isLoading ? 'Creating...' : 'Next: Arm Setup'}
    >
      <h2 className="text-2xl font-bold text-center mb-6">Create a Class</h2>
      
      <p className="text-gray-400 mb-6 text-center">
        Next, let's add a class to your "{campusName}" campus. Classes help organize students into academic years or grades.
      </p>
      
      <div className="space-y-6">
        <div className="p-4 border border-gray-700 rounded bg-gray-800/50">
          <div className="space-y-4">
            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                Class Name*
              </label>
              <input
                type="text"
                id="className"
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="e.g., JSS1, Primary 3, Grade 10"
                className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Use standard class naming that will be easy for students and teachers to recognize.
              </p>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of this class"
                rows={2}
                className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500 resize-none"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          <p>* Required field</p>
        </div>
      </div>
    </WizardContainer>
  );
};

export default ClassSetup; 