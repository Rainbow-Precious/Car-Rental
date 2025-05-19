import React from "react";

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 items-center px-8 py-16 gap-8">
      <div>
        <h1 className="text-4xl font-bold leading-tight mb-4">
          Empowering Online Assessments
        </h1>
        <p className="text-gray-300 mb-6">
          Students can take exams and tests, schools can manage accounts, and
          teachers can upload questions and answers.
        </p>
        <button className="border border-yellow-400 px-6 py-2 rounded hover:bg-yellow-400 hover:text-black text-black">
          Get Started
        </button>
      </div>
      <div>
        <img
          src="/banner-user-dark.png"
          alt="Student using laptop"
          className="rounded"
        />
      </div>
    </section>
  );
}
