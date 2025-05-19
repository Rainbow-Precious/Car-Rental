import React, { useState } from "react";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    // On successful login, navigate to dashboard
    navigate("/dashboard");
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
                  Sign In to Your Account
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="bg-black border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    to="/signup"
                    className="text-yellow-400 hover:underline"
                  >
                    Sign Up
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
