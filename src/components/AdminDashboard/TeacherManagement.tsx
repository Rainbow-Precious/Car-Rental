import React from "react";
import { Link } from "react-router-dom";

// Mock data for static UI
const initialTeachers = [
  {
    id: "1",
    firstName: "Jane",
    lastName: "Smith",
    gender: "Female",
    phoneNumber: "123-456-7890",
    email: "jane.smith@example.com",
    classId: "1",
    armId: "1",
    campusId: "1",
    subjects: ["Mathematics", "Physics"],
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    phoneNumber: "234-567-8901",
    email: "john.doe@example.com",
    classId: "2",
    armId: "2",
    campusId: "1",
    subjects: ["Chemistry", "English"],
  },
  {
    id: "3",
    firstName: "Mary",
    lastName: "Johnson",
    gender: "Female",
    phoneNumber: "345-678-9012",
    email: "mary.johnson@example.com",
    classId: "1",
    armId: "1",
    campusId: "1",
    subjects: ["Mathematics"],
  },
  {
    id: "4",
    firstName: "Peter",
    lastName: "Williams",
    gender: "Male",
    phoneNumber: "456-789-0123",
    email: "peter.williams@example.com",
    classId: "2",
    armId: "2",
    campusId: "1",
    subjects: ["Physics"],
  },
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

const TeacherManagement: React.FC = () => {
  return (
    <div className="min-h-screen w-screen bg-black flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-start py-8">
        <div className="w-full max-w-6xl px-4 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Teacher Management</h1>
            <div className="space-x-3">
              <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
                Add Teacher
              </button>
              <button className="bg-gray-700 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600">
                Invite Teacher
              </button>
            </div>
          </div>

          {/* Teacher List */}
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 text-left text-white">Name</th>
                  <th className="p-3 text-left text-white">Email</th>
                  <th className="p-3 text-left text-white">Subjects</th>
                  <th className="p-3 text-left text-white">Class/Arm</th>
                  <th className="p-3 text-left text-white">Campus</th>
                  <th className="p-3 text-left text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {initialTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-t border-gray-700">
                    <td className="p-3 text-white">{`${teacher.firstName} ${teacher.lastName}`}</td>
                    <td className="p-3 text-white">{teacher.email}</td>
                    <td className="p-3 text-white">{teacher.subjects.join(", ")}</td>
                    <td className="p-3 text-white">{`${classes.find((c) => c.id === teacher.classId)?.name} / ${arms.find((a) => a.id === teacher.armId)?.name}`}</td>
                    <td className="p-3 text-white">{campuses.find((c) => c.id === teacher.campusId)?.name}</td>
                    <td className="p-3 space-x-2">
                      <Link
                        to={`/admin/teachers/${teacher.id}`}
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

export default TeacherManagement;