import { Navigate, Route, Routes } from "react-router-dom";
import { AppShellLayout } from "../layouts/app-shell-layout";
import { AuthLayout } from "../layouts/auth-layout";
import { MarketingLayout } from "../layouts/marketing-layout";
import { AdminDashboardPage } from "../pages/admin-dashboard-page";
import { AIQuizPage } from "../pages/ai-quiz-page";
import { ActionDetailPage } from "../pages/action-detail-page";
import { DonationPage } from "../pages/donation-page";
import { DonationDetailPage } from "../pages/donation-detail-page";
import { DonationHistoryPage } from "../pages/donation-history-page";
import { HazardReportPage } from "../pages/hazard-report-page";
import { LandingPage } from "../pages/landing-page";
import { LoginPage } from "../pages/login-page";
import { MapMonitoringPage } from "../pages/map-monitoring-page";
import { NewsPage } from "../pages/news-page";
import { NewsDetailPage } from "../pages/news-detail-page";
import { NotFoundPage } from "../pages/not-found-page";
import { ProfilePage } from "../pages/profile-page";
import { RegisterPage } from "../pages/register-page";
import { UserManagementPage } from "../pages/user-management-page";
import { ActionReportsPage } from "../pages/action-reports-page";
import { AdminNewsPage } from "../pages/admin-news-page";
import { AdminNewsCreatePage } from "../pages/admin-news-create-page";
import { AdminNewsEditPage } from "../pages/admin-news-edit-page";
import { AdminRegionStatusPage } from "../pages/admin-region-status-page";
import { AdminRegionStatusDetailPage } from "../pages/admin-region-status-detail-page";
import { AdminRegionStatusCreatePage } from "../pages/admin-region-status-create-page";
import { AdminRegionStatusEditPage } from "../pages/admin-region-status-edit-page";
import { UserDashboardPage } from "../pages/user-dashboard-page";
import { AuthGuard } from "../middleware/authGuard";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route index element={<LandingPage />} />
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
          path="/actions"
          element={
            <AuthGuard allow={["user"]}>
              <MapMonitoringPage />
            </AuthGuard>
          }
        />
        <Route
          path="/actions/:id"
          element={
            <AuthGuard allow={["user"]}>
              <ActionDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/map"
          element={
            <AuthGuard allow={["user"]}>
              <MapMonitoringPage />
            </AuthGuard>
          }
        />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/donation/:id" element={<DonationDetailPage />} />
        <Route path="/donations/:id" element={<DonationDetailPage />} />
        <Route
          path="/donation-history"
          element={
            <AuthGuard allow={["user"]}>
              <DonationHistoryPage />
            </AuthGuard>
          }
        />
        <Route
          path="/hazard-report"
          element={
            <AuthGuard allow={["user"]}>
              <HazardReportPage />
            </AuthGuard>
          }
        />
        <Route path="/donation" element={<DonationPage />} />
        <Route path="/ai-quiz" element={<AIQuizPage />} />
        <Route
          path="/profile"
          element={
            <AuthGuard allow={["user", "admin"]}>
              <ProfilePage />
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
        <Route
          path="/admin/users"
          element={
            <AuthGuard allow={["admin"]}>
              <UserManagementPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/actions"
          element={
            <AuthGuard allow={["admin"]}>
              <ActionReportsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/news"
          element={
            <AuthGuard allow={["admin"]}>
              <AdminNewsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/news/create"
          element={
            <AuthGuard allow={["admin"]}>
              <AdminNewsCreatePage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/news/:id/edit"
          element={
            <AuthGuard allow={["admin"]}>
              <AdminNewsEditPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/regions"
          element={
            <AuthGuard allow={["admin"]}>
              <AdminRegionStatusPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/regions/create"
          element={
            <AuthGuard allow={["admin"]}>
              <AdminRegionStatusCreatePage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/regions/:id/edit"
          element={
            <AuthGuard allow={["admin"]}>
              <AdminRegionStatusEditPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/regions/:id"
          element={
            <AuthGuard allow={["admin"]}>
              <AdminRegionStatusDetailPage />
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
