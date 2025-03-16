"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

const roadmapData = [
  {
    id: "1",
    label: "HTML & CSS",
    level: "Beginner",
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    label: "JavaScript",
    level: "Beginner",
    position: { x: 100, y: 150 },
  },
  {
    id: "3",
    label: "React.js",
    level: "Intermediate",
    position: { x: 400, y: 150 },
  },
  {
    id: "4",
    label: "Next.js & TypeScript",
    level: "Advanced",
    position: { x: 250, y: 300 },
  },
];

const edges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-4", source: "3", target: "4" },
];

const nodeStyles: Record<string, string> = {
  Beginner: "bg-green-500 text-white border-green-700",
  Intermediate: "bg-yellow-500 text-white border-yellow-700",
  Advanced: "bg-red-500 text-white border-red-700",
};

const CustomNode = ({
  data,
}: {
  data: {
    id: string;
    label: string;
    level: string;
    position: { x: number; y: number };
  };
}) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={`p-3 text-center rounded-lg border shadow-md w-36 ${
            nodeStyles[data.level]
          }`}
        >
          {data.label}
          <Handle type="target" position={Position.Top} />
          <Handle type="source" position={Position.Bottom} />
        </div>
      </TooltipTrigger>
      <TooltipContent>{data.label}</TooltipContent>
    </Tooltip>
  );
};

const Roadmap = () => {
  const [nodes, setNodes] = useState(
    roadmapData.map((node) => ({
      id: node.id,
      position: node.position,
      data: { label: node.label, level: node.level },
      type: "custom",
    }))
  );

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        🚀 Frontend Roadmap
      </h2>
      <div className="h-[85vh] w-full rounded-lg overflow-hidden border border-gray-300 bg-white p-4">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ custom: CustomNode }}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Roadmap;
