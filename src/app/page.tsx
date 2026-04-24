"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  Zap,
  Users,
  BarChart3,
  Globe,
  ChevronRight,
  Eye,
  BrainCircuit,
  AlertTriangle,
  FileBarChart,
  Lock,
  Plug,
} from "lucide-react";
import { Icon } from "@iconify/react";

const NAV_LINKS = [
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/security", label: "Security" },
];

const STATS = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 200ms", label: "Data Latency" },
  { value: "500K+", label: "People Tracked Daily" },
  { value: "40+", label: "Venues Worldwide" },
];

const FEATURES = [
  {
    icon: "mdi:heat-wave",
    title: "Live Heatmaps",
    desc: "See crowd levels across all areas in real time. Spot problems before they happen.",
    color: "from-amber-600/20 to-orange-600/5 border-amber-600/20",
    textColor: "text-amber-400",
    bgColor: "bg-amber-500",
  },
  {
    icon: "mdi:robot-excited",
    title: "Smart Alerts",
    desc: "Get notified instantly when areas get too crowded. Act fast, not too late.",
    color: "from-teal-600/20 to-cyan-600/5 border-teal-600/20",
    textColor: "text-teal-400",
    bgColor: "bg-teal-500",
  },
  {
    icon: "mdi:alarm-light",
    title: "AI Recommendations",
    desc: "Our system suggests the best routes to redirect crowds. Keep things flowing smoothly.",
    color: "from-orange-500/20 to-amber-500/5 border-orange-500/20",
    textColor: "text-orange-400",
    bgColor: "bg-orange-500",
  },
  {
    icon: "mdi:chart-timeline-variant",
    title: "Easy Reports",
    desc: "See past events and plan better for future ones. Learn from your data.",
    color: "from-cyan-500/20 to-teal-500/5 border-cyan-500/20",
    textColor: "text-cyan-400",
    bgColor: "bg-cyan-500",
  },
  {
    icon: "mdi:shield-lock",
    title: "Secure & Compliant",
    desc: "Your data is protected with enterprise-grade security. Safe and sound.",
    color: "from-red-500/20 to-rose-500/5 border-red-500/20",
    textColor: "text-red-400",
    bgColor: "bg-red-500",
  },
  {
    icon: "mdi:api",
    title: "Works With Your Systems",
    desc: "Connect to your existing cameras and gates. No new hardware needed.",
    color: "from-violet-500/20 to-purple-500/5 border-violet-500/20",
    textColor: "text-violet-400",
    bgColor: "bg-violet-500",
  },
];

const TESTIMONIALS = [
  {
    quote: "SmartFlow cut our wait times by 38%. The AI routing made a huge difference.",
    author: "Sarah Chen",
    role: "Operations Lead, Apex Stadium",
    avatar: "SC",
  },
  {
    quote: "We stopped two incidents before they happened. The alerts gave us 7 minutes to act.",
    author: "Marcus Oyelaran",
    role: "Safety Director, International Events",
    avatar: "MO",
  },
  {
    quote: "Setup took 3 days. Our board now views the dashboard in every meeting.",
    author: "Priya Sharma",
    role: "CTO, StadiumTech Asia",
    avatar: "PS",
  },
];

const ZONES_PREVIEW = [
  { name: "Gate A", pct: 82, status: "high" },
  { name: "Food Court", pct: 45, status: "medium" },
  { name: "North Stand", pct: 12, status: "low" },
  { name: "South Stand", pct: 91, status: "critical" },
];

const statusColor: Record<string, string> = {
  low: "bg-teal-500",
  medium: "bg-cyan-500",
  high: "bg-amber-500",
  critical: "bg-red-500",
};

