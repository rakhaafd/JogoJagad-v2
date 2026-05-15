import type { User, UserRole } from "../types";
import { apiFetch } from "./api";

export interface AdminUserUpdatePayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
}

interface AdminUserListResponse {
  users: User[];
}

interface AdminUserDetailResponse {
  user: User;
}

export const userService = {
  async list() {
    const data = await apiFetch<AdminUserListResponse>("/admin/users");
    return data.users;
  },

  async detail(id: number) {
    const data = await apiFetch<AdminUserDetailResponse>(`/admin/users/${id}`);
    return data.user;
  },

  async update(id: number, payload: AdminUserUpdatePayload) {
    const data = await apiFetch<AdminUserDetailResponse>(`/admin/users/${id}`, {
      method: "PUT",
      body: payload,
    });
    return data.user;
  },

  async remove(id: number) {
    return apiFetch<{ message: string }>(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  async removeAll() {
    return apiFetch<{ message: string; deleted?: number }>("/admin/users", {
      method: "DELETE",
    });
  },
};
