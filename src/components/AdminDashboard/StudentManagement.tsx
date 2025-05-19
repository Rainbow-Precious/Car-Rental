import React from "react";
import { Link } from "react-router-dom";

// Mock data for static UI
const initialStudents = [
  { id: "1", firstName: "John", lastName: "Doe", gender: "Male", admissionNumber: "A001", classId: "1", armId: "1", campusId: "1", email: "john.doe@example.com", password: "", forcePasswordChange: false, status: "Active" },
  { id: "2", firstName: "Jane", lastName: "Smith", gender: "Female", admissionNumber: "A002", classId: "2", armId: "2", campusId: "1", email: "jane.smith@example.com", password: "", forcePasswordChange: false, status: "Active" },
];

const classes = [
  { id: "1", name: "JSS1" },
  { id: "2", name: "SS2" },
];

const arms = [
  { id: "1", name: "A", classId: "1" },
  { id: "2", name: "Science", classId: "2" },
];

const campuses = [
  { id: "1", name: "Main Campus" },
];

const StudentManagement: React.FC = () => {
  return (
    <div className="min-h-screen w-screen bg-black flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-start py-8">
        <div className="w-full max-w-6xl px-4 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Student Management</h1>
            <div className="space-x-3">
              <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
                Add Student
              </button>
              <a
                href="/templates/students-template.csv"
                download
                className="bg-gray-700 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600"
              >
                Download CSV Template
              </a>
            </div>
          </div>

          {/* Import Form (static) */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-white">Import Students</h2>
            <div className="flex space-x-3">
              <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
                Import (Simulated)
              </button>
            </div>
          </div>

          {/* Student List */}
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 text-left text-white">Name</th>
                  <th className="p-3 text-left text-white">Admission Number</th>
                  <th className="p-3 text-left text-white">Class</th>
                  <th className="p-3 text-left text-white">Arm</th>
                  <th className="p-3 text-left text-white">Campus</th>
                  <th className="p-3 text-left text-white">Status</th>
                  <th className="p-3 text-left text-white">Actions</th>
                  <th className="p-3 text-left text-green-500">Ongoing Exam</th>
                </tr>
              </thead>
              <tbody>
                {initialStudents.map((student) => (
                  <tr key={student.id} className="border-t border-gray-700">
                    <td className="p-3 text-white">{`${student.firstName} ${student.lastName}`}</td>
                    <td className="p-3 text-white">{student.admissionNumber}</td>
                    <td className="p-3 text-white">
                      {classes.find((c) => c.id === student.classId)?.name}
                    </td>
                    <td className="p-3 text-white">{arms.find((a) => a.id === student.armId)?.name}</td>
                    <td className="p-3 text-white">
                      {campuses.find((c) => c.id === student.campusId)?.name}
                    </td>
                    <td className="p-3 text-white">{student.status}</td>
                    <td className="p-3 space-x-2">
                      <Link
                        to={`/admin/students/${student.id}`}
                        className="text-yellow-500 hover:underline"
                      >
                        View
                      </Link>
                      <button className="text-blue-500 hover:underline">Edit</button>
                      <button className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentManagement;