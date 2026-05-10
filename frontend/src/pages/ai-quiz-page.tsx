import { PageHeader } from "../components/shared/page-header";
import { AIChatPanel } from "../fragments/ai/ai-chat-panel";
import { QuizGrid } from "../fragments/ai/quiz-grid";

export function AIQuizPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="AI Ask & Quiz"
        description="Interactive disaster education with adaptive chatbot assistance and gamified challenge cards."
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <AIChatPanel />
        <QuizGrid />
      </div>
    </div>
  );
}
