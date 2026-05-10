import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const comments = [
  { id: "cm-1", user: "Ayu", body: "Great response speed from local teams.", time: "22m ago" },
  {
    id: "cm-2",
    user: "Dion",
    body: "Can we add evacuation route details for this district?",
    time: "14m ago",
  },
];

export function CommentThread() {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">Community Discussion</h3>
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-xl border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{comment.user}</p>
              <p className="text-xs text-muted-foreground">{comment.time}</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{comment.body}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input placeholder="Write a helpful comment..." />
        <Button>Post</Button>
      </div>
    </Card>
  );
}
