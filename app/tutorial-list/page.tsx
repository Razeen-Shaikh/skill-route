import React from "react";

const TutorialList: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-600">Tutorial List 📚</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
          <li>React Basics</li>
          <li>Advanced TypeScript</li>
          <li>State Management with Zustand</li>
          <li>Building a Full-Stack App with Next.js</li>
        </ul>
      </div>
    </div>
  );
};

export default TutorialList;
