import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit2, Trash2, ArrowLeft, Check, X } from "lucide-react";
import { PageHeader } from "../components/shared/page-header";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { useApi } from "../composables/useApi";
import { useMutation } from "../composables/useMutation";
import { actionService } from "../services/actionService";
import { useToast } from "../components/ui/toast";
import { getStorageUrl } from "../utils/storage";
import type { ActionReport } from "../types";

function getStatusColor(status: string) {
  switch (status) {
    case "verified":
      return "safe";
    case "pending":
      return "warning";
    default:
      return "default";
  }
}

export function ActionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ActionReport> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetcher = useCallback(
    () =>
      id
        ? actionService.detail(Number(id))
        : Promise.reject(new Error("No ID")),
    [id],
  );

  const {
    data: action,
    loading,
    error,
  } = useApi<ActionReport>(fetcher, { immediate: !!id });

  useEffect(() => {
    if (action && !editData) {
      setEditData(action as Partial<ActionReport>);
    }
  }, [action]);

  const updateMutation = useMutation<ActionReport, void>(async () => {
    if (!editData || !id) return Promise.reject();
    const payload: Record<string, unknown> = {
      title: editData.title,
      action_type: editData.action_type,
      description: editData.description,
    };
    if (selectedFile) {
      payload.photo = selectedFile;
    }
    const updated = await actionService.update(Number(id), payload as any);
    pushToast("Action report updated successfully");
    setIsEditing(false);
    return updated;
  });

  const deleteMutation = useMutation<{ message: string }, void>(async () => {
    if (!id) return Promise.reject();
    const result = await actionService.delete(Number(id));
    pushToast("Action report deleted successfully");
    navigate("/actions");
    return result;
  });

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.currentTarget.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    },
    [],
  );

  const handleDeleteFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditData(action ? (action as Partial<ActionReport>) : null);
    setSelectedFile(null);
  }, [action]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/actions")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <PageHeader title="Loading..." description="" />
        </div>
      </div>
    );
  }

  if (error || !action) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/actions")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <PageHeader
            title="Not Found"
            description="Action report tidak ditemukan"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/actions")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <PageHeader
            title={action.title}
            description={`ID: ${action.id} • ${new Date(action.created_at).toLocaleDateString("id-ID")}`}
          />
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={action.status === "verified"}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm("Anda yakin ingin menghapus laporan ini?")) {
                    deleteMutation.mutate(undefined as any);
                  }
                }}
                disabled={action.status === "verified"}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4">
        {/* Status Badge */}
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge tone={getStatusColor(action.status)}>{action.status}</Badge>
          </div>
        </Card>

        {/* Main Content */}
        {isEditing && editData ? (
          <Card className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editData.title || ""}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                placeholder="Judul laporan"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Action Type</label>
              <Input
                value={editData.action_type || ""}
                onChange={(e) =>
                  setEditData({ ...editData, action_type: e.target.value })
                }
                placeholder="Tipe aksi"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder="Deskripsi aksi"
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Photo</label>
              <div className="space-y-2">
                {selectedFile ? (
                  <div className="rounded-lg border border-border bg-muted/50 p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDeleteFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : action.photo_path ? (
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">
                      Current photo: {action.photo_path}
                    </p>
                  </div>
                ) : null}
                <label className="flex items-center justify-center rounded-lg border-2 border-dashed border-border px-6 py-8 cursor-pointer hover:bg-muted/50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">
                    {selectedFile ? "Ganti Foto" : "Pilih Foto"}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updateMutation.loading}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={() => updateMutation.mutate(undefined as any)}
                disabled={updateMutation.loading}
              >
                <Check className="h-4 w-4" />
                {updateMutation.loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <Card>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Action Type</p>
                  <p className="font-medium">{action.action_type}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="whitespace-pre-wrap text-sm">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>

            {action.photo_path && (
              <Card>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Photo</p>
                  <img
                    src={getStorageUrl(action.photo_path)}
                    alt="Action report photo"
                    className="rounded-lg w-full max-h-96 object-cover"
                  />
                </div>
              </Card>
            )}

            {action.verification && (
              <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
                <div className="space-y-2">
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Verification Details
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Category:</span>{" "}
                      {action.verification.category}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Points:</span>{" "}
                      {action.verification.points_awarded}
                    </p>
                    {action.verification.notes && (
                      <p>
                        <span className="text-muted-foreground">Notes:</span>{" "}
                        {action.verification.notes}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {deleteMutation.loading && (
        <div className="text-center text-sm text-muted-foreground">
          Deleting...
        </div>
      )}
    </motion.div>
  );
}
