import React from "react";

// Mock data for static UI, tailored for CBT
const initialCampuses = [
  {
    id: "1",
    name: "Main CBT Campus",
    description: "Central hub for computer-based testing",
    address: "123 CBT Avenue",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    phoneNumber: "123-456-7890",
    email: "cbtmain@example.com",
    capacity: 200,
    examCenterCount: 3,
    computerLabCount: 5,
    maxCBTSessions: 150,
    status: "Active",
  },
];


const CampusManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-yellow-400">CBT Campus Management</h1>
        <button className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-200">
          Add New Campus
        </button>
      </div>

      {/* Campus List */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full bg-gray-800 border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-3 border-b border-gray-600">Campus Name</th>
              <th className="p-3 border-b border-gray-600">Address</th>
              <th className="p-3 border-b border-gray-600">City</th>
              <th className="p-3 border-b border-gray-600">State</th>
              <th className="p-3 border-b border-gray-600">Country</th>
              <th className="p-3 border-b border-gray-600">Phone</th>
              <th className="p-3 border-b border-gray-600">Email</th>
              <th className="p-3 border-b border-gray-600">Capacity</th>
              <th className="p-3 border-b border-gray-600">Exam Centers</th>
              <th className="p-3 border-b border-gray-600">Labs</th>
              <th className="p-3 border-b border-gray-600">Max CBT Sessions</th>
              <th className="p-3 border-b border-gray-600">Status</th>
              <th className="p-3 border-b border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialCampuses.map((campus) => (
              <tr key={campus.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-3">{campus.name}</td>
                <td className="p-3">{campus.address}</td>
                <td className="p-3">{campus.city}</td>
                <td className="p-3">{campus.state}</td>
                <td className="p-3">{campus.country}</td>
                <td className="p-3">{campus.phoneNumber}</td>
                <td className="p-3">{campus.email || "N/A"}</td>
                <td className="p-3">{campus.capacity}</td>
                <td className="p-3">{campus.examCenterCount}</td>
                <td className="p-3">{campus.computerLabCount}</td>
                <td className="p-3">{campus.maxCBTSessions}</td>
                <td className="p-3">{campus.status || "Active"}</td>
                <td className="p-3 space-x-2">
                  <button className="text-blue-400 hover:underline">Edit</button>
                  <button className="text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Static Add/Edit Campus Form Placeholder */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Add/Edit Campus</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Campus Name</label>
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
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Capacity</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Exam Centers</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Computer Labs</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max CBT Sessions</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
                disabled
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-75"
              disabled
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusManagement;