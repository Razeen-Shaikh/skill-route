import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileCard({ user }: { user: any }) {
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow">
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user?.profile?.avatarUrl} alt="Profile Picture" />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold">{user?.email}</h3>
      </div>
      <div className="space-y-2 text-gray-700">
        <ProfileDetail label="Rank" value={user?.profile?.rank} />
        <ProfileDetail label="Points" value={user?.profile?.points} />
        <ProfileDetail label="Coins" value={user?.profile?.coinsEarned} />
        <ProfileDetail label="Theme" value={user?.profile?.theme} />
      </div>
    </div>
  );
}

const ProfileDetail = ({ label, value }: { label: string; value: any }) => (
  <p className="flex justify-between text-sm border-b pb-2">
    <span className="font-medium">{label}:</span>
    <span className="text-gray-900">{value ?? "N/A"}</span>
  </p>
);
