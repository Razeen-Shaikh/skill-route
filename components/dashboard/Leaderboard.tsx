"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "../ui/table";
import { fetchLeaderboard } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getRankColor } from "@/lib/helper";

const itemsPerPage = 10;

/**
 * A paginated leaderboard component.
 *
 * @param {LeaderboardProps} props
 * @prop {UserProfile[]} leaderboardData - The leaderboard data to display.
 * @returns {JSX.Element}
 */
export default function Leaderboard(): JSX.Element {
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const userId = session?.user?.id;
  const isAuthenticated = status === "authenticated";

  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => fetchLeaderboard(),
    enabled: !!isAuthenticated,
    refetchOnWindowFocus: false,
  });

  // Calculate the total number of pages
  useEffect(() => {
    setTotalPages(Math.ceil((leaderboardData?.length ?? 0) / itemsPerPage));
  }, [leaderboardData]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return leaderboardData?.slice(start, end);
  }, [currentPage, leaderboardData]);

  if (isLeaderboardLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableCell className="w-12 text-center">#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell className="text-center">Rank</TableCell>
            <TableCell className="text-center">Level</TableCell>
            <TableCell className="text-center">XP</TableCell>
            <TableCell className="text-center">Coins</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData?.map((leader, index) => (
            <TableRow
              key={leader.id}
              className={`hover:bg-muted ${leader.id === session?.user?.id ? "bg-blue-50 font-semibold" : ""
                }`}
            >
              <TableCell className="text-center">{(index + 1) + (currentPage - 1) * itemsPerPage}</TableCell>
              <TableCell className="flex items-center space-x-3">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={leader.avatar} />
                  <AvatarFallback>
                    {leader.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">
                    {leader.firstName} {leader.lastName}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getRankColor(leader.rank)
                    }`}
                >
                  {leader.rank}
                </span>
              </TableCell>
              <TableCell className="text-center">{leader.level}</TableCell>
              <TableCell className="text-center">{leader.xp}</TableCell>
              <TableCell className="text-center">{leader.coins}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      {/* Pagination */}
      <div className="flex justify-between items-center mt-4" >
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );
}
