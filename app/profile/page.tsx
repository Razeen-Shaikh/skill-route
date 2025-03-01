import React from "react";

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="max-w-sm bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto"></div>
        <h2 className="text-xl font-bold mt-4 text-gray-900">John Doe</h2>
        <p className="text-gray-500">Software Developer</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
