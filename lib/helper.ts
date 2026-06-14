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

export function getXpRequiredForLevel(level: number): number {
    return level * 100;
}

export function getTotalXpForLevel(level: number): number {
    let total = 0;
    for (let currentLevel = 1; currentLevel < level; currentLevel++) {
        total += getXpRequiredForLevel(currentLevel);
    }
    return total;
}

export function getLevelProgressFromXp(xp: number) {
    const level = getLevelFromXP(xp);
    const xpAtLevelStart = getTotalXpForLevel(level);
    const levelProgress = xp - xpAtLevelStart;
    const levelProgressMax = getXpRequiredForLevel(level);
    const rank = calculateRank(xp);

    return { level, levelProgress, levelProgressMax, rank };
}

export const rankColors = {
    Grandmaster: "text-yellow-500",
    Legend: "text-green-500",
    Master: "text-purple-500",
    "Pro Learner": "text-blue-500",
    Intermediate: "text-gray-500",
    Novice: "text-orange-500",
    Beginner: "text-slate-500",
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
    return rankColors[rank as keyof typeof rankColors] ?? "text-slate-500";
};

/** @deprecated Use calculateRank instead */
export function getRankFromLevelXP(level: number, xp: number): string {
    return calculateRank(xp);
}
