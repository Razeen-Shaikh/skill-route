"use client";

import useRoadmap from "@/hooks/useRoadmap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import RoadmapStepUnit, { RoadmapStepWithTutorials } from "@/components/roadmaps/RoadmapStepUnit";
import { RoadmapTreeSkeleton } from "@/components/skeletons";

const CARD_WIDTH = 240;
const CARD_HEIGHT = 160;
const GAP_X = 48;
const GAP_Y = 72;

type Size = { w: number; h: number };

type PlacedNode = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  centerX: number;
};

type TreeLayout = {
  nodes: PlacedNode[];
  width: number;
  height: number;
  childrenOf: Map<string, RoadmapStepWithTutorials[]>;
};

function sameSizes(a: Record<string, Size>, b: Record<string, Size>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key]?.w === b[key]?.w && a[key]?.h === b[key]?.h);
}

function buildLayout(
  steps: RoadmapStepWithTutorials[],
  sizes: Record<string, Size>
): TreeLayout {
  const ids = new Set(steps.map((step) => step.id));
  const childrenOf = new Map<string, RoadmapStepWithTutorials[]>();
  const roots: RoadmapStepWithTutorials[] = [];

  for (const step of steps) {
    if (step.parentId && ids.has(step.parentId)) {
      const siblings = childrenOf.get(step.parentId) ?? [];
      siblings.push(step);
      childrenOf.set(step.parentId, siblings);
    } else {
      roots.push(step);
    }
  }

  const byOrder = (a: RoadmapStepWithTutorials, b: RoadmapStepWithTutorials) =>
    a.order - b.order;
  roots.sort(byOrder);
  for (const siblings of childrenOf.values()) siblings.sort(byOrder);

  const sizeOf = (id: string): Size => sizes[id] ?? { w: CARD_WIDTH, h: CARD_HEIGHT };
  const widthCache = new Map<string, number>();

  const subtreeWidth = (id: string): number => {
    const cached = widthCache.get(id);
    if (cached != null) return cached;

    const kids = childrenOf.get(id) ?? [];
    const own = sizeOf(id).w;
    if (kids.length === 0) {
      widthCache.set(id, own);
      return own;
    }

    const kidsWidth = kids.reduce(
      (sum, kid, index) => sum + subtreeWidth(kid.id) + (index > 0 ? GAP_X : 0),
      0
    );
    const width = Math.max(own, kidsWidth);
    widthCache.set(id, width);
    return width;
  };

  const depthOf = new Map<string, number>();
  const leftOf = new Map<string, number>();

  const place = (id: string, left: number, depth: number) => {
    depthOf.set(id, depth);
    leftOf.set(id, left);
    const kids = childrenOf.get(id) ?? [];
    const kidsWidth = kids.reduce(
      (sum, kid, index) => sum + subtreeWidth(kid.id) + (index > 0 ? GAP_X : 0),
      0
    );
    let cursor = left + (subtreeWidth(id) - kidsWidth) / 2;
    for (const kid of kids) {
      place(kid.id, cursor, depth + 1);
      cursor += subtreeWidth(kid.id) + GAP_X;
    }
  };

  let cursor = 0;
  for (const root of roots) {
    place(root.id, cursor, 0);
    cursor += subtreeWidth(root.id) + GAP_X;
  }

  const treeWidth = Math.max(cursor - (roots.length > 0 ? GAP_X : 0), 0);
  const maxDepth = steps.reduce(
    (max, step) => Math.max(max, depthOf.get(step.id) ?? 0),
    0
  );
  const rowHeight = Array.from({ length: maxDepth + 1 }, () => 0);
  for (const step of steps) {
    const depth = depthOf.get(step.id) ?? 0;
    rowHeight[depth] = Math.max(rowHeight[depth], sizeOf(step.id).h);
  }

  const rowTop: number[] = [];
  let y = 0;
  for (let depth = 0; depth <= maxDepth; depth++) {
    rowTop[depth] = y;
    y += rowHeight[depth] + (depth === maxDepth ? 0 : GAP_Y);
  }

  const nodes = steps.map((step) => {
    const depth = depthOf.get(step.id) ?? 0;
    const width = sizeOf(step.id).w;
    const height = sizeOf(step.id).h;
    const left = (leftOf.get(step.id) ?? 0) + (subtreeWidth(step.id) - width) / 2;
    const top = rowTop[depth] ?? 0;
    return {
      id: step.id,
      left,
      top,
      width,
      height,
      centerX: left + width / 2,
    };
  });

  return { nodes, width: treeWidth, height: y, childrenOf };
}

