// src/Routes/route.tsx
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import SignInPage from "../components/HomePage/Login/SignInPage";
import VerifyOtpPage from "../components/HomePage/Login/VerifyOtpPage";
import PricingPage from "../../src/components/HomePage/Navigation/PricingPage";
import ForgotPasswordPage from "../components/HomePage/Login/ForgotPasswordPage";
import ResetPasswordPage from "../components/HomePage/Login/ResetPasswordPage";
import DashboardHome from "../components/AdminDashboard/DashboardHome";
import CarManagement from "../components/AdminDashboard/CarManagement";
import CustomerManagement from "../components/AdminDashboard/CustomerManagement";
import BookingManagement from "../components/AdminDashboard/BookingManagement";
import Settings from "../components/AdminDashboard/Settings";
import AuthCheck from "../utils/AuthCheck";
import CustomerDashboard from "../components/CustomerDashboard/CustomerDashboard";

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
    element: <DashboardHome />,
  },

  // Admin management routes
  {
    path: "/admin/cars",
    element: (
      <AuthCheck>
        <CarManagement />
      </AuthCheck>
    ),
  },
  {
    path: "/admin/customers",
    element: (
      <AuthCheck>
        <CustomerManagement />
      </AuthCheck>
    ),
  },
  {
    path: "/admin/bookings",
    element: (
      <AuthCheck>
        <BookingManagement />
      </AuthCheck>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <AuthCheck>
        <Settings />
      </AuthCheck>
    ),
  },

  // Customer Dashboard routes
  {
    path: "/customer/dashboard",
    element: <CustomerDashboard />,
  },
  {
    path: "/customer/bookings",
    element: (
      <AuthCheck>
        <CustomerDashboard />
      </AuthCheck>
    ),
  },
  {
    path: "/customer/history",
    element: (
      <AuthCheck>
        <CustomerDashboard />
      </AuthCheck>
    ),
  },

  // Catch-all route
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
