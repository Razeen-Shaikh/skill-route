export function QuizzesSkeleton() {
  return (
    <div className="flex flex-1 flex-col p-6 animate-pulse">
      <div className="w-1/4 h-8 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-full h-24 bg-gray-300 dark:bg-gray-700 rounded-md"
          ></div>
        ))}
      </div>
    </div>
  );
}
