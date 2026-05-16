import { useEffect, useState, useCallback } from "react";
import type { FieldOption } from "../types";
import {
  locationService,
  type LocationItem,
} from "../services/locationService";

function toOptions(items: LocationItem[]) {
  return items.map((item) => ({
    label: item.name,
    value: item.code,
  }));
}

// Simple in-memory cache
const cache = {
  provinces: null as LocationItem[] | null,
  regencies: {} as Record<string, LocationItem[]>,
  districts: {} as Record<string, LocationItem[]>,
  villages: {} as Record<string, LocationItem[]>,
};

export function useLocationData() {
  const [provinces, setProvinces] = useState<FieldOption[]>([]);
  const [regencies, setRegencies] = useState<FieldOption[]>([]);
  const [districts, setDistricts] = useState<FieldOption[]>([]);
  const [villages, setVillages] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState({
    provinces: true,
    regencies: false,
    districts: false,
    villages: false,
  });

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading((prev) => ({ ...prev, provinces: true }));

        // Check cache first
        if (cache.provinces) {
          setProvinces(toOptions(cache.provinces));
        } else {
          const data = await locationService.getProvinces();
          cache.provinces = data;
          setProvinces(toOptions(data));
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setProvinces([]);
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    };

    void fetchProvinces();
  }, []);

  const fetchDistricts = useCallback(async (provinceCode: string) => {
    if (!provinceCode) {
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
      return [];
    }

    try {
      setLoading((prev) => ({ ...prev, regencies: true }));

      // Check cache first
      if (cache.regencies[provinceCode]) {
        const options = toOptions(cache.regencies[provinceCode]);
        setRegencies(options);
        return options;
      } else {
        const data = await locationService.getRegencies(provinceCode);
        cache.regencies[provinceCode] = data;
        const options = toOptions(data);
        setRegencies(options);
        return options;
      }

      // Reset districts and villages when province changes
      setDistricts([]);
      setVillages([]);
    } catch (error) {
      console.error("Error fetching regencies:", error);
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, regencies: false }));
    }
  }, []);

  const fetchDistricts2 = useCallback(async (regencyCode: string) => {
    if (!regencyCode) {
      setVillages([]);
      return [];
    }

    try {
      setLoading((prev) => ({ ...prev, villages: true }));

      // Check cache first
      if (cache.districts[regencyCode]) {
        const options = toOptions(cache.districts[regencyCode]);
        setDistricts(options);
        return options;
      } else {
        const data = await locationService.getDistricts(regencyCode);
        cache.districts[regencyCode] = data;
        const options = toOptions(data);
        setDistricts(options);
        return options;
      }

      // Reset villages when regency changes
      setVillages([]);
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
      setVillages([]);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }));
    }
  }, []);

  const fetchVillages = useCallback(async (districtCode: string) => {
    if (!districtCode) {
      setVillages([]);
      return [];
    }

    try {
      setLoading((prev) => ({ ...prev, villages: true }));

      // Check cache first
      if (cache.villages[districtCode]) {
        const options = toOptions(cache.villages[districtCode]);
        setVillages(options);
        return options;
      } else {
        const data = await locationService.getVillages(districtCode);
        cache.villages[districtCode] = data;
        const options = toOptions(data);
        setVillages(options);
        return options;
      }
    } catch (error) {
      console.error("Error fetching villages:", error);
      setVillages([]);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, villages: false }));
    }
  }, []);

  return {
    provinces,
    regencies,
    districts,
    villages,
    loading,
    fetchRegencies: fetchDistricts,
    fetchDistricts: fetchDistricts2,
    fetchVillages,
  };
}
