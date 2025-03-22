export default function SkeletonLoader() {
    return (
      <div className="flex flex-1 flex-col p-6 animate-pulse">
        {/* Title Skeleton */}
        <div className="w-1/3 h-8 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
  
        {/* Paragraphs Skeleton */}
        <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded-md mb-2"></div>
        <div className="w-5/6 h-4 bg-gray-300 dark:bg-gray-700 rounded-md mb-2"></div>
        <div className="w-4/6 h-4 bg-gray-300 dark:bg-gray-700 rounded-md mb-2"></div>
  
        {/* Content Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
  