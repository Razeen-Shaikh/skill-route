import React from "react";
import { waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import QuizList from "./QuizList";
import { Quiz } from "@/lib/interfaces/interface";
import { renderWithQueryClient } from "@/lib/test-utils";
import { ErrorBoundary } from "react-error-boundary";
import axios from "axios";

const queryClient = new QueryClient();

describe("QuizList", () => {
  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it("renders with no quizzes", () => {
    const { getByText } = renderWithQueryClient(<QuizList quizzes={[]} />);

    expect(getByText("Quizzes")).toBeInTheDocument();
    expect(getByText("Progress Bar")).toBeInTheDocument();
    expect(getByText("Quiz List")).toBeInTheDocument();
  });

  it("renders with quizzes, no completed quizzes", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error("Error fetching completed quizzes")
    );

    const quizzes: Quiz[] = [
      {
        id: 1,
        title: "Quiz 1",
        attempts: [],
        questions: [],
        tutorialId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isTimed: false,
        maxScore: 100,
        passPercentage: 70,
        difficulty: "EASY",
      },
      {
        id: 2,
        title: "Quiz 2",
        attempts: [],
        questions: [],
        tutorialId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isTimed: false,
        maxScore: 100,
        passPercentage: 70,
        difficulty: "MEDIUM",
      },
    ];
    const { getByText } = renderWithQueryClient(
      <ErrorBoundary fallback={<div>Error occurred</div>}>
        <QuizList quizzes={quizzes} />
      </ErrorBoundary>
    );
    await waitFor(() => expect(getByText("Quiz 1")).toBeInTheDocument());
    await waitFor(() => expect(getByText("Quiz 2")).toBeInTheDocument());
    expect(getByText("0%")).toBeInTheDocument();
  });

  it("renders with quizzes, some completed quizzes", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error("Error fetching completed quizzes")
    );
    const quizzes: Quiz[] = [
      {
        id: 2,
        title: "Quiz 2",
        attempts: [],
        questions: [],
        tutorialId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isTimed: false,
        maxScore: 100,
        passPercentage: 70,
        difficulty: "MEDIUM",
      },
      {
        id: 1,
        title: "Quiz 1",
        attempts: [
          {
            id: 1,
            quizId: 1,
            score: 50,
            userId: 1,
            completedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            startedAt: new Date(),
          },
        ],
        questions: [],
        tutorialId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isTimed: false,
        maxScore: 100,
        passPercentage: 70,
        difficulty: "EASY",
      },
    ];
    const completedQuizzes = [{ quizId: 1 }];
    queryClient.setQueryData(
      ["completedQuizzes", quizzes.map((q) => q.id)],
      completedQuizzes
    );
    const { getByText } = renderWithQueryClient(<QuizList quizzes={quizzes} />);
    await waitFor(() => expect(getByText("Quiz 1")).toBeInTheDocument());
    await waitFor(() => expect(getByText("Quiz 2")).toBeInTheDocument());
    expect(getByText("50%")).toBeInTheDocument();
  });

  it("renders with quizzes, all completed quizzes", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error("Error fetching completed quizzes")
    );
    const quizzes: Quiz[] = [
      {
        id: 2,
        title: "Quiz 2",
        attempts: [
          {
            id: 1,
            quizId: 2,
            score: 100,
            userId: 1,
            completedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            startedAt: new Date(),
          },
        ],
        questions: [],
        tutorialId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isTimed: false,
        maxScore: 100,
        passPercentage: 70,
        difficulty: "MEDIUM",
      },
      {
        id: 1,
        title: "Quiz 1",
        attempts: [
          {
            id: 1,
            quizId: 1,
            score: 100,
            userId: 1,
            completedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            startedAt: new Date(),
          },
        ],
        questions: [],
        tutorialId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isTimed: false,
        maxScore: 100,
        passPercentage: 70,
        difficulty: "EASY",
      },
    ];
    const completedQuizzes = [{ quizId: 1 }, { quizId: 2 }];
    queryClient.setQueryData(
      ["completedQuizzes", quizzes.map((q) => q.id)],
      completedQuizzes
    );
    const { getByText } = renderWithQueryClient(<QuizList quizzes={quizzes} />);
    await waitFor(() => expect(getByText("Quiz 1")).toBeInTheDocument());
    await waitFor(() => expect(getByText("Quiz 2")).toBeInTheDocument());
    expect(getByText("100%")).toBeInTheDocument();
  });

  it("renders with quizzes, fetchQuizAttempts returns an error", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error("Error fetching completed quizzes")
    );

    const quizzes: Quiz[] = [
      {
        id: 1,
        title: "Quiz 1",
        attempts: [],
        questions: [],
        tutorialId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isTimed: false,
        maxScore: 100,
        passPercentage: 70,
        difficulty: "EASY",
      },
      {
        id: 2,
        title: "Quiz 2",
        attempts: [],
        questions: [],
        tutorialId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isTimed: false,
        maxScore: 100,
        passPercentage: 70,
        difficulty: "MEDIUM",
      },
    ];
    queryClient.setQueryDefaults(
      ["completedQuizzes", quizzes.map((q) => q.id)],
      {
        queryFn: async () => {
          throw new Error("Error fetching completed quizzes");
        },
      }
    );

    const { getByText } = renderWithQueryClient(
      <ErrorBoundary fallback={<div>Error occurred</div>}>
        <QuizList quizzes={quizzes} />
      </ErrorBoundary>
    );
    await waitFor(() =>
      expect(getByText("Error fetching completed quizzes")).toBeInTheDocument()
    );
  });
});
