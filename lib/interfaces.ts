
export interface LastActivity {
    id: string
    userId: string
    type: ActivityType
    description?: string
    xpAwarded?: number
    createdAt: Date
    updatedAt: Date
    quizId?: string
    tutorialId?: string
    roadmapId?: string
    roadmapStepId?: string
    quizAttemptId?: string
    questionAttemptId?: string
    quiz?: Quiz
    tutorial?: Tutorial
    roadmap?: Roadmap
    roadmapStep?: RoadmapStep
    quizAttempt?: UserQuizAttempt
    questionAttempt?: UserQuestionAttempt
    profile: UserProfile[]
}

export interface AdminActivityLog {
    id: string;
    adminId: string;
    action: string;
    target: string;
    targetId: string;
    timestamp: Date;

    admin: User;
}


export interface Roadmap {
    id: string;
    title: string;
    description?: string | null;
    category?: string | null;
    type: RoadmapType;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;

    createdBy: User;
    steps: RoadmapStep[];
    progress: RoadmapProgress[];
    lastActivities: LastActivity[];
}

export interface RoadmapProgress {
    id: string;
    userId: string;
    roadmapId: string;
    progress: number;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    user: User;
    roadmap: Roadmap;
}

export interface RoadmapStep {
    id: string;
    title: string;
    description?: string | null;
    order: number;
    status: StepStatus;
    progress: number;
    completedAt?: Date | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;

    parentId?: string | null;
    roadmapId?: string | null;
    parent?: RoadmapStep | null;
    children: RoadmapStep[];
    roadmap?: Roadmap | null;
    tutorials: Tutorial[];
    quizzes: Quiz[];
    lastActivities: LastActivity[];
}


export interface Tutorial {
    id: string;
    title: string;
    description?: string;
    content: string;
    category?: string;
    authorId?: string;
    likes: number;
    views: number;
    isLocked: boolean;
    cost: number;
    hasChallenge: boolean;
    difficulty: DifficultyLevel;
    status: TutorialStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    quizzes: Quiz[];
    progress: UserProgress[];
    tutorialTags: Tag[];
    stepsId?: string;
    steps?: RoadmapStep;
    tutorialId?: string;
    tutorial?: Tutorial;
    nextTutorialId?: string;
    nextTutorial?: Tutorial;
    previousTutorials: Tutorial[];
    relatedTutorials: Tutorial[];
    lastActivities: LastActivity[];
}

export interface Quiz {
    id: string;
    title: string;
    slug: string;
    isTimed: boolean;
    timeLimit: number | null;
    maxScore: number;
    passPercentage: number;
    difficulty: DifficultyLevel;
    order: number | null;
    tutorialLocked: boolean | null;
    questionCount: number | null;
    estimatedDuration: number | null;
    tutorialId: string;
    stepsId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    questions: QuizQuestion[];
    attempts: UserQuizAttempt[];
    tutorial: Tutorial;
    tags: Tag[];
    steps: RoadmapStep | null;
    lastActivities: LastActivity[];
}

export interface QuizQuestion {
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    xp: number;
    quizId: string;
    createdAt: Date;
    updatedAt: Date;
    quiz: Quiz;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    usageCount: number;
    type: TagType;
    createdAt: Date;
    updatedAt: Date;
    quizzes: Quiz[];
    tutorials: Tutorial[];
}

export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash?: string;
    role: UserRole;
    failedAttempts: number;
    lockedUntil?: Date;
    resetToken?: string;
    resetTokenExpiry?: Date;
    emailVerified: boolean;
    verificationToken?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    profile?: UserProfile;
    roadmap?: Roadmap[];
    roadmapProgress: RoadmapProgress[];
    adminActivityLogs: AdminActivityLog[];
}

export interface UserProfile {
    userId: string;
    bio: string | null;
    location: string | null;
    website: string | null;
    socialLinks?: string[];
    avatar: string | null;
    rank: string;
    level: number;
    xp: number;
    levelProgress: number;
    levelProgressMax: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    lastLogin: Date | null;
    completedQuizzes?: string[];
    completedTutorials?: string[];
    completedRoadmaps?: string[];
    completedSteps?: string[];
    completedChallenges?: string[];
    completedInterviews?: string[];
    completedProjects?: string[];

    theme: ThemeName;

