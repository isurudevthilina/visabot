"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "24+", label: "Countries" },
  { value: "Official", label: "Sources" },
  { value: "Seconds", label: "To Results" },
];

export function Stats() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="rounded-xl bg-accent-secondary/5 px-8 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-serif text-5xl font-medium text-foreground md:text-6xl">
                  {stat.value}
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
