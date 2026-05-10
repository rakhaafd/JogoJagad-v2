import { api } from "./api";
import type { CurrentWeatherResponse } from "../types";

export const weatherService = {
  async current() {
    const { data } = await api.get<CurrentWeatherResponse>("/weather/current");
    return data;
  },
};
