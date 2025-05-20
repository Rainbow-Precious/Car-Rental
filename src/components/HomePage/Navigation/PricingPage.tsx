import React, { useState } from "react";
import Navigation from "./Navigation";
import Footer from "../../HomePage/Footer";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const toggleBilling = () => {
    setIsYearly((prev) => !prev);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col text-white">
      <Navigation />
      <div className="flex justify-center flex-1">
        <div className="max-w-5xl w-full bg-black flex flex-col flex-1">
          {/* Main Content */}
          <main className="flex flex-1 items-center justify-center w-full py-16">
            <div className="px-4 w-full">
              <h1 className="text-4xl font-bold text-center mb-6">
                Choose Your Subscription Plan
              </h1>
              <div className="flex justify-center space-x-2 mb-8">
                <button
                  onClick={toggleBilling}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-l-md hover:bg-yellow-400"
                >
                  Monthly
                </button>
                <button
                  onClick={toggleBilling}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-r-md hover:bg-yellow-400"
                >
                  Yearly (16.7% off)
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Plan */}
                <div className="bg-transparent border border-gray-700 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors">
                  <h2 className="text-2xl font-semibold mb-4">Basic</h2>
                  <p className="text-gray-400 mb-4">For small institutions</p>
                  <p className="text-3xl font-bold mb-6">
                    {isYearly ? "₦100,000/year" : "₦10,000/month"}
                  </p>
                  <ul className="text-gray-300 space-y-3 mb-6">
                    <li>100 Students</li>
                    <li>10 Teachers</li>
                    <li>5 Examiners</li>
                    <li>1,000 Questions</li>
                    <li>Basic Analytics</li>
                  </ul>
                  <div className="flex flex-col space-y-3">
                    <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
                      Choose Plan
                    </button>
                    <button className="bg-yellow-600 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-500">
                      Free Trial
                    </button>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="bg-transparent border border-gray-700 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors">
                  <h2 className="text-2xl font-semibold mb-4">Premium</h2>
                  <p className="text-gray-400 mb-4">For growing institutions</p>
                  <p className="text-3xl font-bold mb-6">
                    {isYearly ? "₦300,000/year" : "₦30,000/month"}
                  </p>
                  <ul className="text-gray-300 space-y-3 mb-6">
                    <li>500 Students</li>
                    <li>50 Teachers</li>
                    <li>20 Examiners</li>
                    <li>5,000 Questions</li>
                    <li>Advanced Analytics</li>
                    <li>Custom Branding</li>
                  </ul>
                  <div className="flex flex-col space-y-3">
                    <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
                      Choose Plan
                    </button>
                    <button className="bg-yellow-600 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-500">
                      Free Trial
                    </button>
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-transparent border border-gray-700 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors">
                  <h2 className="text-2xl font-semibold mb-4">Enterprise</h2>
                  <p className="text-gray-400 mb-4">For large institutions</p>
                  <p className="text-3xl font-bold mb-6">
                    {isYearly ? "₦500,000/year" : "₦50,000/month"}
                  </p>
                  <ul className="text-gray-300 space-y-3 mb-6">
                    <li>Unlimited Students</li>
                    <li>Unlimited Teachers</li>
                    <li>Unlimited Examiners</li>
                    <li>Unlimited Questions</li>
                    <li>AI-Driven Insights</li>
                    <li>Adaptive Testing</li>
                  </ul>
                  <div className="flex flex-col space-y-3">
                    <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400">
                      Choose Plan
                    </button>
                    <button className="bg-yellow-600 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-500">
                      Free Trial
                    </button>
                  </div>
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