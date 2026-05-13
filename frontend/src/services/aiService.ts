import { apiFetch } from "./api";

interface AskPayload {
  question: string;
}

interface GenerateQuizPayload {
  topic: string;
  amount?: number;
}

interface SubmitQuizPayload {
  is_correct: boolean;
}

export interface QuizItem {
  question: string;
  options: string[];
  correct_answer: string;
}

export const aiService = {
  async ask(payload: AskPayload) {
    const data = await apiFetch<{ answer: string }>("/ai/ask", {
      method: "POST",
      body: payload,
    });
    return data.answer;
  },

  async generateQuiz(payload: GenerateQuizPayload) {
    const data = await apiFetch<{ quizzes: QuizItem[] }>("/ai/quiz/generate", {
      method: "POST",
      body: payload,
    });
    return data.quizzes;
  },

  async submit(payload: SubmitQuizPayload) {
    return apiFetch<{ message: string; points_awarded?: number }>(
      "/ai/quiz/submit",
      {
        method: "POST",
        body: payload,
      },
    );
  },
};
