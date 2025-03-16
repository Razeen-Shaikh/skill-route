export default function Skeleton({ width = "w-full", height = "h-6" }) {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md ${width} ${height}`}
    />
  );
}
