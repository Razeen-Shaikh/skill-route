import React from "react";

interface Tutorial {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const tutorials: Tutorial[] = [
  {
    id: 1,
    title: "Getting Started with JavaScript",
    description:
      "Learn the basics of JavaScript, including variables, functions, and loops.",
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Understanding Closures in JavaScript",
    description:
      "A deep dive into closures and their applications in JavaScript.",
    difficulty: "Intermediate",
  },
  {
    id: 3,
    title: "Optimizing React Performance",
    description:
      "Learn how to optimize React apps using memoization, lazy loading, and useMemo.",
    difficulty: "Advanced",
  },
];

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

const difficultyColors: Record<Difficulty, string> = {
  Beginner: "bg-green-500",
  Intermediate: "bg-yellow-500",
  Advanced: "bg-red-500",
};

const TutorialList: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200 my-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        📚 Tutorial List
      </h2>
      <ul className="space-y-4">
        {tutorials.map((tutorial) => (
          <li
            key={tutorial.id}
            className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {tutorial.title}
              </h3>
              <span
                className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${
                  difficultyColors[tutorial.difficulty]
                }`}
              >
                {tutorial.difficulty}
              </span>
            </div>
            <p className="text-gray-600 mt-2 text-sm">{tutorial.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TutorialList;
