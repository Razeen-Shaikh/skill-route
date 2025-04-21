"use client";

import useRoadmap from "@/hooks/useRoadmap";
import { RoadmapStep } from "@prisma/client";
import { motion } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";
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

const RoadmapTree = ({ roadmapId }: { roadmapId: string }) => {
  console.log({ roadmapId })
  const { steps: roadmapSteps } = useRoadmap(roadmapId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  const levels = useMemo(() => {
    const levelMap: Record<number, RoadmapStep[]> = {};
    const visited = new Set<string>();

    const assignLevels = (step: RoadmapStep, depth: number) => {
      if (visited.has(step.id)) return;
      visited.add(step.id);

      levelMap[depth] = levelMap[depth] || [];
      levelMap[depth].push(step);

      const children: RoadmapStep[] = roadmapSteps.filter((s: RoadmapStep) => s.parentId === step.id);
      children.forEach((child) => assignLevels(child, depth + 1));
    };

    const rootSteps = roadmapSteps.filter((step: RoadmapStep) => step.parentId === null);
    rootSteps.forEach((root: RoadmapStep) => assignLevels(root, 0));

    return levelMap;
  }, [roadmapSteps]);

  const renderConnections = () => {
    if (!roadmapSteps || !positions) return null;
    return roadmapSteps.flatMap((step: RoadmapStep) => {
      const children = roadmapSteps.filter((s: RoadmapStep) => s.parentId === step.id);
      return children.map((child: RoadmapStep) => {
        const from = positions[step.id];
        const to = positions[child.id];

        if (!from || !to) return null;

        return (
          <motion.line
            key={`${step.id}-${child.id}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={child.status === "COMPLETED" ? "#ffffff" : "#999999"}
            strokeDasharray={child.status === "COMPLETED" ? "0" : "5"}
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        );
      });
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    setTimeout(() => {
      const elements = containerRef.current?.querySelectorAll(".roadmap-step") || [];
      const newPositions: Record<string, { x: number; y: number }> = {};
      const parentRect = containerRef.current?.getBoundingClientRect();
      if (!parentRect) return;

      elements.forEach((el) => {
        const element = el as HTMLElement;
        const id = element.getAttribute("data-id");
        if (!id) return;
        const rect = element.getBoundingClientRect();

        newPositions[id] = {
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top + rect.height / 2,
        };
      });

      setPositions(newPositions);
    }, 300);
  }, [levels]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-start p-8 overflow-auto bg-black text-white"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {renderConnections()}
      </svg>

      {Object.entries(levels).map(([depth, steps]) => (
        <div
          key={depth}
          className="flex flex-wrap justify-center gap-10 my-8 w-full max-w-6xl"
        >
          {steps.map((step) => (
            <RoadmapStepUnit key={step.id} step={step} roadmapSteps={roadmapSteps} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default RoadmapTree;
