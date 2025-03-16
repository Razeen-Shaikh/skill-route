"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function QuizSubmit({
  quizId,
  userId,
}: {
  quizId: number;
  userId: number;
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/quizzes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, userId, selectedOption }),
      });
      return res.json();
    },
  });

  return (
    <div>
      <button onClick={() => mutation.mutate()} disabled={!selectedOption}>
        Submit Answer
      </button>
      {mutation.isSuccess && (
        <p>{mutation.data.correct ? "Correct!" : "Incorrect"}</p>
      )}
    </div>
  );
}
