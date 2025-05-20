import React from "react";

// Mock data for static UI, updated to match CampusSetupInfo fields
const initialCampuses = [
  {
    id: "1",
    name: "Main Campus",
    description: "Primary campus location",
    address: "123 Main St",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    phoneNumber: "123-456-7890",
    email: "maincampus@example.com",
    capacity: 150,
    status: "Active",
  },
];

/*interface Campus {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  email?: string;
  capacity: number;
  status?: string;
}*/

const CampusManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campus Management</h1>
        <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
          Add Campus
        </button>
      </div>

      {/* Campus List */}
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Capacity</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialCampuses.map((campus) => (
              <tr key={campus.id} className="border-t border-gray-700">
                <td className="p-3">{campus.name}</td>
                <td className="p-3">{campus.address}</td>
                <td className="p-3">{campus.city}</td>
                <td className="p-3">{campus.state}</td>
                <td className="p-3">{campus.country}</td>
                <td className="p-3">{campus.phoneNumber}</td>
                <td className="p-3">{campus.email || "N/A"}</td>
                <td className="p-3">{campus.capacity}</td>
                <td className="p-3">{campus.status || "Active"}</td>
                <td className="p-3 space-x-2">
                  <button className="text-blue-500 hover:underline">Edit</button>
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Static Add/Edit Campus Form Placeholder */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add/Edit Campus</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Campus Name</label>
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
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
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