import { api } from "./api";
import type {
  ActionCreatePayload,
  ActionListResponse,
  ActionVerifyPayload,
  RegionListResponse,
  RegionPayload,
} from "../types";

function toActionFormData(payload: ActionCreatePayload) {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("action_type", payload.action_type);
  form.append("description", payload.description);
  form.append("photo", payload.photo);
  return form;
}

export const disasterService = {
  async regions() {
    const { data } = await api.get<RegionListResponse>("/regions");
    return data.regions;
  },

  async regionDetail(id: number) {
    const { data } = await api.get<{ region: RegionListResponse["regions"][number] }>(
      `/regions/${id}`,
    );
    return data.region;
  },

  async createRegion(payload: RegionPayload) {
    const { data } = await api.post<{ region: RegionListResponse["regions"][number] }>(
      "/admin/regions",
      payload,
    );
    return data.region;
  },

  async updateRegion(id: number, payload: Partial<RegionPayload>) {
    const { data } = await api.put<{ region: RegionListResponse["regions"][number] }>(
      `/admin/regions/${id}`,
      payload,
    );
    return data.region;
  },

  async deleteRegion(id: number) {
    const { data } = await api.delete<{ message: string }>(`/admin/regions/${id}`);
    return data;
  },

  async userActions() {
    const { data } = await api.get<ActionListResponse>("/actions");
    return data.actions;
  },

  async adminActions(status?: string) {
    const { data } = await api.get<ActionListResponse>("/admin/actions", {
      params: status ? { status } : undefined,
    });
    return data.actions;
  },

  async submitAction(payload: ActionCreatePayload, onProgress?: (progress: number) => void) {
    const { data } = await api.post<{ action: ActionListResponse["actions"][number] }>(
      "/actions",
      toActionFormData(payload),
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress(event) {
          if (!event.total || !onProgress) return;
          onProgress(Math.round((event.loaded / event.total) * 100));
        },
      },
    );
    return data.action;
  },

  async verifyAction(id: number, payload: ActionVerifyPayload) {
    const { data } = await api.post<{ message: string; action: ActionListResponse["actions"][number] }>(
      `/admin/actions/${id}/verify`,
      payload,
    );
    return data;
  },
};
