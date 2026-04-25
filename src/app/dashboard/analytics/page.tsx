"use client";

import { useState } from "react";
import { useSimulation } from "@/app/SimulationEngine";
import {
  CommandHeader,
  CommandPage,
  EyebrowPill,
  MetricCard,
  MetricsStrip,
  Panel,
} from "@/components/command-center";
import { Activity, AlertTriangle, BarChart3, Clock, RefreshCw, TrendingDown, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const TIME_RANGES = ["1h", "6h", "24h", "7d"];

const STATUS_GRADIENT: Record<string, string> = {
  low: "from-emerald-600 to-emerald-400",
  medium: "from-yellow-600 to-yellow-400",
  high: "from-amber-600 to-amber-400",
  critical: "from-red-600 to-rose-400",
};

const STATUS_TEXT: Record<string, string> = {
  low: "text-emerald-400",
  medium: "text-yellow-400",
  high: "text-amber-400",
  critical: "text-red-400",
};

export default function AnalyticsPage() {
  const { zones, insights } = useSimulation();
  const [timeRange, setTimeRange] = useState("1h");
  const sortedZones = [...zones].sort((a, b) => b.percentage - a.percentage);

  return (
    <CommandPage>
      <CommandHeader
        eyebrow={<EyebrowPill>Live data stream</EyebrowPill>}
        title="Live Analytics"
        subtitle="Historical metrics and predictive insights."
        right={
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {TIME_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  timeRange === r ? "bg-blue-500 text-white" : "text-white/55 hover:text-white/75"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      <div className="space-y-6">
        <Panel title="Core Metrics">
          <MetricsStrip>
            <MetricCard
              label="Total Occupancy"
              value={insights?.totalPeople?.toLocaleString() ?? "0"}
              hint={
                <span className="inline-flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" /> Live
                </span>
              }
              accent="blue"
            />
            <MetricCard
              label="Avg Wait Time"
              value={`${insights?.averageWaitTime ?? 0}m`}
              hint={
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" /> Rolling
                </span>
              }
              accent="neutral"
            />
            <MetricCard
              label="Critical Zones"
              value={String(insights?.criticalZones ?? 0)}
              hint={insights?.criticalZones ? "Elevated" : "Nominal"}
              accent={insights?.criticalZones ? "red" : "neutral"}
            />
            <MetricCard
              label="Throughput Rate"
              value={`${insights?.throughputRate ?? 0}%`}
              hint={
                <span className="inline-flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5" /> Live
                </span>
              }
              accent="emerald"
            />
          </MetricsStrip>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Zone Saturation" right={<BarChart3 className="h-4 w-4 text-white/35" />}>
            <div className="space-y-5">
              {sortedZones.slice(0, 6).map((zone, i) => (
                <div key={zone.id}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/80">{zone.name}</span>
                    <span className={`text-sm font-semibold tabular-nums ${STATUS_TEXT[zone.status]}`}>{zone.percentage}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full border border-white/10 bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.percentage}%` }}
                      transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                      className={`h-full bg-gradient-to-r ${STATUS_GRADIENT[zone.status]}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Predictions" right={<span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">30m</span>}>
            <div className="space-y-3">
              {sortedZones.slice(0, 5).map((zone, i) => {
                const predicted = Math.min(100, zone.percentage + 8);
                const delta = predicted - zone.percentage;
                const up = delta > 5;
                return (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white/80">{zone.name}</div>
                        <div className="mt-1 text-xs text-white/45">
                          Now <span className="text-white/70 font-semibold">{zone.percentage}%</span> → 30m{" "}
                          <span className="text-white/70 font-semibold">{predicted}%</span>
                        </div>
                      </div>
                      <div className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-red-300" : "text-emerald-300"}`}>
                        {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}+{delta}%
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Panel>
        </div>

        <Panel
          title="Full Data Table"
          right={
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.05] transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["Zone", "Occupancy", "Capacity", "Saturation", "Wait Time", "Status"].map((h) => (
                    <th key={h} className="py-3 pr-6 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id} className="border-b border-white/[0.06]">
                    <td className="py-3 pr-6 text-sm font-semibold text-white/80">{zone.name}</td>
                    <td className="py-3 pr-6 text-sm text-white/55 tabular-nums">{zone.count.toLocaleString()}</td>
                    <td className="py-3 pr-6 text-sm text-white/55 tabular-nums">{zone.capacity.toLocaleString()}</td>
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 rounded-full border border-white/10 bg-white/[0.04] overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${STATUS_GRADIENT[zone.status]}`} style={{ width: `${zone.percentage}%` }} />
                        </div>
                        <span className={`text-sm font-semibold tabular-nums ${STATUS_TEXT[zone.status]}`}>{zone.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-6 text-sm text-white/55 tabular-nums">{zone.waitTime}m</td>
                    <td className="py-3 pr-6">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          zone.status === "low"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                            : zone.status === "medium"
                              ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                              : zone.status === "high"
                                ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                : "bg-red-500/10 text-red-300 border-red-500/20"
                        }`}
                      >
                        {zone.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </CommandPage>
  );
}