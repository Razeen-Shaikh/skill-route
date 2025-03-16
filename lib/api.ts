import axios from "axios";
import { Quiz, User } from "./interface";
import { UserQuizAttempt } from "@prisma/client";

const API_BASE_URL = "/api";

const fetchUserData = async () => {
    const { data } = await axios.get<User>(`${API_BASE_URL}/user`, {
        withCredentials: true,
    });
    return data;
};

const fetchTutorials = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/tutorials`);
    return data;
}

const fetchTutorial = async (id: string) => {
    const { data } = await axios.get(`${API_BASE_URL}/tutorials/${id}`);
    return data;
}

const fetchQuiz = async (id: string) => {
    const { data } = await axios.get<Quiz>(`${API_BASE_URL}/quizzes/${id}`);
    return data;
}

const fetchUserProgress = async (userId: string, tutorialId: string) => {
    const { data } = await axios.get(`${API_BASE_URL}/progress/?userId=${userId}&tutorialId=${tutorialId}`);
    return data;
}

const fetchDashboardData = async (email: string) => {
    const { data } = await axios.get(`${API_BASE_URL}/dashboard?email=${email}`);
    return data;
}

const fetchBadges = async (userId: number) => {
    const { data } = await axios.get(`${API_BASE_URL}/badges?userId=${userId}`);
    return data;
}

const fetchLeaderboard = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/leaderboard`);
    return data;
}

const updateProfile = async ({ userId, avatar, theme }: { userId: number, avatar: string, theme: string }) => {
    const { data } = await axios.put(`${API_BASE_URL}/profile`, { userId, avatarUrl: avatar, theme });
    return data;
}

const submitQuizAttempt = async ({ userId, quizId, attempts }: { userId: number, quizId: number, attempts: { questionId: number, selectedOption: string }[] }) => {
    const { data } = await axios.post<UserQuizAttempt>(`${API_BASE_URL}/quiz/submit`, { userId, quizId, attempts }, {
        withCredentials: true,
    });
    return data;
}

const updateRewards = async (userId: number) => {
    const { data } = await axios.post(`${API_BASE_URL}/rewards`, { userId });
    return data;
}

const updateStreak = async (userId: number) => {
    const { data } = await axios.post(`${API_BASE_URL}/streak`, { userId });
    return data;
}

export {
    fetchUserData,
    fetchTutorials,
    fetchTutorial,
    fetchQuiz,
    fetchUserProgress,
    fetchDashboardData,
    fetchBadges,
    fetchLeaderboard,
    updateProfile,
    submitQuizAttempt,
    updateRewards,
    updateStreak
};