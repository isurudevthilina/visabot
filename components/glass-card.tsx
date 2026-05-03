"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type GlassCardVariant = "default" | "hover" | "glow";

export function GlassCard({
  children,
  variant = "default",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  variant?: GlassCardVariant;
  className?: string;
  delay?: number;
}) {
  const variants: Record<GlassCardVariant, string> = {
    default: "glass-card",
    hover: "glass-card card-lift",
    glow: "glass-card glow-border-focus",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`rounded-2xl p-5 shadow-xl shadow-black/10 sm:p-6 ${variants[variant]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
