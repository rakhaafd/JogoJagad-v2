import { Bot, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
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

function renderInlineText(text: string) {
  const parts: Array<string | ReactNode> = [];
  const boldPattern = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index).replace(/\*/g, ""));
    }

    parts.push(
      <strong
        key={`bold-${match.index}-${match[1]}`}
        className="font-semibold text-foreground"
      >
        {match[1]}
      </strong>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex).replace(/\*/g, ""));
  }

  if (parts.length === 0) {
    return text.replace(/\*/g, "");
  }

  return parts.map((part, index) => <span key={`part-${index}`}>{part}</span>);
}

function renderFormattedText(text: string) {
  const paragraphs = text.split(/\n{2,}/);

  return paragraphs.map((paragraph, paragraphIndex) => {
    const trimmedParagraph = paragraph.trim();

    if (!trimmedParagraph) {
      return null;
    }

    const orderedListItems = trimmedParagraph
      .split(/\n/)
      .map((line) => line.trim())
      .filter((line) => /^\d+\.\s/.test(line));

    if (orderedListItems.length > 0) {
      return (
        <ol
          key={`paragraph-${paragraphIndex}`}
          className="ml-4 list-decimal space-y-1"
        >
          {orderedListItems.map((item, itemIndex) => (
            <li key={`item-${paragraphIndex}-${itemIndex}`}>
              {renderInlineText(item.replace(/^\d+\.\s/, ""))}
            </li>
          ))}
        </ol>
      );
    }

    const bulletListItems = trimmedParagraph
      .split(/\n/)
      .map((line) => line.trim())
      .filter((line) => /^[-*]\s/.test(line));

    if (bulletListItems.length > 0) {
      return (
        <ul
          key={`paragraph-${paragraphIndex}`}
          className="ml-4 list-disc space-y-1"
        >
          {bulletListItems.map((item, itemIndex) => (
            <li key={`item-${paragraphIndex}-${itemIndex}`}>
              {renderInlineText(item.replace(/^[-*]\s/, ""))}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`paragraph-${paragraphIndex}`} className="whitespace-pre-wrap">
        {renderInlineText(trimmedParagraph)}
      </p>
    );
  });
}

export function AIChatPanel() {
  const { pushToast } = useToast();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! Ask me about flood and storm safety plans.",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
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
    <Card className="flex flex-col overflow-hidden">
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              JogoJagad AI Assistant
            </h3>
            <p className="text-xs text-muted-foreground">
              Always ready to help
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 max-h-[400px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "assistant"
                  ? "max-w-xs bg-muted/50 text-foreground shadow-sm"
                  : "max-w-xs bg-primary text-white shadow-md"
              }`}
            >
              {message.role === "assistant"
                ? renderFormattedText(message.text)
                : message.text}
            </div>
          </div>
        ))}
        {askMutation.loading ? (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Thinking...
              </div>
            </div>
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border/50 bg-muted/20 p-3">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about evacuation, weather, and preparedness..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !askMutation.loading) {
                event.preventDefault();
                void handleSend();
              }
            }}
            disabled={askMutation.loading}
            className="bg-background"
          />
          <Button
            onClick={() => void handleSend()}
            disabled={!input.trim() || askMutation.loading}
            size="icon"
            className="h-11 w-11 shrink-0 rounded-2xl bg-primary shadow-md transition hover:bg-primary/90 hover:shadow-lg disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
