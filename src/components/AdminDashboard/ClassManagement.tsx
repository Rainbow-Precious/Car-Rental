import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./Layout/AdminLayout";
import Spinner from "../common/Spinner";
import AddArmModal from "./ClassManagement/AddArmModal";
import api from "../../utils/api";
import { toast } from 'react-hot-toast';

interface Class {
  classId: string;
  className: string;
  campusId: string;
  campusName: string;
  arms: {
    armId: string;
    armName: string;
  }[];
  studentCount?: number;
  teacherCount?: number;
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
}

interface ArmInput {
  name: string;
  description?: string;
}

interface ClassInput {
  name: string;
  campusId: string;
  arms: ArmInput[];
}

interface Campus {
  id: string;
  tenantId: string;
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
  createdAt: string;
  updatedAt: string | null;
  studentCount: number;
  teacherCount: number;
}

interface TeacherInviteForm {
  email: string;
  classId: string;
  armId: string;
  campusId: string;
}

// Mock data for class performance
const classPerformance = [
  { className: "Primary 1", averageScore: 78, passRate: 82 },
  { className: "Primary 2", averageScore: 82, passRate: 88 },
  { className: "Primary 3", averageScore: 75, passRate: 80 },
  { className: "JSS 1", averageScore: 72, passRate: 76 },
  { className: "JSS 2", averageScore: 68, passRate: 74 },
  { className: "JSS 3", averageScore: 71, passRate: 78 },
];

