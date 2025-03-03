import Link from "next/link";
import React from "react";

const Profile: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 absolute left-4"
      >
        Back
      </Link>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-white">
          🏆
        </div>
        <p className="text-lg font-semibold text-gray-700">
          Rank: <span className="text-blue-500">Expert</span>
        </p>
        <p className="text-lg font-semibold text-gray-700">
          Points: <span className="text-green-500">1200</span>
        </p>
      </div>
    </div>
  );
};

export default Profile;
