"use client";

import Link from "next/link";
import { fetchTutorials } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Tutorial } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Tutorials() {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: tutorials, isLoading: tutorialsLoading } = useQuery({
    queryKey: ["tutorials"],
    queryFn: fetchTutorials,
  });

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
    }
  }, []);

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-100">
        <div className="text-center p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p>Please log in to view the tutorials.</p>
        </div>
      </div>
    );
  }

  if (tutorialsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-6 bg-white shadow-lg rounded-lg">
          <p>Loading tutorials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tutorials.map((tutorial: Tutorial) => (
        <Link key={tutorial.id} href={`/tutorials/${tutorial.id}`}>
          <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full">
            <h2 className="text-xl font-semibold">{tutorial.title}</h2>
            <p className="text-gray-600">{tutorial.description}</p>
            <p className="text-sm text-gray-500">
              {tutorial.isLocked ? "🔒 Locked" : "🔓 Unlocked"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
