"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CommandPage({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-6 lg:px-10 lg:py-10">{children}</div>;
}

export function CommandHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        {eyebrow ? <div className="mb-2">{eyebrow}</div> : null}
        <h1 className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">{title}</h1>
        {subtitle ? <div className="mt-2 text-sm text-white/50">{subtitle}</div> : null}
      </div>
      {right ? <div className="flex shrink-0 items-center gap-3">{right}</div> : null}
    </header>
  );
}

export function EyebrowPill({
  dotClassName,
  children,
}: {
  dotClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
      <span className={cn("h-1.5 w-1.5 rounded-full bg-emerald-500", dotClassName)} />
      <span className="truncate">{children}</span>
    </div>
  );
}

export function Panel({
  title,
  right,
  children,
  className,
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      {title ? (
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight text-white/90">{title}</h2>
          {right ? <div className="flex items-center gap-2">{right}</div> : null}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  accent = "blue",
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  accent?: "blue" | "emerald" | "amber" | "red" | "neutral";
  onClick?: () => void;
}) {
  const accentMap = {
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    red: "bg-red-500/10 text-red-300 border-red-500/20",
    neutral: "bg-white/5 text-white/70 border-white/10",
  } satisfies Record<string, string>;

  const Wrap: React.ElementType = onClick ? "button" : "div";
  return (
    <Wrap
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "group rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left transition-colors hover:bg-white/[0.035]",
        onClick ? "cursor-pointer" : "",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-white tabular-nums">{value}</div>
        </div>
        <div className={cn("rounded-xl border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]", accentMap[accent])}>
          {hint ?? "Live"}
        </div>
      </div>
    </Wrap>
  );
}

export function MetricsStrip({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

export function CollapsiblePanel({
  title,
  defaultOpen = true,
  right,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 border-b border-white/10 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold tracking-tight text-white/90">{title}</div>
          {right ? <div className="flex items-center gap-2">{right}</div> : null}
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-white/50">
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      {open ? <div className="p-5">{children}</div> : null}
    </section>
  );
}

