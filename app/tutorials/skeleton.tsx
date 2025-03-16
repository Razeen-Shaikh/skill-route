// Skeleton Loader for tuturials page
import React from "react";

const Skeleton = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 animate-pulse">
        <div className="h-4 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default Skeleton;
