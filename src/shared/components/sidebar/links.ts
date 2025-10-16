import { ChartColumn, Lock, LucideIcon } from "lucide-react";

export type NavLinks = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  subLinks: {
    title: string;
    url: string;
  }[];
};

export const navLinks: NavLinks[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartColumn,
    isActive: true,
    subLinks: [],
  },
  {
    title: "Security",
    url: "",
    icon: Lock,
    isActive: true,
    subLinks: [{ title: "users", url: "/security/users" }],
  },
];
