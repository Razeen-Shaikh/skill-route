import bcrypt from "bcryptjs";
import { ActivityType, DifficultyLevel, Quiz, RoadmapType, ThemeName, TransactionType, Tutorial, TutorialStatus, UserProfile, UserQuizAttempt, UserRole } from "@/generated/prisma";

const hashPassword = async (password: string) => await bcrypt.hash(password, 10);

const roles: UserRole[] = ["USER", "ADMIN", "MODERATOR"];
const themeOptions: ThemeName[] = ['LIGHT', 'DARK'];
const difficultyLevels: DifficultyLevel[] = ["EASY", "MEDIUM", "HARD"];
const tutorialStatus: TutorialStatus[] = ["DRAFT", "PENDING_APPROVAL", "PUBLISHED"];
const transactionType: TransactionType[] = ["EARNED", "SPENT"];
const activityType: ActivityType[] = ["BADGE", "COINS", "LOGIN", "QUIZ", "TUTORIAL", "ROADMAP", "STEP", "TRANSACTION", "XP", "LEVEL"];
const roadmapType: RoadmapType[] = ["AI", "BACKEND", "DEVOPS", "FRONTEND", "FULLSTACK"];
const getTheme = () => themeOptions[Math.floor(Math.random() * themeOptions.length)];
const getRandomDifficulty = (): DifficultyLevel =>
    difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
const getTutorialStatus = (): TutorialStatus => tutorialStatus[Math.floor(Math.random() * tutorialStatus.length)];
const getRole = (): UserRole => roles[Math.floor(Math.random() * roles.length)];
const getTransactionType = (): TransactionType => transactionType[Math.floor(Math.random() * transactionType.length)];
const getActivityType = (): ActivityType => activityType[Math.floor(Math.random() * activityType.length)];
const getRoadmapType = (): RoadmapType => roadmapType[Math.floor(Math.random() * roadmapType.length)];

const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomBool = () => Math.random() < 0.5;
let selected: { [key: string]: string } = {};
const selectedOption = (id: string, quizQuestion: { options: string[] }) => {
    selected = { [id]: quizQuestion.options[Math.floor(Math.random() * 4)] };
    return selected[id];
}

const getResetToken = () => Math.random().toString(36).substring(2, 15);

const getRandomTimeLimit = () =>
    [30, 60, 90, 120, 150, 180, 210, 240, 270, 300][Math.floor(Math.random() * 10)];


// User Progress
const getPercentageCompleted = (userId: string, tutorialId: string, quizRecords: Quiz[] = [], quizAttemptRecords: UserQuizAttempt[] = []) => {
    const tutorialQuizzes = quizRecords.filter(q => q.tutorialId === tutorialId);
    const completedQuizzes = quizAttemptRecords.filter(q => q.profileId === userId && tutorialQuizzes.some(tq => tq.id === q.quizId));

    return tutorialQuizzes.length > 0 ? Math.round((completedQuizzes.length / tutorialQuizzes.length) * 100) : 0;
};
const getUserId = (userProfileRecords: UserProfile[]) => {
    return userProfileRecords[Math.floor(Math.random() * userProfileRecords.length)].userId;
}

const getTotalQuizAttemptsByUserAndTutorial = (userId: string, tutorialId: string, quizRecords: Quiz[] = [], quizAttemptRecords: UserQuizAttempt[] = []) => {
    const tutorialQuizzes = quizRecords.filter((q: { tutorialId: string; id: string }) => q.tutorialId === tutorialId).map(q => q.id);

    return quizAttemptRecords.filter(q => q.profileId === userId && tutorialQuizzes.includes(q.quizId)).length;
};

const getBestScoreByUserIdAndTutorialId = (userId: string, tutorialId: string, quizRecords: Quiz[] = [], quizAttemptRecords: UserQuizAttempt[] = []) => {
    const tutorialQuizzes = quizRecords.filter(q => q.tutorialId === tutorialId).map(q => q.id);

    const userAttempts = quizAttemptRecords.filter(q => q.profileId === userId && tutorialQuizzes.includes(q.quizId));

    if (userAttempts.length === 0) return 0;

    return Math.max(...userAttempts.map(q => q.score));
};


const getIsCompleted = (percentageCompleted: number) => percentageCompleted === 100;

const getQuizId = (quizRecords: Quiz[] = [], tutorialRecords: Tutorial[] = []) =>
    quizRecords.filter((q: { tutorialId: string; id: string }) => q.tutorialId === tutorialRecords[0].id)[Math.floor(Math.random() * quizRecords.filter((q: { tutorialId: string; id: string }) => q.tutorialId === tutorialRecords[0].id).length)].id;
const getScoreBasedOnDifficulty = (difficulty: string) => {
    switch (difficulty) {
        case "EASY":
            return Math.floor(Math.random() * (100 - 60) + 60);
        case "MEDIUM":
            return Math.floor(Math.random() * (90 - 40) + 40);
        case "HARD":
            return Math.floor(Math.random() * (80 - 20) + 20);
        default:
            return Math.floor(Math.random() * 100);
    }
};

function getRandomInt(arg0: number, arg1: number) {
    return Math.floor(Math.random() * (arg1 - arg0 + 1)) + arg0;
}

function getUniqueUserId(userProfileRecords: UserProfile[], quizAttemptsData: UserQuizAttempt[]) {
    const userIds = userProfileRecords.map((profile) => profile.userId);
    const randomIndex = Math.floor(Math.random() * userIds.length);

    quizAttemptsData.forEach((quizAttempt) => {
        if (quizAttempt.profileId === userIds[randomIndex]) {
            userIds.splice(randomIndex, 1);
        }
    });

    if (userIds.length === 0) {
        return null;
    }

    return userIds[randomIndex];
}


export const seedHelper = {
    hashPassword,
    getTheme,
    getTutorialStatus,
    getRole,
    getTransactionType,
    getActivityType,
    getRoadmapType,
    getRandomDate,
    getRandomBool,
    selectedOption,
    getResetToken,
    getRandomTimeLimit,
    getPercentageCompleted,
    getUserId,
    getTotalQuizAttemptsByUserAndTutorial,
    getBestScoreByUserIdAndTutorialId,
    getIsCompleted,
    getQuizId,
    getScoreBasedOnDifficulty,
    getRandomDifficulty,
    getUniqueUserId,
    getRandomInt
};