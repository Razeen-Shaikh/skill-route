"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Star } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "../ui/table";
import { calculateRank } from "@/lib/helper";
import { User } from "@/lib/interface";

const itemsPerPage = 10;

/**
 * A paginated leaderboard component.
 *
 * @param {LeaderboardProps} props
 * @prop {UserProfile[]} leaderboardData - The leaderboard data to display.
 * @returns {JSX.Element}
 */
export default function Leaderboard({
  leaderboardData,
}: {
  leaderboardData: User[];
}): JSX.Element {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Calculate the total number of pages
  useEffect(() => {
    setTotalPages(Math.ceil(leaderboardData.length / itemsPerPage));
  }, [leaderboardData]);

  // Calculate the paginated data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return leaderboardData.slice(start, end);
  }, [currentPage, leaderboardData]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>XP</TableCell>
            <TableCell>Coins</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData?.map((leader: User, index: number) => (
            <TableRow key={leader.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <span>{calculateRank(leader?.profile?.points ?? 0)}</span>
              </TableCell>
              <TableCell>
                <span>{leader.firstName}</span>
                <span className="ml-2">{leader.lastName}</span>
              </TableCell>
              <TableCell>
                <Star className="inline text-blue-500" />
                <span className="ml-2">{leader?.profile?.points}</span>
              </TableCell>
              <TableCell>
                <Coins className="inline text-yellow-400" />
                <span className="ml-2">{leader?.profile?.coins}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
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
