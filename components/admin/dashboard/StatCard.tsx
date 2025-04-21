// /components/dashboard/StatCard.tsx
type StatCardProps = {
  title: string;
  value: number;
};

const StatCard = ({ title, value }: StatCardProps) => (
  <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6 text-center">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default StatCard;
