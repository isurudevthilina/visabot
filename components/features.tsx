"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="10" />
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <path d="M4.5 6.5C7 9 9.5 12 12 12s5-3 7.5-5.5" />
        <path d="M4.5 17.5C7 15 9.5 12 12 12s5 3 7.5 5.5" />
      </svg>
    ),
    title: "Official Sources",
    description: "Embassy websites and government portals.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 11-9-9" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
    ),
    title: "Real-Time Rules",
    description: "Always current immigration policies.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "Structured Results",
    description: "Clear steps and actionable guidance.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    title: "Always Free",
    description: "No account or payment required.",
  },
];

export function Features() {
  return (
    <section id="about" className="py-20 bg-surface">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted"
          >
            Why VisaBot
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-serif text-3xl text-foreground md:text-4xl"
          >
            Intelligence you can trust
          </motion.h2>
        </div>

        {/* Features Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-lg border border-border bg-background p-5 text-center transition-colors hover:border-accent/40"
            >
              {/* Icon */}
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
