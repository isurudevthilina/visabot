"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { WorldMap } from "./world-map";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* World Map Background */}
      <WorldMap className="z-0" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted"
        >
          AI-Powered Visa Intelligence
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-5xl font-medium leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          Navigate borders{" "}
          <span className="italic">with confidence</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl"
        >
          Before you book your flight, know exactly what you need. Our AI agent
          scans official immigration sources and delivers your personal travel
          brief in seconds.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10"
        >
          <a
            href="#check-visa"
            className="btn-primary inline-flex text-base"
          >
            Start Your Check
            <ArrowRight size={18} />
          </a>
        </motion.div>

        {/* Trust text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 text-sm text-text-muted"
        >
          Trusted by 10,000+ travelers worldwide
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a
          href="#how-it-works"
          className="flex flex-col items-center gap-2 text-text-muted transition-colors hover:text-foreground"
          aria-label="Scroll to learn more"
        >
          <span className="text-xs uppercase tracking-widest">Discover</span>
          <ChevronDown size={20} className="bounce" />
        </a>
      </motion.div>
    </section>
  );
}
