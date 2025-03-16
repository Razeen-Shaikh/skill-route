import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays } from "date-fns";

interface ProgressHeatmapProps {
  data: { date: string; count: number }[];
}

const ProgressHeatmap: React.FC<ProgressHeatmapProps> = ({ data }) => {
  if (data && data.length === 0) {
    return <p className="text-gray-500">No progress data available.</p>;
  }

  return (
    <div className="mb-6">
      <CalendarHeatmap
        startDate={subDays(new Date(), 365)}
        endDate={new Date()}
        values={data ?? []}
        gutterSize={2}
        classForValue={(value) => {
          if (!value) return "color-empty";
          return `color-scale-${value.count}`;
        }}
        showWeekdayLabels={false}
        transformDayElement={(rect) => (
          <g key={rect.key} transform="scale(0.9)">
            {React.cloneElement(rect as React.ReactElement)}
          </g>
        )}
      />
    </div>
  );
};

export default ProgressHeatmap;
