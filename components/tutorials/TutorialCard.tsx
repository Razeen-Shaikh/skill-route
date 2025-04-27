import { cn } from "@/lib/utils";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { Tutorial } from "@/lib/interfaces";

/**
 * A card component representing a tutorial.
 *
 * @prop {Tutorial} tutorial The tutorial data.
 * @prop {boolean} isCompleted Whether the tutorial is completed or not.
 *
 * @example
 * <TutorialCard tutorial={tutorial} isCompleted={progress.interviewCompleted} />
 */
const TutorialCard = ({
  tutorial: { id, title, description, isLocked },
  isCompleted,
}: {
  tutorial: Tutorial;
  isCompleted: boolean;
}) => {
  const router = useRouter();

  const handleClick = () => !isLocked && router.push(`/tutorials/${id}`);

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "cursor-pointer transition-all",
        isLocked
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "hover:shadow-lg"
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
        <p className="text-sm">
          {/* TODO: Can be unlocked with coins if the tutorial before it is already opened */}
          {isLocked ? "🔒 Locked" : "🔓 Unlocked"}
          {isCompleted && <span className="text-green-500">✔ Completed</span>}
        </p>
      </CardContent>
    </Card>
  );
};

export default TutorialCard;
