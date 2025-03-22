interface User {
    id: number; // Auto-incremented ID
    username: string; // Unique username
    firstName: string;
    lastName?: string;
    email: string; // Unique email
    passwordHash: string;
    avatarUrl?: string;
    role: string; // 'user' or 'admin'
    failedAttempts: number;
    lockedUntil?: Date;
    createdAt: Date;
    updatedAt: Date;
    resetToken?: string;
    resetTokenExpiry?: Date;
    emailVerified: boolean;
    verificationToken?: string;

    profile?: UserProfile;
    progress: UserProgress[];
    quizAttempts: UserQuizAttempt[];
    badges: UserBadge[];
    streaks?: UserStreak;
    recentActivities: RecentActivity[];
}

interface UserProfile {
    userId: number;
    rank: number;
    points: number;
    coins: number;
    theme: ThemeName | null;
    createdAt: Date;
    updatedAt: Date;

    user: User;

    transactions: CoinTransaction[];
    themes: Theme[];
}

interface Tutorial {
    id: number; // Auto-incremented ID
    title: string;
    description?: string;
    content: string;
    category?: string;
    authorId?: number;
    likes: number;
    views: number;
    isLocked: boolean;
    cost: number;
    nextTutorialId?: number;
    difficulty: DifficultyLevel;
    hasChallenge: boolean;
    createdAt: Date;
    updatedAt: Date;

    quizzes: Quiz[];
    progress: UserProgress[];
}

interface Quiz {
    id: number; // Auto-incremented ID
    title: string;
    isTimed: boolean;
    timeLimit?: number;
    maxScore: number;
    passPercentage: number;
    difficulty: DifficultyLevel;
    createdAt: Date;
    updatedAt: Date;

    questions: QuizQuestion[];
    attempts: UserQuizAttempt[];
    tutorial?: Tutorial;
    tutorialId?: number;
}

interface QuizQuestion {
    id: number; // Auto-incremented ID
    quizId: number;
    questionText: string;
    options: string[];
    correctAnswer: string;
    points: number;

    createdAt: Date;
    updatedAt: Date;

    quiz: Quiz;
}

interface UserProgress {
    id: number; // Auto-incremented ID
    userId: number;
    tutorialId: number;
    isCompleted: boolean;
    completedAt?: Date;
    attempts: number;
    bestScore: number;
    percentageCompleted: number;
    interviewCompleted: boolean;
    challengeCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;

    user: User;
    tutorial: Tutorial;
}

interface UserQuizAttempt {
    id: number; // Auto-incremented ID
    userId: number;
    quizId: number;
    startedAt: Date;
    completedAt?: Date;
    score: number;
    createdAt: Date;
    updatedAt: Date;

    user?: User;
    quiz?: Quiz;

    questionAttempts?: UserQuestionAttempt[];
}

interface UserQuestionAttempt {
    id: number; // Auto-incremented ID
    userQuizAttemptId: number;
    questionId: number;
    selectedOption: string;
    isCorrect: boolean;
    pointsEarned: number;
    createdAt: Date;
    updatedAt: Date;

    quizAttempts: UserQuizAttempt;
}

interface CoinTransaction {
    id: number; // Auto-incremented ID
    userProfileId: number;
    type: TransactionType;
    amount: number;
    description: string;
    transactionAt: Date;
    createdAt: Date;
    updatedAt: Date;

    userProfile: UserProfile;
}

interface Badge {
    id: number; // Auto-incremented ID
    name: string;
    imageUrl: string;
    pointsReq: number;
    createdAt: Date;
    updatedAt: Date;

    badges: UserBadge[];
}

interface UserBadge {
    id: number; // Auto-incremented ID
    userId: number;
    badgeId: number;
    earnedAt: Date;
    createdAt: Date;
    updatedAt: Date;

    user: User;
    badge: Badge;
}

interface UserStreak {
    userId: number; // Relational ID
    streakCount: number;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;

    user: User
}

interface Theme {
    id: number; // Auto-incremented ID
    userProfileId: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;

    userProfile: UserProfile
}

interface RecentActivity {
    id: string; // UUID
    userId: number;
    activityType: string;
    activityDetails: string;
    createdAt: Date;
    updatedAt: Date;
}

type TransactionType = "ALL" | "EARNED" | "SPENT";

type ThemeName = "DARK" | "LIGHT";

type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";


export type {
    User,
    UserProfile,
    Tutorial,
    Quiz,
    QuizQuestion,
    UserProgress,
    UserQuizAttempt,
    UserQuestionAttempt,
    CoinTransaction,
    Badge,
    UserBadge,
    UserStreak,
    Theme,
    RecentActivity,
    TransactionType,
    ThemeName,
    DifficultyLevel
}