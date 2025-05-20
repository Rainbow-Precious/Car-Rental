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
import Settings from "../components/AdminDashboard/Settings";
import SetupWizard from "../components/SetupWizard/SetupWizard";

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
  {
    path: "/dashboard",
    element: <DashboardHome />,
  },
  {
    path: "/setup",
    element: <SetupWizard />,
  },
  {
    path: "/admin/studentmanagement",
    element: <StudentManagement />,
  },
  {
    path: "/admin/teachermanagement",
    element: <TeacherManagement />,
  },
  {
    path: "/admin/exammanagement",
    element: <ExamManagement />,
  },
  {
    path: "/admin/settings",
    element: <Settings />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
