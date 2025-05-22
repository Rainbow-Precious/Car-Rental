import React, { useState, useEffect } from "react";
import axios from "axios";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassAdded: () => void;
}

interface Campus {
  campusId: string;
  campusName: string;
}

const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose, onClassAdded }) => {
  const [className, setClassName] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formTab, setFormTab] = useState<"basic" | "advanced">("basic");

  useEffect(() => {
    if (isOpen) {
      fetchCampuses();
    }
  }, [isOpen]);

  const fetchCampuses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://159.65.31.191/api/campus/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      if (response.data.statusCode === 200) {
        setCampuses(response.data.data || []);
        if (response.data.data?.length > 0) {
          setSelectedCampus(response.data.data[0].campusId);
        }
      } else {
        setError('Failed to fetch campuses');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch campuses');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://159.65.31.191/api/Class/create', 
        {
          className,
          campusId: selectedCampus
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
        setSuccess(true);
        setClassName("");
        
        // Notify parent component that a class was added
        setTimeout(() => {
          onClassAdded();
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to create class');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-md mx-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
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
          
          <form onSubmit={handleSubmit} className="p-6">
            {formTab === "basic" ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Class Name*
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
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
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    {campuses.length === 0 && (
                      <option value="">No campuses available</option>
                    )}
                    {campuses.map(campus => (
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
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
                Class created successfully!
              </div>
            )}
            
            {/* Form actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !className || !selectedCampus}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  loading || !className || !selectedCampus
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-600 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-400"
                }`}
              >
                {loading ? (
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
  );
};

export default AddClassModal; 