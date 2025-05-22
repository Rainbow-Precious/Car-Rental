import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./Layout/AdminLayout";

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

const ClassManagement: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddArmForm, setShowAddArmForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

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

  const handleAddClass = () => {
    setShowAddForm(true);
  };

  const handleAddArm = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowAddArmForm(true);
  };

  return (
    <AdminLayout title="Class Management">
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleAddClass}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200"
          >
            Add Class
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500 text-white p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {classes.length > 0 ? (
              classes.map((classItem) => (
                <div 
                  key={classItem.classId} 
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-200 shadow-lg"
                >
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      {classItem.className}
                    </h3>
                    <p className="text-gray-400 text-sm">Campus: {classItem.campusName}</p>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Arms ({classItem.arms.length})
                    </h4>
                    
                    {classItem.arms.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {classItem.arms.map(arm => (
                          <div key={arm.armId} className="bg-gray-700 rounded-lg p-2 text-sm text-white">
                            {arm.armName}
                          </div>
                        ))}
                        <button 
                          onClick={() => handleAddArm(classItem)}
                          className="bg-gray-700 rounded-lg p-2 text-sm text-gray-400 border border-dashed border-gray-600 hover:border-yellow-500 hover:text-yellow-500 flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Arm
                        </button>
                      </div>
                    ) : (
                      <div className="mb-4 text-center py-3 border border-dashed border-gray-700 rounded-lg">
                        <p className="text-gray-500 text-sm">No arms available</p>
                        <button 
                          onClick={() => handleAddArm(classItem)}
                          className="mt-2 text-yellow-500 text-sm hover:underline flex items-center justify-center mx-auto"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add an arm
                        </button>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-white">{classItem.studentCount || 0}</p>
                        <p className="text-xs text-gray-400">Students</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-white">{classItem.teacherCount || 0}</p>
                        <p className="text-xs text-gray-400">Teachers</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex border-t border-gray-700">
                    <button className="flex-1 p-3 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 text-sm">
                      Edit Class
                    </button>
                    <div className="border-l border-gray-700"></div>
                    <button className="flex-1 p-3 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))
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
      
      {/* Class form modal would go here */}
      {/* Arm form modal would go here */}
      
    </AdminLayout>
  );
};

export default ClassManagement;