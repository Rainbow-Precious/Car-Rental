import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Mock user data for the navbar
const mockUser = {
  name: "James",
  schoolName: "Demo School",
  subscriptionStatus: "Trial",
  profilePicture: "/default-avatar.png",
};

// Mock data for new sections
const usage: Usage = {
  students: { current: 80, limit: 100 },
  teachers: { current: 8, limit: 10 },
  exams: { current: 3, limit: 20 },
  classes: 5,
};

const recentActivity: Activity[] = [
  {
    type: "exam",
    title: "Math Midterm",
    action: "created",
    date: "2025-05-18",
  },
  { type: "student", name: "John Doe", action: "added", date: "2025-05-17" },
  { type: "teacher", name: "Jane Smith", action: "edited", date: "2025-05-16" },
];

const quickStats: QuickStats = {
  totalStudents: 8,
  totalTeachers: 5,
  totalExams: 150,
  totalQuestions: 150,
  totalCampuses: 2,
  totalClasses: 8,
};

const examSchedule = [
  {
    id: "1",
    title: "Math Midterm",
    date: "2025-06-01T09:00",
    status: "Scheduled",
  },
  {
    id: "2",
    title: "Physics Final",
    date: "2025-06-05T10:00",
    status: "In Progress",
  },
];

const performanceInsights = {
  averageScore: 75,
  passRate: 80,
  scoreDistribution: [
    { range: '0-20', count: 5 },
    { range: '21-40', count: 10 },
    { range: '41-60', count: 15 },
    { range: '61-80', count: 40 },
    { range: '81-100', count: 30 },
  ],
  subjectPerformance: [
    { subject: 'Math', score: 68 },
    { subject: 'Science', score: 74 },
    { subject: 'English', score: 81 },
    { subject: 'History', score: 76 },
    { subject: 'Art', score: 89 },
  ],
  monthlyAverage: [
    { month: 'Jan', score: 72 },
    { month: 'Feb', score: 74 },
    { month: 'Mar', score: 71 },
    { month: 'Apr', score: 76 },
    { month: 'May', score: 78 },
    { month: 'Jun', score: 75 },
  ],
  topPerformers: [
    { name: 'John Smith', score: 96 },
    { name: 'Emma Clark', score: 94 },
    { name: 'Michael Brown', score: 92 },
  ]
};

const systemHealth = {
  status: "Online",
  lastSync: "2025-05-19 04:21 PM WAT",
};

interface Usage {
  students: { current: number; limit: number };
  teachers: { current: number; limit: number };
  exams: { current: number; limit: number };
  classes: number;
}

interface Activity {
  type: "exam" | "student" | "teacher";
  title?: string;
  name?: string;
  action: string;
  date: string;
}

interface QuickStats {
  totalStudents: number;
  totalTeachers: number;
  totalExams: number;
  totalQuestions: number;
  totalCampuses: number;
  totalClasses: number;
}

// Near the top of the file, add this style to hide scrollbars
const hideScrollbarStyles = `
  /* Hide scrollbar for all elements */
  * {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  *::-webkit-scrollbar {
    display: none;
  }
  
  /* Ensure the body doesn't overflow */
  html, body {
    overflow: hidden;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
`;

