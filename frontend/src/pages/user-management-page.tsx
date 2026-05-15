import { motion } from "framer-motion";
import { AlertTriangle, Edit2, RefreshCw, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/shared/page-header";
import { EmptyState } from "../components/shared/empty-state";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Modal } from "../components/ui/modal";
import { Select } from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { useToast } from "../components/ui/toast";
import { useApi } from "../composables/useApi";
import type { User, UserRole } from "../types";
import {
  userService,
  type AdminUserUpdatePayload,
} from "../services/userService";

interface UserFormState {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
}

const emptyFormState: UserFormState = {
  name: "",
  email: "",
  password: "",
  role: "user",
  kelurahan: "",
  kecamatan: "",
  kota: "",
  provinsi: "",
};

function mapUserToForm(user: User): UserFormState {
  return {
    name: user.name ?? "",
    email: user.email ?? "",
    password: "",
    role: user.role,
    kelurahan: user.kelurahan ?? "",
    kecamatan: user.kecamatan ?? "",
    kota: user.kota ?? "",
    provinsi: user.provinsi ?? "",
  };
}

function getRoleTone(role: UserRole) {
  return role === "admin" ? "warning" : "safe";
}

function hasProfileLocation(form: UserFormState) {
  return [form.provinsi, form.kota, form.kecamatan, form.kelurahan].some(
    (value) => value.trim().length > 0,
  );
}

