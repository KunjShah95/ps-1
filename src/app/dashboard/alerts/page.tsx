"use client";

import { useState } from "react";
import { useSimulation } from "@/app/SimulationEngine";
import { AlertTriangle, Bell, CheckCircle2, Search, Shield, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = ["all", "critical", "high", "warning"] as const;

const TYPE_CONFIG = {
  critical: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", shadow: "shadow-red-500/5" },
  high: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", shadow: "shadow-amber-500/5" },
  warning: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", shadow: "shadow-blue-500/5" },
};

export default function AlertsPage() {
  const { alerts } = useSimulation();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = alerts.filter((a) => {
    if (filter !== "all" && a.type !== filter) return false;
    if (search && !a.zoneName.toLowerCase().includes(search.toLowerCase()) && !a.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    critical: alerts.filter((a) => a.type === "critical").length,
    high: alerts.filter((a) => a.type === "high").length,
    warning: alerts.filter((a) => a.type === "warning").length,
  };

  return (
    <div className="p-6 lg:p-12">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            {alerts.length > 0 ? (
              <><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">{alerts.length} Active Incidents</span></>
            ) : (
              <><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">All Systems Nominal</span></>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Incidents</h1>
          <p className="text-white/40 text-sm font-medium">Monitor and manage active alerts across all zones.</p>
        </motion.div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input type="text" placeholder="Search alerts or zones..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="glass border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all w-80 placeholder:text-white/20 font-medium" />
        </div>
      </header>

      {/* Summary Cards */}
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">01 — Alert Summary</h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { label: "Critical", count: counts.critical, icon: <XCircle className="w-5 h-5" />, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
          { label: "High Priority", count: counts.high, icon: <AlertTriangle className="w-5 h-5" />, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { label: "Warnings", count: counts.warning, icon: <Bell className="w-5 h-5" />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="p-8 glass border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] hover:border-white/20 transition-all group relative overflow-hidden shadow-xl">
            <div className={`p-4 rounded-2xl w-fit mb-6 ${s.bg}`}>
              <span className={s.color}>{s.icon}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">{s.label}</p>
            <p className={`text-5xl font-bold tracking-tighter ${s.color} text-glow`}>{s.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs + List */}
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">02 — Incident Feed</h2>
        <div className="h-px flex-1 bg-white/5" />
        <div className="flex items-center gap-1 glass border-white/5 rounded-2xl p-1.5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-blue-600 text-white shadow-glow" : "text-white/30 hover:text-white/60"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-16 glass border-white/5 rounded-[2.5rem] text-center backdrop-blur-sm">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
              <Shield className="w-10 h-10 text-emerald-500/40" />
            </div>
            <h4 className="font-bold mb-2 uppercase tracking-widest text-emerald-500/60">Perimeter Locked</h4>
            <p className="text-white/20 text-sm font-medium">No incidents match the current filter.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filtered.map((alert, idx) => {
              const cfg = TYPE_CONFIG[alert.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.warning;
              return (
                <motion.div key={alert.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.04 }}
                  className={`p-6 glass border-white/5 rounded-[2rem] flex gap-5 group hover:bg-white/[0.04] transition-all ${alert.type === 'critical' ? 'bg-red-500/[0.03] border-red-500/10' : 'bg-white/[0.02]'}`}>
                  <div className={`mt-1 p-4 rounded-2xl border self-start group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${cfg.bg} ${cfg.border}`}>
                    <AlertTriangle className={`w-5 h-5 ${cfg.color.replace('text-', 'text-')}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{alert.zoneName}</p>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${cfg.bg} ${cfg.color} ${cfg.border}`}>{alert.type}</span>
                        <span className="text-[10px] font-black text-white/20">Just now</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold leading-relaxed text-white/80 group-hover:text-white transition-colors mb-4">{alert.message}</p>
                    <div className="flex gap-4">
                      <button className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-400 transition-all hover:translate-x-1">
                        Acknowledge
                      </button>
                      <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-all">
                        Escalate
                      </button>
                      <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-emerald-400 transition-all flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />Resolve
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}