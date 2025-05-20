import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <header className="w-full flex justify-between items-center px-8 py-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-700 shadow-lg">
      <div className="max-w-5xl w-full mx-auto flex justify-between items-center">
        <div className="text-2xl font-extrabold flex items-center gap-2 text-white">
          <div className="bg-yellow-400 rounded-full w-7 h-7 flex items-center justify-center text-black font-extrabold shadow-md">
            *
          </div>
          MYSTAR CBT
        </div>
        <nav className="flex gap-8 items-center text-sm">
          <a
            href="#features"
            className="relative text-gray-200 font-semibold py-2 px-1 transition-all duration-300 hover:text-yellow-400 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            Features
          </a>
          <a
            href="/pricing"
            className="relative text-gray-200 font-semibold py-2 px-1 transition-all duration-300 hover:text-yellow-400 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            Pricing
          </a>
          <a
            href="#about"
            className="relative text-gray-200 font-semibold py-2 px-1 transition-all duration-300 hover:text-yellow-400 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            About
          </a>
          <a
            href="#contact"
            className="relative text-gray-200 font-semibold py-2 px-1 transition-all duration-300 hover:text-yellow-400 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </a>
          <Link
            to="/signin"
            className="relative text-gray-200 font-semibold py-2 px-1 transition-all duration-300 hover:text-yellow-400 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            Sign In
          </Link>
          <Link
            to="/signup/school"
            className="relative text-gray-200 font-semibold py-2 px-1 transition-all duration-300 hover:text-yellow-400 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            As School
          </Link>
          <Link
            to="/signup/organization"
            className="relative text-gray-200 font-semibold py-2 px-1 transition-all duration-300 hover:text-yellow-400 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            As Organization
          </Link>
          <Link
            to="/signup"
            className="ml-4 border border-yellow-400 px-5 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold shadow-md hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
