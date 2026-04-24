"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  Users,
  TrendingUp,
} from "lucide-react";
import { Icon } from "@iconify/react";

const NAV_LINKS = [
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/security", label: "Security" },
];

const CASE_STUDIES = [
  {
    category: "Sports Venue",
    venue: "Apex Arena — London",
    capacity: "82,000 seats",
    headline: "38% Faster Gate Times",
    challenge:
      "Gate A got extremely crowded within 20 minutes of doors opening. Two near-miss safety incidents happened in the previous season.",
    solution:
      "SmartFlow analyzed arrival patterns and directed visitors to Gates C and D before overcrowding occurred. Staff got real-time alerts to help manage the flow.",
    results: [
      { metric: "38%", label: "Faster gate entry" },
      { metric: "0", label: "Safety incidents" },
      { metric: "6 min", label: "Faster exit after events" },
      {metric: "₹2.4Cr", label: "Extra revenue from concessions" },
    ],
    quote: "We had seven minutes of warning before problems. That's the difference between a good event and a safety issue.",
    quoteAuthor: "James Hartley, Operations — Apex Arena",
    accentColor: "border-blue-600/20",
    tagColor: "text-blue-400 bg-blue-600/10",
  },
  {
    category: "Transit Hub",
    venue: "Central Station — Singapore",
    capacity: "400,000 daily passengers",
    headline: "52% Less Crowding",
    challenge:
      "Platform 3 got dangerously crowded during rush hour. The single exit corridor caused dangerous compression.",
    solution:
      "SmartFlow connected to existing cameras. At 70% capacity, alerts went out 4 minutes before problems — allowing PA announcements and barrier management in real time.",
    results: [
      { metric: "52%", label: "Less crowding" },
      { metric: "4 min", label: "Early warning time" },
      { metric: "99.9%", label: "Alert accuracy" },
      { metric: "28s", label: "Response time" },
    ],
    quote: "We went from reacting to predicting. It's a complete change in how we manage safety.",
    quoteAuthor: "Mei Lin Toh, Safety Lead — Central Transit",
    accentColor: "border-purple-600/20",
    tagColor: "text-purple-400 bg-purple-600/10",
  },
  {
    category: "Music Festival",
    venue: "Solstice Festival — Barcelona",
    capacity: "95,000 attendees",
    headline: "Zero Stage Incidents",
    challenge:
      "The pit area held 8,000 standing fans with no way to measure crowd density. Staff relied on guesswork.",
    solution:
      "SmartFlow installed 12 sensors around the pit. Alerts went to a dedicated phone app with clear response steps.",
    results: [
      { metric: "0", label: "Safety incidents" },
      { metric: "12", label: "Warnings acted on" },
      { metric: "8,000", label: "Max people tracked" },
      { metric: "94%", label: "Staff satisfied" },
    ],
    quote: "We went from gut feeling to data-driven decisions in 48 hours.",
    quoteAuthor: "Carla Mendez, Safety — Solstice Festivals",
    accentColor: "border-amber-500/20",
    tagColor: "text-amber-400 bg-amber-500/10",
  },
];

const IMPACT_STATS = [
  { icon: <TrendingDown className="w-6 h-6" />, stat: "38%", label: "Average wait-time reduction across all deployments" },
  { icon: <ShieldCheck className="w-6 h-6" />, stat: "99.9%", label: "Uptime across 1,200+ live events" },
  { icon: <Clock className="w-6 h-6" />, stat: "< 30s", label: "Mean time from alert to team notification" },
  { icon: <Users className="w-6 h-6" />, stat: "500K+", label: "People flow managed daily across all venues" },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">SmartFlow AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Get Started
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-3 py-1 bg-blue-600/10 text-blue-400 text-xs font-medium rounded-full uppercase tracking-widest mb-6">
              Case Studies
            </span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Real Results from <span className="text-blue-500">Real Venues</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              See how SmartFlow AI transforms crowd management across sports, transit, and live entertainment venues worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto space-y-12">
          {CASE_STUDIES.map((study, idx) => (
            <motion.article
              key={study.venue}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`glass rounded-2xl p-8 border ${study.accentColor}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${study.tagColor}`}>
                  {study.category}
                </span>
                <span className="text-white/30 text-sm">{study.venue}</span>
              </div>

              <h2 className="text-2xl font-bold mb-2">{study.headline}</h2>

              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-white/30 font-medium mb-2">Challenge</h3>
                    <p className="text-white/70 leading-relaxed">{study.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-white/30 font-medium mb-2">Solution</h3>
                    <p className="text-white/70 leading-relaxed">{study.solution}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-white/30 font-medium mb-4">Results</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {study.results.map((r) => (
                        <div key={r.label} className="bg-white/5 rounded-xl p-4">
                          <div className="text-2xl font-bold text-white mb-1">{r.metric}</div>
                          <div className="text-xs text-white/50">{r.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <blockquote className="mt-8 pl-4 border-l-2 border-blue-500">
                <p className="text-white/80 italic mb-2">&quot;{study.quote}&quot;</p>
                <cite className="text-sm text-white/40">— {study.quoteAuthor}</cite>
              </blockquote>
            </motion.article>
          ))}
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {IMPACT_STATS.map((s) => (
              <div key={s.stat} className="text-center glass rounded-xl p-6">
                <div className="flex justify-center mb-3 text-blue-400">{s.icon}</div>
                <div className="text-3xl font-bold mb-1">{s.stat}</div>
                <div className="text-sm text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32">
        <div className="max-w-3xl mx-auto text-center glass rounded-2xl p-12 border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your venue?</h2>
          <p className="text-white/60 mb-8">
            Join 150+ venues already using SmartFlow AI to keep crowds safe and operations smooth.
          </p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Request a Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">SmartFlow AI</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/platform" className="hover:text-white">Platform</Link>
            <Link href="/solutions" className="hover:text-white">Solutions</Link>
            <Link href="/security" className="hover:text-white">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}