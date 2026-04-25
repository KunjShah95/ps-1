"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSimulation } from "../SimulationEngine";
import type { Alert as SimAlert, ZoneData as SimZoneData } from "../SimulationEngine";
import { TrendChart } from "@/components/TrendChart";
import { useAuth } from "@/lib/auth-context";
import {
  CollapsiblePanel,
  CommandHeader,
  CommandPage,
  EyebrowPill,
  MetricCard,
  MetricsStrip,
  Panel,
} from "@/components/command-center";
import { AlertTriangle, Bell, Clock, Search, ShieldCheck, TrendingUp, Users, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function DashboardPage() {
  const { zones, recommendation, alerts, insights, acknowledgeAlert, isLive } = useSimulation();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (zones.length > 0) {
      setLastUpdate(new Date());
    }
  }, [zones]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredZones = useMemo(() => 
    zones.filter(z => 
      z.id.startsWith('gate') && 
      z.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [zones, searchQuery]
  );

  const getRelativeTime = (timestamp: unknown) => {
    if (!timestamp) return "Just now";
    const t = timestamp as { toDate?: () => Date };
    const date =
      typeof t.toDate === "function"
        ? t.toDate()
        : timestamp instanceof Date
          ? timestamp
          : typeof timestamp === "number" || typeof timestamp === "string"
            ? new Date(timestamp)
            : new Date();
    const diff = Math.floor((currentTime.getTime() - date.getTime()) / 1000 / 60);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <CommandPage>
      <CommandHeader
        eyebrow={<EyebrowPill>Live — Active</EyebrowPill>}
        title="Command Console"
        subtitle={
          <>
            Monitoring <span className="text-white/80">{zones.length}</span> active zones · Signed in as{" "}
            <span className="text-white/70">{user?.displayName || "Operator"}</span>
          </>
        }
        right={
          <>
            <div className="relative w-full lg:w-[360px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                type="text"
                placeholder="Search zones…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-blue-500/40"
              />
            </div>
            <button
              type="button"
              className="relative rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-white/60 hover:bg-white/[0.05] hover:text-white/80 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {alerts.length > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" /> : null}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.05] hover:text-white/80 transition-colors"
            >
              Logout
            </button>
          </>
        }
      />

      <div className="space-y-6">
        <Panel title="Metrics Strip">
          <MetricsStrip>
            <MetricCard
              label="Live Census"
              value={insights?.totalPeople?.toLocaleString() || "0"}
              hint={
                <span className="inline-flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" /> Live
                </span>
              }
              accent="blue"
            />
            <MetricCard
              label="Avg Wait Time"
              value={`${insights?.averageWaitTime || 0} min`}
              hint={
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" /> Rolling
                </span>
              }
              accent="emerald"
            />
            <MetricCard
              label="Critical Zones"
              value={insights?.criticalZones?.toString() || "0"}
              hint={insights?.criticalZones ? "Elevated" : "Nominal"}
              accent={insights?.criticalZones ? "red" : "neutral"}
            />
            <MetricCard
              label="Flow Rate"
              value={`${insights?.throughputRate || 0}/min`}
              hint={
                <span className="inline-flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5" /> Live
                </span>
              }
              accent="amber"
            />
          </MetricsStrip>
        </Panel>

        <Panel
          title="Live Recommendation"
          right={
            <button
              className="rounded-xl bg-blue-500 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-blue-400 transition-colors"
              type="button"
            >
              Execute
            </button>
          }
        >
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/30 to-blue-500/5 p-3 text-blue-200">
              <Zap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">Flow Optimization</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{recommendation}</p>
            </div>
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <Panel 
  title="Zone Grid"
  right={
    <span className="inline-flex items-center gap-2 text-[10px] font-medium text-white/40">
      <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
      Live · 1 min
    </span>
  }
>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredZones.map((zone, idx) => (
                    <ZoneCard key={zone.id} zone={zone} index={idx} />
                  ))}
                </AnimatePresence>
                {filteredZones.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
                    <Icon icon="mdi:map-marker-off" className="mx-auto mb-4 h-10 w-10 text-white/10" />
                    <p className="text-sm text-white/40">No zones matched “{searchQuery}”.</p>
                  </div>
                ) : null}
              </motion.div>
            </Panel>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <CollapsiblePanel
              title="Alerts Feed"
              right={
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  {alerts.length} active
                </span>
              }
            >
              {alerts.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold text-white/80">All systems nominal</div>
                  <div className="mt-1 text-xs text-white/40">No intervention required.</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <AlertRow
                      key={alert.id}
                      alert={alert}
                      timeLabel={getRelativeTime(alert.created_at)}
                      onAcknowledge={() => acknowledgeAlert(alert.id)}
                    />
                  ))}
                </div>
              )}
            </CollapsiblePanel>

            <Panel title="Saturation Monitor">
              <div className="space-y-5">
                {zones
                  .slice(0, 5)
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((zone) => (
                    <ProgressLine
                      key={zone.id}
                      label={zone.name}
                      percentage={zone.percentage}
                      color={
                        zone.status === "critical" ? "text-red-300" : zone.status === "high" ? "text-amber-300" : "text-blue-300"
                      }
                    />
                  ))}
              </div>
            </Panel>

            {zones.length > 0 ? (
              <Panel title="Gate Movements (Trends)">
                <div className="space-y-6">
                  {zones
                    .filter(z => z.id.startsWith('gate'))
                    .slice(0, 4)
                    .map((zone) => (
                    <TrendChart
                      key={zone.id}
                      zoneId={zone.id}
                      zoneName={zone.name}
                    />
                  ))}
                </div>
              </Panel>
            ) : null}
          </div>
        </div>
      </div>
    </CommandPage>
  );
}