    coinWallet: CoinWallet | null;
    user: User;
    coinTransaction: CoinTransaction[];
    lastActivities: LastActivity[];
    progress: UserProgress[];
    quizAttempts: UserQuizAttempt[];
    userBadges: UserBadge[];
    streaks?: UserStreak;
}

export interface UserProgress {
    tutorialId: string;
    bestAttemptId?: string;
    lastAttemptId?: string;
    userQuizAttemptId?: string;
    isCompleted: boolean;
    completedAt?: Date;
    attempts: number;
    bestScore: number;
    percentageCompleted: number;
    interviewCompleted: boolean;
    challengeCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    profileId: string;
    profile: UserProfile;
    tutorial: Tutorial;
    userQuizAttempt?: UserQuizAttempt;
}

export interface UserStreak {
    profileId: string;
    streak: number;
    streakDays: number;
    lastLogin?: Date;
    currentStart?: Date;
    currentEnd?: Date;
    longestStreak: number;
    longestStart?: Date;
    longestEnd?: Date;
    createdAt: Date;
    updatedAt: Date;
    profile: UserProfile;
}

export interface UserQuizAttempt {
    id: string;
    quizId: string;
    startedAt: Date;
    completedAt?: Date;
    score: number;
    isPassed: boolean;
    feedback?: string;
    createdAt: Date;
    updatedAt: Date;
    profileId: string;
    profile: UserProfile;
    quiz: Quiz;
    questionAttempts: UserQuestionAttempt[];
    lastActivities: LastActivity[];
    userProgress: UserProgress[];
}

export interface UserQuestionAttempt {
    id: string;
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
    xpEarned: number;
    userQuizAttemptId: string;
    createdAt: Date;
    updatedAt: Date;
    quizAttempt: UserQuizAttempt;
    lastActivities: LastActivity[];
}

export interface UserBadge {
    badgeId: string;
    earnedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    profileId: string;
    profile: UserProfile;
    badge: Badge;
}

export interface Badge {
    id: string;
    name: string;
    imageUrl: string;
    xpRequired: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    userBadges: UserBadge[];
}

export interface CoinWallet {
    id: string
    balance: number
    createdAt: Date
    updatedAt: Date

    profile: UserProfile
}

export interface CoinTransaction {
    id: string
    type: TransactionType
    amount: number
    description: string
    transactionAt: Date
    createdAt: Date
    updatedAt: Date

    profileId: string
    profile: UserProfile
}


export type ActivityType = "BADGE" | "COINS" | "LOGIN" | "QUIZ" | "ROADMAP" | "STEP" | "TUTORIAL" | "TRANSACTION" | "XP" | "LEVEL";
export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";
export type RoadmapType = "FRONTEND" | "BACKEND" | "FULLSTACK" | "MERN" | "MEAN" | "AI" | "DEVOPS" | "MOBILE" | "BLOCKCHAIN" | "GAMING" | "DATA_SCIENCE" | "CLOUD" | "CYBER_SECURITY" | "SOFTWARE_TESTING" | "MACHINE_LEARNING";
export type StepStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type TagType = "GLOBAL" | "QUIZ" | "ROADMAP" | "TUTORIAL";
export type ThemeName = "DARK" | "LIGHT";
export type TransactionType = "EARNED" | "PENALTY" | "SPENT" | "REWARD" | "ALL";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";
export type TransactionCategory = "COINS" | "XP" | "BADGES" | "LEVEL_UP" | "TUTORIAL_COMPLETION" | "QUIZ_COMPLETION" | "ROADMAP_COMPLETION";
// export type TransactionAction = "EARN" | "SPEND" | "PENALTY" | "REWARD" | "LEVEL_UP" | "TUTORIAL_COMPLETION" | "QUIZ_COMPLETION" | "ROADMAP_COMPLETION"; // keep this for future use
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED" | "DELETED" | "SUSPENDED";
export type TutorialStatus = "DRAFT" | "PENDING_APPROVAL" | "PUBLISHED" | "ARCHIVED" | "REJECTED" | "DELETED";
export type UnitType = "CHALLENGE" | "LESSON" | "QUIZ" | "TUTORIAL" | "INTERVIEW" | "PROJECT" | "EXERCISE" | "ASSESSMENT" | "CERTIFICATION" | "WORKSHOP" | "BOOTCAMP" | "WEBINAR" | "PODCAST" | "ARTICLE" | "VIDEO" | "BOOK" | "COURSE";
export type UserRole = "ADMIN" | "USER" | "MODERATOR" | "GUEST" | "SUPER_ADMIN";
