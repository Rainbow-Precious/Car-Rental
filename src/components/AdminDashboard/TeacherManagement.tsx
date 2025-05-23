import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import Spinner from "../common/Spinner";
import api from "../../utils/api";
import { createPortal } from "react-dom";
import TeacherRegistration from './TeacherRegistration';
import { toast } from 'react-hot-toast';
import axios from 'axios';

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

interface TeacherInvite {
  id: string;
  email: string;
  classId: string;
  className: string;
  armId: string;
  armName: string;
  campusId: string;
  campusName: string;
  status: string;
  createdAt: string;
}

interface InviteFormData {
  email: string;
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeDropdownPos, setActiveDropdownPos] = useState<{ top: number, left: number } | null>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Invite teacher states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPendingInvites, setShowPendingInvites] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<TeacherInvite[]>([]);
  const [inviteForm, setInviteForm] = useState<InviteFormData>({
    email: '',
    classId: '',
    armId: '',
    campusId: ''
  });

  // Fetch data from the API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/signin');
        return;
      }

      // Fetch teachers using the correct endpoint
      const teachersResponse = await api.get('/Tenant/teachers');
      
      // Fetch campuses
      const campusesResponse = await api.get('/Tenant/campuses');
      
      // Fetch classes with arms
      const classesResponse = await api.get('/Class/all-with-arms');

      if (teachersResponse.data.statusCode === 200) {
        setTeachers(teachersResponse.data.data || []);
      } else {
        setError(`Error fetching teachers: ${teachersResponse.data.message}`);
      }
      
      if (campusesResponse.data.statusCode === 200) {
        setCampuses(campusesResponse.data.data || []);
      }
      
      if (classesResponse.data.statusCode === 200) {
        setClasses(classesResponse.data.data || []);
        // Extract arms from classes
        const allArms: Arm[] = [];
        classesResponse.data.data?.forEach((cls: Class) => {
          if (cls.arms) {
            cls.arms.forEach(arm => {
              allArms.push({
                armId: arm.armId,
                armName: arm.armName,
                armDescription: '',
                classId: cls.classId,
                className: cls.className,
                tenantId: '',
                studentCount: 0,
                createdAt: new Date().toISOString(),
                campuses: []
              });
            });
          }
        });
        setArms(allArms);
      }
        
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      if (err.response?.status === 401) {
        navigate('/signin');
      } else {
        setError(err.response?.data?.message || err.message || "Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending invites
  const fetchPendingInvites = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get('http://159.65.31.191/api/TeacherInvitation/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      if (response.data.statusCode === 200) {
        // Ensure we always set an array, even if data is null/undefined
        const invites = response.data.data;
        setPendingInvites(Array.isArray(invites) ? invites : []);
      } else {
        // If response is not successful, set empty array
        setPendingInvites([]);
      }
    } catch (err: any) {
      console.error('Error fetching pending invites:', err);
      // On error, ensure we set empty array
      setPendingInvites([]);
    }
  };

  // Add useEffect to fetch data on mount
  useEffect(() => {
    fetchData();
    fetchPendingInvites();
  }, [navigate]);

  // Handle invite teacher
  const handleInviteTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://159.65.31.191/api/TeacherInvitation/invite',
        inviteForm,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': '*/*'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Teacher invitation sent successfully!');
        setShowInviteModal(false);
        setInviteForm({
          email: '',
          classId: '',
          armId: '',
          campusId: ''
        });
        fetchPendingInvites();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
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

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchData(); // Refresh the teacher list
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

  // Invite Teacher Modal
  const inviteTeacherModal = (
    <div className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center ${showInviteModal ? 'block' : 'hidden'}`}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Invite Teacher
          </h2>
          <button 
            onClick={() => setShowInviteModal(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleInviteTeacher} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="teacher@example.com"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Campus <span className="text-red-500">*</span>
            </label>
            <select
              value={inviteForm.campusId}
              onChange={(e) => setInviteForm(prev => ({ ...prev, campusId: e.target.value, classId: '', armId: '' }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              value={inviteForm.classId}
              onChange={(e) => setInviteForm(prev => ({ ...prev, classId: e.target.value, armId: '' }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
              disabled={!inviteForm.campusId}
            >
              <option value="">Select Class</option>
              {classes.filter(cls => cls.campusId === inviteForm.campusId).map(cls => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Arm <span className="text-red-500">*</span>
            </label>
            <select
              value={inviteForm.armId}
              onChange={(e) => setInviteForm(prev => ({ ...prev, armId: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
              disabled={!inviteForm.classId}
            >
              <option value="">Select Arm</option>
              {classes.find(cls => cls.classId === inviteForm.classId)?.arms.map(arm => (
                <option key={arm.armId} value={arm.armId}>
                  {arm.armName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteLoading}
              className={`px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-colors flex items-center ${
                inviteLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {inviteLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Pending Invites Modal
  const pendingInvitesModal = (
    <div className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center ${showPendingInvites ? 'block' : 'hidden'}`}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-4xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Teacher Invitations ({Array.isArray(pendingInvites) ? pendingInvites.length : 0})
          </h2>
          <button 
            onClick={() => setShowPendingInvites(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Class/Arm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Campus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {(Array.isArray(pendingInvites) ? pendingInvites : []).map((invite) => (
                <tr key={invite.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{invite.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{invite.className} - {invite.armName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{invite.campusName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {invite.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(invite.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(Array.isArray(pendingInvites) ? pendingInvites : []).length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No pending invitations found.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Teacher Management">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Teachers</h1>
            <p className="text-gray-400">Register and manage teacher accounts</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            {!showAddForm && (
              <>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Invite Teacher
                </button>
                <button
                  onClick={() => {
                    fetchPendingInvites();
                    setShowPendingInvites(true);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg flex items-center transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pending Invites ({Array.isArray(pendingInvites) ? pendingInvites.length : 0})
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 px-6 rounded-lg flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register New Teacher
                </button>
              </>
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
                <Spinner size="lg" text="Loading teachers..." />
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="mt-4 text-white text-lg font-medium">No teachers found</p>
                  <p className="mt-2 text-gray-400">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by registering your first teacher.'}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 text-yellow-500 hover:text-yellow-400"
                    >
                      Clear search
                    </button>
                  )}
                  {!searchTerm && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 flex items-center mx-auto"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Register First Teacher
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
                          Status
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
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-black font-bold">
                                {teacher.firstName[0]}{teacher.lastName[0]}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {teacher.firstName} {teacher.middleName ? `${teacher.middleName} ` : ''}{teacher.lastName}
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              teacher.isVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {teacher.isVerified ? 'Active' : 'Pending'}
                            </span>
                            {teacher.mustChangePassword && (
                              <div className="text-xs text-orange-400 mt-1">Must change password</div>
                            )}
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
                                className="text-blue-500 hover:text-blue-400 focus:outline-none"
                                title="View Details"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                
                {/* Table Summary */}
                <div className="bg-gray-700/50 px-6 py-3 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>
                      Showing {filteredTeachers.length} of {teachers.length} teachers
                    </span>
                    <span>
                      {teachers.filter(t => t.isVerified).length} active, {teachers.filter(t => !t.isVerified).length} pending
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Render dropdown portal */}
      {renderDropdownPortal()}
      
      {/* Invite Teacher Modal */}
      {inviteTeacherModal}
      
      {/* Pending Invites Modal */}
      {pendingInvitesModal}
    </AdminLayout>
  );
};

export default TeacherManagement;