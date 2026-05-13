import { Trophy } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Input } from "../../components/ui/input";
import { useMutation } from "../../composables/useMutation";
import { aiService, type QuizItem } from "../../services/aiService";
import { useToast } from "../../components/ui/toast";
import { useMemo, useState } from "react";

export function QuizGrid() {
  const { pushToast } = useToast();
  const [topic, setTopic] = useState("");
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const generateMutation = useMutation(
    async (payload: { topic: string; amount: number }) => {
      return aiService.generateQuiz(payload);
    },
  );
  const submitMutation = useMutation(
    async (payload: { is_correct: boolean }) => {
      return aiService.submit(payload);
    },
  );

  const completion = useMemo(() => {
    if (!quizzes.length) return 0;
    const answered = Object.keys(answers).length;
    return Math.min(100, Math.round((answered / quizzes.length) * 100));
  }, [answers, quizzes.length]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    try {
      const result = await generateMutation.mutate({ topic, amount: 3 });
      setQuizzes(result);
      setAnswers({});
    } catch {
      pushToast("Unable to generate quiz at the moment.", "info");
    }
  };

  const handleSubmit = async (index: number) => {
    const quiz = quizzes[index];
    const selected = answers[index];
    if (!quiz || !selected) return;
    const isCorrect = selected === quiz.correct_answer;
    try {
      const response = await submitMutation.mutate({ is_correct: isCorrect });
      pushToast(response.message ?? "Quiz submitted successfully.");
    } catch {
      pushToast("Failed to submit quiz result.", "info");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Quiz topic (ex: Banjir Bandang)"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          />
          <Button
            onClick={() => void handleGenerate()}
            disabled={generateMutation.loading}
          >
            {generateMutation.loading ? "Generating..." : "Generate Quiz"}
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quizzes.map((quiz, index) => (
          <Card key={`quiz-${index}`} className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge>AI Quiz</Badge>
              <span className="text-xs text-muted-foreground">
                {quiz.options.length} options
              </span>
            </div>
            <h3 className="font-semibold">{quiz.question}</h3>
            <div className="space-y-2">
              {quiz.options.map((option) => (
                <button
                  key={`${index}-${option}`}
                  type="button"
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    answers[index] === option
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border"
                  }`}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [index]: option }))
                  }
                >
                  {option}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => void handleSubmit(index)}
              disabled={!answers[index] || submitMutation.loading}
            >
              Submit Answer
            </Button>
          </Card>
        ))}
      </div>
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Gamification Progress</p>
          <h3 className="text-xl font-semibold">Current Rank: Guardian Tier</h3>
        </div>
        <Trophy className="h-8 w-8 text-warning" />
      </Card>
      <Card className="space-y-2">
        <p className="text-sm text-muted-foreground">Quiz Completion</p>
        <Progress value={completion} />
      </Card>
    </div>
  );
}
