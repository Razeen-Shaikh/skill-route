"use client";

import useRoadmap from "@/hooks/useRoadmap";
import { motion } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import RoadmapStepUnit from "@/components/roadmaps/RoadmapStepUnit";
import { RoadmapStep } from "@/generated/prisma";

const RoadmapTree = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const { id: roadmapId } = useParams();

  const { steps: roadmapSteps } = useRoadmap(roadmapId as string);

  const levels = useMemo(() => {
    const levelMap: Record<number, RoadmapStep[]> = {};
    const visited = new Set<string>();

    const assignLevels = (step: RoadmapStep, depth: number) => {
      if (visited.has(step.id)) return;
      visited.add(step.id);

      levelMap[depth] = levelMap[depth] || [];
      levelMap[depth].push(step);

      const children: RoadmapStep[] = roadmapSteps.filter(
        (s: RoadmapStep) => s.parentId === step.id
      );
      children.forEach((child) => assignLevels(child, depth + 1));
    };

    const rootSteps = roadmapSteps.filter(
      (step: RoadmapStep) => step.parentId === null
    );
    rootSteps.forEach((root: RoadmapStep) => assignLevels(root, 0));

    return levelMap;
  }, [roadmapSteps]);

  const renderConnections = () => {
    if (!roadmapSteps || !positions) return null;
    return roadmapSteps.flatMap((step: RoadmapStep) => {
      const children = roadmapSteps.filter(
        (s: RoadmapStep) => s.parentId === step.id
      );
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
            stroke={
              child.status === "COMPLETED"
                ? "var(--stroke-color-completed)"
                : "var(--stroke-color-pending)"
            }
            strokeDasharray={child.status === "COMPLETED" ? "0" : "5"}
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="dark:stroke-white stroke-gray-400"
          />
        );
      });
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    setTimeout(() => {
      const elements =
        containerRef.current?.querySelectorAll(".roadmap-step") || [];
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
      className="relative w-full h-screen flex flex-col items-center justify-start p-8 overflow-y-auto"
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
            <RoadmapStepUnit
              key={step.id}
              step={step}
              roadmapSteps={roadmapSteps}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default RoadmapTree;
