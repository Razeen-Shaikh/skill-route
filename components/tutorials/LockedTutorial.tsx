export default function LockedTutorial() {
  return (
    <div className="p-6 bg-muted border border-border rounded-lg text-center space-y-2">
      <p className="text-lg font-semibold">This tutorial is locked</p>
      <p className="text-muted-foreground">
        Complete all quizzes in the previous tutorial to unlock this one.
      </p>
    </div>
  );
}
