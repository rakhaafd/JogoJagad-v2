import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you requested is unavailable.
        </p>
        <Link to="/" className="mt-4 inline-block">
          <Button>Return Home</Button>
        </Link>
      </Card>
    </div>
  );
}
