import { apiFetch } from "./api";
import type {
  AuthResponse,
  LoginPayload,
  MeResponse,
  RegisterPayload,
  User,
} from "../types";

export interface ProfileUpdatePayload {
  name?: string;
  email?: string;
  password?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const endpoint =
      payload.role === "admin" ? "/auth/admin/login" : "/auth/login";
    return apiFetch<AuthResponse>(endpoint, {
      method: "POST",
      body: {
        email: payload.email,
        password: payload.password,
      },
      auth: false,
    });
  },

  async register(payload: RegisterPayload) {
    const body = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      provinsi: payload.provinsi,
      kota: payload.kota,
      kecamatan: payload.kecamatan,
      kelurahan: payload.kelurahan,
    };

    const cleanedBody = Object.fromEntries(
      Object.entries(body).filter((entry) => entry[1] !== undefined),
    );

    return apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: cleanedBody,
      auth: false,
    });
  },

  async me() {
    return apiFetch<MeResponse>("/me");
  },

  async updateProfile(payload: ProfileUpdatePayload) {
    const data = await apiFetch<{ user: User }>("/me", {
      method: "PATCH",
      body: payload,
    });
    return data.user;
  },

  async logout() {
    return apiFetch<{ message: string }>("/logout", { method: "POST" });
  },
};
