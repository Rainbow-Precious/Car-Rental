import React from "react";

// Mock data for static UI, tailored for CBT
const initialClasses = [
  {
    id: "1",
    name: "JSS1",
    description: "Junior Secondary School Year 1",
    campusId: "1",
    schedule: "Mon-Fri, 9:00 AM - 1:00 PM",
    maxCBTCapacity: 50,
    assignedSubjects: "Mathematics, English",
    techStatus: "Functional",
  },
  {
    id: "2",
    name: "SS2",
    description: "Senior Secondary School Year 2",
    campusId: "1",
    schedule: "Mon-Fri, 10:00 AM - 2:00 PM",
    maxCBTCapacity: 60,
    assignedSubjects: "Physics, Chemistry",
    techStatus: "Needs Maintenance",
  },
];
const initialArms = [
  { id: "1", name: "A", classId: "1", description: "Section A", maxStudents: 25 },
  { id: "2", name: "Science", classId: "2", description: "Science Stream", maxStudents: 30 },
];
const initialCampuses = [{ id: "1", name: "Main CBT Campus" }];



const ClassManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-yellow-400">CBT Class Management</h1>
        <div className="space-x-4">
          <button className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-200">
            Add Class
          </button>
          <button className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-200">
            Add Arm
          </button>
        </div>
      </div>

      {/* Class & Arm List */}
      <div className="space-y-4">
        {initialClasses.map((cls) => (
          <div key={cls.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-yellow-400">{cls.name}</h2>
              <div className="space-x-3">
                <button className="text-blue-400 hover:underline">Edit</button>
                <button className="text-red-400 hover:underline">Delete</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <p><strong>Campus:</strong> {initialCampuses.find((c) => c.id === cls.campusId)?.name || "N/A"}</p>
              <p><strong>Schedule:</strong> {cls.schedule}</p>
              <p><strong>Max CBT Capacity:</strong> {cls.maxCBTCapacity}</p>
              <p><strong>Subjects:</strong> {cls.assignedSubjects}</p>
              <p><strong>Tech Status:</strong> {cls.techStatus}</p>
            </div>
            <div className="ml-4 mt-2">
              <h3 className="text-md font-medium mb-2">Arms:</h3>
              {initialArms
                .filter((arm) => arm.classId === cls.id)
                .map((arm) => (
                  <div key={arm.id} className="flex justify-between items-center py-2 border-t border-gray-700">
                    <span className="text-sm">
                      {arm.name} (Max Students: {arm.maxStudents})
                    </span>
                    <div className="space-x-2">
                      <button className="text-blue-400 hover:underline">Edit</button>
                      <button className="text-red-400 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Static Add/Edit Class Form Placeholder */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Add/Edit Class</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Class Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Campus</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
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
          <div>
            <label className="block text-sm font-medium mb-2">Schedule</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max CBT Capacity</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Assigned Subjects</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tech Status</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            >
              <option value="Functional">Functional</option>
              <option value="Needs Maintenance">Needs Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Static Add/Edit Arm Form Placeholder */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Add/Edit Arm</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Arm Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Parent Class</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
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
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Students</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassManagement;