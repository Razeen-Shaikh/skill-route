import axios from "axios";
import { Quiz, Tutorial, User, UserBadge, UserProgress, UserQuizAttempt } from "./interface";

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

// Fetch functions
const fetchUserData = () => fetchData<User>("/user");
const fetchTutorials = () => fetchData<Tutorial[]>("/tutorials");
const fetchTutorial = (id: number) => fetchData<Tutorial>(`/tutorials/${id}`);
const fetchQuiz = (id: number) => fetchData<Quiz>(`/quizzes/${id}`);
const fetchUserProgress = (userId: number, tutorialId: number) => fetchData<UserProgress>(`/tutorials/progress`, { userId, tutorialId });
const fetchDashboardData = (email: string) => fetchData<User>(`/dashboard`, { email });
const fetchBadges = (userId: number) => fetchData<UserBadge[]>(`/badges`, { userId });
const fetchLeaderboard = () => fetchData<User[]>(`/leaderboard`);
const fetchTheme = (userId: number) => fetchData(`/profile/theme`, { userId });
const fetchUserCoins = (userId: number) => fetchData<{ coins: number }>(`/profile/coins`, { userId });

const fetchTransactions = async ({ page, limit, filter }: { page: number; limit: number; filter: string }) => {
    return fetchData(`/transactions`, { page, limit, filter: filter !== "ALL" ? filter : undefined });
};

const fetchQuizAttempts = (quizIds: number[]) => fetchData<{ quizId: number }[]>(`/quiz/attempts`, { quizIds: quizIds.join(",") });

// Update functions
const updateProfile = (userId: number, avatar: string, theme: string) => putData(`/profile`, { userId, avatarUrl: avatar, theme });
const submitQuizAttempt = (userId: number, quizId: number, attempts: { questionId: number; selectedOption: string }[]) => postData<UserQuizAttempt>(`/quiz/submit`, { userId, quizId, attempts });
const updateRewards = (userId: number) => postData(`/rewards`, { userId });
const updateStreak = (userId: number) => postData(`/streak`, { userId });
const updateTheme = (userId: number, newTheme: string) => putData(`/profile/theme`, { userId, theme: newTheme });
const updateProgress = (userId: number, tutorialId: number, percentageCompleted: number) => putData(`/tutorials/progress`, { userId, tutorialId, percentageCompleted });

export {
    fetchUserData,
    fetchTutorials,
    fetchTutorial,
    fetchQuiz,
    fetchUserProgress,
    fetchDashboardData,
    fetchBadges,
    fetchLeaderboard,
    fetchTheme,
    fetchUserCoins,
    fetchTransactions,
    fetchQuizAttempts,
    updateProfile,
    submitQuizAttempt,
    updateRewards,
    updateStreak,
    updateTheme,
    updateProgress,
};
