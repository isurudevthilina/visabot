"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Select Countries",
    description: "Choose your passport country and travel destination.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "Our AI checks official sources for visa requirements.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Get Results",
    description: "Receive clear steps, documents needed, and timelines.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-text-secondary">
            Three simple steps to your visa requirements
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative flex flex-col gap-6 md:flex-row md:gap-4">
          {/* Connecting line */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-border md:left-0 md:right-0 md:top-[28px] md:mx-auto md:h-px md:w-full" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex-1"
            >
              <div className="flex items-start gap-4 rounded-lg border border-border bg-background p-5 transition-shadow hover:shadow-md md:flex-col md:items-center md:text-center">
                {/* Icon circle */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="md:mt-4">
                  <span className="text-xs font-medium text-accent">{step.number}</span>
                  <h3 className="mt-1 font-serif text-lg font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-border md:block">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
