import React from "react";

const TutorialList: React.FC = () => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Tutorial List</h2>
      <ul className="list-disc pl-5">
        <li>Getting Started with React</li>
        <li>Understanding TypeScript Basics</li>
        <li>State Management with Zustand</li>
        <li>Building a Full-Stack App with Next.js</li>
      </ul>
    </div>
  );
};

export default TutorialList;
