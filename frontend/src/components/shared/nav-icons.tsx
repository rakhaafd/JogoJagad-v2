import {
  Bot,
  Heart,
  House,
  LayoutDashboard,
  List,
  Map,
  Newspaper,
  Satellite,
  ShieldCheck,
  Siren,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const navIconMap: Record<string, LucideIcon> = {
  house: House,
  map: Map,
  newspaper: Newspaper,
  heart: Heart,
  sparkles: Bot,
  "layout-dashboard": LayoutDashboard,
  "shield-check": ShieldCheck,
  satellite: Satellite,
  wallet: Wallet,
  bot: Bot,
  siren: Siren,
  list: List,
};
