import React, { useState } from "react";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    // On successful login, navigate to dashboard
    navigate("/dashboard");
  };

  const renderSelectAccountType = () => {
    return (
      <div className="w-full bg-gray-900 p-8 rounded shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          Sign In to Your Account
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Please select your account type to continue
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setSelectedOption("school")}
            className="bg-gray-800 border border-gray-700 hover:border-yellow-500 px-6 py-8 rounded text-left hover:bg-gray-800/50 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-white mb-2">School</h3>
            <p className="text-gray-400 text-sm">
              Sign in to your school administrator account
            </p>
          </button>
          <button
            onClick={() => setSelectedOption("organization")}
            className="bg-gray-800 border border-gray-700 hover:border-yellow-500 px-6 py-8 rounded text-left hover:bg-gray-800/50 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Organization
            </h3>
            <p className="text-gray-400 text-sm">
              Sign in to your organization account
            </p>
          </button>
        </div>
        <p className="text-sm text-gray-400 text-center mt-8">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    );
  };

  const renderLoginForm = (accountType: string) => {
    return (
      <div className="w-full bg-gray-900 p-8 rounded shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedOption(null)}
            className="text-gray-400 hover:text-white flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h2 className="text-2xl font-bold text-center flex-1 pr-16">
            {accountType === "school" ? "School Login" : "Organization Login"}
          </h2>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            className="bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="text-gray-400 hover:text-yellow-400"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400"
          >
            Sign In
          </button>
        </form>
        <p className="text-sm text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <Link
            to={`/signup/${accountType}`}
            className="text-yellow-400 hover:underline"
          >
            Sign Up as {accountType === "school" ? "School" : "Organization"}
          </Link>
        </p>
      </div>
    );
  };

  return (
    <div className="w-screen min-h-screen flex flex-col text-white">
      <Navigation />
      <div className="flex justify-center flex-1">
        <div className="max-w-5xl w-full bg-black flex flex-col flex-1">
          {/* Main Content */}
          <main className="flex flex-1 items-center justify-center w-full">
            <div className="px-4 w-full">
              <div className="flex items-center justify-center w-full max-w-md">
                {selectedOption === null
                  ? renderSelectAccountType()
                  : renderLoginForm(selectedOption)}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
