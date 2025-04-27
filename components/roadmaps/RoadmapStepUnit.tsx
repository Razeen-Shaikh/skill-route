import { RoadmapStep } from "@/generated/prisma";
import { motion } from "framer-motion";
import { Lock, CheckCircle } from "lucide-react";

const RoadmapStepUnit = ({
    step,
    roadmapSteps,
}: {
    step: RoadmapStep;
    roadmapSteps: RoadmapStep[];
}) => {
    const isRootStep = !step.parentId;
    const isForceLocked = step.id === "12" && !step.completed;

    const isUnlocked =
        !isForceLocked &&
        (isRootStep ||
            roadmapSteps
                .filter((s) => s.id !== step.id)
                .filter((s) => s.id === step.parentId)
                .every((parent) => parent.completed));

    return (
        <motion.div
            data-id={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`roadmap-step relative w-60 p-6 rounded-xl shadow-lg transition-all backdrop-blur-lg border border-white ${isUnlocked
                ? "hover:shadow-xl bg-black text-white"
                : "bg-gray-800 text-gray-400 opacity-50 pointer-events-none"
                }`}
        >
            {!isUnlocked && (
                <motion.div
                    className="absolute top-3 right-3 text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Lock size={20} />
                </motion.div>
            )}
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="text-sm">{step.description}</p>
            <div className="w-full bg-gray-600 h-2 rounded mt-3 overflow-hidden">
                <motion.div
                    className="h-2 bg-gradient-to-r from-white to-gray-400 rounded"
                    initial={{ width: "0%" }}
                    animate={{ width: `${step.progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            {step.completed && (
                <motion.p
                    className="text-green-400 mt-4 flex items-center font-medium"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                >
                    <CheckCircle className="mr-2" size={20} /> Completed
                </motion.p>
            )}
        </motion.div>
    );
};

export default RoadmapStepUnit;