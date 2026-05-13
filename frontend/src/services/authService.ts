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
    const endpoint =
      payload.role === "admin" ? "/auth/admin/register" : "/auth/register";
    return apiFetch<AuthResponse>(endpoint, {
      method: "POST",
      body: payload,
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
