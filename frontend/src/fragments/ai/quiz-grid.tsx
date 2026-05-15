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
      <Card className="bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Generate Challenge
            </p>
            <p className="text-sm text-muted-foreground">
              Choose a topic to generate adaptive quiz cards
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Topic
              </label>
              <Input
                placeholder="ex: Banjir Bandang, Storm Safety"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="bg-background"
              />
            </div>

            <Button
              onClick={() => void handleGenerate()}
              disabled={generateMutation.loading || !topic.trim()}
              className="w-full rounded-xl"
            >
              {generateMutation.loading ? "Generating..." : "Generate Quiz"}
            </Button>
          </div>
        </div>
      </Card>

      {quizzes.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {quizzes.map((quiz, index) => (
              <Card
                key={`quiz-${index}`}
                className="w-full space-y-4 border-l-4 border-l-primary/50 transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-primary/5">
                    Question {index + 1}
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    {quiz.options.length} options
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold leading-relaxed text-foreground">
                    {quiz.question}
                  </h3>
                </div>
                <div className="space-y-2">
                  {quiz.options.map((option, optionIndex) => {
                    const isSelected = answers[index] === option;
                    return (
                      <button
                        key={`${index}-${optionIndex}`}
                        type="button"
                        className={`group w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/50 text-foreground hover:border-primary/50 hover:bg-muted/30"
                        }`}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [index]: option }))
                        }
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                              isSelected
                                ? "border-primary bg-primary text-white"
                                : "border-border/50 group-hover:border-primary/50"
                            }`}
                          >
                            {isSelected && "✓"}
                          </span>
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant={answers[index] ? "default" : "outline"}
                  className="w-full rounded-lg"
                  onClick={() => void handleSubmit(index)}
                  disabled={!answers[index] || submitMutation.loading}
                >
                  {submitMutation.loading ? "Submitting..." : "Submit Answer"}
                </Button>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-warning/5 to-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Achievement
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-foreground">
                    Guardian Tier
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Disaster preparedness expert
                  </p>
                </div>
                <Trophy className="h-10 w-10 text-warning" />
              </div>
            </Card>

            <Card className="space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Progress
                  </p>
                  <span className="text-lg font-bold text-primary">
                    {completion}%
                  </span>
                </div>
              </div>
              <Progress value={completion} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Object.keys(answers).length} of {quizzes.length} answered
              </p>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
