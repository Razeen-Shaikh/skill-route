"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Roadmap } from "@prisma/client";
import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchRoadmaps } from "@/lib/api";

const SelectRoadmapPage = () => {
  const router = useRouter();

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: () => fetchRoadmaps(),
    refetchOnWindowFocus: false,
  });

  const handleRoadmapClick = (roadmapId: string) => {
    router.push(`/roadmaps/${roadmapId}`);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="w-full h-screen bg-black text-white flex items-center justify-center">
        <p>No roadmaps found.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col items-center p-8 overflow-auto">
      <h1 className="text-3xl font-semibold mb-6">Select a Roadmap</h1>
      <div className="flex flex-wrap gap-6 justify-center w-full max-w-5xl">
        {roadmaps?.map((roadmap) => (
          <motion.div
            key={roadmap.id}
            className="w-72 p-6 rounded-lg bg-gray-800 shadow-xl cursor-pointer"
            onClick={() => handleRoadmapClick(roadmap.id)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold">{roadmap.title}</h3>
            <p className="text-sm text-gray-400">{roadmap.description}</p>
            <div className="w-full bg-gray-600 h-2 rounded mt-3 overflow-hidden">
              {/* You can implement a progress bar here */}
              <motion.div
                className="h-2 bg-gradient-to-r from-white to-gray-400 rounded"
                initial={{ width: "0%" }}
                animate={{ width: "50%" }}  // Placeholder for progress
                transition={{ duration: 0.5 }}
              />
            </div>
            <motion.p
              className="text-blue-400 mt-4 flex items-center font-medium"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            >
              <CheckCircle className="mr-2" size={20} /> Select
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SelectRoadmapPage;
