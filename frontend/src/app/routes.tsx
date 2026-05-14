import { Navigate, Route, Routes } from "react-router-dom";
import { AppShellLayout } from "../layouts/app-shell-layout";
import { AuthLayout } from "../layouts/auth-layout";
import { MarketingLayout } from "../layouts/marketing-layout";
import { AdminDashboardPage } from "../pages/admin-dashboard-page";
import { AIQuizPage } from "../pages/ai-quiz-page";
import { DonationPage } from "../pages/donation-page";
import { LandingPage } from "../pages/landing-page";
import { LoginPage } from "../pages/login-page";
import { MapMonitoringPage } from "../pages/map-monitoring-page";
import { NewsPage } from "../pages/news-page";
import { NotFoundPage } from "../pages/not-found-page";
import { RegisterPage } from "../pages/register-page";
import { UserDashboardPage } from "../pages/user-dashboard-page";
import { AuthGuard } from "../middleware/authGuard";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/map" element={<MapMonitoringPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/donation" element={<DonationPage />} />
        <Route path="/ai-quiz" element={<AIQuizPage />} />
      </Route>

      <Route element={<AppShellLayout />}>
        <Route
          path="/dashboard"
          element={
            <AuthGuard allow={["user"]}>
              <UserDashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthGuard allow={["admin"]}>
              <AdminDashboardPage />
            </AuthGuard>
          }
        />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
