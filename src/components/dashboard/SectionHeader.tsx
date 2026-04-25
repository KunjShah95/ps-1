"use client";

import React from "react";

export function SectionHeader({
  num,
  title,
  right,
}: {
  num: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
        {num} — {title}
      </h2>
      <div className="h-px flex-1 bg-white/5" />
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}

