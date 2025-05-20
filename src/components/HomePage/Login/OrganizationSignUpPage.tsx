import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";

export default function OrganizationSignUpPage() {
  const [form, setForm] = useState({
    orgName: "",
    orgType: "",
    industry: "", 
    address: "",
    city: "",
    state: "",
    firstName: "",
    lastName: "",
    position: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form validation and submission logic
    console.log("Submitting Organization Registration", form);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col text-white">
      <Navigation />
      <div className="flex justify-center flex-1">
        <div className="max-w-5xl w-full bg-black flex flex-col flex-1">
          {/* Main Content */}
          <main className="flex flex-1 items-center justify-center w-full py-8">
            <div className="px-4 w-full">
              <div className="flex items-center justify-center w-full max-w-2xl mx-auto">
                <div className="w-full bg-gray-900 p-8 rounded shadow-xl">
                  <h2 className="text-2xl font-bold text-center mb-6">
                    Register as an Organization
                  </h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <h3 className="text-lg font-semibold border-b border-gray-700 pb-1">Organization Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="orgName"
                        type="text"
                        placeholder="Organization Name*"
                        value={form.orgName}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                      />
                      <select
                        name="orgType"
                        value={form.orgType}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                      >
                        <option value="">Select Organization Type*</option>
                        <option value="business">Business</option>
                        <option value="nonprofit">Non-Profit</option>
                        <option value="government">Government</option>
                        <option value="training">Training Center</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <select
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                    >
                      <option value="">Select Industry*</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="service">Service</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      name="address"
                      type="text"
                      placeholder="Organization Address*"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="city"
                        type="text"
                        placeholder="City*"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                      />
                      <input
                        name="state"
                        type="text"
                        placeholder="State*"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold border-b border-gray-700 pb-1 mt-6">Administrator Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="firstName"
                        type="text"
                        placeholder="First Name*"
                        value={form.firstName}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                      />
                      <input
                        name="lastName"
                        type="text"
                        placeholder="Last Name*"
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                      />
                    </div>
                    <input
                      name="position"
                      type="text"
                      placeholder="Position/Role*"
                      value={form.position}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder="Email Address*"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                    />
                    <input
                      name="phoneNumber"
                      type="tel"
                      placeholder="Phone Number*"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                      required
                    />
                    
                    <h3 className="text-lg font-semibold border-b border-gray-700 pb-1 mt-6">Account Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="password"
                        type="password"
                        placeholder="Password*"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                        required
                      />
                      <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password*"
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
                      <span>I agree to the Terms and Conditions*</span>
                    </label>
                    <button
                      type="submit"
                      className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200"
                    >
                      Register Organization
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
                  <p className="text-center text-sm text-gray-400 mt-2">
                    Need to register as a school?{" "}
                    <Link
                      to="/signup/school"
                      className="text-yellow-400 hover:underline"
                    >
                      Register as School
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
} 