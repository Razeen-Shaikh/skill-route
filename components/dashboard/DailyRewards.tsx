"use client";

import { updateRewards } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DailyRewards() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateRewards(),
    onSuccess: (data) => {
      setMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      setMessage("Unable to claim reward right now.");
    },
  });

  return (
    <div className="p-4 shadow-md rounded-lg border border-border bg-card">
      <h3 className="text-xl font-semibold mb-2">Daily Reward</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Claim bonus coins based on your login streak.
      </p>
      <Button onClick={() => mutate()} disabled={isPending} className="cursor-pointer">
        {isPending ? "Claiming..." : "Claim Daily Reward"}
      </Button>
      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
    </div>
  );
}
