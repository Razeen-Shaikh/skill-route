import { Quiz, ThemeName } from "./interfaces";

export function getStoredOrSystemTheme(): ThemeName {
    if (typeof window === "undefined") return "LIGHT";
    return (localStorage.getItem("theme") as ThemeName) ?? getSystemPreference();
}

export function getSystemPreference(): ThemeName {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "DARK"
        : "LIGHT";
}

export const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(date);
};

export function shouldLockQuiz(allQuizzes: Quiz[], currentQuiz: Quiz): boolean {
    const previousQuiz = allQuizzes.find(
        (q) => q.order === (currentQuiz?.order ?? 0) - 1 && q.tutorialId === currentQuiz.tutorialId
    );

    if (!previousQuiz) return false;

    const prevAttempts = previousQuiz.attempts || [];
    const passed = prevAttempts.some(
        (a) => (a.score / previousQuiz.maxScore) * 100 >= previousQuiz.passPercentage
    );

    return !passed;
}

export function getLevelFromXP(xp: number): number {
    let level = 1;
    let requiredXP = 100;
    let totalXP = 0;

    while (xp >= totalXP + requiredXP) {
        totalXP += requiredXP;
        level++;
        requiredXP = level * 100;
    }

    return level;
}

export const rankColors = {
    Grandmaster: "text-yellow-500",
    Master: "text-purple-500",
    Legend: "text-green-500",
    "Pro Learner": "text-blue-500",
    Intermediate: "text-gray-500",
};

export const calculateRank = (xp: number): string => {
    if (xp >= 5000) return "Grandmaster";
    if (xp >= 3000) return "Legend";
    if (xp >= 2000) return "Master";
    if (xp >= 1000) return "Pro Learner";
    if (xp >= 500) return "Intermediate";
    if (xp >= 200) return "Novice";
    return "Beginner";
};

export const getRankColor = (rank: string): string => {
    switch (rank) {
        case "Grandmaster":
            return rankColors.Grandmaster;
        case "Master":
            return rankColors.Master;
        case "Legend":
            return rankColors.Legend;
        case "Pro Learner":
            return rankColors["Pro Learner"];
        case "Intermediate":
            return rankColors.Intermediate;
        default:
            return "text-dark-500";
    }
}

export function getRankFromLevelXP(level: number, xp: number): string {
    if (level >= 10 && xp >= 15000) return "Legend";
    if (level >= 8 && xp >= 12000) return "Master";
    if (level >= 6 && xp >= 9000) return "Grandmaster";
    if (level >= 4 && xp >= 6000) return "Pro Learner";
    if (level >= 2 && xp >= 3000) return "Intermediate";
    return "Rookie";
}
