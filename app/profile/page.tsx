import React from "react";

const Profile: React.FC = () => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200 text-center h-full">
      <h2 className="text-2xl font-bold text-blue-600 mb-2">👤 Profile</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700">
          U
        </div>
        <p className="text-lg font-semibold text-gray-800">Username</p>
        <div className="w-full bg-gray-100 p-3 rounded-lg">
          <p className="text-gray-600 text-sm">
            🏆 Rank: <span className="font-bold text-blue-500">Gold</span>
          </p>
          <p className="text-gray-600 text-sm">
            ⭐ Points: <span className="font-bold text-green-500">1200</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
