"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchAllBadges } from "@/lib/api";
import BadgeGrid from "@/components/badges/BadgeGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgesSkeleton } from "@/components/skeletons";

export default function BadgesPage() {
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";

    const { data: badges, isLoading } = useQuery({
        queryKey: ["badges", "all"],
        queryFn: () => fetchAllBadges(),
        enabled: isAuthenticated,
        refetchOnWindowFocus: false,
    });

    if (status === "loading" || isLoading) {
        return <BadgesSkeleton />;
    }

    if (status === "unauthenticated") {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <Card>
                    <CardContent className="py-12 text-center space-y-4">
                        <p className="text-muted-foreground">
                            Log in to view your badge collection and track progress.
                        </p>
                        <Button asChild>
                            <Link href="/auth/login">Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const earnedCount = badges?.filter((badge) => badge.earned).length ?? 0;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 h-[calc(100vh-4.5rem)] overflow-y-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Badge Collection</CardTitle>
                    <CardDescription>
                        Earn badges by passing quizzes, completing tutorials, finishing roadmap
                        steps, building streaks, and collecting XP and coins. Locked badges appear
                        in grayscale until you unlock them.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">
                        {earnedCount} of {badges?.length ?? 0} badges earned
                    </p>
                    <BadgeGrid badges={badges ?? []} showHeader={false} />
                </CardContent>
            </Card>
        </div>
    );
}
