"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface CircleData {
  label: string;
  progress: number;
  color: string;
  link: string;
  position: { x: number; y: number };
  connections?: string[]; // Stores which circles this should connect to
}

// Define circles with explicit connections
const circles: CircleData[] = [
  {
    label: "Preprocessors",
    progress: 40,
    color: "#9333ea",
    link: "/preprocessors",
    position: { x: 250, y: 350 },
  },
  {
    label: "Tailwind CSS",
    progress: 80,
    color: "#2563eb",
    link: "/tailwind",
    position: { x: 550, y: 350 },
  },
  // {
  //   label: "Bootstrap",
  //   progress: 0,
  //   color: "#2563eb",
  //   link: "/bootstrap",
  //   position: { x: 400, y: 350 },
  // },
  {
    label: "CSS",
    progress: 60,
    color: "#2563eb",
    link: "/css",
    position: { x: 400, y: 250 },
    connections: ["Preprocessors", "Tailwind CSS"],
  },
  {
    label: "HTML",
    progress: 80,
    color: "#f97316",
    link: "/html",
    position: { x: 600, y: 150 },
    connections: ["CSS", "JavaScript"],
  },
  {
    label: "JavaScript",
    progress: 90,
    color: "#facc15",
    link: "/javascript",
    position: { x: 800, y: 250 },
    connections: ["Node.js", "React.js"],
  },
  {
    label: "React.js",
    progress: 70,
    color: "#3b82f6",
    link: "/react",
    position: { x: 650, y: 350 },
    connections: ["Next.js"],
  },
  {
    label: "Node.js",
    progress: 50,
    color: "#2563eb",
    link: "/jquery",
    position: { x: 950, y: 350 },
  },
  {
    label: "Next.js",
    progress: 60,
    color: "#2563eb",
    link: "/nextjs",
    position: { x: 550, y: 500 },
  },
];

const techOptions = {
  frontend: ["React.js", "Next.js", "Vue.js", "Angular", "Svelte"],
  backend: ["Node.js", "Express.js", "Django", "Flask", "Spring Boot"],
  database: ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Redis"],
  devops: ["Docker", "Kubernetes", "AWS", "Vercel", "GitHub Actions"],
};

export default function LearningProgress() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const router = useRouter();
  const circleRadius = 40;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous SVG

    // Draw connecting lines based on `connections`
    circles.forEach((circle) => {
      if (circle.connections) {
        circle.connections.forEach((targetLabel) => {
          const start = circle.position;
          const endCircle = circles.find((c) => c.label === targetLabel);
          if (!endCircle) {
            return;
          }

          const end = endCircle.position;

          // Calculate offset so lines don't overlap the circles
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          const offsetX = Math.cos(angle) * circleRadius;
          const offsetY = Math.sin(angle) * circleRadius;

          svg
            .append("line")
            .attr("x1", start.x + offsetX)
            .attr("y1", start.y + offsetY)
            .attr("x2", end.x - offsetX)
            .attr("y2", end.y - offsetY)
            .attr("stroke", "#9ca3af")
            .attr("stroke-width", 3)
            .attr("stroke-linecap", "round");
        });
      }
    });

    // Draw circles
    const group = svg
      .selectAll(".progress-circle")
      .data(circles)
      .enter()
      .append("g");

    group
      .append("circle")
      .attr("cx", (d) => d.position.x)
      .attr("cy", (d) => d.position.y)
      .attr("r", circleRadius)
      .attr("fill", "transparent")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 8);

    // Progress arcs
    group
      .append("path")
      .attr("d", (d) => {
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (d.progress / 100) * 2 * Math.PI;
        const largeArcFlag = d.progress > 50 ? 1 : 0;

        const x1 = d.position.x + circleRadius * Math.cos(startAngle);
        const y1 = d.position.y + circleRadius * Math.sin(startAngle);
        const x2 = d.position.x + circleRadius * Math.cos(endAngle);
        const y2 = d.position.y + circleRadius * Math.sin(endAngle);

        return `M ${x1},${y1} A ${circleRadius},${circleRadius} 0 ${largeArcFlag} 1 ${x2},${y2}`;
      })
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 8);

    // Labels
    group
      .append("text")
      .attr("x", (d) => d.position.x)
      .attr("y", (d) => d.position.y)
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#374151")
      .text((d) => d.label)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        router.push(d.link);
      });

    return () => {
      svg.selectAll("*").remove(); // Cleanup on unmount
    };
  }, []);

  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const handleCheckboxChange = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6 relative">
        <svg ref={svgRef} width={1200} height={900} className="absolute"></svg>
      </div>
      <div className="max-w-lg mx-auto p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Select Your Tech Stack</h2>

        {Object.entries(techOptions).map(([category, options]) => (
          <div key={category} className="mb-4">
            <h3 className="text-lg font-semibold">{category.toUpperCase()}</h3>
            <div className="grid grid-cols-2 gap-2">
              {options.map((tech) => (
                <label key={tech} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={tech}
                    checked={selectedTech.includes(tech)}
                    onChange={() => handleCheckboxChange(tech)}
                    className="w-4 h-4"
                  />
                  <span>{tech}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => alert(`Selected Tech: ${selectedTech.join(", ")}`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </>
  );
}
