"use client";

import { motion } from "framer-motion";

const statusConfig = {
  GREEN: {
    label: "Low friction",
    caption: "Likely visa-free or simple entry",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    dot: "bg-emerald-500",
    pulseClass: "pulse-dot-green",
    glow: "shadow-emerald-500/20",
  },
  YELLOW: {
    label: "Verify first",
    caption: "Visa or official check likely",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    dot: "bg-amber-500",
    pulseClass: "pulse-dot-yellow",
    glow: "shadow-amber-500/20",
  },
  RED: {
    label: "High friction",
    caption: "Special permit or visa likely",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    dot: "bg-rose-500",
    pulseClass: "pulse-dot-red",
    glow: "shadow-rose-500/20",
  },
} as const;

export type VisaStatus = keyof typeof statusConfig;

export function StatusBadge({ status }: { status: VisaStatus | undefined | null }) {
  if (!status || !(status in statusConfig)) {
    return (
      <motion.div
        key="idle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="rounded-xl bg-slate-800/50 px-4 py-2.5 text-sm font-semibold text-slate-500 ring-1 ring-slate-700"
      >
        Awaiting scan
      </motion.div>
    );
  }

  const style = statusConfig[status];

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`rounded-xl px-4 py-2.5 shadow-lg ${style.bg} ${style.border} border ${style.glow}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex size-3 items-center justify-center">
          <span
            className={`pulse-dot ${style.pulseClass} relative size-3 rounded-full ${style.dot}`}
          />
        </div>
        <div>
          <div className={`text-sm font-bold ${style.text}`}>{style.label}</div>
          <p className="text-xs text-slate-400">{style.caption}</p>
        </div>
      </div>
    </motion.div>
  );
}

export { statusConfig };
