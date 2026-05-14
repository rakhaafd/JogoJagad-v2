import { apiFetch } from "./api";
import type {
  AuthResponse,
  LoginPayload,
  MeResponse,
  RegisterPayload,
} from "../types";

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

  async logout() {
    return apiFetch<{ message: string }>("/logout", { method: "POST" });
  },
};
