"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, UserPlus, Search, Clock, Shield, Stethoscope, ClipboardList, MoreVertical, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/client/api";
import { CommandHeader, CommandPage, EyebrowPill, Panel } from "@/components/command-center";

type StaffMember = {
  id: string;
  uid?: string;
  name?: string;
  role?: string;
  zone?: string;
  status?: string;
  checkIn?: string;
  shift?: string;
  active?: boolean;
  email?: string;
};

const ROLE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  security: { icon: <Shield className="w-4 h-4" />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  medical: { icon: <Stethoscope className="w-4 h-4" />, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  usher: { icon: <Users className="w-4 h-4" />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  cleaning: { icon: <ClipboardList className="w-4 h-4" />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: "Active", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  break: { label: "On Break", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", dot: "bg-yellow-500" },
  off: { label: "Off Duty", color: "text-white/30 bg-white/5 border-white/10", dot: "bg-white/20" },
};

const ROLES = ["all", "security", "medical", "usher", "cleaning"];

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiFetch<{ staff: StaffMember[] }>("/api/staff");
        if (!alive) return;
        setStaff(res.staff ?? []);
      } catch {
        if (!alive) return;
        setStaff([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const normalized = useMemo(
    () =>
      staff.map((m) => ({
        id: m.id,
        name: m.name || "Unnamed",
        role: m.role || "staff",
        zone: m.zone || "Unassigned",
        status: m.status || (m.active === false ? "off" : "active"),
        checkIn: m.checkIn || "—",
        shift: m.shift || "—",
      })),
    [staff],
  );

  const filtered = normalized.filter((m) => {
    if (roleFilter !== "all" && m.role !== roleFilter) return false;
    if (
      search &&
      !m.name.toLowerCase().includes(search.toLowerCase()) &&
      !m.zone.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const stats = {
    total: normalized.length,
    active: normalized.filter((m) => m.status === "active").length,
    onBreak: normalized.filter((m) => m.status === "break").length,
    off: normalized.filter((m) => m.status === "off").length,
  };

  return (
    <CommandPage>
      <CommandHeader
        eyebrow={<EyebrowPill>{stats.active} operators on-site</EyebrowPill>}
        title="Staff Management"
        subtitle="Personnel deployment and shift tracking."
        right={
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-blue-400 transition-colors">
            <UserPlus className="h-4 w-4" />
            Add Staff
          </button>
        }
      />

      {/* Stats */}
      <Panel title="Personnel Status">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: "Total Personnel", value: stats.total, color: "text-white", accent: "bg-white/5 border-white/10" },
          { label: "Active On-Site", value: stats.active, color: "text-emerald-400", accent: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "On Break", value: stats.onBreak, color: "text-yellow-400", accent: "bg-yellow-500/10 border-yellow-500/20" },
          { label: "Off Duty", value: stats.off, color: "text-white/30", accent: "bg-white/[0.02] border-white/5" },
        ].map((s, i) => (
          <motion.div key={s.label} whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.035] transition-colors ${s.accent}`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 bg-white/5 rounded-[1.25rem] group-hover:scale-110 transition-all duration-500 shadow-inner ring-1 ring-white/10`}>
                <Users className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border shadow-sm ${s.color.includes('emerald') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : s.color.includes('yellow') ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-white/5 text-white/20 border-white/10'}`}>
                {s.label === "Active On-Site" ? "Live" : s.label === "Off Duty" ? "Offline" : s.label === "On Break" ? "Paused" : "Total"}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">{s.label}</p>
            <p className={`text-4xl font-bold tracking-tighter ${s.color} text-glow`}>{s.value}</p>
          </motion.div>
        ))}
      </div>
      </Panel>

      {/* Filters + Table */}
      <Panel
        title="Personnel Roster"
        right={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                type="text"
                placeholder="Search staff or zone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-blue-500/40"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    roleFilter === r ? "bg-blue-500 text-white" : "text-white/55 hover:text-white/75"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        }
      >

      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 glass border-white/5 rounded-[2rem] text-center text-white/30">
              Syncing staff roster…
            </motion.div>
          )}
          {filtered.map((member, idx) => {
            const role = ROLE_CONFIG[member.role];
            const status = STATUS_CONFIG[member.status];
            return (
              <motion.div key={member.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-5 p-6 glass border-white/5 rounded-[2rem] hover:bg-white/[0.05] hover:border-white/20 transition-all group relative overflow-hidden shadow-xl">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border flex-shrink-0 ${role.bg} ${role.border} group-hover:scale-110 transition-transform`}>
                  <span className={role.color}>{role.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm tracking-tight mb-0.5">{member.name}</h3>
                  <div className="flex items-center gap-3 text-white/30 text-xs">
                    <span className={`font-bold capitalize ${role.color}`}>{member.role}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{member.zone}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-white/30 text-xs">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">Check-in: {member.checkIn}</span>
                </div>
                <div className="hidden md:block text-white/20 text-xs font-medium">{member.shift}</div>
                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${member.status === "active" ? "animate-pulse" : ""}`} />
                  {status.label}
                </span>
                <button className="p-2 hover:bg-white/5 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4 text-white/30" />
                </button>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 glass border-dashed border-white/10 rounded-[3rem] text-center">
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform duration-500">
                <Users className="w-12 h-12 text-white/10" />
              </div>
              <p className="font-bold text-white/30 mb-1 text-lg tracking-tight">No staff found</p>
              <p className="text-white/20 text-sm">Try adjusting your search or filter.</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
      </Panel>
    </CommandPage>
  );
}