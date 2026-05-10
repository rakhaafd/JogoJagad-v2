import type { User } from "../types";
import { disasterService } from "./disasterService";

const severityWeight = {
  bahaya: 3,
  waspada: 2,
  aman: 1,
} as const;

export const notificationService = {
  async myRegionAlerts(user: User) {
    const regions = await disasterService.regions();
    const matches = regions
      .filter(
        (region) =>
          region.provinsi === user.provinsi &&
          region.kota === user.kota &&
          region.kecamatan === user.kecamatan &&
          region.kelurahan === user.kelurahan,
      )
      .sort((a, b) => severityWeight[b.status] - severityWeight[a.status]);

    return matches.map((region) => ({
      id: `region-${region.id}`,
      title: `Status ${region.status.toUpperCase()} - ${region.kelurahan}`,
      body: region.description ?? "Perubahan status wilayah terdeteksi.",
      level:
        region.status === "bahaya"
          ? ("danger" as const)
          : region.status === "waspada"
            ? ("warning" as const)
            : ("safe" as const),
      time: new Date(region.updated_at).toLocaleString("id-ID"),
    }));
  },
};
