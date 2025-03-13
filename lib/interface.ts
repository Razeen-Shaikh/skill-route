interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    badges: string[];
    achievements: string[];
    stats: Stats;
    attempts: Attempt[];
};

interface Stats {
    progress: Progress[];
    points: Point[];
    rank: number;
    previous_rank: number;
    quizzesAttempted: number;
    bestScore: number;
    coursesCompleted: number;
    streak: number;
    lastActiveDate: Date;
}

interface Point {
    points: number;
    reason: string;
    date: Date;
}

interface Progress {
    count: number;
    date: Date;
}

interface Quiz {
    id: number;
    title: string;
    description: string;
    questions: Question[];
    attemps: Attempt[];
}

interface Attempt {
    id: number;
    score: number;
    timestamp: Date;
    quiz: Quiz;
}

interface Question {
    id: number;
    text: string;
    options: string[];
    answer: string;
    points: number;
}

// need to implement this/made changes
interface Course {
    id: number;
    title: string;
    description: string;
    quizzes: Quiz[];
}

export type { User, Stats, Point, Progress, Quiz, Attempt, Question, Course };