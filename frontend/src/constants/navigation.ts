import type { NavItem } from "../types";

export const publicNavigation: NavItem[] = [
  { label: "Home", path: "/", icon: "house" },
  { label: "Map", path: "/map", icon: "map" },
  { label: "News", path: "/news", icon: "newspaper" },
  { label: "Donation", path: "/donation", icon: "heart" },
  { label: "AI Quiz", path: "/ai-quiz", icon: "sparkles" },
];

export const appNavigation: NavItem[] = [
  { label: "User Dashboard", path: "/dashboard", icon: "layout-dashboard" },
  { label: "Admin Dashboard", path: "/admin", icon: "shield-check" },
  { label: "Map Monitor", path: "/map", icon: "satellite" },
  { label: "News", path: "/news", icon: "newspaper" },
  { label: "Donation", path: "/donation", icon: "wallet" },
  { label: "AI Quiz", path: "/ai-quiz", icon: "bot" },
];
