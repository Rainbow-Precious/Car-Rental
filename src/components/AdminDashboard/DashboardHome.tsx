import React from "react";
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
}

const TopNav: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
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
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
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
  return (
    <div className="min-h-screen w-screen bg-black flex flex-col">
      <TopNav />
      <main className="flex-1 flex flex-col items-center justify-start py-8">
        <div className="w-full max-w-6xl px-4 space-y-6">
          {/* School Overview and Exam Schedule Combined Horizontally */}
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col md:flex-row md:space-x-6">
            {/* School Overview */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">School Overview</h2>
              <p className="text-gray-400">School: Demo School</p>
              <p className="text-gray-400">Subscription: Trial</p>
              <p className="text-gray-400">Trial Days Left: 12</p>
              <Link
                to="/admin/settings"
                className="mt-2 inline-block bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400"
              >
                Manage Subscription
              </Link>
            </div>
            {/* Exam Schedule */}
            <div className="flex-1 mt-6 md:mt-0">
              <h2 className="text-lg font-semibold mb-4">Exam Schedule</h2>
              <ul className="space-y-2">
                {examSchedule.map((exam) => (
                  <li key={exam.id} className="text-gray-300">
                    {exam.title} - {new Date(exam.date).toLocaleString()} -{" "}
                    <span className="text-yellow-500">{exam.status}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/admin/exams"
                className="mt-2 text-yellow-500 hover:underline"
              >
                View All
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">
                {quickStats.totalStudents}
              </h3>
              <p className="text-gray-400">Total Students</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">
                {quickStats.totalTeachers}
              </h3>
              <p className="text-gray-400">Total Teachers</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">{quickStats.totalExams}</h3>
              <p className="text-gray-400">Total Exams</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">
                {quickStats.totalQuestions}
              </h3>
              <p className="text-gray-400">Questions in Bank</p>
            </div>
          </div>

          {/* Resource Usage Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Students Progress Bar - Make this a link */}
            <Link
              to="/admin/studentmanagement"
              className="bg-gray-800 p-4 rounded-lg block hover:bg-gray-700 transition"
              style={{ textDecoration: "none" }}
            >
              <h2 className="text-lg font-semibold mb-2">Students</h2>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-yellow-500 h-2.5 rounded-full"
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
              to="/admin/teachermanagement"
              className="bg-gray-800 p-4 rounded-lg block hover:bg-gray-700 transition"
              style={{ textDecoration: "none" }}
            >
              <h2 className="text-lg font-semibold mb-2">Teachers</h2>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-yellow-500 h-2.5 rounded-full"
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
              to="/admin/exammanagement"
              className="bg-gray-800 p-4 rounded-lg block hover:bg-gray-700 transition"
              style={{ textDecoration: "none" }}
            >
              <h2 className="text-lg font-semibold mb-2">Exams</h2>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-yellow-500 h-2.5 rounded-full"
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
            <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <div className="flex-shrink-0">
                    {activity.type === "exam" && (
                      <svg
                        className="h-6 w-6 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12V8a4 4 0 00-8 0v4m8 0l4 4m-4-4l-4-4"
                        />
                      </svg>
                    )}
                    {activity.type === "student" && (
                      <svg
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12V8a4 4 0 00-8 0v4m8 0l4 4m-4-4l-4-4"
                        />
                      </svg>
                    )}
                    {activity.type === "teacher" && (
                      <svg
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12V8a4 4 0 00-8 0v4m8 0l4 4m-4-4l-4-4"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    {activity.type === "exam" && (
                      <span>
                        Exam{" "}
                        <Link
                          to={`/admin/exams/${activity.title}`}
                          className="text-yellow-500 hover:underline"
                        >
                          {activity.title}
                        </Link>{" "}
                        was {activity.action} on{" "}
                        {new Date(activity.date).toLocaleString()}
                      </span>
                    )}
                    {activity.type === "student" && (
                      <span>
                        Student{" "}
                        <Link
                          to={`/admin/students/${activity.name}`}
                          className="text-green-500 hover:underline"
                        >
                          {activity.name}
                        </Link>{" "}
                        was {activity.action} on{" "}
                        {new Date(activity.date).toLocaleString()}
                      </span>
                    )}
                    {activity.type === "teacher" && (
                      <span>
                        Teacher{" "}
                        <Link
                          to={`/admin/teachers/${activity.name}`}
                          className="text-blue-500 hover:underline"
                        >
                          {activity.name}
                        </Link>{" "}
                        was {activity.action} on{" "}
                        {new Date(activity.date).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Performance Insights</h2>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1 bg-gray-700 p-4 rounded-lg">
                <h3 className="text-md font-semibold mb-2">Average Score</h3>
                <div className="text-center">
                  <span className="text-4xl font-bold text-yellow-500">
                    {performanceInsights.averageScore}%
                  </span>
                </div>
              </div>
              <div className="flex-1 bg-gray-700 p-4 rounded-lg">
                <h3 className="text-md font-semibold mb-2">Pass Rate</h3>
                <div className="text-center">
                  <span className="text-4xl font-bold text-yellow-500">
                    {performanceInsights.passRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;