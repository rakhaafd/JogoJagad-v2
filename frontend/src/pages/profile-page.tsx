import { motion } from "framer-motion";
import { Edit2, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import { PageHeader } from "../components/shared/page-header";
import { EmptyState } from "../components/shared/empty-state";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Modal } from "../components/ui/modal";
import { Skeleton } from "../components/ui/skeleton";
import { useToast } from "../components/ui/toast";
import { useApi } from "../composables/useApi";
import { useAuth } from "../hooks/useAuth";
import {
  authService,
  type ProfileUpdatePayload,
} from "../services/authService";

interface ProfileFormState {
  name: string;
  email: string;
  password: string;
}

const emptyFormState: ProfileFormState = {
  name: "",
  email: "",
  password: "",
};

export function ProfilePage() {
  const { pushToast } = useToast();
  const { refreshProfile } = useAuth();
  const { data, loading, error, refetch } = useApi(authService.me);
  const [formState, setFormState] = useState<ProfileFormState>(emptyFormState);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const currentUser = data?.user ?? null;
  const totalPoints = data?.total_poin ?? 0;

  // Initialize form state when opening the edit modal to avoid
  // setting state synchronously inside effects (prevents cascading renders).
  const openEditModal = () => {
    setFormState({
      name: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
      password: "",
    });
    setModalOpen(true);
  };

  const handleSave = useCallback(async () => {
    const payload: ProfileUpdatePayload = {
      name: formState.name.trim(),
      email: formState.email.trim(),
    };

    const password = formState.password.trim();
    if (password) {
      payload.password = password;
    }

    setSaving(true);
    try {
      await authService.updateProfile(payload);
      await refreshProfile();
      await refetch();
      setFormState((previous) => ({ ...previous, password: "" }));
      pushToast("Profile updated successfully.");
    } catch {
      pushToast("Failed to update profile. Please try again.", "info");
    } finally {
      setSaving(false);
    }
  }, [formState, pushToast, refreshProfile, refetch]);

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Profile"
          description="Loading your account details..."
        />
        <Card className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Profile"
          description="Manage your personal account information."
        />
        <EmptyState
          title="Failed to load profile"
          message={error ?? "Profile data is unavailable."}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <PageHeader
        title="Profile"
        description="Review and update the account details for the currently signed-in user."
      />

      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Account Summary</p>
            <h3 className="text-2xl font-semibold">{currentUser.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              User ID: #{currentUser.id}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Badge tone={currentUser.role === "admin" ? "warning" : "safe"}>
              {currentUser.role}
            </Badge>
            <Button variant="outline" size="sm" onClick={openEditModal}>
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm">
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-right break-all">
                {currentUser.email}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium text-right">
                {[
                  currentUser.kelurahan,
                  currentUser.kecamatan,
                  currentUser.kota,
                  currentUser.provinsi,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Total Points</span>
              <span className="font-medium">{totalPoints}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium capitalize">{currentUser.role}</span>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Edit Profile"
        description="Update your personal account information."
      >
        <div className="space-y-4">
          <div className="grid gap-4">
            <label className="space-y-2 text-sm font-medium">
              <span>Name</span>
              <Input
                value={formState.name}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                placeholder="Your name"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Email</span>
              <Input
                type="email"
                value={formState.email}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
                placeholder="Your email"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Password</span>
              <Input
                type="password"
                value={formState.password}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    password: event.target.value,
                  }))
                }
                placeholder="Leave blank to keep the current password"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
              Save Profile
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
