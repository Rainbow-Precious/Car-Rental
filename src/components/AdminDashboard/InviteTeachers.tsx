import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './Layout/AdminLayout';
import { toast } from 'react-hot-toast';

interface TeacherInviteForm {
  email: string;
  classId: string;
  armId: string;
  campusId: string;
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
  armDescription: string;
  classId: string;
  className: string;
  tenantId: string;
  studentCount: number;
  createdAt: string;
  campuses: {
    campusId: string;
    campusName: string;
    campusAddress: string;
  }[];
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

const InviteTeachers: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TeacherInviteForm>({
    email: '',
    classId: '',
    armId: '',
    campusId: ''
  });
  
  // Add state for dropdown data
  const [classes, setClasses] = useState<Class[]>([]);
  const [arms, setArms] = useState<Arm[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  // Log state for debugging
  useEffect(() => {
    console.log("Arms state:", arms);
    console.log("Classes state:", classes);
  }, [arms, classes]);

  // Fetch classes and campuses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/signin');
          return;
        }
        
        // Fetch campuses
        const campusesResponse = await axios.get('http://159.65.31.191/api/Tenant/campuses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        });
        
        // Fetch classes
        const classesResponse = await axios.get('http://159.65.31.191/api/Class/all-with-arms', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        });
        
        // Fetch arms using the endpoint provided
        const armsResponse = await axios.get('http://159.65.31.191/api/Tenant/arms', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        });

        if (campusesResponse.data.statusCode === 200) {
          setCampuses(campusesResponse.data.data || []);
        }
        
        if (classesResponse.data.statusCode === 200) {
          setClasses(classesResponse.data.data || []);
        }
        
        if (armsResponse.data.statusCode === 200) {
          setArms(armsResponse.data.data || []);
          console.log("Arms data:", armsResponse.data.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to fetch data");
      }
    };

    fetchData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If changing class, also update campusId and reset armId
    if (name === 'classId') {
      if (value) {
        const selectedClass = classes.find(cls => cls.classId === value);
        if (selectedClass) {
          setFormData(prev => ({
            ...prev,
            campusId: selectedClass.campusId,
            armId: '' // Reset arm when class changes
          }));
        }
      } else {
        // If class is cleared, also clear arm
        setFormData(prev => ({
          ...prev,
          armId: ''
        }));
      }
    }
  };

  // Get filtered arms based on selected class
  const getFilteredArms = () => {
    if (!formData.classId) return [];
    
    // Filter arms by the selected classId
    const filteredArms = arms.filter(arm => arm.classId === formData.classId);
    console.log("Filtered arms for classId", formData.classId, ":", filteredArms);
    return filteredArms;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://159.65.31.191/api/TeacherInvitation/invite',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': '/'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Show success message with toast
        toast.success('Teacher invitation sent successfully!');
        
        // Navigate immediately to teachers page
        navigate('/admin/teachers');
      }
    } catch (error: any) {
      console.error("Invitation error:", error);
      // Show error toast and set form error
      toast.error(error.response?.data?.message || 'Failed to send invitation');
      setFormError(error.response?.data?.message || 'Failed to send invitation');
      // Ensure loading state is reset
      setLoading(false);
    } finally {
      // This will run if the try block completed without navigation
      // In case navigation didn't happen for some reason
      setLoading(false);
    }
  };

  // Get campus name based on campusId
  const getCampusName = (campusId: string) => {
    const campus = campuses.find(c => c.id === campusId);
    return campus ? campus.name : '';
  };

  return (
    <AdminLayout title="Invite Teacher">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-yellow-500 rounded-lg p-1.5">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Invite New Teacher</h2>
            </div>
          </div>
          
          {error && (
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-3 rounded-lg mb-6 shadow-lg flex items-center text-sm">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {formError && (
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-3 rounded-lg mb-6 shadow-lg flex items-center text-sm">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formError}</span>
            </div>
          )}
          
          {formSuccess && (
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-3 rounded-lg mb-6 shadow-lg flex items-center text-sm">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
              <h3 className="text-gray-300 text-sm font-semibold mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Teacher Email
              </h3>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="teacher@example.com"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-400 mt-1">An invitation will be sent to this email address</p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
              <h3 className="text-gray-300 text-sm font-semibold mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Class Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    disabled={loading}
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.classId} value={cls.classId}>
                        {cls.className} ({getCampusName(cls.campusId)})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Select the class for the teacher</p>
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
                    disabled={loading || !formData.classId}
                  >
                    <option value="">Select Arm</option>
                    {getFilteredArms().map((arm) => (
                      <option key={arm.armId} value={arm.armId}>
                        {arm.armName}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Select the arm for the teacher</p>
                </div>
              </div>
              
              {formData.classId && formData.armId && (
                <div className="mt-4 bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                  <h4 className="text-xs font-medium text-gray-300 mb-2">Assignment Summary</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-yellow-500">
                      {classes.find(c => c.classId === formData.classId)?.className || ""}
                    </span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-blue-400">
                      {getFilteredArms().find(a => a.armId === formData.armId)?.armName || ""}
                    </span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-green-400">
                      {getCampusName(formData.campusId)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/admin/teachers')}
                className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 text-sm ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InviteTeachers; 