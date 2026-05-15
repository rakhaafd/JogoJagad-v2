import type { NavItem } from "../types/ui";

export const publicNavigation: NavItem[] = [
  { label: "Home", path: "/", icon: "house" },
  { label: "Map", path: "/map", icon: "map" },
  { label: "News", path: "/news", icon: "newspaper" },
  { label: "Donation", path: "/donation", icon: "heart" },
  { label: "AI Quiz", path: "/ai-quiz", icon: "sparkles" },
];

export const userAppNavigation: NavItem[] = [
  { label: "User Dashboard", path: "/dashboard", icon: "layout-dashboard" },
  { label: "Action", path: "/actions", icon: "list" },
  { label: "News", path: "/news", icon: "newspaper" },
  { label: "Donation", path: "/donation", icon: "wallet" },
  { label: "AI Quiz", path: "/ai-quiz", icon: "bot" },
];

export const adminAppNavigation: NavItem[] = [
  { label: "Admin Dashboard", path: "/admin", icon: "shield-check" },
  { label: "News", path: "/news", icon: "newspaper" },
  { label: "Donation", path: "/donation", icon: "wallet" },
  { label: "AI Quiz", path: "/ai-quiz", icon: "bot" },
];
