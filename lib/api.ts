import axios from "axios";
import { Attempt, Quiz, User } from "./interface";

const API_BASE_URL = "/api";

const fetchUserData = async () => {
    const { data } = await axios.get<User>(`${API_BASE_URL}/user`, {
        withCredentials: true,
    });
    return data;
};

const fetchQuizData = async (quizId: number) => {
    const { data } = await axios.get<Quiz>(`${API_BASE_URL}/quiz/${quizId}`, {
        withCredentials: true,
    });
    return data;
};

const postAttemptData = async (quizId: number, body: { score: number }) => {
    const { data } = await axios.post<Attempt>(`${API_BASE_URL}/quiz/${quizId}/attempts`, body, {
        withCredentials: true,
    });
    return data;
};

export { fetchUserData, fetchQuizData, postAttemptData };