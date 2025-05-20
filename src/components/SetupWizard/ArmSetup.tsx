import React, { useState } from 'react';
import WizardContainer from './WizardContainer';
import { apiService } from '../../utils/api';
import { showError, showSuccess, showLoading, dismissToast } from '../../utils/toast';

interface ArmSetupProps {
  onComplete: () => void;
  onBack: () => void;
  classId: string;
  className: string;
}

const ArmSetup: React.FC<ArmSetupProps> = ({ onComplete, onBack, classId, className }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'name' && error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Arm name is required');
      showError('Arm name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const loadingToastId = showLoading('Creating arm...');

    try {
      const response = await apiService.createArm({
        name: formData.name,
        description: formData.description || undefined,
        classId: classId
      });

      if (response.data.statusCode === 201) {
        // Setup complete, move to completion or dashboard
        dismissToast(loadingToastId);
        showSuccess(`Arm ${formData.name} created successfully! Setup complete.`);
        onComplete();
      } else {
        dismissToast(loadingToastId);
        showError(response.data.message || 'Failed to create class arm. Please try again.');
      }
    } catch (err: any) {
      console.error('Arm setup error:', err);
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
      currentStep={3}
      totalSteps={3}
      onNext={handleSubmit}
      onBack={onBack}
      isNextDisabled={isLoading}
      nextButtonText={isLoading ? 'Creating...' : 'Complete Setup'}
    >
      <h2 className="text-2xl font-bold text-center mb-6">Add Class Arm</h2>
      
      <p className="text-gray-400 mb-6 text-center">
        Finally, create an arm for your "{className}" class. Arms help to divide students into different sections within the same class.
      </p>
      
      <div className="space-y-6">
        <div className="p-4 border border-gray-700 rounded bg-gray-800/50">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Arm Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., A, Science, Red"
                className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Common examples: A, B, C or Gold, Blue, Green or Science, Arts, Commercial.
              </p>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Arm Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of this arm"
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

export default ArmSetup; 