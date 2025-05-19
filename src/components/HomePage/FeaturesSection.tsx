import React from "react";

export default function FeaturesSection() {
  return (
    <section className="px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      <div className="bg-gray-900 p-6 rounded">
        <div className="text-yellow-400 text-3xl mb-2">📋</div>
        <h3 className="text-xl font-semibold mb-1">Take Exams</h3>
        <p className="text-sm text-gray-400">
          Students can participate in computer-based tests and exams.
        </p>
      </div>
      <div className="bg-gray-900 p-6 rounded">
        <div className="text-yellow-400 text-3xl mb-2">🏫</div>
        <h3 className="text-xl font-semibold mb-1">School Management</h3>
        <p className="text-sm text-gray-400">
          Schools can register, add admins, and manage accounts.
        </p>
      </div>
      <div className="bg-gray-900 p-6 rounded">
        <div className="text-yellow-400 text-3xl mb-2">⬆️</div>
        <h3 className="text-xl font-semibold mb-1">Question Upload</h3>
        <p className="text-sm text-gray-400">
          Teachers and examiners can upload questions and answers.
        </p>
      </div>
    </section>
  );
}
