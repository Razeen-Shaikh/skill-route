import React from "react";

const Roadmap: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-blue-600">Roadmap 🛣️</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
          <li>Step 1: Learn Basics</li>
          <li>Step 2: Understand Frameworks</li>
          <li>Step 3: Build Projects</li>
          <li>Step 4: Prepare for Interviews</li>
        </ul>
      </div>
    </div>
  );
};

export default Roadmap;