const TopNav: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any user session data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isSetupComplete');
    
    // Redirect to login page
    navigate("/signin");
  };

  // Determine greeting and icon based on current time (02:22 PM WAT)
  const currentHour = new Date("2025-05-20T14:22:00").getHours();
  const userName = mockUser.name;
  let greeting = "";
  let icon = "🌞"; // Default to sun for daytime

  if (currentHour >= 6 && currentHour < 12) {
    greeting = `Good Morning, ${userName}`;
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = `Good Afternoon, ${userName}`;
  } else if (currentHour >= 18 || currentHour < 6) {
    greeting = `Good Evening, ${userName}`;
    icon = "🌙"; // Moon for nighttime
  }

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="School Logo" className="h-8 w-8" />
        <div>
          <span className="text-white font-semibold">
            {icon} {greeting}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-white">
          <span>System Health: {systemHealth.status}</span>
          <span className="text-gray-400 ml-2">
            Last Sync: {systemHealth.lastSync}
          </span>
        </div>
        <button className="text-white">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
        <div className="relative group">
          <button className="flex items-center space-x-2 text-white">
            <img
              src={mockUser.profilePicture}
              alt="Admin"
              className="h-8 w-8 rounded-full"
            />
            <span>{mockUser.name}</span>
          </button>
          <div
            className="absolute right-0 top-full w-48 bg-gray-800 rounded-lg shadow-lg hidden group-hover:flex flex-col z-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          >
            <a
              href="#"
              className="block px-4 py-2 text-white hover:bg-gray-700 rounded-t-lg"
            >
              Profile
            </a>
            <Link
              to="/admin/settings"
              className="block px-4 py-2 text-white hover:bg-gray-700"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-b-lg"
            >
              Logout
            </button>
          </div>
        </div>
        <Link to="/support" className="text-yellow-500 hover:underline">
          Help
        </Link>
      </div>
    </nav>
  );
};

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();

  // Simple authentication check
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/signin');
    }
  }, [navigate]);

  return (
    <>
      {/* Add style tag to hide scrollbars */}
      <style>{hideScrollbarStyles}</style>
      
      <div className="h-screen w-full bg-black flex flex-col">
        <TopNav />
        <main className="flex-1 py-8 px-6 pt-20 overflow-y-auto">
          <div className="w-full space-y-6 pb-16">
            {/* School Overview and Exam Schedule Combined Horizontally */}
            <div className="bg-gray-800 p-6 rounded-lg flex flex-col md:flex-row md:space-x-6">
              {/* School Overview */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">School Overview</h2>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-yellow-500 mb-4 transform transition-all duration-300 hover:scale-102 hover:shadow-lg">
                  <div className="flex items-center mb-3">
                    <span className="text-gray-400 text-sm">School</span>
                    <div className="flex-grow mx-2 border-b border-dashed border-gray-700"></div>
                    <span className="text-white font-semibold">Demo School</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-gray-400 text-sm">Subscription</span>
                    <div className="flex-grow mx-2 border-b border-dashed border-gray-700"></div>
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold py-1 px-2 rounded">
                      Trial
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-400 text-sm">Trial Days Left</span>
                    <div className="flex-grow mx-2 border-b border-dashed border-gray-700"></div>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center">
                        <span className="text-white font-bold">12</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <Link
                  to="/admin/settings"
                  className="mt-2 inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Subscription
                  </div>
                </Link>
              </div>
              {/* Exam Schedule */}
              <div className="flex-1 mt-6 md:mt-0">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Exam Schedule</h2>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-yellow-500 mb-4">
                  <ul className="space-y-4">
                    {examSchedule.map((exam) => (
                      <li key={exam.id} className="bg-gray-800 rounded-lg p-3 transition-all duration-200 hover:shadow-md">
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-semibold">{exam.title}</span>
                            {exam.status === "Scheduled" ? (
                              <span className="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded">
                                {exam.status}
                              </span>
                            ) : (
                              <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold py-1 px-2 rounded">
                                {exam.status}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(exam.date).toLocaleString()}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link
                  to="/admin/exams"
                  className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors duration-200 group"
                >
                  <span className="mr-1">View All Exams</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold">
                  {quickStats.totalStudents}
                </h3>
                <p className="text-gray-400">Students</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold">
                  {quickStats.totalTeachers}
                </h3>
                <p className="text-gray-400">Teachers</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold">{quickStats.totalExams}</h3>
                <p className="text-gray-400">Exams</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold">
                  {quickStats.totalQuestions}
                </h3>
                <p className="text-gray-400">Questions</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold">
                  {quickStats.totalCampuses}
                </h3>
                <p className="text-gray-400">Campuses</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold">
                  {quickStats.totalClasses}
                </h3>
                <p className="text-gray-400">Classes</p>
              </div>
            </div>

            {/* Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Campus Management Card */}
              <Link
                to="/admin/campus"
                className="group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4 group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-200">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-center text-white mb-2">Campus Management</h3>
                  <p className="text-gray-400 text-center mb-4">Manage all your school campuses and locations</p>
                  <div className="text-center">
                    <span className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-200">
                      Manage Campuses
                    </span>
                  </div>
                </div>
              </Link>

              {/* Class Management Card */}
              <Link
                to="/admin/classes"
                className="group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4 group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-200">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-center text-white mb-2">Class Management</h3>
                  <p className="text-gray-400 text-center mb-4">Organize and manage all your classes and arms</p>
                  <div className="text-center">
                    <span className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-200">
                      Manage Classes
                    </span>
                  </div>
                </div>
              </Link>

              {/* Exam Management Card */}
              <Link
                to="/admin/exams"
                className="group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4 group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-200">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-center text-white mb-2">Exam Management</h3>
                  <p className="text-gray-400 text-center mb-4">Create and manage exams and question banks</p>
                  <div className="text-center">
                    <span className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-200">
                      Manage Exams
                    </span>
                  </div>
                </div>
              </Link>

              {/* Question Bank Card */}
              <Link
                to="/admin/questions"
                className="group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4 group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-200">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-center text-white mb-2">Question Bank</h3>
                  <p className="text-gray-400 text-center mb-4">Create and organize your exam questions</p>
                  <div className="text-center">
                    <span className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-200">
                      Manage Questions
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Resource Usage Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Students Progress Bar - Make this a link */}
              <Link
                to="/admin/students"
                className="bg-gray-800 p-4 rounded-lg block hover:bg-gray-700 transition"
                style={{ textDecoration: "none" }}
              >
                <h2 className="text-lg font-semibold mb-2">Students</h2>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (usage.students.current / usage.students.limit) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-gray-400">
                  {usage.students.current}/{usage.students.limit} used
                </p>
              </Link>
              <Link
                to="/admin/teachers"
                className="bg-gray-800 p-4 rounded-lg block hover:bg-gray-700 transition"
                style={{ textDecoration: "none" }}
              >
                <h2 className="text-lg font-semibold mb-2">Teachers</h2>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (usage.teachers.current / usage.teachers.limit) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-gray-400">
                  {usage.teachers.current}/{usage.teachers.limit} used
                </p>
              </Link>
              <Link
                to="/admin/exams"
                className="bg-gray-800 p-4 rounded-lg block hover:bg-gray-700 transition"
                style={{ textDecoration: "none" }}
              >
                <h2 className="text-lg font-semibold mb-2">Exams</h2>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (usage.exams.current / usage.exams.limit) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-gray-400">
                  {usage.exams.current}/{usage.exams.limit} used
                </p>
              </Link>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                </div>
                
                <div className="flex space-x-1">
                  <button className="bg-gray-700 text-gray-300 text-xs py-1 px-2 rounded-full">
                    All
                  </button>
                  <button className="bg-gray-900 text-gray-300 text-xs py-1 px-2 rounded-full">
                    Exams
                  </button>
                  <button className="bg-gray-900 text-gray-300 text-xs py-1 px-2 rounded-full">
                    Students
                  </button>
                </div>
              </div>
              
              <div className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-1 before:bottom-0 before:w-0.5 before:bg-gray-700">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="mb-2 relative before:content-[''] before:absolute before:left-[-20px] before:top-2 before:w-3 before:h-3 before:rounded-full before:bg-gray-700"
                  >
                    <div className="bg-gray-900 rounded-lg p-2 border-l-2 border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {activity.type === "exam" && (
                            <div className="w-6 h-6 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                              <svg className="h-3 w-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                          {activity.type === "student" && (
                            <div className="w-6 h-6 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                              <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                          {activity.type === "teacher" && (
                            <div className="w-6 h-6 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                              <svg className="h-3 w-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          <div className="text-sm">
                            {activity.type === "exam" && (
                              <span className="text-white">
                                Exam <Link to={`/admin/exams/${activity.title}`} className="text-yellow-500">{activity.title}</Link>
                                <span className="text-gray-400"> was {activity.action}</span>
                              </span>
                            )}
                            {activity.type === "student" && (
                              <span className="text-white">
                                Student <Link to={`/admin/students/${activity.name}`} className="text-green-500">{activity.name}</Link>
                                <span className="text-gray-400"> was {activity.action}</span>
                              </span>
                            )}
                            {activity.type === "teacher" && (
                              <span className="text-white">
                                Teacher <Link to={`/admin/teachers/${activity.name}`} className="text-blue-500">{activity.name}</Link>
                                <span className="text-gray-400"> was {activity.action}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-gray-500 text-xs flex items-center ml-2">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-right mt-1">
                  <Link to="/admin/activity" className="text-xs text-yellow-500 hover:underline flex items-center justify-end">
                    View all activity
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-white">Performance Insights</h2>
                
                <div className="flex ml-auto">
                  <select className="bg-gray-700 text-gray-300 text-xs rounded border border-gray-600 px-1 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-500">
                    <option>Last 30 Days</option>
                    <option>Last Quarter</option>
                    <option>This Year</option>
                    <option>All Time</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Key Metrics */}
                <div className="bg-gray-900 rounded-lg p-3 flex flex-col md:col-span-1">
                  <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">Key Metrics</h3>
                  
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="10" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke="url(#gradient)" 
                          strokeWidth="10" 
                          strokeDasharray={`${2 * Math.PI * 45 * performanceInsights.averageScore / 100} ${2 * Math.PI * 45}`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#D97706" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{performanceInsights.averageScore}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-white font-semibold">Average Score</h4>
                      <p className="text-xs text-gray-400">School average: 72</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="10" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke="url(#gradient2)" 
                          strokeWidth="10" 
                          strokeDasharray={`${2 * Math.PI * 45 * performanceInsights.passRate / 100} ${2 * Math.PI * 45}`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{performanceInsights.passRate}%</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-white font-semibold">Pass Rate</h4>
                      <p className="text-xs text-gray-400">Target: 75%</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Exams Taken</span>
                      <span className="text-white">214</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Students Participated</span>
                      <span className="text-white">157</span>
                    </div>
                  </div>
                </div>
                
                {/* Score Distribution (Bar Chart) */}
                <div className="bg-gray-900 rounded-lg p-3 flex flex-col">
                  <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">Score Distribution</h3>
                  
                  <div className="flex-1 flex items-end space-x-2 mb-1">
                    {performanceInsights.scoreDistribution.map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t" 
                          style={{ height: `${item.count * 2}px` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    {performanceInsights.scoreDistribution.map((item, index) => (
                      <div key={index} className="text-center">
                        <span>{item.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Subject Performance */}
                <div className="bg-gray-900 rounded-lg p-3 flex flex-col">
                  <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">Subject Performance</h3>
                  
                  <div className="flex-1 space-y-2">
                    {performanceInsights.subjectPerformance.map((subject, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">{subject.subject}</span>
                          <span className="text-gray-400">{subject.score}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-1.5 rounded-full"
                            style={{ width: `${subject.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Monthly Performance Trend (Line chart) */}
                <div className="bg-gray-900 rounded-lg p-3 flex flex-col">
                  <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">Performance Trend</h3>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="relative flex-1 pt-5 pb-2">
                      {/* Y-axis grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        <div className="border-b border-gray-800 h-0"></div>
                        <div className="border-b border-gray-800 h-0"></div>
                        <div className="border-b border-gray-800 h-0"></div>
                        <div className="border-b border-gray-800 h-0"></div>
                      </div>
                      
                      {/* Chart line */}
                      <div className="relative h-full flex items-end">
                        <svg className="absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <path
                            d={`M0,${100 - performanceInsights.monthlyAverage[0].score} ${performanceInsights.monthlyAverage.map((point, i) => 
                              `L${(i * 100) / (performanceInsights.monthlyAverage.length - 1)},${100 - point.score}`
                            ).join(' ')}`}
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#F59E0B" />
                              <stop offset="100%" stopColor="#D97706" />
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Data points */}
                        <div className="absolute inset-0 flex justify-between items-end">
                          {performanceInsights.monthlyAverage.map((point, index) => (
                            <div 
                              key={index} 
                              className="w-2 h-2 bg-yellow-500 rounded-full"
                              style={{ marginBottom: `${point.score * 0.8}%` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      {performanceInsights.monthlyAverage.map((point, index) => (
                        <span key={index}>{point.month}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Top Performers */}
                <div className="bg-gray-900 rounded-lg p-3 flex flex-col">
                  <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">Top Performers</h3>
                  
                  <div className="flex-1">
                    {performanceInsights.topPerformers.map((student, index) => (
                      <div key={index} className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors mb-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-full mr-3 flex items-center justify-center text-xs font-bold text-yellow-500">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white text-sm">{student.name}</h4>
                          <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                            <div 
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-1 rounded-full" 
                              style={{ width: `${student.score}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-3">
                          <span className="text-xl font-bold text-yellow-500">{student.score}</span>
                        </div>
                      </div>
                    ))}
                    
                    <Link to="/admin/performance" className="text-xs text-yellow-500 hover:underline flex items-center justify-end mt-2">
                      View all students
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardHome;