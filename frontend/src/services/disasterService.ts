import { apiFetch } from "./api";
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
    const data = await apiFetch<RegionListResponse>("/regions");
    return data.regions;
  },

  async regionDetail(id: number) {
    const data = await apiFetch<{
      region: RegionListResponse["regions"][number];
    }>(`/regions/${id}`);
    return data.region;
  },

  async createRegion(payload: RegionPayload) {
    const data = await apiFetch<{
      region: RegionListResponse["regions"][number];
    }>("/admin/regions", { method: "POST", body: payload });
    return data.region;
  },

  async updateRegion(id: number, payload: Partial<RegionPayload>) {
    const data = await apiFetch<{
      region: RegionListResponse["regions"][number];
    }>(`/regions/${id}`, { method: "PUT", body: payload });
    return data.region;
  },

  async deleteRegion(id: number) {
    return apiFetch<{ message: string }>(`/admin/regions/${id}`, {
      method: "DELETE",
    });
  },

  async userActions() {
    const data = await apiFetch<ActionListResponse>("/actions");
    return data.actions;
  },

  async adminActions(status?: string) {
    const data = await apiFetch<ActionListResponse>("/admin/actions", {
      query: status ? { status } : undefined,
    });
    return data.actions;
  },

  async submitAction(
    payload: ActionCreatePayload,
    onProgress?: (progress: number) => void,
  ) {
    if (onProgress) onProgress(15);
    const data = await apiFetch<{
      action: ActionListResponse["actions"][number];
    }>("/actions", { method: "POST", body: toActionFormData(payload) });
    if (onProgress) onProgress(100);
    return data.action;
  },

  async verifyAction(id: number, payload: ActionVerifyPayload) {
    return apiFetch<{
      message: string;
      action: ActionListResponse["actions"][number];
    }>(`/admin/actions/${id}/verify`, { method: "POST", body: payload });
  },

  async actionDetail(id: number) {
    const data = await apiFetch<{
      action: ActionListResponse["actions"][number];
    }>(`/actions/${id}`);
    return data.action;
  },

  async updateAction(id: number, payload: Partial<ActionCreatePayload>) {
    const formData = new FormData();
    if (payload.title) formData.append("title", payload.title);
    if (payload.action_type)
      formData.append("action_type", payload.action_type);
    if (payload.description)
      formData.append("description", payload.description);
    if (payload.photo) formData.append("photo", payload.photo);
    formData.append("_method", "PUT");

    const data = await apiFetch<{
      action: ActionListResponse["actions"][number];
    }>(`/actions/${id}`, { method: "POST", body: formData });
    return data.action;
  },

  async deleteAction(id: number) {
    return apiFetch<{ message: string }>(`/actions/${id}`, {
      method: "DELETE",
    });
  },
};