const ClassManagement: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddArmForm, setShowAddArmForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  
  // Add Class form state
  const [formData, setFormData] = useState<ClassInput>({
    name: "",
    campusId: "",
    arms: [{ name: "", description: "" }]
  });
  const [campusList, setCampusList] = useState<Campus[]>([]);
  const [addClassLoading, setAddClassLoading] = useState(false);
  const [addClassError, setAddClassError] = useState<string | null>(null);
  const [addClassSuccess, setAddClassSuccess] = useState(false);
  const [formTab, setFormTab] = useState<"basic" | "advanced">("basic");

  // Add these states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [selectedClassForInvite, setSelectedClassForInvite] = useState<Class | null>(null);
  const [selectedArm, setSelectedArm] = useState<string>('');
  const [inviteForm, setInviteForm] = useState<TeacherInviteForm>({
    email: '',
    classId: '',
    armId: '',
    campusId: ''
  });

  // Get unique campuses for filter
  const campuses = classes.length 
    ? [...new Set(classes.map(c => c.campusName))]
    : [];

  // Update the fetchData function
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/signin');
        return;
      }

      // Fetch classes with arms
      const classesResponse = await axios.get('http://159.65.31.191/api/Class/all-with-arms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      if (classesResponse.data.statusCode === 200) {
        setClasses(classesResponse.data.data || []);
      } else {
        setError(`Error fetching classes: ${classesResponse.data.message}`);
      }
          
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to include proper dependencies and cleanup
  useEffect(() => {
    let isSubscribed = true;

    const initializeData = async () => {
      if (!isSubscribed) return;
      await fetchData();
    };

    initializeData();

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, []); // Empty dependency array since we only want to fetch once on mount

  const fetchCampusList = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://159.65.31.191/api/Tenant/campuses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      if (response.data.statusCode === 200) {
        setCampusList(response.data.data || []);
        if (response.data.data?.length > 0) {
          setFormData(prev => ({
            ...prev,
            campusId: response.data.data[0].id
          }));
        }
      } else {
        setAddClassError('Failed to fetch campuses');
      }
    } catch (err: any) {
      setAddClassError(err.message || 'Failed to fetch campuses');
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddClassLoading(true);
    setAddClassError(null);
    setAddClassSuccess(false);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://159.65.31.191/api/Tenant/setup/class', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      if (response.data.statusCode === 201) {
        setAddClassSuccess(true);
        setFormData({ name: "", campusId: "", arms: [{ name: "", description: "" }] });
        closeAddClassModal();
        fetchData();
      } else {
        setAddClassError(response.data.message || 'Failed to create class');
      }
    } catch (err: any) {
      setAddClassError(err.message || 'Failed to create class');
    } finally {
      setAddClassLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArmChange = (index: number, field: keyof ArmInput, value: string) => {
    setFormData(prev => {
      const newArms = [...prev.arms];
      newArms[index] = {
        ...newArms[index],
        [field]: value
      };
      return {
        ...prev,
        arms: newArms
      };
    });
  };

  const addArm = () => {
    setFormData(prev => ({
      ...prev,
      arms: [...prev.arms, { name: "", description: "" }]
    }));
  };

  const removeArm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      arms: prev.arms.filter((_, i) => i !== index)
    }));
  };

  const closeAddClassModal = () => {
    setIsAddClassOpen(false);
    setAddClassError(null);
    setAddClassSuccess(false);
    setFormTab("basic");
  };

  const handleAddClass = () => {
    setIsAddClassOpen(true);
    fetchCampusList(); // Fetch campus list when opening modal
  };

  const handleAddArm = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowAddArmForm(true);
  };

  const handleViewClassDetails = (classId: string) => {
    navigate(`/admin/classes/${classId}`);
  };

  // Filter classes based on search and campus filter
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCampus = selectedCampus === "all" || classItem.campusName === selectedCampus;
    return matchesSearch && matchesCampus;
  });

  // Add this function to handle teacher invitation
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
            'accept': '/'
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
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  // Add this function to open invite modal
  const openInviteModal = (classItem: Class) => {
    setSelectedClassForInvite(classItem);
    setInviteForm(prev => ({
      ...prev,
      classId: classItem.classId,
      campusId: classItem.campusId
    }));
    setShowInviteModal(true);
  };

  // Show loading state only when loading is true
  if (loading) {
    return (
      <AdminLayout title="Class Management">
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
          <Spinner size="lg" text="Loading classes..." />
        </div>
      </AdminLayout>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <AdminLayout title="Class Management">
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </AdminLayout>
    );
  }

  const classForm = (
    <div className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center ${isAddClassOpen ? 'block' : 'hidden'}`}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-4 w-full max-w-xl border border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Class
          </h2>
          <button 
            onClick={closeAddClassModal}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {addClassError && (
          <div className="mb-3 p-2 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {addClassError}
          </div>
        )}

        <form onSubmit={handleCreateClass} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Class Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Class 5"
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Campus <span className="text-red-500">*</span>
              </label>
              <select
                name="campusId"
                value={formData.campusId}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                required
              >
                <option value="">Select Campus</option>
                {campusList.map(campus => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  Arms
                </label>
                <button
                  type="button"
                  onClick={addArm}
                  className="text-yellow-500 hover:text-yellow-400 text-xs flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Arm
                </button>
              </div>

              {formData.arms.map((arm, index) => (
                <div key={index} className="bg-gray-800 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-medium text-white">Arm {index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArm(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={arm.name}
                        onChange={(e) => handleArmChange(index, 'name', e.target.value)}
                        placeholder="e.g. A"
                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={arm.description}
                        onChange={(e) => handleArmChange(index, 'description', e.target.value)}
                        placeholder="Optional description"
                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-700">
            <button
              type="button"
              onClick={closeAddClassModal}
              className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addClassLoading}
              className={`px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-colors flex items-center text-sm ${
                addClassLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {addClassLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Class'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Update the invite teacher modal component
  const inviteTeacherModal = (
    <div className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center ${showInviteModal ? 'block' : 'hidden'}`}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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

        {/* Form Data Display */}
        <div className="bg-gray-700/50 rounded-lg p-4 mb-6 font-mono text-sm">
          <pre className="text-gray-300 overflow-x-auto">
{`{
  "email": "${inviteForm.email || 'user@example.com'}",
  "classId": "${inviteForm.classId || '3fa85f64-5717-4562-b3fc-2c963f66afa6'}",
  "armId": "${inviteForm.armId || '3fa85f64-5717-4562-b3fc-2c963f66afa6'}",
  "campusId": "${inviteForm.campusId || '3fa85f64-5717-4562-b3fc-2c963f66afa6'}"
}`}
          </pre>
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
              placeholder="user@example.com"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Class <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={selectedClassForInvite?.className || ''}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              disabled
            />
            <input 
              type="hidden" 
              value={inviteForm.classId} 
            />
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
            >
              <option value="">Select an arm</option>
              {selectedClassForInvite?.arms.map(arm => (
                <option key={arm.armId} value={arm.armId}>
                  {arm.armName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Campus ID
            </label>
            <input
              type="text"
              value={inviteForm.campusId}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              disabled
            />
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

  return (
    <AdminLayout title="Class Management">
      <div className="w-full space-y-6">
        {/* Class Summary Stats */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Class Overview</h2>
            </div>
            <button 
              onClick={handleAddClass}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Class
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 border-l-2 border-yellow-500">
              <p className="text-gray-400 text-sm">Total Classes</p>
              <p className="text-2xl font-bold text-white">{classes.length}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border-l-2 border-green-500">
              <p className="text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-white">
                {classes.reduce((total, cls) => total + (cls.studentCount || 0), 0)}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border-l-2 border-blue-500">
              <p className="text-gray-400 text-sm">Total Teachers</p>
              <p className="text-2xl font-bold text-white">
                {classes.reduce((total, cls) => total + (cls.teacherCount || 0), 0)}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border-l-2 border-purple-500">
              <p className="text-gray-400 text-sm">Total Arms</p>
              <p className="text-2xl font-bold text-white">
                {classes.reduce((total, cls) => total + cls.arms.length, 0)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-yellow-500 focus:border-yellow-500 p-2"
              >
                <option value="all">All Campuses</option>
                {campuses.map((campus, index) => (
                  <option key={index} value={campus}>{campus}</option>
                ))}
              </select>
              
              <div className="flex items-center bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded ${viewMode === "grid" ? "bg-gray-600" : ""}`}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded ${viewMode === "list" ? "bg-gray-600" : ""}`}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              <button 
                onClick={handleAddClass}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Class
              </button>
            </div>
          </div>
        </div>

        {/* Class Performance (Line Chart) */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Class Performance</h3>
          
          <div className="relative h-64">
            <div className="absolute inset-0 grid grid-cols-6 gap-0.5">
              {classPerformance.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative h-52 w-full flex items-end justify-center mb-2">
                    <div 
                      className="w-full max-w-[40px] bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t-md"
                      style={{ height: `${item.averageScore}%` }}
                    ></div>
                    <div 
                      className="absolute bottom-0 w-full max-w-[40px] border-2 border-green-500 rounded-full"
                      style={{ bottom: `${item.passRate}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{item.className}</span>
                </div>
              ))}
            </div>
            
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-4 text-sm">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 mr-1"></div>
              <span className="text-gray-400">Average Score</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border-2 border-green-500 mr-1"></div>
              <span className="text-gray-400">Pass Rate</span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-500 text-white p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {/* Horizontal Scrollable Classes */}
            <div className="relative">
              <div className="overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex justify-between w-full px-1 min-w-full">
                  {filteredClasses.slice(0, 3).map((classItem) => (
                    <div 
                      key={classItem.classId} 
                      className="w-[32%] bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-200 shadow-lg group"
                    >
                      <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-900 transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-white flex items-center">
                            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            {classItem.className}
                          </h3>
                          <div className="bg-yellow-500 text-black text-xs font-semibold py-0.5 px-2 rounded-full">
                            {classItem.campusName}
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Performance</span>
                            <span className="text-yellow-500">Good</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 w-[75%]"></div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                            <div className="text-lg font-semibold text-white">{classItem.studentCount || 0}</div>
                            <div className="text-xs text-gray-400">Students</div>
                          </div>
                          <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                            <div className="text-lg font-semibold text-white">{classItem.teacherCount || 0}</div>
                            <div className="text-xs text-gray-400">Teachers</div>
                          </div>
                        </div>

                        {/* Add Invite Teacher Button */}
                        <div className="mt-4 flex justify-center">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate('/admin/invite-teacher');
                            }}
                            className="w-full py-2 px-3 bg-gray-700/50 hover:bg-gray-700 text-yellow-500 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <span>Invite Teacher</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* View All Classes Button */}
            {filteredClasses.length > 3 && (
              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => setViewMode("list")}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span>View All Classes</span>
                  <span className="bg-yellow-600/30 rounded-full px-2 py-0.5 text-sm">
                    {filteredClasses.length}
                  </span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Arm form modal */}
      {selectedClass && (
        <AddArmModal
          isOpen={showAddArmForm}
          onClose={() => setShowAddArmForm(false)}
          onArmAdded={fetchData}
          classId={selectedClass.classId}
          className={selectedClass.className}
        />
      )}

      {/* Integrated Add Class Modal */}
      {classForm}

      {/* Add the invite modal */}
      {inviteTeacherModal}

      {/* Add this CSS to your global styles or in a style tag */}
      <style>
        {`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        `}
      </style>
    </AdminLayout>
  );
};

export default ClassManagement;