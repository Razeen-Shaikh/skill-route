"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    console.log(`Selected Roadmap ID: ${roadmapId}`);

    router.push(`/roadmaps/${roadmapId}`);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>No roadmaps found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800 dark:text-white">
          Select a Roadmap
        </h1>

        <div className="container flex flex-wrap gap-6 mx-auto justify-center overflow-y-auto max-h-[calc(100vh-200px)]">
          {roadmaps.map((roadmap) => (
            <motion.div
              key={roadmap.id}
              className="w-72 h-64 p-6 rounded-2xl cursor-pointer bg-white dark:bg-gray-800 flex flex-col justify-between border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
              onClick={() => handleRoadmapClick(roadmap.id)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {roadmap.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {(roadmap.description ?? "").length > 90
                    ? `${(roadmap.description ?? "").slice(0, 89)}...`
                    : roadmap.description ?? ""}
                </p>
                <div className="w-full h-2 rounded mt-4 overflow-hidden">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-gray-200 to-gray-500 dark:from-gray-600 dark:to-gray-300 rounded"
                    initial={{ width: "0%" }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <motion.p
                className="text-blue-600 dark:text-blue-400 mt-4 flex items-center font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              >
                <CheckCircle className="mr-2" size={20} /> Select
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectRoadmapPage;