const statusText: Record<string, string> = {
  low: "text-teal-400 bg-teal-500/10",
  medium: "text-cyan-400 bg-cyan-500/10",
  high: "text-amber-400 bg-amber-500/10",
  critical: "text-red-400 bg-red-500/10",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">
      {/* GRID BACKGROUND */}
      <div className="fixed inset-0 grid-animation opacity-30 pointer-events-none" style={{ backgroundSize: "60px 60px" }} />
      
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-600/30">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              SmartFlow <span className="text-amber-500">AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-5 py-2.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden lg:block text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2.5"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-600/25"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-44 pb-28 px-6 lg:px-12 relative">
        {/* Ambient glow */}
        <div className="absolute top-32 left-[10%] w-[500px] h-[500px] bg-amber-600/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-48 right-[5%] w-[400px] h-[400px] bg-teal-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[900px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-amber-500/[0.08] border border-amber-500/20 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-full mb-10 uppercase tracking-widest">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Now Live — Real-Time Intelligence
            </div>

            {/* Headline */}
            <h1 className="text-6xl lg:text-8xl font-heading font-bold tracking-tight leading-[0.97] mb-8">
              See Your Crowd.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                Keep Them Safe.
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-white/40 max-w-2xl leading-relaxed mb-14 font-light">
              SmartFlow shows you where crowds are in real time. Get alerts before things get crowded. Make better decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-5">
              <Link
                href="/auth/register"
                className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 py-4.5 rounded-xl transition-all flex items-center gap-3 text-base shadow-2xl shadow-amber-600/30"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/platform"
                className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-base font-medium pl-2"
              >
                <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center hover:border-white/25 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
                See How It Works
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ─── Dashboard Preview ─── */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="max-w-[900px] mx-auto mt-24 relative z-10"
        >
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 lg:p-6">
            {/* Mock header */}
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500/60 rounded-full" />
                <div className="w-3 h-3 bg-amber-500/60 rounded-full" />
                <div className="w-3 h-3 bg-teal-500/60 rounded-full" />
                <span className="text-white/15 text-xs ml-3 font-mono">smartflow.ai/dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {ZONES_PREVIEW.map((z) => (
                <div key={z.name} className="bg-white/[0.025] rounded-xl p-4 border border-white/[0.04]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/40 font-medium">{z.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusText[z.status]}`}>
                      {z.status}
                    </span>
                  </div>
                  <p className="text-3xl font-heading font-bold mb-2">{z.pct}%</p>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${statusColor[z.status]}`}
                      style={{ width: `${z.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Recommendation */}
            <div className="bg-gradient-to-r from-amber-500/[0.08] to-orange-500/[0.08] border border-amber-500/15 rounded-xl p-4 flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                <Icon icon="mdi:auto-fix" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-0.5">AI Recommendation</p>
                <p className="text-sm font-medium">
                  Route visitors to{" "}
                  <span className="text-amber-400 font-bold">North Stand</span> — only 12% full
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="py-20 border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {STATS.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <p className="text-4xl lg:text-5xl font-heading font-bold text-white mb-1">{s.value}</p>
                <p className="text-sm text-white/35 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20">
            <div className="inline-flex items-center gap-2.5 text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
              <Zap className="w-3.5 h-3.5" /> Core Platform
            </div>
            <h2 className="text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-5">
              Everything You Need to
              <br />
              <span className="text-white/25">Manage Any Crowd</span>
            </h2>
            <p className="text-white/35 text-lg max-w-xl">
              From real-time heatmaps to predictive AI routing, SmartFlow is the only platform
              built specifically for high-density venue intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`p-7 bg-gradient-to-br ${f.color} border border-white/[0.06] rounded-2xl hover:scale-[1.015] transition-transform cursor-pointer group`}
              >
                <div className="mb-5">
                  <Icon icon={f.icon} className={`w-9 h-9 ${f.textColor}`} />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2.5">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                <div className={`mt-5 w-10 h-10 rounded-lg ${f.bgColor}/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0`}>
                  <ArrowRight className={`w-5 h-5 ${f.textColor}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-32 px-6 lg:px-12 border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2.5 text-teal-400 text-xs font-bold uppercase tracking-widest mb-5">
              <Users className="w-3.5 h-3.5" /> Customer Stories
            </div>
            <h2 className="text-5xl lg:text-6xl font-heading font-bold tracking-tight">
              Trusted by Venues
              <br />
              <span className="text-white/25">Around the World</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition-all"
              >
                <Icon icon="mdi:format-quote-open" className="w-10 h-10 text-amber-500/25 mb-5" />
                <p className="text-white/60 leading-relaxed mb-6 text-base">{t.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.author}</p>
                    <p className="text-white/30 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 lg:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="p-14 lg:p-16 bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.06] border border-amber-500/15 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent pointer-events-none" />
            <BarChart3 className="w-14 h-14 text-amber-500/40 mx-auto mb-8" />
            <h2 className="text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-5">
              Ready to Gain Command?
            </h2>
            <p className="text-white/40 text-lg mb-10 max-w-md mx-auto">
              Join 40+ venues already running SmartFlow AI. Setup takes under 48 hours —
              no hardware rip-and-replace required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 py-4.5 rounded-xl transition-all flex items-center gap-2.5 shadow-xl shadow-amber-600/25"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/platform" className="text-white/50 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium">
                Explore Platform <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.06] py-14 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-base">SmartFlow AI</span>
            </Link>
            <div className="flex items-center gap-8 text-sm text-white/30">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
            <p className="text-white/15 text-xs">© 2025 SmartFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}