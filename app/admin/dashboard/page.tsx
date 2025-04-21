// /app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchAdminDashboardData } from '@/lib/api';
import StatCard from '@/components/admin/dashboard/StatCard';
import TopUsers from '@/components/admin/dashboard/TopUsers';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';

const AdminDashboardPage = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAdminDashboardData().then(setData);
  }, []);

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Users" value={data.stats.users} />
        <StatCard title="Tutorials" value={data.stats.tutorials} />
        <StatCard title="Quizzes" value={data.stats.quizzes} />
        <StatCard title="Paths" value={data.stats.paths} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopUsers users={data.topUsers} />
        <RecentActivity activities={data.recentActivities} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
