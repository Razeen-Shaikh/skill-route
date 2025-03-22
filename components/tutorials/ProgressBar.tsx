import clsx from "clsx";

const getProgressColor = (progress: number) => {
  if (progress < 33) return "bg-red-500"; // Low progress
  if (progress < 66) return "bg-yellow-500"; // Medium progress
  return "bg-green-500"; // High progress
};

const getTextColor = (progress: number) => {
  if (progress < 33) return "text-red-700"; // Darker red for visibility
  if (progress < 66) return "text-yellow-700"; // Darker yellow for contrast
  return "text-green-900"; // Darkest green for maximum contrast
};

export default function ProgressBar({ progress }: { progress: number }) {
  const safeProgress = Math.min(progress, 100);

  return (
    <div
      className="relative w-full bg-gray-200 rounded-lg h-5 overflow-hidden"
      role="progressbar"
      aria-valuenow={safeProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Progress Bar Fill */}
      <div
        className={clsx(
          "absolute top-0 left-0 h-full transition-all ease-in-out duration-300",
          getProgressColor(safeProgress)
        )}
        style={{ width: `${safeProgress}%` }}
      />

      {/* Progress Text (Ensuring Contrast) */}
      <p
        className={clsx(
          "text-xs font-semibold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          getTextColor(safeProgress)
        )}
      >
        {safeProgress.toFixed(0)}% Completed
      </p>
    </div>
  );
}
