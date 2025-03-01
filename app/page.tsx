import React from "react";
import Roadmap from "../components/Roadmap";
import Profile from "../components/Profile";
import TutorialList from "../components/TutorialList";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Profile />
        <Roadmap />
        <TutorialList />
      </div>
    </div>
  );
};

export default Home;
