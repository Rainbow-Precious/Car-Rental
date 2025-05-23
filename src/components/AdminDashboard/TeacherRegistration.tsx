import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TeacherRegistrationProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Campus {
  id: string;
  name: string;
}

interface Class {
  id?: string;
  classId?: string;
  name?: string;
  className?: string;
  campusId?: string;
}

interface Arm {
  id?: string;
  armId?: string;
  name?: string;
  armName?: string;
  classId?: string;
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
  }, []);
  
  useEffect(() => {
    if (formData.campusId) {
      fetchClasses(formData.campusId);
    }
  }, [formData.campusId]);
  
  useEffect(() => {
    if (formData.classId) {
      fetchArms(formData.classId);
    }
  }, [formData.classId]);
  
  useEffect(() => {
    // Filter classes based on selected campus
    if (formData.campusId) {
      setFilteredClasses(classes.filter(c => 
        (c.campusId === formData.campusId)
      ));
    } else {
      setFilteredClasses([]);
    }
  }, [formData.campusId, classes]);
  
  useEffect(() => {
    // Filter arms based on selected class
    if (formData.classId) {
      setFilteredArms(arms.filter(a => 
        (a.classId === formData.classId)
      ));
    } else {
      setFilteredArms([]);
    }
  }, [formData.classId, arms]);
  
  const fetchCampuses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Debug: log whether token exists
      console.log('Auth token exists:', !!token);
      
      if (!token) {
        setError('Authentication token is missing');
        return;
      }
      
      const response = await axios.get('http://159.65.31.191/api/Campus/get-all-campus', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.statusCode === 200) {
        setCampuses(response.data.data);
      } else {
        setError('Failed to fetch campuses');
      }
    } catch (err: any) {
      console.error('Error fetching campuses:', err);
      setError(err.response?.data?.message || 'Error fetching campuses');
    }
  };
  
  const fetchClasses = async (campusId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication token is missing');
        return;
      }
      
      const response = await axios.get(`http://159.65.31.191/api/Class/get-classes-by-campus?campusId=${campusId}`, {
        headers: {
          Authorization: `Bearer ${token}`
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
  
  const fetchArms = async (classId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication token is missing');
        return;
      }
      
      const response = await axios.get(`http://159.65.31.191/api/Arm/get-arm-by-class?classId=${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.statusCode === 200) {
        setArms(response.data.data || []);
      } else {
        setError('Failed to fetch arms');
      }
    } catch (err: any) {
      console.error('Error fetching arms:', err);
      setError(err.response?.data?.message || 'Error fetching arms');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any previous errors when user starts typing
    setError('');
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
      
      // Log the data being sent to help debugging
      console.log('Sending teacher registration data:', formData);
      
      // Create a new object to ensure we're sending exactly the format the API expects
      const requestData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        classId: formData.classId,
        armId: formData.armId,
        campusId: formData.campusId
      };
      
      const response = await axios.post(
        'http://159.65.31.191/api/Tenant/register-teacher',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Teacher registration response:', response.data);
      
      if (response.data.statusCode === 200) {
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setError(response.data.message || 'Failed to register teacher');
      }
    } catch (err: any) {
      console.error('Teacher registration error:', err);
      if (err.response && err.response.data) {
        console.error('Error details:', err.response.data);
        setError(err.response.data.message || 'An error occurred while registering the teacher');
      } else {
        setError('An error occurred while registering the teacher. Please check the console for details.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
        <div className="text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-xl font-bold text-white mt-4">Teacher Registration Successful!</h2>
          <p className="text-gray-400 mt-2">The teacher has been created with a default password that they must change on first login.</p>
          <button
            onClick={onSuccess}
            className="mt-6 bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400 transition-colors"
          >
            Back to Teacher Management
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Register New Teacher</h2>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              disabled={loading}
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
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={loading}
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
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              disabled={loading}
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
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              disabled={loading}
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
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              disabled={loading}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="campusId" className="block text-sm font-medium text-gray-300 mb-1">
              Campus <span className="text-red-500">*</span>
            </label>
            <select
              id="campusId"
              name="campusId"
              value={formData.campusId}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              disabled={loading}
            >
              <option value="">Select Campus</option>
              {campuses.map(campus => (
                <option key={campus.id} value={campus.id}>{campus.name}</option>
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
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              disabled={loading || !formData.campusId}
            >
              <option value="">Select Class</option>
              {filteredClasses.map(cls => (
                <option key={cls.classId || cls.id} value={cls.classId || cls.id}>
                  {cls.className || cls.name}
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
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              disabled={loading || !formData.classId}
            >
              <option value="">Select Arm</option>
              {filteredArms.map(arm => (
                <option key={arm.armId || arm.id} value={arm.armId || arm.id}>
                  {arm.armName || arm.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 focus:outline-none flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register Teacher'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherRegistration; 