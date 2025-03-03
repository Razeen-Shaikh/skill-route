"use client";

import React from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

const nodes = [
  { id: "1", position: { x: 250, y: 0 }, data: { label: "Start" } },
  { id: "2", position: { x: 100, y: 150 }, data: { label: "Step 1" } },
  { id: "3", position: { x: 400, y: 150 }, data: { label: "Step 2" } },
  { id: "4", position: { x: 250, y: 300 }, data: { label: "Step 3" } },
  { id: "5", position: { x: 100, y: 450 }, data: { label: "Step 4" } },
  { id: "6", position: { x: 395, y: 450 }, data: { label: "Step 5" } },
  { id: "7", position: { x: 100, y: 600 }, data: { label: "Step 6" } },
  { id: "8", position: { x: 270, y: 600 }, data: { label: "Step 7" } },
  { id: "9", position: { x: 520, y: 600 }, data: { label: "Step 8" } },
  { id: "10", position: { x: 250, y: 750 }, data: { label: "End" } },
];

const edges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e4-5", source: "4", target: "5" },
  { id: "e4-6", source: "4", target: "6" },
  { id: "e5-7", source: "5", target: "7" },
  { id: "e6-8", source: "6", target: "8" },
  { id: "e6-9", source: "6", target: "9" },
  { id: "e7-10", source: "7", target: "10" },
  { id: "e8-10", source: "8", target: "10" },
  { id: "e9-10", source: "9", target: "10" },
];

const Roadmap: React.FC = () => {
  return (
    <div className="h-[100vh] w-full bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold text-center mb-4">Roadmap</h2>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default Roadmap;
