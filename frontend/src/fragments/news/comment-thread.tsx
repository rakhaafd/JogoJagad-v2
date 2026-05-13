import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/shared/empty-state";

export function CommentThread() {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">Community Discussion</h3>
      <EmptyState
        title="Discussion unavailable"
        message="Comment endpoints are not available in the current API."
      />
      <div className="flex gap-2">
        <Input placeholder="Write a helpful comment..." disabled />
        <Button disabled>Post</Button>
      </div>
    </Card>
  );
}
