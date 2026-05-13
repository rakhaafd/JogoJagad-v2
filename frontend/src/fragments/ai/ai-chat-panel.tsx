import { Bot, Send } from "lucide-react";
import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useMutation } from "../../composables/useMutation";
import { aiService } from "../../services/aiService";
import { useToast } from "../../components/ui/toast";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

export function AIChatPanel() {
  const { pushToast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! Ask me about flood and storm safety plans.",
    },
  ]);
  const askMutation = useMutation(async (question: string) => {
    return aiService.ask({ question });
  });

  const handleSend = async () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text: prompt },
    ]);

    try {
      const answer = await askMutation.mutate(prompt);
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", text: answer },
      ]);
    } catch {
      pushToast("AI assistant is temporarily unavailable.", "info");
    }
  };

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
        {askMutation.loading ? (
          <div className="max-w-[85%] rounded-2xl bg-card p-3 text-sm text-muted-foreground">
            Thinking...
          </div>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Ask about evacuation, weather, and preparedness..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleSend();
            }
          }}
        />
        <Button
          onClick={() => void handleSend()}
          disabled={askMutation.loading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
