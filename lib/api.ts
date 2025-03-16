import axios from "axios";
import { Quiz, User } from "./interface";
import { UserQuizAttempt } from "@prisma/client";
import { format } from "date-fns";

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

const fetchTheme = async (userId: number) => {
    const { data } = await axios.get(`${API_BASE_URL}/profile/theme?userId=${userId}`);
    return data;
}

const fetchCoinTransactions = async (filter: string, searchQuery: string, page: number, dateRange: { endDate: string | number | Date; }[]) => {
    const startDate = format(dateRange[0].startDate, "yyyy-MM-dd");
    const endDate = format(dateRange[0].endDate, "yyyy-MM-dd");

    const response = await fetch(`/api/coin-transactions?filter=${filter}&search=${searchQuery}&page=${page}&startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok) { throw new Error("Failed to fetch transactions"); }
    return response.json();
};

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

const updateTheme = async (userId: number, newTheme: string) => {
    const { data } = await axios.put(`${API_BASE_URL}/profile/theme`, { userId, theme: newTheme });
    return data;
}

// 📄 Export to CSV (With Date Range)
export const exportToCSV = (transactions, startDate, endDate) => {
    if (!transactions || transactions.length === 0) return;

    const headers = ["Description", "Amount", "Date"];
    const rows = transactions
        .filter((txn) => new Date(txn.date) >= new Date(startDate) && new Date(txn.date) <= new Date(endDate))
        .map((txn) => [txn.description, txn.amount, format(new Date(txn.date), "yyyy-MM-dd")]);

    let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `coin_transactions_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
};

// 🖨️ Export to PDF (With Date Range)
export const exportToPDF = (transactions, startDate, endDate) => {
    if (!transactions || transactions.length === 0) return;

    const doc = new jsPDF();
    doc.text(`Coin Transactions (${startDate} to ${endDate})`, 14, 10);

    const rows = transactions
        .filter((txn) => new Date(txn.date) >= new Date(startDate) && new Date(txn.date) <= new Date(endDate))
        .map((txn) => [txn.description, txn.amount, format(new Date(txn.date), "yyyy-MM-dd")]);

    autoTable(doc, {
        head: [["Description", "Amount", "Date"]],
        body: rows,
        startY: 20,
    });

    doc.save(`coin_transactions_${startDate}_to_${endDate}.pdf`);
};


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
    fetchCoinTransactions,
    updateProfile,
    submitQuizAttempt,
    updateRewards,
    updateStreak,
    updateTheme
};