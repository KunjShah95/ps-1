"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, LogOut, Menu, X, Zap } from "lucide-react";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: boolean;
};

export type DashboardNavGroup = {
  label: string;
  num: string;
  items: DashboardNavItem[];
};

export function DashboardShell({
  navGroups,
  alertsCount,
  userLabel,
  userInitial,
  onLogout,
  children,
}: {
  navGroups: DashboardNavGroup[];
  alertsCount: number;
  userLabel: string;
  userInitial: string;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const flatNav = useMemo(
    () => navGroups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label }))),
    [navGroups],
  );

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden selection:bg-blue-500/30">
      {/* Ambient wash (subtle, operational) */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(59,130,246,0.10),transparent_55%),radial-gradient(70%_55%_at_100%_100%,rgba(16,185,129,0.06),transparent_60%)]" />

      {/* Desktop Sidebar */}
      <aside className="w-60 hidden lg:flex flex-col p-6 fixed h-full z-40 border-r border-white/[0.06] bg-[#050505]/85 backdrop-blur-2xl">
        <LogoBlock />

        <nav className="flex-1 space-y-8">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="pb-3 text-[10px] uppercase tracking-[0.25em] text-white/35 font-semibold px-4 flex items-center justify-between">
                <span>{group.label}</span>
                <span className="opacity-50">{group.num}</span>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={pathname === item.href}
                    badge={item.badge ? alertsCount : 0}
                    onNavigate={() => setDrawerOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <UserCard userInitial={userInitial} userLabel={userLabel} onLogout={onLogout} />
      </aside>

      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#050505]/70 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="px-5 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <div className="text-sm font-black tracking-tight">SmartFlow</div>
              <div className="text-[10px] text-blue-400 font-black tracking-[0.2em] uppercase">Enterprise</div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.05] transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50"
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="absolute top-0 left-0 h-full w-[86%] max-w-sm bg-[#050505]/92 backdrop-blur-3xl border-r border-white/[0.10] p-6 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <div className="flex items-center justify-between mb-8">
                <LogoBlock compact />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.05] transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {flatNav.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={pathname === item.href}
                    badge={item.badge ? alertsCount : 0}
                    onNavigate={() => setDrawerOpen(false)}
                  />
                ))}
              </div>

              <div className="pt-6 border-t border-white/5">
                <UserCard userInitial={userInitial} userLabel={userLabel} onLogout={onLogout} />
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-60 min-h-screen relative z-10 pt-[72px] lg:pt-0">
        {children}
      </main>
    </div>
  );
}

function LogoBlock({ compact }: { compact?: boolean }) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-3 ${compact ? "" : "mb-10 px-2"}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
        <Activity className="w-6 h-6 text-white" />
      </div>
      <div>
        <span className="text-xl font-bold tracking-tight block leading-none">SmartFlow</span>
        <span className="text-[10px] text-blue-400 font-black tracking-[0.2em] uppercase">Enterprise</span>
      </div>
    </Link>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: number;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative ${
        active
          ? "bg-white/[0.05] text-white border border-white/15"
          : "text-white/40 hover:bg-white/[0.03] hover:text-white/70"
      }`}
    >
      {active ? (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
        />
      ) : null}
      <Icon className={`w-4 h-4 transition-all duration-300 ${active ? "text-blue-400" : "group-hover:text-white/60"}`} />
      <span className={`text-sm font-bold tracking-tight flex-1 ${active ? "text-white" : ""}`}>{label}</span>
      {badge && badge > 0 ? (
        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-xl font-black shadow-lg shadow-red-500/30">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function UserCard({
  userInitial,
  userLabel,
  onLogout,
}: {
  userInitial: string;
  userLabel: string;
  onLogout: () => void;
}) {
  return (
    <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold shadow-inner ring-1 ring-white/10">
            {userInitial}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#020202]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate tracking-tight">{userLabel}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Zap className="w-3 h-3 text-blue-400" />
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">Authorized</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest group border border-transparent hover:border-red-500/20"
      >
        <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>Terminate Session</span>
      </button>
    </div>
  );
}

