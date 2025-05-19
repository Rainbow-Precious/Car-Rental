import React from "react";

export default function Footer() {
  return (
    <footer className="px-8 py-6 bg-black border-t border-gray-800 text-sm text-gray-400">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex gap-4 mb-4 md:mb-0">
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#pricing" className="hover:text-white">
            Pricing
          </a>
          <a href="#about" className="hover:text-white">
            About
          </a>
          <a href="#contact" className="hover:text-white">
            Contact
          </a>
          <a href="#faqs" className="hover:text-white">
            FAQs
          </a>
        </div>
        <div>© 2024 Mystar CBT. All rights reserved.</div>
      </div>
    </footer>
  );
}
