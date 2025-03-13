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
        <Link
          href="/quiz/1"
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          Take a Quiz
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Dashboard
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
