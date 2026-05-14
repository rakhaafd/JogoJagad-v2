import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import type { UserRole } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Skeleton } from "../components/ui/skeleton";

interface AuthGuardProps extends PropsWithChildren {
  allow?: UserRole[];
}

export function AuthGuard({ children, allow }: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allow && user && !allow.includes(user.role)) {
    const fallbackPath = user.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
