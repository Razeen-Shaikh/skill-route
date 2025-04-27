'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Medal, Star, Coins, Mountain, TrendingUp, Mail, Settings } from 'lucide-react';
import React from 'react'
import { getRankColor } from '@/lib/helper';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@radix-ui/react-tooltip';
import Link from 'next/link';

interface ProfilePropsType {
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    rank: string;
    xp: number;
    coins: number;
    level: number;
    email: string;
    streakCount: number;
    longestStreak: number;
}

const Profile: React.FC<ProfilePropsType> = ({
    firstName,
    lastName,
    username,
    avatar,
    rank,
    xp,
    coins,
    level,
    email,
    streakCount,
    longestStreak,
}) => {
    const safeRank = rank ?? 'N/A';
    const xpForNextLevel = (level + 1) * 1000;
    const xpPercentageToNextLevel = Math.min((xp / xpForNextLevel) * 100, 100).toFixed(2);

    return (
        <div className="flex items-start gap-6 w-full">
            <Avatar className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                <AvatarImage src={avatar ?? ''} alt="User Avatar" />
                <AvatarFallback className="flex items-center justify-center bg-gray-100 text-gray-700 font-bold text-xl">
                    {firstName?.charAt(0).toUpperCase()}
                    {lastName?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        {firstName} {lastName} <span className="text-sm text-gray-500">(@{username})</span>
                    </h2>
                    <Link
                        href={'/settings'}
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                        <Settings />
                    </Link>
                </div>

                <InfoRow icon={Mail} label="Email" value={email} className="text-gray-500" />
                <InfoRow icon={Medal} label="Rank" value={safeRank} className={getRankColor(safeRank)} />
                <InfoRow icon={TrendingUp} label="Level" value={level} className="text-purple-600" />

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="mt-1 cursor-pointer">
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-600 transition-all duration-300"
                                        style={{ width: `${xpPercentageToNextLevel}%` }}
                                    />
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white px-3 py-1 text-xs rounded">
                            {`You've completed ${xpPercentageToNextLevel}% of Level ${level}.`}<br />
                            {`${xpForNextLevel - xp} XP to Level ${level + 1}.`}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <InfoRow icon={Star} label="XP" value={xp} className="text-blue-500" />
                <InfoRow icon={Coins} label="Coins" value={coins} className="text-yellow-500" />

                <InfoRow
                    icon={Mountain}
                    label="Streak"
                    value={
                        <span>
                            {streakCount ?? 0} days{' '}
                            <span className="text-xs text-gray-500">
                                (Longest: {longestStreak ?? 0}{' '}
                                {longestStreak >= 5 ? '🔥' : ''})
                            </span>
                        </span>
                    }
                    className={streakCount > 0 ? "text-green-600" : "text-red-500"}
                />
            </div>
        </div>
    );
};

export default Profile;

const InfoRow = ({
    icon: Icon,
    label,
    value,
    className = '',
}: {
    icon: React.ElementType;
    label: string;
    value: string | number | React.ReactNode;
    className?: string;
}) => (
    <div className="flex items-center gap-3 text-sm text-gray-700">
        <Icon className={`w-4 h-4 ${className}`} />
        <span className="min-w-[60px] text-gray-500">{label}:</span>
        <span className={`font-semibold truncate ${className} max-w-[220px]`}>{value}</span>
    </div>
);
