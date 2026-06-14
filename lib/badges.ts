import { BadgeCriteria } from "@/generated/prisma";

export type BadgeDefinition = {
    slug: string;
    name: string;
    description: string;
    criteriaType: BadgeCriteria;
    criteriaValue: number;
    icon: string;
    colorFrom: string;
    colorTo: string;
    ringColor: string;
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
    // Quiz milestones
    {
        slug: "first-quiz",
        name: "First Quiz",
        description: "Pass your first quiz",
        criteriaType: "QUIZZES_PASSED",
        criteriaValue: 1,
        icon: "✓",
        colorFrom: "#60a5fa",
        colorTo: "#2563eb",
        ringColor: "#93c5fd",
    },
    {
        slug: "quiz-explorer",
        name: "Quiz Explorer",
        description: "Pass 5 quizzes",
        criteriaType: "QUIZZES_PASSED",
        criteriaValue: 5,
        icon: "?",
        colorFrom: "#34d399",
        colorTo: "#059669",
        ringColor: "#6ee7b7",
    },
    {
        slug: "quiz-champion",
        name: "Quiz Champion",
        description: "Pass 10 quizzes",
        criteriaType: "QUIZZES_PASSED",
        criteriaValue: 10,
        icon: "★",
        colorFrom: "#fbbf24",
        colorTo: "#d97706",
        ringColor: "#fcd34d",
    },
    {
        slug: "quiz-legend",
        name: "Quiz Legend",
        description: "Pass all 15 quizzes",
        criteriaType: "QUIZZES_PASSED",
        criteriaValue: 15,
        icon: "♛",
        colorFrom: "#f472b6",
        colorTo: "#db2777",
        ringColor: "#f9a8d4",
    },
    {
        slug: "perfect-quiz",
        name: "Perfect Score",
        description: "Score 100% on any quiz",
        criteriaType: "PERFECT_QUIZ",
        criteriaValue: 1,
        icon: "100",
        colorFrom: "#a78bfa",
        colorTo: "#7c3aed",
        ringColor: "#c4b5fd",
    },

    // Tutorial milestones
    {
        slug: "first-tutorial",
        name: "First Tutorial",
        description: "Complete your first tutorial",
        criteriaType: "TUTORIALS_COMPLETED",
        criteriaValue: 1,
        icon: "📖",
        colorFrom: "#38bdf8",
        colorTo: "#0284c7",
        ringColor: "#7dd3fc",
    },
    {
        slug: "tutorial-path",
        name: "Learning Path",
        description: "Complete 5 tutorials",
        criteriaType: "TUTORIALS_COMPLETED",
        criteriaValue: 5,
        icon: "📚",
        colorFrom: "#4ade80",
        colorTo: "#16a34a",
        ringColor: "#86efac",
    },
    {
        slug: "tutorial-master",
        name: "Tutorial Master",
        description: "Complete all 15 tutorials",
        criteriaType: "TUTORIALS_COMPLETED",
        criteriaValue: 15,
        icon: "🎓",
        colorFrom: "#fb923c",
        colorTo: "#ea580c",
        ringColor: "#fdba74",
    },

    // Roadmap milestones
    {
        slug: "first-step",
        name: "Roadmap Starter",
        description: "Complete your first roadmap step",
        criteriaType: "ROADMAP_STEPS",
        criteriaValue: 1,
        icon: "🗺",
        colorFrom: "#2dd4bf",
        colorTo: "#0d9488",
        ringColor: "#5eead4",
    },
    {
        slug: "roadmap-builder",
        name: "Roadmap Builder",
        description: "Complete 3 roadmap steps",
        criteriaType: "ROADMAP_STEPS",
        criteriaValue: 3,
        icon: "🧭",
        colorFrom: "#818cf8",
        colorTo: "#4f46e5",
        ringColor: "#a5b4fc",
    },
    {
        slug: "roadmap-master",
        name: "Roadmap Master",
        description: "Complete all 6 roadmap steps",
        criteriaType: "ROADMAP_STEPS",
        criteriaValue: 6,
        icon: "🏔",
        colorFrom: "#e879f9",
        colorTo: "#c026d3",
        ringColor: "#f0abfc",
    },

    // XP milestones (aligned with rank thresholds)
    {
        slug: "xp-novice",
        name: "Novice",
        description: "Earn 200 XP",
        criteriaType: "XP",
        criteriaValue: 200,
        icon: "I",
        colorFrom: "#94a3b8",
        colorTo: "#64748b",
        ringColor: "#cbd5e1",
    },
    {
        slug: "xp-intermediate",
        name: "Intermediate",
        description: "Earn 500 XP",
        criteriaType: "XP",
        criteriaValue: 500,
        icon: "II",
        colorFrom: "#78716c",
        colorTo: "#57534e",
        ringColor: "#a8a29e",
    },
    {
        slug: "xp-pro",
        name: "Pro Learner",
        description: "Earn 1,000 XP",
        criteriaType: "XP",
        criteriaValue: 1000,
        icon: "III",
        colorFrom: "#3b82f6",
        colorTo: "#1d4ed8",
        ringColor: "#60a5fa",
    },
    {
        slug: "xp-master",
        name: "Master",
        description: "Earn 2,000 XP",
        criteriaType: "XP",
        criteriaValue: 2000,
        icon: "IV",
        colorFrom: "#a855f7",
        colorTo: "#7e22ce",
        ringColor: "#c084fc",
    },
    {
        slug: "xp-legend",
        name: "Legend",
        description: "Earn 3,000 XP",
        criteriaType: "XP",
        criteriaValue: 3000,
        icon: "V",
        colorFrom: "#22c55e",
        colorTo: "#15803d",
        ringColor: "#4ade80",
    },
    {
        slug: "xp-grandmaster",
        name: "Grandmaster",
        description: "Earn 5,000 XP",
        criteriaType: "XP",
        criteriaValue: 5000,
        icon: "VI",
        colorFrom: "#eab308",
        colorTo: "#a16207",
        ringColor: "#facc15",
    },

    // Level milestones
    {
        slug: "level-5",
        name: "Level 5",
        description: "Reach level 5",
        criteriaType: "LEVEL",
        criteriaValue: 5,
        icon: "5",
        colorFrom: "#06b6d4",
        colorTo: "#0891b2",
        ringColor: "#22d3ee",
    },
    {
        slug: "level-10",
        name: "Level 10",
        description: "Reach level 10",
        criteriaType: "LEVEL",
        criteriaValue: 10,
        icon: "10",
        colorFrom: "#ef4444",
        colorTo: "#b91c1c",
        ringColor: "#f87171",
    },

    // Streak milestones
    {
        slug: "streak-3",
        name: "On a Roll",
        description: "Maintain a 3-day login streak",
        criteriaType: "STREAK",
        criteriaValue: 3,
        icon: "🔥",
        colorFrom: "#f97316",
        colorTo: "#c2410c",
        ringColor: "#fb923c",
    },
    {
        slug: "streak-7",
        name: "Week Warrior",
        description: "Maintain a 7-day login streak",
        criteriaType: "STREAK",
        criteriaValue: 7,
        icon: "7",
        colorFrom: "#f43f5e",
        colorTo: "#be123c",
        ringColor: "#fb7185",
    },
    {
        slug: "streak-30",
        name: "Unstoppable",
        description: "Maintain a 30-day login streak",
        criteriaType: "STREAK",
        criteriaValue: 30,
        icon: "30",
        colorFrom: "#8b5cf6",
        colorTo: "#6d28d9",
        ringColor: "#a78bfa",
    },

    // Coin milestones
    {
        slug: "coins-50",
        name: "Coin Collector",
        description: "Collect 50 coins",
        criteriaType: "COINS",
        criteriaValue: 50,
        icon: "🪙",
        colorFrom: "#fcd34d",
        colorTo: "#ca8a04",
        ringColor: "#fde047",
    },
    {
        slug: "coins-200",
        name: "Treasure Hunter",
        description: "Collect 200 coins",
        criteriaType: "COINS",
        criteriaValue: 200,
        icon: "💰",
        colorFrom: "#f59e0b",
        colorTo: "#b45309",
        ringColor: "#fbbf24",
    },
];

export function getBadgeDefinition(slug: string) {
    return BADGE_DEFINITIONS.find((badge) => badge.slug === slug);
}

export function getEarnRequirementText(badge: BadgeDefinition) {
    switch (badge.criteriaType) {
        case "XP":
            return `Earn ${badge.criteriaValue.toLocaleString()} XP`;
        case "LEVEL":
            return `Reach level ${badge.criteriaValue}`;
        case "QUIZZES_PASSED":
            return `Pass ${badge.criteriaValue} quiz${badge.criteriaValue === 1 ? "" : "zes"}`;
        case "TUTORIALS_COMPLETED":
            return `Complete ${badge.criteriaValue} tutorial${badge.criteriaValue === 1 ? "" : "s"}`;
        case "ROADMAP_STEPS":
            return `Complete ${badge.criteriaValue} roadmap step${badge.criteriaValue === 1 ? "" : "s"}`;
        case "STREAK":
            return `${badge.criteriaValue}-day login streak`;
        case "COINS":
            return `Collect ${badge.criteriaValue} coins`;
        case "PERFECT_QUIZ":
            return "Score 100% on a quiz";
        default:
            return badge.description;
    }
}
