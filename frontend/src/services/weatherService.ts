import { apiFetch } from "./api";
import type { CurrentWeatherResponse } from "../types";

export const weatherService = {
  async current() {
    return apiFetch<CurrentWeatherResponse>("/weather/current");
  },
};
