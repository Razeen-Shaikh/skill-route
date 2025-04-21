// /components/dashboard/RecentActivity.tsx
type RecentActivityProps = {
  activities: {
    id: string;
    user: { name: string };
    action: string;
    timestamp: string;
  }[];
};

const RecentActivity = ({ activities }: RecentActivityProps) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
    <ul className="space-y-2">
      {activities.map((activity) => (
        <li
          key={activity.id}
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          <strong>{activity.user.name}</strong> {activity.action}
          <span className="ml-2 text-xs text-gray-400">
            {new Date(activity.timestamp).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentActivity;
