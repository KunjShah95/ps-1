"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useSimulation } from "@/app/SimulationEngine";
import {
  Activity,
  LayoutDashboard,
  BarChart3,
  Bell,
  ShieldAlert,
  Users,
  Store,
  Settings,
  LogOut,
  Zap,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";

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
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { alerts } = useSimulation();

  return (
    <div className="flex min-h-screen bg-[#020202] text-white font-sans relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/8 blur-[150px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-72 hidden lg:flex flex-col p-8 fixed h-full z-40 border-r border-white/[0.04] bg-[#020202]/90 backdrop-blur-3xl">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight block leading-none">SmartFlow</span>
            <span className="text-[10px] text-blue-400 font-black tracking-[0.2em] uppercase">Enterprise</span>
          </div>
        </Link>

        {/* Nav Groups */}
        <nav className="flex-1 space-y-8">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="pb-3 text-[10px] uppercase tracking-[0.25em] text-white/20 font-black px-4 flex items-center justify-between">
                <span>{group.label}</span>
                <span className="opacity-50">{group.num}</span>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative ${
                        isActive
                          ? "bg-white/5 text-white border border-white/10"
                          : "text-white/30 hover:bg-white/[0.03] hover:text-white/60"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                        />
                      )}
                      <Icon
                        className={`w-4 h-4 transition-all duration-300 ${
                          isActive ? "text-blue-400" : "group-hover:text-white/60"
                        }`}
                      />
                      <span className={`text-sm font-bold tracking-tight flex-1 ${isActive ? "text-white" : ""}`}>
                        {item.label}
                      </span>
                      {item.badge && alerts.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-xl font-black shadow-lg shadow-red-500/30">
                          {alerts.length}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className="pt-8 border-t border-white/5">
          <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold shadow-inner ring-1 ring-white/10">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#020202]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate tracking-tight">
                  {user?.displayName || user?.email?.split("@")[0] || "Operator"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Zap className="w-3 h-3 text-blue-400" />
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">Authorized</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest group border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen relative z-10">
        {children}
      </main>
    </div>
  );
}
