import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../Layout/AdminLayout";
import Spinner from "../../common/Spinner";

interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  gender: string;
  dateOfBirth: string;
  armId: string;
  armName: string;
  email?: string;
}

interface Teacher {
  teacherId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  gender: string;
  email: string;
  phoneNumber?: string;
  subjects: string[];
}

interface ClassDetails {
  classId: string;
  className: string;
  campusId: string;
  campusName: string;
  arms: {
    armId: string;
    armName: string;
    armDescription: string;
    studentCount: number;
  }[];
  totalStudents: number;
  totalTeachers: number;
}

const ClassDetail: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "teachers" | "exams">("overview");
  const [selectedArm, setSelectedArm] = useState<string>("all");

  useEffect(() => {
    if (!classId) {
      navigate('/admin/class-management');
      return;
    }

    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        // Fetch class details
        const classResponse = await axios.get(`http://159.65.31.191/api/Class/${classId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        });

        if (classResponse.data.statusCode === 200) {
          setClassDetails(classResponse.data.data);
          
          // Fetch students for this class
          const studentsResponse = await axios.get(`http://159.65.31.191/api/student/by-class/${classId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'text/plain'
            }
          });

          if (studentsResponse.data.statusCode === 200) {
            setStudents(studentsResponse.data.data || []);
          }
          
          // Fetch teachers for this class
          const teachersResponse = await axios.get(`http://159.65.31.191/api/teacher/by-class/${classId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'text/plain'
            }
          });

          if (teachersResponse.data.statusCode === 200) {
            setTeachers(teachersResponse.data.data || []);
          }
        } else {
          setError(`Error fetching class details: ${classResponse.data.message}`);
        }
      } catch (err: any) {
        console.error("Failed to fetch class details:", err);
        setError(err.message || "Failed to fetch class details");
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId, navigate]);

  // Filter students by selected arm
  const filteredStudents = selectedArm === "all" 
    ? students 
    : students.filter(student => student.armId === selectedArm);

  if (loading) {
    return (
      <AdminLayout title="Class Details">
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
          <Spinner size="lg" text="Loading class details..." />
        </div>
      </AdminLayout>
    );
  }

  if (error || !classDetails) {
    return (
      <AdminLayout title="Class Details">
        <div className="bg-red-500 text-white p-4 rounded-lg">
          {error || "Class not found"}
        </div>
        <button 
          onClick={() => navigate('/admin/class-management')}
          className="mt-4 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Class Management
        </button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Class: ${classDetails.className}`}>
      <div className="w-full space-y-6">
        {/* Back button */}
        <button 
          onClick={() => navigate('/admin/class-management')}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Class Management
        </button>
        
        {/* Class header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mr-4 text-black text-2xl font-bold">
                {classDetails.className.substring(0, 2)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{classDetails.className}</h2>
                <p className="text-gray-400">Campus: {classDetails.campusName}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-gray-700 rounded-lg px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">{classDetails.totalStudents}</p>
                <p className="text-xs text-gray-400">Students</p>
              </div>
              <div className="bg-gray-700 rounded-lg px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">{classDetails.totalTeachers || 0}</p>
                <p className="text-xs text-gray-400">Teachers</p>
              </div>
              <div className="bg-gray-700 rounded-lg px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">{classDetails.arms.length}</p>
                <p className="text-xs text-gray-400">Arms</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "overview" 
                  ? "bg-gray-700 text-yellow-500 border-t-2 border-yellow-500" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "students" 
                  ? "bg-gray-700 text-yellow-500 border-t-2 border-yellow-500" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Students ({classDetails.totalStudents})
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "teachers" 
                  ? "bg-gray-700 text-yellow-500 border-t-2 border-yellow-500" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Teachers ({classDetails.totalTeachers || 0})
            </button>
            <button
              onClick={() => setActiveTab("exams")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "exams" 
                  ? "bg-gray-700 text-yellow-500 border-t-2 border-yellow-500" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Exams & Results
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Arms section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Arms</h3>
                    <button className="text-sm bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-1 px-3 rounded flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Arm
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classDetails.arms.map(arm => (
                      <div key={arm.armId} className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-yellow-500 transition-all duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-white font-semibold">
                            {classDetails.className} {arm.armName}
                          </h4>
                          <div className="bg-yellow-500 text-black text-xs font-semibold py-0.5 px-2 rounded-full">
                            {arm.studentCount} students
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-3">
                          {arm.armDescription || `Default arm for ${classDetails.className}`}
                        </p>
                        
                        <div className="flex justify-between">
                          <button className="text-xs text-gray-400 hover:text-white transition-colors">
                            Edit Details
                          </button>
                          <button className="text-xs text-gray-400 hover:text-white transition-colors">
                            View Students
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Performance section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <h4 className="text-white font-semibold mb-3">Average Scores by Arm</h4>
                      <div className="relative h-48">
                        <div className="absolute inset-0 flex items-end justify-around">
                          {classDetails.arms.map((arm, index) => (
                            <div key={arm.armId} className="flex flex-col items-center">
                              <div 
                                className="w-10 bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t"
                                style={{ height: `${Math.floor(Math.random() * 40) + 40}%` }}
                              ></div>
                              <span className="mt-2 text-xs text-gray-400">{arm.armName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <h4 className="text-white font-semibold mb-3">Recent Performance Trend</h4>
                      <div className="relative h-48">
                        <div className="absolute inset-0 flex items-center">
                          <svg className="w-full h-32" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,80 C20,70 40,90 60,75 C80,60 100,50 120,55 C140,60 160,80 180,65 C200,50 220,40 240,45 C260,50 280,30 300,20" 
                                  stroke="url(#gradient)" strokeWidth="3" fill="none" />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#EAB308" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "students" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <select
                      value={selectedArm}
                      onChange={(e) => setSelectedArm(e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-yellow-500 focus:border-yellow-500 p-2"
                    >
                      <option value="all">All Arms</option>
                      {classDetails.arms.map(arm => (
                        <option key={arm.armId} value={arm.armId}>
                          {arm.armName}
                        </option>
                      ))}
                    </select>
                    
                    <button className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-colors flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Student
                    </button>
                  </div>
                </div>
                
                {filteredStudents.length > 0 ? (
                  <div className="bg-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-800">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Arm</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gender</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-600">
                        {filteredStudents.map(student => (
                          <tr key={student.studentId} className="hover:bg-gray-600 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs mr-3">
                                  {student.profilePicture ? (
                                    <img 
                                      src={student.profilePicture} 
                                      alt={`${student.firstName} ${student.lastName}`} 
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`
                                  )}
                                </div>
                                <div>
                                  <p className="text-white">{student.firstName} {student.lastName}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-white">{student.armName}</td>
                            <td className="px-4 py-3 text-white">{student.gender}</td>
                            <td className="px-4 py-3 text-white">{student.email || "N/A"}</td>
                            <td className="px-4 py-3 text-right">
                              <button className="text-yellow-500 hover:text-yellow-400 p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button className="text-yellow-500 hover:text-yellow-400 p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-lg p-8 text-center">
                    <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-300 text-lg mb-3 font-bold">
                      No students found
                    </p>
                    <p className="text-gray-400 mb-6">
                      {selectedArm === "all" 
                        ? "There are no students enrolled in this class yet." 
                        : "There are no students in the selected arm."}
                    </p>
                    <button className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-2 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-colors">
                      Add Students
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "teachers" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Assigned Teachers</h3>
                  <button className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Assign Teacher
                  </button>
                </div>
                
                {teachers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teachers.map(teacher => (
                      <div key={teacher.teacherId} className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-yellow-500 transition-all duration-200">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white mr-4">
                            {teacher.profilePicture ? (
                              <img 
                                src={teacher.profilePicture} 
                                alt={`${teacher.firstName} ${teacher.lastName}`} 
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`
                            )}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{teacher.firstName} {teacher.lastName}</h4>
                            <p className="text-sm text-gray-400">{teacher.email}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 pl-16">
                          <p className="text-sm text-gray-300 mb-1">Subjects:</p>
                          <div className="flex flex-wrap gap-2">
                            {teacher.subjects.map((subject, index) => (
                              <span key={index} className="bg-gray-600 text-white text-xs py-1 px-2 rounded">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-lg p-8 text-center">
                    <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-gray-300 text-lg mb-3 font-bold">
                      No teachers assigned
                    </p>
                    <p className="text-gray-400 mb-6">
                      There are no teachers assigned to this class yet.
                    </p>
                    <button className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-2 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-colors">
                      Assign Teachers
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "exams" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Exams & Results</h3>
                  <button className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Schedule Exam
                  </button>
                </div>
                
                {/* Example exam list - would be populated from API in production */}
                <div className="bg-gray-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Exam Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      <tr className="hover:bg-gray-600 transition-colors">
                        <td className="px-4 py-3 text-white">First Term Examination</td>
                        <td className="px-4 py-3 text-white">Oct 15, 2023</td>
                        <td className="px-4 py-3">
                          <span className="bg-green-900/30 text-green-400 text-xs py-1 px-2 rounded">Completed</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-yellow-500 hover:text-yellow-400">View Results</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-600 transition-colors">
                        <td className="px-4 py-3 text-white">Mid-Term Assessment</td>
                        <td className="px-4 py-3 text-white">Aug 20, 2023</td>
                        <td className="px-4 py-3">
                          <span className="bg-green-900/30 text-green-400 text-xs py-1 px-2 rounded">Completed</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-yellow-500 hover:text-yellow-400">View Results</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-600 transition-colors">
                        <td className="px-4 py-3 text-white">Second Term Examination</td>
                        <td className="px-4 py-3 text-white">Dec 5, 2023</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-900/30 text-blue-400 text-xs py-1 px-2 rounded">Upcoming</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-yellow-500 hover:text-yellow-400">Edit Schedule</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClassDetail; 