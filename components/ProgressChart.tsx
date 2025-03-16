"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

/**
 * A line chart that displays the user's progress over time.
 *
 * It displays the user's points earned on each day, and the x-axis can be toggled
 * between displaying the date or the month.
 *
 * @example
 * <ProgressChart data={[{ date: "2022-01-01", points: 100 }, { date: "2022-01-02", points: 120 }]} />
 *
 * @param {object} props
 * @param {object[]} props.data - An array of objects, each with a `date` and a `points` property.
 * @returns {ReactElement}
 */
const ProgressChart: React.FC<{
  data: { date: string; points: number }[];
}> = ({ data }) => {
  const [view, setView] = useState<"day" | "month" | "year">("day");

  if (process.env.NODE_ENV === "development") {
    console.log({ data });
  }

  const toggleView = () => {
    setView((prev) =>
      prev === "day" ? "month" : prev === "month" ? "year" : "day"
    );
  };

  const processData = (): { date: string; points: number }[] => {
    if (!data) {
      return [];
    }

    let formatter: Intl.DateTimeFormat;
    const aggregatedData: Record<string, number> = {};

    if (view === "month") {
      formatter = new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
      });
    } else if (view === "year") {
      formatter = new Intl.DateTimeFormat("en", { year: "numeric" });
    } else {
      formatter = new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    data.forEach(({ date, points }) => {
      const key = formatter.format(new Date(date));

      aggregatedData[key] = (aggregatedData[key] || 0) + points;
    });

    console.log({ data, aggregatedData });

    return Object.entries(aggregatedData).map(([date, points]) => ({
      date,
      points,
    }));
  };

  return (
    <div className="mb-6">
      <Button
        onClick={toggleView}
        className="mb-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
        type="button"
      >
        Toggle Day/Month/Year
      </Button>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={processData()}>
          <XAxis dataKey={"date"} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="points"
            stroke="#4f46e5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
