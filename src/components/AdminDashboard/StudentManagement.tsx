import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { createPortal } from "react-dom";
import AdminLayout from "./Layout/AdminLayout";
import Spinner from "../common/Spinner";
import api from "../../utils/api";

// Define Student interface
interface Student {
  id: string;
  userId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  email: string;
  admissionNumber: string;
  classId: string;
  className?: string;
  armId: string;
  armName?: string;
  campusId: string;
  campusName?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  profilePicture?: string;
  status?: string;
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

// Student form data interface
interface StudentFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  admissionNumber: string;
  gender: string;
  classId: string;
  armId: string;
  campusId: string;
  profilePicture?: File | null;
}

// Mock data for static UI
const initialStudents = [
  { id: "1", firstName: "John", lastName: "Doe", gender: "Male", admissionNumber: "A001", classId: "1", armId: "1", campusId: "1", email: "john.doe@example.com", password: "", forcePasswordChange: false, status: "Active" },
  { id: "2", firstName: "Jane", lastName: "Smith", gender: "Female", admissionNumber: "A002", classId: "2", armId: "2", campusId: "1", email: "jane.smith@example.com", password: "", forcePasswordChange: false, status: "Active" },
];

const classes = [
  { id: "1", name: "JSS1" },
  { id: "2", name: "SS2" },
];

const arms = [
  { id: "1", name: "A", classId: "1" },
  { id: "2", name: "Science", classId: "2" },
];

const campuses = [
  { id: "1", name: "Main Campus" },
];

const StudentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newStudentData, setNewStudentData] = useState<Student | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Form data state
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    admissionNumber: "",
    gender: "Male", // Default value
    classId: "",
    armId: "",
    campusId: "",
    profilePicture: null
  });

  // Fetch data from the API
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch students
      const studentsResponse = await api.get('/Tenant/students');
      
      // Fetch campuses
      const campusesResponse = await api.get('/Tenant/campuses');
      
      // Fetch arms
      const armsResponse = await api.get('/Tenant/arms');
      
      // Fetch classes
      const classesResponse = await api.get('/Class/all-with-arms');

      if (studentsResponse.data.statusCode === 200) {
        setStudents(studentsResponse.data.data || []);
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
        
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddStudent = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setFormError(null);
    setFormSuccess(null);
    setProfilePicture(null);
    setProfilePicturePreview(null);
    // Reset form data
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      admissionNumber: "",
      gender: "Male",
      classId: "",
      armId: "",
      campusId: "",
      profilePicture: null
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
    }
  };

  const handleRegisterStudent = async (formData: any) => {
    try {
      setSubmitting(true);
      
      const response = await api.post('/Tenant/register-student', formData);

      if (response.data.statusCode === 201) {
        // Handle success
        setShowAddForm(false);
        await fetchData(); // Refresh the list
        setFormSuccess(response.data.message || "Student registered successfully!");
      } else {
        setFormError(response.data.message || "Failed to register student");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to register student");
    } finally {
      setSubmitting(false);
    }
  };

  // Function to handle opening the dropdown
  const handleOpenDropdown = (studentId: string) => {
    if (activeDropdown === studentId) {
      setActiveDropdown(null);
      setActiveDropdownPos(null);
      return;
    }

    const buttonElement = actionButtonRefs.current[studentId];
    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      setActiveDropdownPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX - 120 // Position to the left of the button
      });
      setActiveDropdown(studentId);
    }
  };

  // Table headers that will be shown even when empty
  const tableHeaders = (
    <thead>
      <tr className="bg-gray-700">
        <th className="p-3 text-left text-white">Name</th>
        <th className="p-3 text-left text-white">Admission Number</th>
        <th className="p-3 text-left text-white">Email</th>
        <th className="p-3 text-left text-white">Gender</th>
        <th className="p-3 text-left text-white">Class/Arm</th>
        <th className="p-3 text-left text-white">Campus</th>
        <th className="p-3 text-center text-white">Actions</th>
      </tr>
    </thead>
  );

  // Student registration form modal
  const studentForm = (
    <div className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center ${showAddForm ? 'block' : 'hidden'}`}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-5 w-full max-w-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-500 rounded-lg p-1.5">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Add New Student</h2>
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
        
        <form onSubmit={handleRegisterStudent} className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Profile Picture Upload - Left column */}
            <div className="col-span-4 bg-gray-800 p-4 rounded-lg shadow-inner flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-3 flex items-center justify-center">
                {profilePicturePreview ? (
                  <img 
                    src={profilePicturePreview} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <label className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white py-2 px-3 rounded-lg cursor-pointer text-sm transition-colors duration-200">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfilePictureChange}
                  disabled={submitting}
                />
                {profilePicture ? 'Change Photo' : 'Upload Photo'}
              </label>
              <p className="text-xs text-gray-400 mt-2">Optional: Maximum size 5MB</p>
            </div>
            
            {/* Personal Information - Right column */}
            <div className="col-span-8 bg-gray-800 p-4 rounded-lg shadow-inner">
              <h3 className="text-gray-300 text-sm font-semibold mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              <div className="grid grid-cols-6 gap-3">
                <div className="col-span-2">
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
                <div className="col-span-2">
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
                <div className="col-span-2">
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
          </div>
          
          {/* Contact Information Section */}
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
                  placeholder="student@school.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Admission Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={submitting}
                  placeholder="e.g. ADM-2023-001"
                />
              </div>
            </div>
          </div>
          
          {/* School Assignment Section */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <h3 className="text-gray-300 text-sm font-semibold mb-3 flex items-center">
              <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              School Assignment
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div>
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
              <div>
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
              <div>
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
              <div>
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
                  <Spinner />
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Success confirmation modal
  const successModal = (
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
        
        <h2 className="text-2xl font-bold text-center text-white mb-1">Student Added Successfully!</h2>
        <p className="text-gray-400 text-center mb-2">The new student account has been created.</p>
        
        {/* Password Information */}
        <div className="bg-blue-900/50 p-3 rounded-lg mb-4 border border-blue-700">
          <div className="flex items-center text-blue-300 mb-1">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Password Information</span>
          </div>
          <p className="text-sm text-blue-100">
            Student has been created with a default password and will be required to change it on first login.
          </p>
        </div>
        
        {/* Student Card */}
        {newStudentData && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700 shadow-inner">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{`${newStudentData.firstName} ${newStudentData.lastName}`}</h3>
                <p className="text-gray-400 text-sm mb-1">{newStudentData.email}</p>
                <p className="text-gray-400 text-sm mb-1">Admission No: {newStudentData.admissionNumber}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                    {newStudentData.className} / {newStudentData.armName}
                  </span>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                    {newStudentData.campusName}
                  </span>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                    {newStudentData.gender}
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
                admissionNumber: "",
                gender: "Male",
                classId: "",
                armId: "",
                campusId: "",
                profilePicture: null
              });
              // Refresh the page to show updated student list
              window.location.reload();
            }}
            className="bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            View Student List
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
                admissionNumber: "",
                gender: "Male",
                classId: "",
                armId: "",
                campusId: "",
                profilePicture: null
              });
              setProfilePicture(null);
              setProfilePicturePreview(null);
            }}
            className="bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Another Student
          </button>
        </div>
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
          to={`/admin/students/${activeDropdown}`}
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
          Edit Student
        </button>
        <button className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 w-full text-left">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Student
        </button>
      </div>,
      document.body
    );
  };

  return (
    <AdminLayout title="Student Management">
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-x-3">
            <button 
              onClick={handleAddStudent}
              className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400"
            >
              Add Student
            </button>
            <a
              href="/templates/students-template.csv"
              download
              className="bg-gray-700 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600"
            >
              Download CSV Template
            </a>
          </div>
        </div>

        {/* Import Form (static) */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-white">Import Students</h2>
          <div className="flex space-x-3">
            <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
              Import Students from CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-xl">Loading...</div>
          </div>
        ) : error ? (
          <div className="bg-red-500 text-white p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg">
              {tableHeaders}
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id} id={`student-${student.id}`} className="border-t border-gray-700">
                      <td className="p-3 text-white">{`${student.firstName} ${student.lastName}`}</td>
                      <td className="p-3 text-white">{student.admissionNumber}</td>
                      <td className="p-3 text-white">{student.email}</td>
                      <td className="p-3 text-white">{student.gender}</td>
                      <td className="p-3 text-white">
                        {`${classes.find((c) => c.classId === student.classId)?.className || "N/A"} / 
                        ${arms.find((a) => a.armId === student.armId)?.armName || "N/A"}`}
                      </td>
                      <td className="p-3 text-white">
                        {student.campusName || campuses.find((c) => c.id === student.campusId)?.name || "N/A"}
                      </td>
                      <td className="p-3 relative">
                        <div className="flex justify-center action-dropdown-container">
                          <button 
                            ref={(el) => { actionButtonRefs.current[student.id] = el; }}
                            onClick={() => handleOpenDropdown(student.id)}
                            className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-all duration-200 action-button"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-0">
                      <div className="empty-state-container flex flex-col items-center justify-center py-16 rounded-b-lg">
                        <svg 
                          className="w-20 h-20 text-gray-500 mb-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                          />
                        </svg>
                        <p className="text-gray-300 text-xl mb-3 font-bold">
                          Seems you don't have any students yet
                        </p>
                        <p className="text-gray-400 mb-8 text-center max-w-md">
                          Add a student to start managing your school's student records
                        </p>
                        <button 
                          onClick={handleAddStudent}
                          className="bg-yellow-500 text-black font-semibold py-3 px-8 rounded-lg hover:bg-yellow-400 text-lg btn-pulse"
                        >
                          Create Your First Student
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Render the student form modal */}
      {studentForm}
      {/* Render success modal */}
      {successModal}
      {/* Render dropdown portal */}
      {renderDropdownPortal()}
    </AdminLayout>
  );
};

export default StudentManagement;