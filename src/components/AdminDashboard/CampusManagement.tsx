import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./Layout/AdminLayout";

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

const CampusManagement: React.FC = () => {
  const navigate = useNavigate();
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
        
        // Fetch campuses
        const campusesResponse = await axios.get('http://159.65.31.191/api/Tenant/campuses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        });

        if (campusesResponse.data.statusCode === 200) {
          setCampuses(campusesResponse.data.data || []);
        } else {
          setError(`Error fetching campuses: ${campusesResponse.data.message}`);
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

  const handleAddCampus = () => {
    setShowAddForm(true);
  };

  return (
    <AdminLayout title="Campus Management">
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleAddCampus}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200"
          >
            Add Campus
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campuses.length > 0 ? (
              campuses.map((campus) => (
                <div key={campus.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-200 shadow-lg">
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {campus.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{campus.description || "No description available"}</p>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-white">{campus.studentCount}</p>
                        <p className="text-xs text-gray-400">Students</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-white">{campus.teacherCount}</p>
                        <p className="text-xs text-gray-400">Teachers</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {campus.address}, {campus.city}, {campus.state}
                      </p>
                      <p className="text-gray-300 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {campus.email}
                      </p>
                      <p className="text-gray-300 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {campus.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex border-t border-gray-700">
                    <button className="flex-1 p-3 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 text-sm">
                      Edit Campus
                    </button>
                    <div className="border-l border-gray-700"></div>
                    <button className="flex-1 p-3 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-800 rounded-lg p-8 flex flex-col items-center">
                <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-gray-300 text-xl mb-3 font-bold">
                  No campuses available
                </p>
                <p className="text-gray-400 mb-6 text-center max-w-md">
                  Add your first campus to start managing your school locations
                </p>
                <button 
                  onClick={handleAddCampus}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-3 px-8 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200"
                >
                  Add Your First Campus
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Campus form modal would go here (similar to teacher/student forms) */}
      {/* We could implement it later if needed */}
      
    </AdminLayout>
  );
};

export default CampusManagement;