"use client";

import { useState } from "react";
import { useSimulation } from "@/app/SimulationEngine";
import {
  CommandHeader,
  CommandPage,
  EyebrowPill,
  Panel,
} from "@/components/command-center";
import { AlertTriangle, Bell, CheckCircle2, Search, Shield, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/client/api";

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
  const [workingId, setWorkingId] = useState<string | null>(null);

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
    <CommandPage>
      <CommandHeader
        eyebrow={
          <EyebrowPill dotClassName={alerts.length > 0 ? "bg-red-500" : "bg-emerald-500"}>
            {alerts.length > 0 ? `${alerts.length} active incidents` : "All systems nominal"}
          </EyebrowPill>
        }
        title="Incidents"
        subtitle="Monitor and manage active alerts across all zones."
        right={
          <div className="relative w-full lg:w-[360px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              placeholder="Search alerts or zones…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-blue-500/40"
            />
          </div>
        }
      />

      <div className="space-y-6">
        <Panel title="Summary">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { label: "Critical", count: counts.critical, icon: <XCircle className="h-4 w-4" />, tone: "red" },
              { label: "High", count: counts.high, icon: <AlertTriangle className="h-4 w-4" />, tone: "amber" },
              { label: "Warnings", count: counts.warning, icon: <Bell className="h-4 w-4" />, tone: "blue" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">{s.label}</div>
                  <div
                    className={`rounded-xl border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      s.tone === "red"
                        ? "bg-red-500/10 text-red-300 border-red-500/20"
                        : s.tone === "amber"
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-300 border-blue-500/20"
                    }`}
                  >
                    {s.icon}
                  </div>
                </div>
                <div className="mt-3 text-3xl font-semibold tabular-nums text-white">{s.count}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Incident Feed"
          right={
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    filter === f ? "bg-blue-500 text-white" : "text-white/55 hover:text-white/75"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold text-white/80">No incidents</div>
                <div className="mt-1 text-xs text-white/40">Nothing matches the current filter.</div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filtered.map((alert, idx) => {
                  const cfg = TYPE_CONFIG[alert.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.warning;
                  return (
                    <motion.div
                      key={alert.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: idx * 0.03 }}
                      className={cn(
                        "flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.035] transition-colors",
                        alert.type === "critical" ? "border-red-500/20" : "",
                      )}
                    >
                      <div className={`mt-0.5 self-start rounded-2xl border p-3 ${cfg.bg} ${cfg.border}`}>
                        <AlertTriangle className={`h-5 w-5 ${cfg.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                            {alert.zoneName}
                          </div>
                          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                            {alert.type}
                          </span>
                        </div>
                        <div className="mt-2 text-sm font-semibold text-white/75">{alert.message}</div>
                        <div className="mt-4 flex gap-4">
                          <button
                            disabled={workingId === alert.id}
                            onClick={async () => {
                              try {
                                setWorkingId(alert.id);
                                await apiFetch("/api/alerts", {
                                  method: "POST",
                                  body: JSON.stringify({ action: "acknowledge", id: alert.id }),
                                });
                              } finally {
                                setWorkingId(null);
                              }
                            }}
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300 hover:text-blue-200 transition-colors disabled:opacity-40"
                          >
                            {workingId === alert.id ? "Acknowledging…" : "Acknowledge"}
                          </button>
                          <button className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 hover:text-white/55 transition-colors">
                            Escalate
                          </button>
                          <button className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 hover:text-emerald-300 transition-colors">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Resolve
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </Panel>
      </div>
    </CommandPage>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}