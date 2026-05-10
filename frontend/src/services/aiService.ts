import { api } from "./api";

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
    const { data } = await api.post<{ answer: string }>("/ai/ask", payload);
    return data.answer;
  },

  async generateQuiz(payload: GenerateQuizPayload) {
    const { data } = await api.post<{ quizzes: QuizItem[] }>("/ai/quiz/generate", payload);
    return data.quizzes;
  },

  async submit(payload: SubmitQuizPayload) {
    const { data } = await api.post<{ message: string; points_awarded?: number }>(
      "/ai/quiz/submit",
      payload,
    );
    return data;
  },
};
