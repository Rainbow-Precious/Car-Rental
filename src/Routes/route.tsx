// src/Routes/route.tsx
import React from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import SignInPage from "../components/HomePage/Login/SignInPage";
import SignUpPage from "../components/HomePage/Login/SignUpPage";
import SchoolSignUpPage from "../components/HomePage/Login/SchoolSignUpPage";
import OrganizationSignUpPage from "../components/HomePage/Login/OrganizationSignUpPage";
import VerifyOtpPage from "../components/HomePage/Login/VerifyOtpPage";
import PricingPage from "../../src/components/HomePage/Navigation/PricingPage";
import ForgotPasswordPage from "../components/HomePage/Login/ForgotPasswordPage";
import ResetPasswordPage from "../components/HomePage/Login/ResetPasswordPage";
import DashboardHome from "../components/AdminDashboard/DashboardHome";
import StudentManagement from "../components/AdminDashboard/StudentManagement";
import TeacherManagement from "../components/AdminDashboard/TeacherManagement";
import ExamManagement from "../components/AdminDashboard/ExamManagement";
import CampusManagement from "../components/AdminDashboard/CampusManagement";
import ClassManagement from "../components/AdminDashboard/ClassManagement";
import ClassDetail from "../components/AdminDashboard/ClassManagement/ClassDetail";
import Settings from "../components/AdminDashboard/Settings";
import SetupWizard from "../components/SetupWizard/SetupWizard";
import AuthCheck from "../utils/AuthCheck";

// Public routes that anyone can access
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/signup/school",
    element: <SchoolSignUpPage />,
  },
  {
    path: "/signup/organization",
    element: <OrganizationSignUpPage />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtpPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  
  // Protected Admin Dashboard routes
  {
    path: "/dashboard",
    element: <AuthCheck><DashboardHome /></AuthCheck>,
  },
  {
    path: "/setup",
    element: <AuthCheck><SetupWizard /></AuthCheck>,
  },
  
  // Admin management routes - grouped logically
  {
    path: "/admin/students",
    element: <AuthCheck><StudentManagement /></AuthCheck>,
  },
  {
    path: "/admin/teachers",
    element: <AuthCheck><TeacherManagement /></AuthCheck>,
  },
  {
    path: "/admin/exams",
    element: <AuthCheck><ExamManagement /></AuthCheck>,
  },
  {
    path: "/admin/campuses",
    element: <AuthCheck><CampusManagement /></AuthCheck>,
  },
  {
    path: "/admin/classes",
    element: <AuthCheck><ClassManagement /></AuthCheck>,
  },
  {
    path: "/admin/classes/:classId",
    element: <AuthCheck><ClassDetail /></AuthCheck>,
  },
  {
    path: "/admin/settings",
    element: <AuthCheck><Settings /></AuthCheck>,
  },
  
  // Redirect old routes to new ones for backward compatibility
  {
    path: "/admin/studentmanagement",
    element: <Navigate to="/admin/students" replace />,
  },
  {
    path: "/admin/teachermanagement",
    element: <Navigate to="/admin/teachers" replace />,
  },
  {
    path: "/admin/exammanagement",
    element: <Navigate to="/admin/exams" replace />,
  },
  {
    path: "/admin/class-management",
    element: <Navigate to="/admin/classes" replace />,
  },
  {
    path: "/admin/class-management/:classId",
    element: <Navigate to="/admin/classes/:classId" replace />,
  },
  
  // Catch-all route
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
