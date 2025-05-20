import React, { useState } from 'react';
import WizardContainer from './WizardContainer';
import { apiService } from '../../utils/api';
import { showError, showSuccess, showLoading, dismissToast } from '../../utils/toast';

interface CampusSetupProps {
  onComplete: (campusId: string, campusName: string) => void;
}

const CampusSetup: React.FC<CampusSetupProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phoneNumber: '',
    email: '',
    capacity: '100'
  });
  
  const [errors, setErrors] = useState<{ 
    name?: string; 
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phoneNumber?: string;
    capacity?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { 
      name?: string; 
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      phoneNumber?: string;
      capacity?: string;
    } = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Campus name is required';
      isValid = false;
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'Campus name must be between 2 and 100 characters';
      isValid = false;
    }

    // Required fields validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
      isValid = false;
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
      isValid = false;
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    }
    
    // Capacity validation
    const capacityNum = parseInt(formData.capacity, 10);
    if (isNaN(capacityNum) || capacityNum < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
      isValid = false;
    }

    setErrors(newErrors);
    
    // Show toast for validation errors
    if (!isValid) {
      const errorMessages = Object.values(newErrors).filter(Boolean);
      if (errorMessages.length > 0) {
        showError(errorMessages[0] as string);
      }
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const loadingToastId = showLoading('Creating campus...');
    
    try {
      const campusData = {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
        description: formData.description || undefined,
        email: formData.email || undefined
      };
      
      const response = await apiService.createCampus(campusData);
      
      if (response.data.statusCode === 201) {
        const { entityId, entityName } = response.data.data;
        dismissToast(loadingToastId);
        showSuccess(`Campus ${entityName} created successfully!`);
        onComplete(entityId, entityName);
      } else {
        dismissToast(loadingToastId);
        showError(response.data.message || 'Failed to create campus. Please try again.');
      }
    } catch (err: any) {
      console.error('Campus setup error:', err);
      dismissToast(loadingToastId);
      
      if (err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WizardContainer
      currentStep={1}
      totalSteps={3}
      onNext={handleSubmit}
      isNextDisabled={isLoading}
      hideBackButton={true}
      nextButtonText={isLoading ? 'Creating...' : 'Next: Class Setup'}
    >
      <h2 className="text-2xl font-bold text-center mb-6">Set Up Your Campus</h2>
      
      <p className="text-gray-400 mb-8 text-center">
        Let's start by creating your first campus. This is where your students and staff will be located.
      </p>
      
      <div className="space-y-6">
        {/* Required Fields */}
        <div className="p-4 border border-gray-700 rounded bg-gray-800/50">
          <h3 className="text-lg font-semibold mb-3">Required Information</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Campus Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Main Campus, North Wing"
                className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                Campus Address*
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full physical address"
                rows={2}
                className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500 resize-none"
                disabled={isLoading}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-400">{errors.address}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                  City*
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Lagos"
                  className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                  disabled={isLoading}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-400">{errors.city}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
                  State*
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g., Lagos State"
                  className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                  disabled={isLoading}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-400">{errors.state}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                  Country*
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., Nigeria"
                  className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                  disabled={isLoading}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-400">{errors.country}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g., 08012345678"
                  className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                  disabled={isLoading}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-1">
                Capacity*
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 500"
                min="1"
                className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                disabled={isLoading}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-400">{errors.capacity}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Optional Fields */}
        <div className="p-4 border border-gray-700 rounded bg-gray-800/50">
          <h3 className="text-lg font-semibold mb-3">Additional Information (Optional)</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your campus"
                rows={2}
                className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500 resize-none"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Campus Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., campus@school.com"
                className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          <p>* Required fields</p>
        </div>
      </div>
    </WizardContainer>
  );
};

export default CampusSetup; 