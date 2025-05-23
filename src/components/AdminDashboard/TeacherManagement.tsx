import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import Spinner from "../common/Spinner";
import api from "../../utils/api";
import { createPortal } from "react-dom";
import TeacherRegistration from './TeacherRegistration';

// Define Teacher interface
interface Teacher {
  id: string;
  userId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  email: string;
  classId: string;
  className?: string;
  armId: string;
  armName?: string;
  campusId: string;
  campusName?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  mustChangePassword?: boolean;
  subjectSpecialization?: string | null;
  subjects?: string[];
}

// Class and Arm interfaces
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
  armDescription: string;
  classId: string;
  className: string;
  tenantId: string;
  studentCount: number;
  createdAt: string;
  campuses: any[];
}

interface Campus {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  email: string;
  capacity: number;
  isActive: boolean;
  studentCount: number;
  teacherCount: number;
}

// Teacher form data interface
interface TeacherFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  classId: string;
  armId: string;
  campusId: string;
}

const TeacherManagement: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [arms, setArms] = useState<Arm[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeDropdownPos, setActiveDropdownPos] = useState<{ top: number, left: number } | null>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newTeacherData, setNewTeacherData] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form data state
  const [formData, setFormData] = useState<TeacherFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "Male", // Default value
    classId: "",
    armId: "",
    campusId: ""
  });

  // Fetch data from the API
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch teachers
      const teachersResponse = await api.get('/Tenant/teachers');
      
      // Fetch campuses
      const campusesResponse = await api.get('/Tenant/campuses');
      
      // Fetch arms
      const armsResponse = await api.get('/Tenant/arms');
      
      // Fetch classes
      const classesResponse = await api.get('/Class/all-with-arms');

      if (teachersResponse.data.statusCode === 200) {
        setTeachers(teachersResponse.data.data || []);
      } else {
        console.error("Teacher API error:", teachersResponse.data);
        setError(`Error fetching teachers: ${teachersResponse.data.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }
      
      if (campusesResponse.data.statusCode === 200) {
        setCampuses(campusesResponse.data.data || []);
      } else {
        console.error("Campus API error:", campusesResponse.data);
      }
      
      if (armsResponse.data.statusCode === 200) {
        setArms(armsResponse.data.data || []);
      } else {
        console.error("Arms API error:", armsResponse.data);
      }
      
      if (classesResponse.data.statusCode === 200) {
        setClasses(classesResponse.data.data || []);
      } else {
        console.error("Classes API error:", classesResponse.data);
      }
      
      // Always set loading to false even if some requests failed
      setLoading(false);
        
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  // Add useEffect to fetch data on mount
  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    // Create a flag to prevent state updates after unmount
    let isSubscribed = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch teachers
        const teachersResponse = await api.get('/Tenant/teachers');
        
        // Fetch campuses
        const campusesResponse = await api.get('/Tenant/campuses');
        
        // Fetch arms
        const armsResponse = await api.get('/Tenant/arms');
        
        // Fetch classes
        const classesResponse = await api.get('/Class/all-with-arms');

        // Only update state if component is still mounted
        if (isSubscribed) {
          if (teachersResponse.data.statusCode === 200) {
            setTeachers(teachersResponse.data.data || []);
          } else {
            console.error("Teacher API error:", teachersResponse.data);
            setError(`Error fetching teachers: ${teachersResponse.data.message || 'Unknown error'}`);
          }
          
          if (campusesResponse.data.statusCode === 200) {
            setCampuses(campusesResponse.data.data || []);
          }
          
          if (armsResponse.data.statusCode === 200) {
            setArms(armsResponse.data.data || []);
          }
          
          if (classesResponse.data.statusCode === 200) {
            setClasses(classesResponse.data.data || []);
          }
          
          // Always set loading to false
          setLoading(false);
        }
      } catch (err: any) {
        // Only update state if component is still mounted
        if (isSubscribed) {
          console.error("Failed to fetch data:", err);
          setError(err.message || "Failed to fetch data");
          setLoading(false);
        }
      }
    };

    loadData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isSubscribed = false;
    };
  }, [navigate]); // Only run on mount and when navigate changes

  const handleAddTeacher = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setFormError(null);
    setFormSuccess(null);
    // Reset form data
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "Male",
      classId: "",
      armId: "",
      campusId: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // This function should be placed right after handleInputChange
  // Filter arms based on selected class using the embedded arms in the class data
  const getFilteredArms = () => {
    if (!formData.classId) return arms; // Return all arms if no class is selected
    
    // Find the selected class
    const selectedClass = classes.find(cls => cls.classId === formData.classId);
    
    // If the class has arms embedded, return those first
    if (selectedClass && selectedClass.arms && selectedClass.arms.length > 0) {
      return selectedClass.arms;
    }
    
    // Fallback to the regular arm filtering if the embedded arms aren't available
    return arms.filter(arm => arm.classId === formData.classId);
  };

  const handleInviteTeacher = async (formData: any) => {
    try {
      setSubmitting(true);
      
      const response = await api.post('/Tenant/register-teacher', formData);

      if (response.data.statusCode === 201) {
        // Handle success
        setShowAddForm(false);
        await fetchData(); // Refresh the list
        setFormSuccess("Teacher invited successfully!");
      } else {
        setFormError(response.data.message || "Failed to invite teacher");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to invite teacher");
    } finally {
      setSubmitting(false);
    }
  };

  // Function to handle opening the dropdown
  const handleOpenDropdown = (teacherId: string) => {
    if (activeDropdown === teacherId) {
      setActiveDropdown(null);
      setActiveDropdownPos(null);
      return;
    }

    const buttonElement = actionButtonRefs.current[teacherId];
    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      setActiveDropdownPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX - 120 // Position to the left of the button
      });
      setActiveDropdown(teacherId);
    }
  };

  // Table headers that will be shown even when empty
  const tableHeaders = (
    <thead>
      <tr className="bg-gray-700">
        <th className="p-3 text-left text-white">Name</th>
        <th className="p-3 text-left text-white">Email</th>
        <th className="p-3 text-left text-white">Gender</th>
        <th className="p-3 text-left text-white">Phone</th>
        <th className="p-3 text-left text-white">Class/Arm</th>
        <th className="p-3 text-left text-white">Campus</th>
        <th className="p-3 text-center text-white">Actions</th>
      </tr>
    </thead>
  );

  // Teacher registration form modal
  const teacherForm = (
    <div className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center ${showAddForm ? 'block' : 'hidden'}`}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-500 rounded-lg p-1.5">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Add New Teacher</h2>
          </div>
          <button 
            onClick={handleCloseForm} 
            className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-1.5 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {formError && (
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-3 rounded-lg mb-4 shadow-lg flex items-center text-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formError}</span>
          </div>
        )}
        
        {formSuccess && (
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-3 rounded-lg mb-4 shadow-lg flex items-center text-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{formSuccess}</span>
          </div>
        )}
        
        <form onSubmit={handleInviteTeacher} className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <h3 className="text-gray-300 text-sm font-semibold mb-3 flex items-center">
              <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={submitting}
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  disabled={submitting}
                  placeholder="Middle name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={submitting}
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <h3 className="text-gray-300 text-sm font-semibold mb-3 flex items-center">
              <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={submitting}
                  placeholder="teacher@school.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={submitting}
                  placeholder="e.g. 08012345678"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <h3 className="text-gray-300 text-sm font-semibold mb-3 flex items-center">
              <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              School Assignment
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={submitting}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Campus <span className="text-red-500">*</span>
                </label>
                <select
                  name="campusId"
                  value={formData.campusId}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={submitting}
                >
                  <option value="">Select Campus</option>
                  {campuses.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={submitting}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Arm <span className="text-red-500">*</span>
                </label>
                <select
                  name="armId"
                  value={formData.armId}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={submitting}
                >
                  <option value="">Select Arm</option>
                  {/* Filter arms based on selected class */}
                  {getFilteredArms()
                    .map((arm) => (
                      <option key={arm.armId} value={arm.armId}>
                        {arm.armName}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-4 border-t border-gray-700 pt-4">
            <button
              type="button"
              onClick={handleCloseForm}
              className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 text-sm ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Teacher
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && 
          !Object.values(actionButtonRefs.current).some(btn => btn && btn.contains(event.target as Node))) {
        setActiveDropdown(null);
        setActiveDropdownPos(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  // Dropdown menu portal
  const renderDropdownPortal = () => {
    if (!activeDropdown || !activeDropdownPos) return null;
    
    return createPortal(
      <div 
        className="fixed z-50 w-48 bg-gray-800 rounded-lg shadow-xl py-1 border border-gray-700"
        style={{
          top: `${activeDropdownPos.top}px`,
          left: `${activeDropdownPos.left}px`,
        }}
      >
        <Link
          to={`/admin/teachers/${activeDropdown}`}
          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Details
        </Link>
        <button className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Teacher
        </button>
        <button className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 w-full text-left">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Teacher
        </button>
      </div>,
      document.body
    );
  };

  // Success confirmation modal
  const renderSuccessModal = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center ${showSuccessModal ? 'block' : 'hidden'}`}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg border border-gray-700 relative overflow-hidden">
        {/* Confetti elements */}
        <div className="absolute top-5 left-5 w-3 h-8 bg-yellow-500 transform rotate-45 opacity-70 animate-pulse"></div>
        <div className="absolute top-10 right-10 w-4 h-4 bg-green-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-10 left-20 w-2 h-6 bg-blue-500 transform -rotate-12 opacity-60"></div>
        <div className="absolute top-20 right-5 w-2 h-2 bg-pink-400 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute bottom-5 right-14 w-3 h-3 bg-purple-500 transform rotate-45 opacity-60 animate-bounce"></div>
        
        {/* Success Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
        
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-green-500 to-green-400 flex items-center justify-center mb-4 transform transition-all duration-500 animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-1">Teacher Added Successfully!</h2>
        <p className="text-gray-400 text-center mb-6">The new teacher account has been created and is ready to use.</p>
        
        {/* Teacher Card */}
        {newTeacherData && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700 shadow-inner">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{`${newTeacherData.firstName} ${newTeacherData.lastName}`}</h3>
                <p className="text-gray-400 text-sm mb-1">{newTeacherData.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                    {newTeacherData.className} / {newTeacherData.armName}
                  </span>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                    {newTeacherData.campusName}
                  </span>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                    {newTeacherData.gender}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => {
              setShowSuccessModal(false);
              // Reset form data
              setFormData({
                firstName: "",
                middleName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                gender: "Male",
                classId: "",
                armId: "",
                campusId: ""
              });
              // Refresh the page to show updated teacher list
              window.location.reload();
            }}
            className="bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            View Teacher List
          </button>
          
          <button 
            onClick={() => {
              setShowSuccessModal(false);
              setShowAddForm(true);
              // Reset form data
              setFormData({
                firstName: "",
                middleName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                gender: "Male",
                classId: "",
                armId: "",
                campusId: ""
              });
            }}
            className="bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center"
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

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchData();
  };
  
  const filteredTeachers = teachers.filter(teacher => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      teacher.firstName.toLowerCase().includes(searchLower) ||
      teacher.lastName.toLowerCase().includes(searchLower) ||
      teacher.email.toLowerCase().includes(searchLower) ||
      teacher.phoneNumber.toLowerCase().includes(searchLower) ||
      teacher.campusName?.toLowerCase().includes(searchLower) ||
      teacher.className?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout title="Teacher Management">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Teachers</h1>
            <p className="text-gray-400">Manage teacher accounts and assignments</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-md flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Teacher
              </button>
            )}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={fetchData}
              className="ml-2 text-yellow-500 hover:text-yellow-400 font-medium"
            >
              Try Again
            </button>
          </div>
        )}
        
        {showAddForm ? (
          <TeacherRegistration 
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <>
            <div className="mb-6">
              <div className="relative rounded-md shadow-sm max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search teachers..."
                  className="block w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {loading ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 flex justify-center">
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-yellow-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-4 text-white">Loading teachers...</p>
                </div>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="mt-4 text-white text-lg font-medium">No teachers found</p>
                  <p className="mt-2 text-gray-400">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first teacher.'}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 text-yellow-500 hover:text-yellow-400"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Assignment
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredTeachers.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                                {teacher.firstName[0]}{teacher.lastName[0]}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {teacher.firstName} {teacher.lastName}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {teacher.gender}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{teacher.email}</div>
                            <div className="text-sm text-gray-400">{teacher.phoneNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{teacher.campusName || 'N/A'}</div>
                            <div className="text-sm text-gray-400">
                              {teacher.className ? `${teacher.className}${teacher.armName ? ` - ${teacher.armName}` : ''}` : 'Not assigned'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button 
                                className="text-yellow-500 hover:text-yellow-400 focus:outline-none"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button 
                                className="text-red-500 hover:text-red-400 focus:outline-none"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Render the teacher form modal */}
      {teacherForm}
      {/* Render success modal */}
      {showSuccessModal && renderSuccessModal()}
      {/* Render dropdown portal */}
      {renderDropdownPortal()}
    </AdminLayout>
  );
};

export default TeacherManagement;