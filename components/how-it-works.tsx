"use client";

import { motion } from "framer-motion";
import { MapPin, Search, FileText } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Share Your Plans",
    description:
      "Select your passport country, destination, and travel purpose.",
  },
  {
    icon: Search,
    title: "Agent Scans Sources",
    description:
      "We query immigration databases, official government sources, and our rule engine.",
  },
  {
    icon: FileText,
    title: "Receive Your Brief",
    description:
      "Get a structured summary with steps, documents, and warnings.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-background">
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
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl font-medium text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Three steps to certainty
          </motion.h2>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="editorial-card p-8 text-center"
            >
              {/* Step Number */}
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-lg font-semibold text-accent">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border">
                <step.icon size={28} className="text-accent-secondary" />
              </div>

              {/* Title */}
              <h3 className="mb-3 font-serif text-xl font-semibold text-foreground">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
