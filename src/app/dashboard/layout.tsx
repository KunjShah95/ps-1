"use client";

import { useAuth } from "@/lib/auth-context";
import { useSimulation } from "@/app/SimulationEngine";
import { LayoutDashboard, BarChart3, Bell, ShieldAlert, Users, Store, Settings, Eye } from "lucide-react";
import { DashboardShell, type DashboardNavGroup } from "@/components/dashboard/DashboardShell";

const NAV_GROUPS = [
  {
    label: "Primary Interface",
    num: "01",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/analytics", label: "Live Analytics", icon: BarChart3 },
      { href: "/dashboard/alerts", label: "Incidents", icon: Bell, badge: true },
      { href: "/dashboard/stadium", label: "Stadium View", icon: Eye },
    ],
  },
  {
    label: "Operations",
    num: "02",
    items: [
      { href: "/dashboard/crisis", label: "Crisis Management", icon: ShieldAlert },
      { href: "/dashboard/staff", label: "Staff Management", icon: Users },
      { href: "/dashboard/vendors", label: "Vendors", icon: Store },
    ],
  },
  {
    label: "System",
    num: "03",
    items: [
      { href: "/dashboard/settings", label: "Configuration", icon: Settings },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { alerts } = useSimulation();

  return (
    <DashboardShell
      navGroups={NAV_GROUPS satisfies DashboardNavGroup[]}
      alertsCount={alerts.length}
      userLabel={user?.displayName || "Operator"}
      userInitial={user?.displayName?.charAt(0).toUpperCase() || "O"}
      onLogout={() => logout()}
    >
      {children}
    </DashboardShell>
  );
}