function connectorPath(parent: PlacedNode, children: PlacedNode[]) {
  const startY = parent.top + parent.height - 1;
  const railY = startY + GAP_Y / 2;
  const sorted = [...children].sort((a, b) => a.centerX - b.centerX);

  if (sorted.length === 1) {
    const child = sorted[0];
    const endY = child.top + 1;
    if (Math.abs(child.centerX - parent.centerX) < 1) {
      return `M ${parent.centerX} ${startY} V ${endY}`;
    }
    return `M ${parent.centerX} ${startY} V ${railY} H ${child.centerX} V ${endY}`;
  }

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const drops = sorted
    .map((child) => `M ${child.centerX} ${railY} V ${child.top + 1}`)
    .join(" ");
  return `M ${parent.centerX} ${startY} V ${railY} M ${first.centerX} ${railY} H ${last.centerX} ${drops}`;
}

const RoadmapTree = () => {
  const { id: roadmapId } = useParams();
  const { steps: roadmapSteps, isLoading } = useRoadmap(roadmapId as string);
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const [sizes, setSizes] = useState<Record<string, Size>>({});

  useLayoutEffect(() => {
    const measure = () => {
      const next: Record<string, Size> = {};
      nodeRefs.current.forEach((element, id) => {
        next[id] = { w: element.offsetWidth, h: element.offsetHeight };
      });
      setSizes((current) => (sameSizes(current, next) ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    nodeRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [roadmapSteps]);

  const layout = useMemo(
    () => buildLayout(roadmapSteps, sizes),
    [roadmapSteps, sizes]
  );
  const nodesById = useMemo(
    () => new Map(layout.nodes.map((node) => [node.id, node])),
    [layout.nodes]
  );
  const stepsById = useMemo(
    () => new Map(roadmapSteps.map((step) => [step.id, step])),
    [roadmapSteps]
  );

  if (isLoading) {
    return <RoadmapTreeSkeleton />;
  }

  if (roadmapSteps.length === 0) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center text-gray-500">
        No steps in this roadmap yet.
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] w-full overflow-auto p-8">
      <div
        className="relative mx-auto"
        style={{ width: layout.width, height: layout.height }}
      >
        <svg
          className="pointer-events-none absolute left-0 top-0"
          width={layout.width}
          height={layout.height}
        >
          {roadmapSteps.map((step) => {
            const parent = nodesById.get(step.id);
            const childSteps = layout.childrenOf.get(step.id) ?? [];
            const children = childSteps
              .map((child) => nodesById.get(child.id))
              .filter((node): node is PlacedNode => Boolean(node));
            if (!parent || children.length === 0) return null;

            const allComplete = childSteps.every((child) => child.status === "COMPLETED");
            return (
              <path
                key={step.id}
                d={connectorPath(parent, children)}
                fill="none"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="butt"
                className={
                  allComplete
                    ? "stroke-green-500"
                    : "stroke-gray-400 dark:stroke-gray-500"
                }
              />
            );
          })}
        </svg>

        {layout.nodes.map((node) => {
          const step = stepsById.get(node.id);
          if (!step) return null;
          return (
            <div
              key={node.id}
              ref={(element) => {
                if (element) nodeRefs.current.set(node.id, element);
                else nodeRefs.current.delete(node.id);
              }}
              className="absolute z-10"
              style={{ left: node.left, top: node.top, width: node.width }}
            >
              <RoadmapStepUnit step={step} roadmapSteps={roadmapSteps} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapTree;
