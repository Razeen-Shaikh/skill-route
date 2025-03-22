export const calculateRank = (xp: number): string => {
    if (xp >= 5000) return "Grandmaster";
    if (xp >= 3000) return "Legend";
    if (xp >= 2000) return "Master";
    if (xp >= 1000) return "Pro Learner";
    if (xp >= 500) return "Intermediate";
    if (xp >= 200) return "Novice";
    return "Beginner";
};