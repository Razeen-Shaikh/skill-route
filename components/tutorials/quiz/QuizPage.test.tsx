import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizPage from "./QuizPage";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: 1 } },
  }),
}));

describe("QuizPage", () => {
  it("shows loading skeleton while fetching quiz data", () => {
    render(<QuizPage quizId="1" />);
    expect(screen.getByTestId("quiz-skeleton")).toBeInTheDocument();
  });

  it("renders the quiz title and first question correctly", async () => {
    render(<QuizPage quizId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Mock Quiz")).toBeInTheDocument();
      expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
    });
  });

  it("allows selecting an option", async () => {
    render(<QuizPage quizId="1" />);

    await waitFor(() =>
      expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument()
    );

    const option = screen.getByLabelText("4"); // Select option 4
    await userEvent.click(option);

    expect(option).toBeChecked();
  });

  it("navigates to the next question on 'Next Question' click", async () => {
    render(<QuizPage quizId="1" />);

    await waitFor(() =>
      expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument()
    );

    const nextButton = screen.getByText("Next Question");
    await userEvent.click(nextButton);

    // Check if the next question is displayed
    expect(screen.queryByText("What is 2 + 2?")).not.toBeInTheDocument();
  });

  it("submits quiz when 'Finish' button is clicked", async () => {
    render(<QuizPage quizId="1" />);

    await waitFor(() =>
      expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument()
    );

    const finishButton = screen.getByText("Finish");
    await userEvent.click(finishButton);

    await waitFor(() => {
      expect(screen.getByText("Quiz not found.")).toBeInTheDocument();
    });
  });
});
