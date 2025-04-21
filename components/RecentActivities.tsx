import { RecentActivity } from "@/lib/interfaces/interface";

export default function RecentActivities({
  activities,
}: {
  activities: RecentActivity[];
}) {
  return (
    <ul>
      {activities?.map((activity: RecentActivity) => (
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
          {activity.type === "transaction" && <p>💸 {activity.description}</p>}
          <span className="text-xs">
            {new Date(activity.createdAt).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
