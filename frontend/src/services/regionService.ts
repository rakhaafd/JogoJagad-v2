import { apiFetch } from "./api";
import type {
  RegionDetailResponse,
  RegionListResponse,
  RegionPayload,
} from "../types";

export const regionService = {
  async list() {
    const data = await apiFetch<RegionListResponse>("/regions");
    return data.regions;
  },

  async detail(id: number) {
    const data = await apiFetch<RegionDetailResponse>(`/regions/${id}`);
    return data.region;
  },

  async create(payload: RegionPayload) {
    const data = await apiFetch<RegionDetailResponse>("/admin/regions", {
      method: "POST",
      body: payload,
    });
    return data.region;
  },

  async update(id: number, payload: RegionPayload) {
    const data = await apiFetch<RegionDetailResponse>(`/regions/${id}`, {
      method: "PUT",
      body: payload,
    });
    return data.region;
  },

  async remove(id: number) {
    return apiFetch<{ message: string }>(`/admin/regions/${id}`, {
      method: "DELETE",
    });
  },

  async removeAll() {
    return apiFetch<{ message: string }>(`/admin/regions`, {
      method: "DELETE",
    });
  },
};
