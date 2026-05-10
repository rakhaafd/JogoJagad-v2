import { api } from "./api";
import type { AuthResponse, LoginPayload, MeResponse, RegisterPayload } from "../types";

export const authService = {
  async login(payload: LoginPayload) {
    const endpoint = payload.role === "admin" ? "/auth/admin/login" : "/auth/login";
    const { data } = await api.post<AuthResponse>(endpoint, {
      email: payload.email,
      password: payload.password,
    });
    return data;
  },

  async register(payload: RegisterPayload) {
    const endpoint = payload.role === "admin" ? "/auth/admin/register" : "/auth/register";
    const { data } = await api.post<AuthResponse>(endpoint, payload);
    return data;
  },

  async me() {
    const { data } = await api.get<MeResponse>("/me");
    return data;
  },

  async logout() {
    const { data } = await api.post<{ message: string }>("/logout");
    return data;
  },
};
