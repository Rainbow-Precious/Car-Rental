import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface TeacherRegistrationProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Campus {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  capacity?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Class {
  classId: string;
  className: string;
  campusId: string;
  campusName: string;
  arms: {
    armId: string;
    armName: string;
  }[];
}

interface Arm {
  armId: string;
  armName: string;
  armDescription?: string;
  classId: string;
}

const TeacherRegistration: React.FC<TeacherRegistrationProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: 'Male',
    campusId: '',
    classId: '',
    armId: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [arms, setArms] = useState<Arm[]>([]);
  
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [filteredArms, setFilteredArms] = useState<Arm[]>([]);
  
  useEffect(() => {
    fetchCampuses();
    fetchClasses();
  }, []);
  
  useEffect(() => {
    // Filter classes based on selected campus
    if (formData.campusId) {
      setFilteredClasses(classes.filter(c => 
        c.campusId === formData.campusId
      ));
      // Reset class and arm when campus changes
      setFormData(prev => ({ ...prev, classId: '', armId: '' }));
    } else {
      setFilteredClasses([]);
    }
  }, [formData.campusId, classes]);
  
  useEffect(() => {
    // Filter arms based on selected class
    if (formData.classId) {
      const selectedClass = classes.find(c => c.classId === formData.classId);
      if (selectedClass && selectedClass.arms) {
        // Add classId to each arm for TypeScript compatibility
        const armsWithClassId = selectedClass.arms.map(arm => ({
          ...arm,
          classId: formData.classId
        }));
        setFilteredArms(armsWithClassId);
      }
      // Reset arm when class changes
      setFormData(prev => ({ ...prev, armId: '' }));
    } else {
      setFilteredArms([]);
    }
  }, [formData.classId, classes]);
  
  const fetchCampuses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication token is missing');
        return;
      }
      
      const response = await axios.get('http://159.65.31.191/api/Tenant/campuses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });
      
      if (response.data.statusCode === 200) {
        setCampuses(response.data.data || []);
      } else {
        setError('Failed to fetch campuses');
      }
    } catch (err: any) {
      console.error('Error fetching campuses:', err);
      setError(err.response?.data?.message || 'Error fetching campuses');
    }
  };
  
  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication token is missing');
        return;
      }
      
      const response = await axios.get('http://159.65.31.191/api/Class/all-with-arms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });
      
      if (response.data.statusCode === 200) {
        setClasses(response.data.data || []);
      } else {
        setError('Failed to fetch classes');
      }
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      setError(err.response?.data?.message || 'Error fetching classes');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication token is missing');
        setLoading(false);
        return;
      }
      
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      if (!formData.campusId || !formData.classId || !formData.armId) {
        setError('Please select Campus, Class and Arm');
        setLoading(false);
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
      
      // Create request data matching the exact API specification
      const requestData = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        gender: formData.gender,
        classId: formData.classId,
        armId: formData.armId,
        campusId: formData.campusId
      };
      
      console.log('Sending teacher registration data:', requestData);
      
      const response = await axios.post(
        'http://159.65.31.191/api/Tenant/register-teacher',
        requestData,
        {
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Teacher registration response:', response.data);
      
      // Check for successful registration (statusCode 200 as per API spec)
      if (response.data.statusCode === 200) {
        setSuccess(true);
        toast.success('Teacher created with default password. Must change password on first login.');
        
        // Reset form
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          gender: 'Male',
          campusId: '',
          classId: '',
          armId: '',
        });
        
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setError(response.data.message || 'Failed to register teacher');
        toast.error(response.data.message || 'Failed to register teacher');
      }
    } catch (err: any) {
      console.error('Teacher registration error:', err);
      if (err.response && err.response.data) {
        console.error('Error details:', err.response.data);
        const errorMessage = err.response.data.message || err.response.data.title || 'An error occurred while registering the teacher';
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err.message) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Network error. Please check your connection and try again.');
        toast.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Teacher Registration Successful!</h2>
          <p className="text-gray-400 mb-2">
            <strong>{formData.firstName} {formData.lastName}</strong> has been registered successfully.
          </p>
          <p className="text-gray-400 mb-6">
            The teacher has been created with a default password that they must change on first login.
          </p>
          <div className="space-y-3">
            <button
              onClick={onSuccess}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Back to Teacher Management
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  firstName: '',
                  middleName: '',
                  lastName: '',
                  email: '',
                  phoneNumber: '',
                  gender: 'Male',
                  campusId: '',
                  classId: '',
                  armId: '',
                });
              }}
              className="w-full bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Another Teacher
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-2">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Register New Teacher</h2>
        </div>
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-lg mb-6 shadow-lg flex items-center">
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-auto text-white hover:text-red-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h3 className="text-gray-300 text-sm font-semibold mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
                placeholder="Enter first name"
              />
            </div>
            
            <div>
              <label htmlFor="middleName" className="block text-sm font-medium text-gray-300 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
                placeholder="Enter middle name (optional)"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h3 className="text-gray-300 text-sm font-semibold mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
                placeholder="teacher@school.com"
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
                placeholder="08012345678"
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* School Assignment Section */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h3 className="text-gray-300 text-sm font-semibold mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            School Assignment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="campusId" className="block text-sm font-medium text-gray-300 mb-1">
                Campus <span className="text-red-500">*</span>
              </label>
              <select
                id="campusId"
                name="campusId"
                value={formData.campusId}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
              >
                <option value="">Select Campus</option>
                {campuses.map(campus => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="classId" className="block text-sm font-medium text-gray-300 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading || !formData.campusId}
              >
                <option value="">Select Class</option>
                {filteredClasses.map(cls => (
                  <option key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="armId" className="block text-sm font-medium text-gray-300 mb-1">
                Arm <span className="text-red-500">*</span>
              </label>
              <select
                id="armId"
                name="armId"
                value={formData.armId}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading || !formData.classId}
              >
                <option value="">Select Arm</option>
                {filteredArms.map(arm => (
                  <option key={arm.armId} value={arm.armId}>
                    {arm.armName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center justify-center"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering Teacher...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register Teacher
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherRegistration; 