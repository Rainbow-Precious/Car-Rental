import React from "react";
//import { Link } from "react-router-dom";

// Mock data for static UI
const initialClasses = [
  { id: "1", name: "JSS1", description: "Junior Secondary School Year 1", campusId: "1" },
  { id: "2", name: "SS2", description: "Senior Secondary School Year 2", campusId: "1" },
];
const initialArms = [
  { id: "1", name: "A", classId: "1", description: "Section A" },
  { id: "2", name: "Science", classId: "2", description: "Science Stream" },
];
const initialCampuses = [{ id: "1", name: "Main Campus" }];

/*interface Class {
  id: string;
  name: string;
  description?: string;
  campusId: string;
}

interface Arm {
  id: string;
  name: string;
  classId: string;
  description?: string;
}

interface Campus {
  id: string;
  name: string;
}*/

const ClassManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Class Management</h1>
        <div className="space-x-3">
          <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
            Add Class
          </button>
          <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
            Add Arm
          </button>
        </div>
      </div>

      {/* Class & Arm List */}
      <div className="space-y-4">
        {initialClasses.map((cls) => (
          <div key={cls.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{cls.name}</h2>
              <div className="space-x-2">
                <button className="text-blue-500 hover:underline">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
            <div className="ml-4">
              {initialArms
                .filter((arm) => arm.classId === cls.id)
                .map((arm) => (
                  <div key={arm.id} className="flex justify-between items-center py-2">
                    <span>{arm.name} (Students: {Math.floor(Math.random() * 30)})</span>
                    <div className="space-x-2">
                      <button className="text-blue-500 hover:underline">Edit</button>
                      <button className="text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Static Add/Edit Class Form Placeholder */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add/Edit Class</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Class Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Campus</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            >
              <option value="">Select Campus</option>
              {initialCampuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Static Add/Edit Arm Form Placeholder */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add/Edit Arm</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Arm Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parent Class</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            >
              <option value="">Select Class</option>
              {initialClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassManagement;