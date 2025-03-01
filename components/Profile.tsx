import React from "react";

const Profile: React.FC = () => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Profile</h2>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div>
          <p className="font-semibold">John Doe</p>
          <p className="text-gray-500">Software Developer</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
