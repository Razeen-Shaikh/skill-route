import React from "react";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to Your Learning Hub! 🚀
      </h1>
      <p className="text-gray-600 mt-4">
        Explore tutorials, track your roadmap, and grow your skills.
      </p>

      <div className="mt-6 space-x-4">
        <Link
          href="/roadmap"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Roadmap
        </Link>
        <Link
          href="/tutorial-list"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Tutorials
        </Link>
        <Link
          href="/profile"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          My Profile
        </Link>
      </div>
    </div>
  );
};

export default Home;
