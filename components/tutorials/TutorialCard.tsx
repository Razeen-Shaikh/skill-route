import { cn } from "@/lib/utils";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { Tutorial } from "@/lib/interfaces";

const TutorialCard = ({
  tutorial: { id, title, description, isLocked },
  isCompleted,
  isActive = false,
}: {
  tutorial: Tutorial;
  isCompleted: boolean;
  isActive?: boolean;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (!isLocked) {
      router.push(`/tutorials/${id}`);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "cursor-pointer transition-all",
        isLocked
          ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
          : "hover:shadow-lg",
        isActive && !isLocked && "ring-2 ring-blue-500 shadow-md"
      )}
    >
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <p className="text-sm mt-2 flex items-center gap-2">
          {isLocked ? "🔒 Locked" : "🔓 Unlocked"}
          {isCompleted && <span className="text-green-500">✔ Completed</span>}
        </p>
      </CardContent>
    </Card>
  );
};

export default TutorialCard;
