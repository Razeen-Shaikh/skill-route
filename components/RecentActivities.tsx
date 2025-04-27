import { DashboardProfile } from "@/lib/api";

export default function RecentActivities({
  activities,
}: {
  activities: DashboardProfile["lastActivities"];
}) {
  return (
    <ul>
      {activities?.map(({ activityId, activityType, activityDescription, xpAwarded, createdAt }) => (
        <li
          key={activityId}
          className="mt-2 text-sm flex items-center justify-between"
        >
          {activityType === "QUIZ" && (
            <p>✅ Completed &quot;{activityDescription}&quot; Quiz</p>
          )}
          {activityType === "BADGE" && (
            <p>✅ Unlocked &quot;{activityDescription}&quot; Badge</p>
          )}
          {activityType === "XP" && (
            <p>✅ Earned {xpAwarded} XP</p>
          )}
          {activityType === "COINS" && (
            <p>💰 Earned {xpAwarded} Coins</p>
          )}
          {activityType === "TUTORIAL" && (
            <p>✅ Completed &quot;{activityDescription}&quot; Tutorial</p>
          )}
          {activityType === "LEVEL" && (
            <p>✅ Unlocked Level {xpAwarded}</p>
          )}
          {activityType === "TRANSACTION" && <p>💸 {activityDescription}</p>}
          <span className="text-xs">
            {new Date(createdAt).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
