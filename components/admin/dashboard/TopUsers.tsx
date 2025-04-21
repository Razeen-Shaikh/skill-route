// /components/dashboard/TopUsers.tsx
type TopUsersProps = {
  users: { id: string; name: string; points: number }[];
};

const TopUsers = ({ users }: TopUsersProps) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Top Users</h2>
    <ul className="space-y-2">
      {users.map((user, i) => (
        <li key={user.id} className="flex justify-between">
          <span>
            {i + 1}. {user.name}
          </span>
          <span className="font-medium">{user.points} pts</span>
        </li>
      ))}
    </ul>
  </div>
);

export default TopUsers;
