// Location data types
export interface LocationItem {
  code: string;
  name: string;
}

// Location Service - fetch from backend to avoid CORS issues
const apiBaseFromEnv = import.meta.env.VITE_URL_API?.replace(/\/$/, "");
const API_BASE = apiBaseFromEnv ? `${apiBaseFromEnv}/api` : "/api";

export const locationService = {
  async getProvinces(): Promise<LocationItem[]> {
    try {
      const response = await fetch(`${API_BASE}/locations/provinces`);
      if (!response.ok) throw new Error("Failed to fetch provinces");
      const result = await response.json();

      const dataArray = result.data || [];

      return Array.isArray(dataArray) ? dataArray : [];
    } catch (error) {
      console.error("Error fetching provinces:", error);
      return [];
    }
  },

  async getRegencies(provinceCode: string): Promise<LocationItem[]> {
    try {
      const response = await fetch(
        `${API_BASE}/locations/regencies?province_code=${encodeURIComponent(provinceCode)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch regencies");
      const result = await response.json();

      const dataArray = result.data || [];
      return Array.isArray(dataArray) ? dataArray : [];
    } catch (error) {
      console.error("Error fetching regencies:", error);
      return [];
    }
  },

  async getDistricts(regencyCode: string): Promise<LocationItem[]> {
    try {
      const response = await fetch(
        `${API_BASE}/locations/districts?regency_code=${encodeURIComponent(regencyCode)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch districts");
      const result = await response.json();

      const dataArray = result.data || [];
      return Array.isArray(dataArray) ? dataArray : [];
    } catch (error) {
      console.error("Error fetching districts:", error);
      return [];
    }
  },

  async getVillages(districtCode: string): Promise<LocationItem[]> {
    try {
      const response = await fetch(
        `${API_BASE}/locations/villages?district_code=${encodeURIComponent(districtCode)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch villages");
      const result = await response.json();

      const dataArray = result.data || [];
      return Array.isArray(dataArray) ? dataArray : [];
    } catch (error) {
      console.error("Error fetching villages:", error);
      return [];
    }
  },
};
