import { rest } from "msw";

export const handlers = [
    // Mock the fetchQuiz API call
    rest.get("/api/quiz/:quizId", (req, res, ctx) => {
        return res(
            ctx.json({
                id: 1,
                title: "Mock Quiz",
                questions: [
                    { id: 101, questionText: "What is 2 + 2?", options: ["3", "4", "5"] },
                ],
            })
        );
    }),

    // Mock submitQuizAttempt API call
    rest.post("/api/quiz/:quizId/submit", (req, res, ctx) => {
        return res(ctx.status(200));
    }),
];
