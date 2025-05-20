import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";

export default function SignUpPage() {
  const navigate = useNavigate();

  const handleSchoolSignup = () => {
    navigate("/signup/school");
  };

  const handleOrganizationSignup = () => {
    navigate("/signup/organization");
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
                <div className="w-full bg-gray-900 p-8 rounded shadow-xl">
                  <h2 className="text-2xl font-bold text-center mb-6">
                    Create Your Account
                  </h2>
                  <p className="text-gray-400 text-center mb-8">
                    Please select your account type to continue
                  </p>
                  <div className="flex flex-col gap-6">
                    <button
                      onClick={handleSchoolSignup}
                      className="bg-gray-800 border border-gray-700 hover:border-yellow-500 px-6 py-10 rounded text-left hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <h3 className="text-xl font-semibold text-white mb-2">School</h3>
                      <p className="text-gray-400 text-sm">
                        Register your educational institution to create and manage exams for your students.
                      </p>
                    </button>
                    <button
                      onClick={handleOrganizationSignup}
                      className="bg-gray-800 border border-gray-700 hover:border-yellow-500 px-6 py-10 rounded text-left hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Organization
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Register your business or organization to create assessments for training, recruitment, or other purposes.
                      </p>
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-8">
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
        </div>
      </div>
      <Footer />
    </div>
  );
}
