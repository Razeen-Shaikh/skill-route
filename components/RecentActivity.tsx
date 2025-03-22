import { useQuery } from "@tanstack/react-query";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["recentActivity"],
    queryFn: async () => {
      const res = await fetch("/api/recent-activity");
      return res.json();
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <h2 className="text-lg font-bold">Recent Activity</h2>
      <ul>
        {activities?.map(
          (activity: {
            id: string;
            type: string;
            description: string;
            value: number;
            createdAt: string;
          }) => (
            <li
              key={activity.id}
              className="mt-2 text-sm flex items-center justify-between"
            >
              {activity.type === "quiz_completed" && (
                <p>✅ Completed &quot;{activity.description}&quot; Quiz</p>
              )}
              {activity.type === "badge_unlocked" && (
                <p>✅ Unlocked &quot;{activity.description}&quot; Badge</p>
              )}
              {activity.type === "xp_earned" && (
                <p>✅ Earned {activity.value} XP</p>
              )}
              {activity.type === "coins_earned" && (
                <p>💰 Earned {activity.value} Coins</p>
              )}
              {activity.type === "tutorial_completed" && (
                <p>✅ Completed &quot;{activity.description}&quot; Tutorial</p>
              )}
              {activity.type === "level_unlocked" && (
                <p>✅ Unlocked Level {activity.value}</p>
              )}
              {activity.type === "transaction" && (
                <p>💸 {activity.description}</p>
              )}
              <span className="text-xs">
                {new Date(activity.createdAt).toLocaleString()}
              </span>
            </li>
          )
        )}
      </ul>
    </>
  );
}
