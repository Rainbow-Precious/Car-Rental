import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";

export default function SignUpPage() {
  const [form, setForm] = useState({
    schoolName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form validation and submission logic
    console.log("Submitting", form);
  };

  return (
    <div className="w-screen min-h-screen flex justify-center text-white">
      <div className="max-w-5xl w-full bg-black flex flex-col flex-1">
        {/* Header */}
        <Navigation />

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center w-full">
          <div className="px-4 w-full">
            <div className="flex items-center justify-center w-full max-w-md">
              <div className="w-full bg-gray-900 p-8 rounded shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Create Your Account
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="schoolName"
                      type="text"
                      placeholder="School Name"
                      value={form.schoolName}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                    />
                    <input
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                    />
                    <input
                      name="middleName"
                      type="text"
                      placeholder="Middle Name"
                      value={form.middleName}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                    />
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                    required
                  />
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                    />
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      name="terms"
                      type="checkbox"
                      checked={form.terms}
                      onChange={handleChange}
                      className="accent-yellow-500"
                      required
                    />
                    <span>I agree to the Terms and Conditions</span>
                  </label>
                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-4">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-yellow-400 hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
