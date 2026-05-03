"use client";

import { motion } from "framer-motion";
import { Database, RefreshCw, LayoutGrid, Heart } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Official Sources",
    description:
      "We pull from embassy websites, government portals, and official documentation.",
  },
  {
    icon: RefreshCw,
    title: "Real-Time Rules",
    description:
      "Our MCP rule base stays current with changing immigration policies.",
  },
  {
    icon: LayoutGrid,
    title: "Structured Results",
    description:
      "No wall of text. Clear steps, checklists, and actionable guidance.",
  },
  {
    icon: Heart,
    title: "Always Free",
    description:
      "Check as many routes as you need. No account required.",
  },
];

export function Features() {
  return (
    <section id="about" className="section-padding bg-surface">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted"
          >
            Why VisaBot
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl font-medium text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Intelligence you can trust
          </motion.h2>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-lg border border-border bg-background p-6 transition-all duration-300 hover:border-accent/30"
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/5 transition-colors group-hover:bg-accent/10">
                <feature.icon
                  size={24}
                  className="text-text-secondary transition-colors group-hover:text-accent"
                />
              </div>

              {/* Title */}
              <h3 className="mb-2 font-semibold text-foreground">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
