import React, { useState } from "react";
import axios from "axios";

interface AddArmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArmAdded: () => void;
  classId: string;
  className: string;
}

const AddArmModal: React.FC<AddArmModalProps> = ({ 
  isOpen, 
  onClose, 
  onArmAdded, 
  classId, 
  className 
}) => {
  const [armName, setArmName] = useState("");
  const [armDescription, setArmDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://159.65.31.191/api/arm/create', 
        {
          armName,
          armDescription,
          classId
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
        setArmName("");
        setArmDescription("");
        
        // Notify parent component that an arm was added
        setTimeout(() => {
          onArmAdded();
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to create arm');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create arm');
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
            <h3 className="text-lg font-bold text-black">Add New Arm</h3>
            <p className="text-sm text-gray-800">
              Add an arm to {className}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Arm Name*
              </label>
              <input
                type="text"
                value={armName}
                onChange={(e) => setArmName(e.target.value)}
                placeholder="e.g. A, B, C, Red, Blue"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={armDescription}
                onChange={(e) => setArmDescription(e.target.value)}
                placeholder="Optional description for this arm"
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
              ></textarea>
            </div>
            
            <div className="mb-4 bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What are Arms?
              </h4>
              <p className="text-sm text-gray-300">
                Arms are subdivisions of a class, such as "Primary 1A" and "Primary 1B". 
                Each arm can have its own set of students and teachers.
              </p>
            </div>
            
            {/* Status messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
                Arm created successfully!
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
                disabled={loading || !armName}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  loading || !armName
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
                ) : "Create Arm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddArmModal; 