function ZoneCard({ zone, index }: { zone: SimZoneData; index: number }) {
  const statusColors = {
    low: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-blue-300 bg-blue-500/10 border-blue-500/20",
    high: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    critical: "text-red-300 bg-red-500/10 border-red-500/20",
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.035]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">Zone</div>
          <h3 className="mt-1 text-sm font-semibold tracking-tight text-white/85">{zone.name}</h3>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusColors[zone.status as keyof typeof statusColors]}`}>
          {zone.status}
        </span>
      </div>

      <div className="mt-4 mb-4 grid grid-cols-2 gap-4">
        <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">Occupancy</p>
          <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xl font-bold text-white tabular-nums">{zone.count}</span>
            <span className="text-[11px] font-medium text-white/30">/ {zone.capacity}</span>
          </div>
        </div>
        <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">Saturation</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold text-white tabular-nums">{zone.percentage}</span>
            <span className="text-xs font-medium text-white/30">%</span>
          </div>
        </div>
      </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
            <span>Capacity</span>
            <span className={zone.status === "critical" ? "text-red-300" : zone.status === "high" ? "text-amber-300" : "text-blue-300"}>
              {zone.status === "critical" ? "Alert" : "Normal"}
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${zone.percentage}%` }}
              transition={{ type: "spring", stiffness: 40, damping: 20 }}
              className={`h-full ${
                zone.status === "critical"
                  ? "bg-red-500"
                  : zone.status === "high"
                    ? "bg-amber-500"
                    : zone.status === "medium"
                      ? "bg-blue-500"
                      : "bg-emerald-500"
              }`}
            />
          </div>
        </div>
    </motion.div>
  );
}

function AlertRow({ alert, timeLabel, onAcknowledge }: { alert: SimAlert; timeLabel: string; onAcknowledge: () => void }) {
  const typeStyles = {
    critical: "bg-red-500/10 text-red-300 border-red-500/20",
    high: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    warning: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.035]",
        alert.type === "critical" ? "border-red-500/20" : "",
      )}
    >
      <div className={`mt-0.5 self-start rounded-2xl border p-3 ${typeStyles[alert.type as keyof typeof typeStyles]}`}>
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">{alert.zoneName}</p>
          <span className="text-[10px] font-semibold text-white/35 tabular-nums">{timeLabel}</span>
        </div>
        <p className="text-sm font-semibold leading-relaxed text-white/75">{alert.message}</p>
        <div className="mt-4 flex gap-4">
          <button 
            onClick={onAcknowledge}
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300 hover:text-blue-200 transition-colors"
          >
            Acknowledge
          </button>
          <button className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 hover:text-white/55 transition-colors">
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressLine({ label, percentage, color }: { label: string; percentage: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">{label}</span>
        <span className={`text-sm font-semibold tabular-nums ${color}`}>{percentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden border border-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={`h-full ${color.replace("text-", "bg-")} rounded-full opacity-90`} 
        />
      </div>
    </div>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
