"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/lib/api";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { CoinTransaction, TransactionType } from "@/lib/interfaces";

export default function TransactionHistory() {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [filter, setFilter] = useState<TransactionType>("ALL");

  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions", page, filter],
    queryFn: () => fetchTransactions({ page, limit, filter }),
    enabled: !!isAuthenticated,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p>Failed to load transactions.</p>;

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex justify-between items-center mb-4">
          <Select
            value={filter}
            onValueChange={(value) =>
              setFilter(value as TransactionType)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="EARNED">Earned</SelectItem>
              <SelectItem value="PENALTY">Penalty</SelectItem>
              <SelectItem value="SPENT">Spent</SelectItem>
              <SelectItem value="REWARD">Reward</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions List */}
        <ul className="space-y-2">
          {data?.transactions?.map((txn: CoinTransaction) => (
            <li key={txn.id} className="flex justify-between border-b pb-2">
              <span>{txn.description}</span>
              <span
                className={`font-bold ${txn.type === "EARNED" ? "text-green-500" : "text-red-500"
                  }`}
              >
                {txn.type === "EARNED" ? "+" : "-"}
                {txn.amount}
              </span>
              <span className="text-gray-500">
                {format(new Date(txn.transactionAt), "PP")}
              </span>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span>
            Page {page} of {data?.totalPages || 1}
          </span>
          <Button
            variant="outline"
            disabled={page === data?.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
