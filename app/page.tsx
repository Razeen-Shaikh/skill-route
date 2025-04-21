"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4.5rem)] flex flex-col items-center bg-background text-foreground overflow-y-auto">
      {/* Hero Section */}
      <section className="w-full py-16 text-center bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">
            Master Problem-Solving with Interactive Quizzes
          </h1>
          <p className="text-lg text-muted-foreground">
            Enhance your coding skills with real-world challenges, track
            progress, and climb the leaderboard!
          </p>
          <div className="mt-6">
            <Link href="/roadmaps">
              <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-lg font-semibold shadow-lg transition cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold text-center mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card text-card-foreground p-6 shadow-md rounded-lg text-center border border-border">
            <h3 className="text-xl font-semibold mb-2">⏳ Timed Quizzes</h3>
            <p className="text-muted-foreground">
              Test your speed and accuracy with time-based coding challenges.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card text-card-foreground p-6 shadow-md rounded-lg text-center border border-border">
            <h3 className="text-xl font-semibold mb-2">
              🏆 Leaderboard System
            </h3>
            <p className="text-muted-foreground">
              Compete with others and track your ranking based on points.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card text-card-foreground p-6 shadow-md rounded-lg text-center border border-border">
            <h3 className="text-xl font-semibold mb-2">
              🎁 Earn Coins & Rewards
            </h3>
            <p className="text-muted-foreground">
              Complete challenges and unlock achievements with our reward
              system.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="w-full py-12 text-center bg-accent text-accent-foreground">
        <h2 className="text-2xl font-bold mb-4">Start Your Journey Today!</h2>
        <p className="text-muted-foreground">
          Sign up now and take your skills to the next level.
        </p>
        {!isAuthenticated && (
          <div className="mt-6">
            <Link href="/auth/register">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 shadow-lg transition cursor-pointer">
                Sign Up Now
              </button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
