import React from "react";
import { Link } from "react-router-dom";

// Mock data for static UI
const initialExams = [
  {
    id: "1",
    title: "Math Midterm",
    description: "Midterm exam for Mathematics",
    classId: "1",
    armId: "1",
    startDate: "2025-06-01T09:00",
    endDate: "2025-06-01T11:00",
    passMark: 50,
    status: "Draft",
    studentsEnrolled: 20,
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

const ExamManagement: React.FC = () => {
  return (
    <div className="min-h-screen w-screen bg-black flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-start py-8">
        <div className="w-full max-w-6xl px-4 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Exam Management</h1>
            <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
              Create Exam
            </button>
          </div>

          {/* Exam List */}
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 text-left text-white">Title</th>
                  <th className="p-3 text-left text-white">Class/Arm</th>
                  <th className="p-3 text-left text-white">Date</th>
                  <th className="p-3 text-left text-white">Status</th>
                  <th className="p-3 text-left text-white">Students Enrolled</th>
                  <th className="p-3 text-left text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {initialExams.map((exam) => (
                  <tr key={exam.id} className="border-t border-gray-700">
                    <td className="p-3 text-white">{exam.title}</td>
                    <td className="p-3 text-white">{`${classes.find((c) => c.id === exam.classId)?.name} / ${arms.find((a) => a.id === exam.armId)?.name}`}</td>
                    <td className="p-3 text-white">{exam.startDate}</td>
                    <td className="p-3 text-white">{exam.status}</td>
                    <td className="p-3 text-white">{exam.studentsEnrolled}</td>
                    <td className="p-3 space-x-2">
                      <Link to={`/admin/exams/${exam.id}`} className="text-yellow-500 hover:underline">View</Link>
                      <button className="text-blue-500 hover:underline">Edit</button>
                      <button className="text-red-500 hover:underline">Delete</button>
                      <button className="text-green-500 hover:underline">
                        {exam.status === "Draft" ? "Publish" : "Unpublish"}
                      </button>
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

export default ExamManagement;