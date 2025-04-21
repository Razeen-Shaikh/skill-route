import { render, screen } from "@testing-library/react";
import QuizCard from "./QuizCard";
import { Quiz } from "@/lib/interfaces/interface";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation"; // Mock Next.js router

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockQuiz: Quiz = {
  id: 1,
  title: "Sample Quiz",
  attempts: [],
  questions: [],
  tutorialId: 101,
  createdAt: new Date(),
  updatedAt: new Date(),
  isTimed: true,
  maxScore: 100,
  passPercentage: 70,
  difficulty: "EASY",
  timeLimit: 60,
};

describe("QuizCard", () => {
  it("renders the quiz title correctly", () => {
    render(<QuizCard quiz={mockQuiz} isCompleted={false} />);
    expect(screen.getByText("Sample Quiz")).toBeInTheDocument();
  });

  it("shows ✔ Completed when quiz is completed", () => {
    render(<QuizCard quiz={mockQuiz} isCompleted={true} />);
    expect(screen.getByText("✔ Completed")).toBeInTheDocument();
  });

  it("displays the correct timing info (Timed or Untimed)", () => {
    render(<QuizCard quiz={mockQuiz} isCompleted={false} />);
    expect(screen.getByText("⏳ Timed (60s)")).toBeInTheDocument();
  });

  it("displays 'Untimed' when quiz is not timed", () => {
    render(
      <QuizCard quiz={{ ...mockQuiz, isTimed: false }} isCompleted={false} />
    );
    expect(screen.getByText("⏳ Untimed")).toBeInTheDocument();
  });

  it("navigates to the correct quiz page on click", async () => {
    const router = useRouter();
    router.push = jest.fn(); // Mock the router push method

    render(<QuizCard quiz={mockQuiz} isCompleted={false} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/tutorials/101/quiz/1");

    await userEvent.click(link);
    expect(router.push).toHaveBeenCalledWith("/tutorials/101/quiz/1");
  });
});
