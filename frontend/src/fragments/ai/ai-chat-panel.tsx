import { Bot, Send } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const messages = [
  { id: "m-1", role: "assistant", text: "Hi! Ask me about flood and storm safety plans." },
  { id: "m-2", role: "user", text: "What should I prepare before heavy rainfall season?" },
  {
    id: "m-3",
    role: "assistant",
    text: "Prepare emergency kit, secure documents, monitor local alerts, and identify nearest shelter.",
  },
] as const;

export function AIChatPanel() {
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">JogoJagad AI Assistant</h3>
      </div>
      <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "assistant"
                ? "max-w-[85%] rounded-2xl bg-card p-3 text-sm"
                : "ml-auto max-w-[85%] rounded-2xl bg-primary p-3 text-sm text-white"
            }
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input placeholder="Ask about evacuation, weather, and preparedness..." />
        <Button>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
