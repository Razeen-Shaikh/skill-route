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
const ProgressChart: React.FC<{ data: { date: string; points: number }[] }> = ({
  data,
}) => {
  const [showMonth, setShowMonth] = useState(false);

  const toggleDateFormat = () => {
    setShowMonth(!showMonth);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        📊 Your Progress
      </h2>
      <button
        onClick={toggleDateFormat}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Toggle Date/Month
      </button>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey={showMonth ? "month" : "date"} />
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
