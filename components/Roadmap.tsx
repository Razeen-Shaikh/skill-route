import React from "react";

const Roadmap: React.FC = () => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Roadmap</h2>
      <ul className="list-disc pl-5">
        <li>Step 1: Introduction</li>
        <li>Step 2: Basics</li>
        <li>Step 3: Advanced Topics</li>
        <li>Step 4: Project Implementation</li>
      </ul>
    </div>
  );
};

export default Roadmap;
