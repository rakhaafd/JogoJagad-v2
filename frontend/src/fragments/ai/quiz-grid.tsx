import { Trophy } from "lucide-react";
import { quizCards } from "../../services/mock-data";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

export function QuizGrid() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quizCards.map((quiz) => (
          <Card key={quiz.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge>{quiz.difficulty}</Badge>
              <span className="text-xs text-muted-foreground">{quiz.points} pts</span>
            </div>
            <h3 className="font-semibold">{quiz.title}</h3>
            <Progress value={quiz.completion} />
            <Button variant={quiz.completion === 100 ? "outline" : "default"} className="w-full">
              {quiz.completion === 100 ? "Replay Quiz" : "Continue Quiz"}
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
    </div>
  );
}
