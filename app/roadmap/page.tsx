"use client";

import React from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

const nodes = [
  { id: "1", position: { x: 250, y: 0 }, data: { label: "Start" } },
  { id: "2", position: { x: 100, y: 150 }, data: { label: "Step 1" } },
  { id: "3", position: { x: 400, y: 150 }, data: { label: "Step 2" } },
  { id: "4", position: { x: 250, y: 300 }, data: { label: "End" } },
];

const edges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-4", source: "3", target: "4" },
];

const Roadmap: React.FC = () => {
  return (
    <div className="max-h-[100vh] w-full bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
        📌 Roadmap
      </h2>
      <div className="h-[88vh] rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Roadmap;
