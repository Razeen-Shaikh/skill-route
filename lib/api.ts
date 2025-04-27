import { User, Tutorial, Quiz, UserProfile, UserProgress, UserBadge, ThemeName, LastActivity, Roadmap, CoinTransaction, UserQuizAttempt, CoinWallet, TransactionType, ActivityType } from "@/lib/interfaces";
import axios from "axios";

export interface LeaderBoard {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    rank: string;
    xp: number;
    coins: number;
    level: number;
}

export interface DashboardProfile extends Omit<UserProfile, "lastActivities" | "quizAttempts" | "userBadges" | "coinTransaction"> {
    email: string;
    firstName: string;
    lastName: string;
    username: string | null;
    emailVerified: boolean | null;
    provider: string | null;

    coins: number;

    transactions: {
        transactionId: string;
        transactionType: TransactionType;
        transactionAmount: number;
        transactionDescription: string;
        transactionDate: Date;
    }[];

    tutorialProgress: {
        tutorialId: string;
        tutorialTitle: string | null;
        completed: boolean;
        completedAt: Date | null;
        percentageCompleted: number;
        bestScore: number;
        attempts: number;
        challengeCompleted: boolean;
        interviewCompleted: boolean;
    }[];

    quizAttempts: {
        quizAttemptId: string;
        quizId: string;
        quizTitle: string | null;
        score: number;
        isPassed: boolean;
        feedback: string;
        completedAt: Date;
    }[];

    earnedBadges: {
        badgeId: string;
        badgeName: string | null;
        badgeImage: string | null;
        badgeDescription: string | null;
        earnedAt: string | null;
    }[];

    streakCount: number;
    streakDays: number;
    longestStreak: number;
    lastStreakLogin: string | null;
    streakStart: string | null;
    streakEnd: string | null;
    longestStreakStart: string | null;
    longestStreakEnd: string | null;

    lastActivities: {
        activityId: string;
        activityType: ActivityType;
        activityDescription: string;
        xpAwarded: number;
        createdAt: Date;
        quizId: string | null;
        tutorialId: string | null;
        roadmapId: string | null;
        roadmapStepId: string | null;
    }[];
    totalTutorials: number;
    totalQuizzes: number;
}

export interface AdminDashboard {
    stats: {
        users: number;
        tutorials: number;
        quizzes: number;
        paths: number;
    };
    topUsers: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        profile: {
            xp: number;
            level: number;
            rank: string;
            completedQuizzes: string[];
            completedTutorials: string[];
            completedRoadmaps: string[];
            completedSteps: string[];
            completedChallenges: string[];
            completedInterviews: string[];
            completedProjects: string[];
        };
    }[];
    recentActivities: {
        id: string;
        action: string;
        timestamp: string;
        admin: {
            firstName: string;
            lastName: string;
        };
    }[];
}

const API_BASE_URL = "/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Generic fetch function with error handling
const fetchData = async <T>(url: string, params?: object) => {
    try {
        const { data } = await api.get<T>(url, { params });
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw new Error("Failed to fetch data");
    }
};

const postData = async <T>(url: string, body: object) => {
    try {
        const { data } = await api.post<T>(url, body);
        return data;
    } catch (error) {
        console.error(`Error posting data to ${url}:`, error);
        throw new Error("Failed to submit data");
    }
};

const putData = async <T>(url: string, body: object) => {
    try {
        const { data } = await api.put<T>(url, body);
        return data;
    } catch (error) {
        console.error(`Error updating data at ${url}:`, error);
        throw new Error("Failed to update data");
    }
};

/** Fetch functions **/
const fetchUserData = () => fetchData<User>("/user");
const fetchTutorials = () => fetchData<Tutorial[]>("/tutorials");
const fetchTutorial = (tutorialId: string) => fetchData<Tutorial>(`/tutorial?tutorialId=${tutorialId}`);
const fetchQuizzes = () => fetchData<Quiz[]>('/quizzes');
const fetchQuiz = (quizId: string) => fetchData<Quiz>(`/quiz?quizId=${quizId}`);
const fetchUserProgress = (userId: string, tutorialId: string) => fetchData<UserProgress>(`/tutorials/progress`, { userId, tutorialId });
const fetchDashboardData = (email: string) => fetchData<User>(`/dashboard`, { email });
const fetchBadges = (userId: string) => fetchData<UserBadge[]>(`/badges`, { userId });
const fetchLeaderboard = () => fetchData<LeaderBoard[]>(`/leaderboard`);
const fetchTheme = () => fetchData<ThemeName>(`/profile/theme`);
const fetchUserCoins = (userId: string) => fetchData<CoinWallet>(`/coins`, { userId });
const fetchLastActivity = () => fetchData<LastActivity[]>('/lastActivity');
/**
 * Fetches data for the admin dashboard.
 * @returns {Promise<AdminDashboard[]>} The promise resolves to an array of AdminDashboard objects.
 */
const fetchAdminDashboard = () => fetchData<AdminDashboard>('/admin/dashboard');
const fetchRoadmaps = () => fetchData<Roadmap[]>('/roadmaps');
export const fetchProfile = () => fetchData<DashboardProfile>('/profile')

const fetchTransactions = async ({ page, limit, filter }: { page: number; limit: number; filter: string }) => {
    return fetchData<{ transactions: CoinTransaction[]; totalPages: number }>(`/transactions`, { page, limit, filter: filter !== "ALL" ? filter : undefined });
};

const fetchQuizAttempts = (quizIds: string[]) => fetchData<{ quizId: string, score: number, completedAt: string }[]>(`/quiz/attempts`, { quizIds: quizIds.join(",") });

/** Update functions **/
const updateProfile = (userId: string, avatar: string, theme: string) => putData(`/profile`, { userId, avatarUrl: avatar, theme });
const updateRewards = () => postData<{ reward: number; message: string }>(`/rewards`, {});
const updateStreak = (userId: string) => postData(`/streak`, { userId });
const updateTheme = (newTheme: string) => putData<ThemeName>(`/profile/theme`, { theme: newTheme });
const updateProgress = (userId: string, tutorialId: string, percentageCompleted: number) => putData(`/tutorials/progress`, { userId, tutorialId, percentageCompleted });
const markComplete = (roadmapId: string) => postData(`/roadmap/complete`, { id: roadmapId });

/** Create functions **/
const submitQuizAttempt = (quizId: string, attempts: { questionId: string; selectedOption: string }[]) => postData<UserQuizAttempt>(`/quiz/submit`, { quizId, attempts });
const registerUser = async (name: string, email: string, password: string) => postData(`/auth/register`, { name, email, password });


export {
    fetchUserData,
    fetchTutorials,
    fetchTutorial,
    fetchQuizzes,
    fetchQuiz,
    fetchUserProgress,
    fetchDashboardData,
    fetchBadges,
    fetchLeaderboard,
    fetchAdminDashboard,
    fetchTheme,
    fetchUserCoins,
    fetchLasttActivity,
    fetchTransactions,
    fetchQuizAttempts,
    fetchRoadmaps,
    updateProfile,
    submitQuizAttempt,
    updateRewards,
    updateStreak,
    updateTheme,
    updateProgress,
    markComplete,
    registerUser
};