export function UserManagementPage() {
  const { pushToast } = useToast();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formState, setFormState] = useState<UserFormState>(emptyFormState);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [rowDeletingId, setRowDeletingId] = useState<number | null>(null);

  const { data: usersData, loading, error, refetch } = useApi(userService.list);

  const users = usersData ?? [];

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesSearch =
        !normalizedSearch ||
        [user.name, user.email, user.kota, user.kecamatan, user.provinsi]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedSearch));

      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, search]);

  const stats = useMemo(() => {
    const adminCount = users.filter((user) => user.role === "admin").length;
    const userCount = users.filter((user) => user.role === "user").length;
    const completedProfiles = users.filter(
      (user) => user.provinsi && user.kota && user.kecamatan && user.kelurahan,
    ).length;

    return {
      total: users.length,
      adminCount,
      userCount,
      completedProfiles,
    };
  }, [users]);

  useEffect(() => {
    if (!editorOpen) {
      setSelectedUser(null);
      setFormState(emptyFormState);
    }
  }, [editorOpen]);

  const openEditor = useCallback(
    async (user: User) => {
      setEditorOpen(true);
      setSelectedUser(user);
      setFormState(mapUserToForm(user));

      try {
        const freshUser = await userService.detail(user.id);
        setSelectedUser(freshUser);
        setFormState(mapUserToForm(freshUser));
      } catch {
        pushToast(
          "User detail could not be refreshed. Using list data instead.",
          "info",
        );
      }
    },
    [pushToast],
  );

  const handleSave = useCallback(async () => {
    if (!selectedUser) return;

    const trimmedName = formState.name.trim();
    const trimmedEmail = formState.email.trim();
    const trimmedPassword = formState.password.trim();
    const trimmedLocation = {
      provinsi: formState.provinsi.trim(),
      kota: formState.kota.trim(),
      kecamatan: formState.kecamatan.trim(),
      kelurahan: formState.kelurahan.trim(),
    };
    const shouldSendLocation = hasProfileLocation(formState);

    if (
      shouldSendLocation &&
      Object.values(trimmedLocation).some((value) => !value)
    ) {
      pushToast(
        "Lengkapi provinsi, kota, kecamatan, dan kelurahan sekaligus.",
        "info",
      );
      return;
    }

    setSaveLoading(true);
    try {
      const payload: AdminUserUpdatePayload = {
        name: trimmedName,
        email: trimmedEmail,
        role: formState.role,
      };

      if (trimmedPassword) {
        payload.password = trimmedPassword;
      }

      if (shouldSendLocation) {
        payload.provinsi = trimmedLocation.provinsi;
        payload.kota = trimmedLocation.kota;
        payload.kecamatan = trimmedLocation.kecamatan;
        payload.kelurahan = trimmedLocation.kelurahan;
      }

      await userService.update(selectedUser.id, payload);
      pushToast("User updated successfully.");
      setEditorOpen(false);
      await refetch();
    } catch {
      pushToast("Failed to update user. Please try again.", "info");
    } finally {
      setSaveLoading(false);
    }
  }, [formState, pushToast, refetch, selectedUser]);

  const handleDelete = useCallback(
    async (user: User) => {
      const confirmed = window.confirm(`Hapus user ${user.name}?`);
      if (!confirmed) return;

      setRowDeletingId(user.id);
      try {
        await userService.remove(user.id);
        pushToast("User deleted successfully.");
        await refetch();
      } catch {
        pushToast("Failed to delete user. Please try again.", "info");
      } finally {
        setRowDeletingId(null);
      }
    },
    [pushToast, refetch],
  );

  const handleDeleteAll = useCallback(async () => {
    const confirmed = window.confirm(
      "Hapus semua user? Tindakan ini tidak bisa dibatalkan.",
    );
    if (!confirmed) return;

    setBulkDeleting(true);
    try {
      await userService.removeAll();
      pushToast("All users deleted successfully.");
      await refetch();
    } catch {
      pushToast("Failed to delete all users. Please try again.", "info");
    } finally {
      setBulkDeleting(false);
    }
  }, [pushToast, refetch]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="User Management"
        description="Kelola akun admin dan user, ubah profil, atau hapus akses langsung dari satu panel."
        action={
          <Button
            variant="danger"
            onClick={handleDeleteAll}
            disabled={bulkDeleting || loading || users.length === 0}
          >
            {bulkDeleting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete All Users
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-3xl font-semibold">{stats.total}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Admins</p>
          <p className="text-3xl font-semibold">{stats.adminCount}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Regular Users</p>
          <p className="text-3xl font-semibold">{stats.userCount}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Complete Profiles</p>
          <p className="text-3xl font-semibold">{stats.completedProfiles}</p>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Users</h3>
            <p className="text-sm text-muted-foreground">
              Data diambil dari endpoint admin users pada backend.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, city..."
                className="pl-9 sm:w-72"
              />
            </div>
            <Select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as "all" | UserRole)
              }
              className="sm:w-40"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`user-skeleton-${index}`}
                className="h-16 w-full"
              />
            ))}
          </div>
        ) : error ? (
          <EmptyState title="Failed to load users" message={error} />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="No users found"
            message="Adjust the filter or search term to find the account you need."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-muted/60 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Points</th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID #{user.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={getRoleTone(user.role)}>{user.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {user.provinsi &&
                        user.kota &&
                        user.kecamatan &&
                        user.kelurahan
                          ? `${user.kelurahan}, ${user.kecamatan}, ${user.kota}, ${user.provinsi}`
                          : "No location data"}
                      </td>
                      <td className="px-4 py-3">
                        {typeof user.total_points === "number"
                          ? user.total_points
                          : 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void openEditor(user)}
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => void handleDelete(user)}
                            disabled={rowDeletingId === user.id}
                          >
                            {rowDeletingId === user.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      <Modal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        title={selectedUser ? `Edit ${selectedUser.name}` : "Edit user"}
        description="Perbarui identitas, role, password, dan domisili user."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
                placeholder="Full name"
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
                placeholder="Email address"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Role</span>
              <Select
                value={formState.role}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    role: event.target.value as UserRole,
                  }))
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
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
                placeholder="Leave blank to keep current password"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>Provinsi</span>
              <Input
                value={formState.provinsi}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    provinsi: event.target.value,
                  }))
                }
                placeholder="Provinsi"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Kota</span>
              <Input
                value={formState.kota}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    kota: event.target.value,
                  }))
                }
                placeholder="Kota"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Kecamatan</span>
              <Input
                value={formState.kecamatan}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    kecamatan: event.target.value,
                  }))
                }
                placeholder="Kecamatan"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Kelurahan</span>
              <Input
                value={formState.kelurahan}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    kelurahan: event.target.value,
                  }))
                }
                placeholder="Kelurahan"
              />
            </label>
          </div>

          <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
              <p>
                Jika mengisi domisili, semua field wilayah harus lengkap karena
                backend memvalidasi kombinasi provinsi, kota, kecamatan, dan
                kelurahan sekaligus.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={saveLoading}>
              {saveLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
