import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserProfile } from "@prisma/client";

export default function ProfileCard({
  user,
}: {
  user: User & { profile: UserProfile };
}) {
  return (
    <div className="p-6 rounded-lg shadow-md dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={user?.avatarUrl ?? undefined}
            alt="Profile Picture"
          />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold">{user?.email}</h3>
      </div>
      <div className="space-y-2">
        <ProfileDetail label="Rank" value={user?.profile?.rank} />
        <ProfileDetail label="Points" value={user?.profile?.points} />
        <ProfileDetail label="Coins" value={user?.profile?.coinsEarned} />
        <ProfileDetail label="Theme" value={user?.profile?.theme} />
      </div>
    </div>
  );
}

const ProfileDetail = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) => (
  <p className="flex justify-between text-sm border-b pb-2">
    <span className="font-medium">{label}:</span>
    <span>{value ?? "N/A"}</span>
  </p>
);
