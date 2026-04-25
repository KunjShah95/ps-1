"use client";

import { useEffect, useMemo, useState } from "react";
import { Store, Search, Clock, Star, MoreVertical, Utensils, ShoppingBag, Camera, Ticket, Plus, MapPin, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/client/api";
import { CommandHeader, CommandPage, EyebrowPill, Panel } from "@/components/command-center";

type Vendor = {
  id: string;
  name?: string;
  type?: string;
  zones?: string[];
  status?: string;
  rating?: number;
  revenue?: number;
  queue?: number;
};

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  food: { icon: <Utensils className="w-4 h-4" />, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  merchandise: { icon: <ShoppingBag className="w-4 h-4" />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  photo: { icon: <Camera className="w-4 h-4" />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  ticket: { icon: <Ticket className="w-4 h-4" />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  open: { label: "Open", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  busy: { label: "Busy", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500" },
  closed: { label: "Closed", color: "text-white/30 bg-white/5 border-white/10", dot: "bg-white/20" },
};

const TYPES = ["all", "food", "merchandise", "photo", "ticket"];

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiFetch<{ vendors: Vendor[] }>("/api/vendors");
        if (!alive) return;
        setVendors(res.vendors ?? []);
      } catch {
        if (!alive) return;
        setVendors([]);
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
      vendors.map((v) => ({
        id: v.id,
        name: v.name || "Unnamed Vendor",
        type: v.type || "general",
        zone: (v.zones?.[0] as string | undefined) || "Unassigned",
        status: v.status || "open",
        queue: typeof v.queue === "number" ? v.queue : 0,
        rating: typeof v.rating === "number" ? v.rating : 0,
        revenue: typeof v.revenue === "number" ? v.revenue : 0,
      })),
    [vendors],
  );

  const filtered = normalized.filter((v) => {
    if (typeFilter !== "all" && v.type !== typeFilter) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.zone.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: normalized.length,
    open: normalized.filter((v) => v.status === "open").length,
    busy: normalized.filter((v) => v.status === "busy").length,
    revenue: normalized.reduce((sum, v) => sum + (v.revenue || 0), 0),
  };

  return (
    <CommandPage>
      <CommandHeader
        eyebrow={<EyebrowPill>{stats.open} active vendors</EyebrowPill>}
        title="Vendors"
        subtitle="Merchant locations, queues, and revenue."
        right={
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-blue-400 transition-colors">
            <Plus className="h-4 w-4" />
            Add Vendor
          </button>
        }
      />

      {/* Stats */}
      <Panel title="Vendor Summary">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: "Total Vendors", value: String(stats.total), color: "text-white", accent: "border-white/10" },
          { label: "Active Now", value: String(stats.open), color: "text-emerald-400", accent: "border-emerald-500/20" },
          { label: "High Queue", value: String(stats.busy), color: "text-amber-400", accent: "border-amber-500/20" },
          { label: "Est. Revenue", value: `₹${stats.revenue.toLocaleString()}`, color: "text-purple-400", accent: "border-purple-500/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.035] transition-colors ${s.accent}`}>
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 group-hover:scale-110">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{s.label}</p>
              <TrendingUp className="w-4 h-4 text-white/10" />
            </div>
            <p className={`text-4xl font-bold tracking-tighter text-glow ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>
      </Panel>

      {/* Filters */}
      <Panel
        title="Vendor Directory"
        right={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                type="text"
                placeholder="Search vendors or zones…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-blue-500/40"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    typeFilter === t ? "bg-blue-500 text-white" : "text-white/55 hover:text-white/75"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        }
      >

      <AnimatePresence mode="popLayout">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full p-10 glass border-white/5 rounded-[2rem] text-center text-white/30">
              Syncing vendor directory…
            </motion.div>
          )}
          {filtered.map((vendor, idx) => {
            const type = TYPE_CONFIG[vendor.type];
            const status = STATUS_CONFIG[vendor.status];
            return (
              <motion.div key={vendor.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-white/10 hover:bg-white/[0.04] transition-all group backdrop-blur-sm">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform ${type.bg} ${type.border}`}>
                    <span className={type.color}>{type.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${vendor.status === "open" ? "animate-pulse" : ""}`} />
                      {status.label}
                    </span>
                    <button className="p-1.5 hover:bg-white/5 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4 text-white/30" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base mb-1 tracking-tight">{vendor.name}</h3>
                <p className="flex items-center gap-1.5 text-white/30 text-xs mb-5">
                  <MapPin className="w-3 h-3" />{vendor.zone}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Queue</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white/30" />
                      <span className="text-sm font-bold">{vendor.queue > 0 ? `${vendor.queue}` : "—"}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold">{vendor.rating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Revenue</p>
                    <span className="text-sm font-bold text-emerald-400">
                      ₹{(vendor.revenue || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full p-16 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center">
              <Store className="w-12 h-12 text-white/10 mx-auto mb-6" />
              <p className="font-bold text-white/30 mb-1">No vendors found</p>
              <p className="text-white/20 text-sm">Try adjusting your search or category filter.</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
      </Panel>
    </CommandPage>
  );
}