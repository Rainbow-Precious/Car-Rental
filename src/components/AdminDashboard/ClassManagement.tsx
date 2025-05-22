import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./Layout/AdminLayout";
import Spinner from "../common/Spinner";
import AddArmModal from "./ClassManagement/AddArmModal";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddArmForm, setShowAddArmForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  
  // Add Class form state
  const [newClassName, setNewClassName] = useState("");
  const [newClassCampusId, setNewClassCampusId] = useState("");
  const [campusList, setCampusList] = useState<{campusId: string, campusName: string}[]>([]);
  const [addClassLoading, setAddClassLoading] = useState(false);
  const [addClassError, setAddClassError] = useState<string | null>(null);
  const [addClassSuccess, setAddClassSuccess] = useState(false);
  const [formTab, setFormTab] = useState<"basic" | "advanced">("basic");

  // Get unique campuses for filter
  const campuses = classes.length 
    ? [...new Set(classes.map(c => c.campusName))]
    : [];

  // Simple authentication check
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/signin');
      return;
    }

    // Fetch data from the API
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
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

    fetchData();
  }, [navigate]);

  // Fetch campuses when Add Class modal opens
  useEffect(() => {
    if (isAddClassOpen) {
      fetchCampusList();
    }
  }, [isAddClassOpen]);

  const fetchCampusList = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://159.65.31.191/api/campus/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      if (response.data.statusCode === 200) {
        setCampusList(response.data.data || []);
        if (response.data.data?.length > 0) {
          setNewClassCampusId(response.data.data[0].campusId);
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
      const response = await axios.post('http://159.65.31.191/api/Class/create', 
        {
          className: newClassName,
          campusId: newClassCampusId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': 'text/plain'
          }
        }
      );

      if (response.data.statusCode === 201) {
        setAddClassSuccess(true);
        setNewClassName("");
        
        // Refetch classes after adding a new one
        setTimeout(() => {
          handleClassAdded();
          closeAddClassModal();
        }, 1500);
      } else {
        setAddClassError(response.data.message || 'Failed to create class');
      }
    } catch (err: any) {
      setAddClassError(err.message || 'Failed to create class');
    } finally {
      setAddClassLoading(false);
    }
  };

  const closeAddClassModal = () => {
    setIsAddClassOpen(false);
    setNewClassName("");
    setAddClassError(null);
    setAddClassSuccess(false);
    setFormTab("basic");
  };

  const handleAddClass = () => {
    setIsAddClassOpen(true);
  };

  const handleAddArm = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowAddArmForm(true);
  };

  const handleClassAdded = () => {
    // Refetch classes after adding a new class
    setLoading(true);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
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

    fetchData();
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

  // Show centered spinner when loading
  if (loading) {
    return (
      <AdminLayout title="Class Management">
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
          <Spinner size="lg" text="Loading classes..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Class Management">
      <div className="w-full space-y-6">
        {/* Class Summary Stats */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Class Overview</h2>
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
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Class
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
          <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}`}>
            {filteredClasses.length > 0 ? (
              viewMode === "grid" ? (
                filteredClasses.map((classItem) => (
                  <div 
                    key={classItem.classId} 
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-200 shadow-lg group"
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
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-400">Performance:</span>
                        <div className="ml-2 w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                            style={{ width: `${Math.floor(Math.random() * 30) + 60}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-semibold text-white flex items-center">
                            <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10" />
                            </svg>
                            Arms ({classItem.arms.length})
                          </h4>
                          <button 
                            onClick={() => handleAddArm(classItem)}
                            className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add
                          </button>
                        </div>
                        
                        {classItem.arms.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {classItem.arms.map(arm => (
                              <div key={arm.armId} className="bg-gray-700 rounded-lg p-2 text-xs text-center text-white">
                                {arm.armName}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-2 text-center border border-dashed border-gray-700 rounded-lg">
                            <p className="text-gray-500 text-xs">No arms available</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-xl font-bold text-white">{classItem.studentCount || 0}</p>
                          </div>
                          <p className="text-xs text-gray-400">Students</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <p className="text-xl font-bold text-white">{classItem.teacherCount || 0}</p>
                          </div>
                          <p className="text-xs text-gray-400">Teachers</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex border-t border-gray-700">
                      <button className="flex-1 p-3 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 text-sm flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Class
                      </button>
                      <div className="border-l border-gray-700"></div>
                      <button 
                        onClick={() => handleViewClassDetails(classItem.classId)}
                        className="flex-1 p-3 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 text-sm flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // List view
                filteredClasses.map((classItem) => (
                  <div 
                    key={classItem.classId} 
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-200 shadow-lg"
                  >
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center mb-2 md:mb-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{classItem.className}</h3>
                            <p className="text-sm text-gray-400">Campus: {classItem.campusName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">{classItem.studentCount || 0}</p>
                            <p className="text-xs text-gray-400">Students</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">{classItem.teacherCount || 0}</p>
                            <p className="text-xs text-gray-400">Teachers</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">{classItem.arms.length}</p>
                            <p className="text-xs text-gray-400">Arms</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button className="p-2 bg-gray-700 rounded-lg text-yellow-500 hover:bg-gray-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleViewClassDetails(classItem.classId)}
                              className="p-2 bg-gray-700 rounded-lg text-yellow-500 hover:bg-gray-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleAddArm(classItem)}
                              className="p-2 bg-gray-700 rounded-lg text-yellow-500 hover:bg-gray-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {classItem.arms.length > 0 && (
                        <div className="mt-3 pl-12">
                          <div className="text-sm text-gray-400 mb-1">Arms:</div>
                          <div className="flex flex-wrap gap-2">
                            {classItem.arms.map(arm => (
                              <div key={arm.armId} className="bg-gray-700 text-white text-xs py-1 px-2 rounded">
                                {arm.armName}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="col-span-1 md:col-span-2 xl:col-span-3 bg-gray-800 rounded-lg p-8 flex flex-col items-center">
                <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="text-gray-300 text-xl mb-3 font-bold">
                  No classes available
                </p>
                <p className="text-gray-400 mb-6 text-center max-w-md">
                  Add your first class to start organizing students and teachers
                </p>
                <button 
                  onClick={handleAddClass}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-3 px-8 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200"
                >
                  Add Your First Class
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Arm form modal */}
      {selectedClass && (
        <AddArmModal
          isOpen={showAddArmForm}
          onClose={() => setShowAddArmForm(false)}
          onArmAdded={handleClassAdded}
          classId={selectedClass.classId}
          className={selectedClass.className}
        />
      )}

      {/* Integrated Add Class Modal */}
      {isAddClassOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-auto">
            {/* Close button */}
            <button 
              onClick={closeAddClassModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Modal content */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-4">
                <h3 className="text-lg font-bold text-black">Add New Class</h3>
                <p className="text-sm text-gray-800">Create a new class in your school</p>
              </div>
              
              {/* Form tabs */}
              <div className="flex border-b border-gray-700">
                <button
                  type="button"
                  className={`flex-1 py-3 font-medium ${
                    formTab === "basic" 
                      ? "text-yellow-500 border-b-2 border-yellow-500" 
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setFormTab("basic")}
                >
                  Basic Info
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 font-medium ${
                    formTab === "advanced" 
                      ? "text-yellow-500 border-b-2 border-yellow-500" 
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setFormTab("advanced")}
                >
                  Advanced Options
                </button>
              </div>
              
              <form onSubmit={handleCreateClass} className="p-6">
                {formTab === "basic" ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Class Name*
                      </label>
                      <input
                        type="text"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="e.g. Primary 1, JSS 1, SS 2"
                        required
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Campus*
                      </label>
                      <select
                        value={newClassCampusId}
                        onChange={(e) => setNewClassCampusId(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        {campusList.length === 0 && (
                          <option value="">No campuses available</option>
                        )}
                        {campusList.map(campus => (
                          <option key={campus.campusId} value={campus.campusId}>
                            {campus.campusName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Class Capacity
                      </label>
                      <input
                        type="number"
                        placeholder="Maximum number of students"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Optional: Set a maximum capacity for this class
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Class Description
                      </label>
                      <textarea
                        placeholder="Add additional information about this class"
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
                      ></textarea>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-yellow-500 focus:ring-yellow-500 mr-2"
                        />
                        <span>Enable automatic student placement</span>
                      </label>
                      <p className="ml-6 text-xs text-gray-400">
                        Allow the system to automatically place students in arms based on capacity
                      </p>
                    </div>
                  </>
                )}
                
                {/* Status messages */}
                {addClassError && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                    {addClassError}
                  </div>
                )}
                
                {addClassSuccess && (
                  <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
                    Class created successfully!
                  </div>
                )}
                
                {/* Form actions */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeAddClassModal}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addClassLoading || !newClassName || !newClassCampusId}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                      addClassLoading || !newClassName || !newClassCampusId
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-600 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-400"
                    }`}
                  >
                    {addClassLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : "Create Class"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ClassManagement;