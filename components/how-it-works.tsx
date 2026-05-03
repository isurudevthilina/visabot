"use client";

import { motion } from "framer-motion";

// Custom SVG illustrations for each step
function PassportIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-full w-full">
      {/* Background circle */}
      <circle cx="60" cy="60" r="56" fill="#FAF9F6" stroke="#e8e6e1" strokeWidth="1" />
      
      {/* Passport book */}
      <rect x="35" y="30" width="50" height="65" rx="3" fill="#1e3a5f" />
      <rect x="38" y="33" width="44" height="59" rx="2" fill="#254a73" />
      
      {/* Passport emblem circle */}
      <circle cx="60" cy="55" r="14" fill="none" stroke="#C9A227" strokeWidth="1.5" />
      <circle cx="60" cy="55" r="10" fill="none" stroke="#C9A227" strokeWidth="1" />
      
      {/* Globe inside emblem */}
      <ellipse cx="60" cy="55" rx="6" ry="6" fill="none" stroke="#C9A227" strokeWidth="0.8" />
      <path d="M54 55 Q60 50 66 55 Q60 60 54 55" fill="none" stroke="#C9A227" strokeWidth="0.5" />
      <line x1="60" y1="49" x2="60" y2="61" stroke="#C9A227" strokeWidth="0.5" />
      
      {/* Passport text lines */}
      <rect x="48" y="74" width="24" height="2" rx="1" fill="#C9A227" opacity="0.6" />
      <rect x="52" y="80" width="16" height="1.5" rx="0.75" fill="#C9A227" opacity="0.4" />
      
      {/* Location pin floating */}
      <motion.g
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M90 35 C90 30 95 25 100 30 C105 25 110 30 110 35 C110 42 100 50 100 50 C100 50 90 42 90 35Z"
          fill="#C45B3F"
          stroke="#fff"
          strokeWidth="1.5"
        />
        <circle cx="100" cy="35" r="3" fill="#fff" />
      </motion.g>
    </svg>
  );
}

function SearchIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-full w-full">
      {/* Background circle */}
      <circle cx="60" cy="60" r="56" fill="#FAF9F6" stroke="#e8e6e1" strokeWidth="1" />
      
      {/* Document stack */}
      <rect x="25" y="40" width="45" height="55" rx="2" fill="#e8e6e1" transform="rotate(-5 25 40)" />
      <rect x="28" y="35" width="45" height="55" rx="2" fill="#f0eeea" transform="rotate(-2 28 35)" />
      <rect x="30" y="30" width="45" height="55" rx="2" fill="#fff" stroke="#e8e6e1" strokeWidth="1" />
      
      {/* Document lines */}
      <rect x="38" y="40" width="28" height="2" rx="1" fill="#d4cfc7" />
      <rect x="38" y="47" width="22" height="2" rx="1" fill="#e8e6e1" />
      <rect x="38" y="54" width="25" height="2" rx="1" fill="#e8e6e1" />
      <rect x="38" y="61" width="18" height="2" rx="1" fill="#e8e6e1" />
      <rect x="38" y="68" width="24" height="2" rx="1" fill="#e8e6e1" />
      
      {/* Magnifying glass */}
      <motion.g
        animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="82" cy="55" r="16" fill="#fff" stroke="#1e3a5f" strokeWidth="3" />
        <line x1="93" y1="66" x2="105" y2="78" stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
        
        {/* Scan lines inside magnifier */}
        <motion.g
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <rect x="74" y="50" width="16" height="1.5" rx="0.75" fill="#C45B3F" opacity="0.6" />
          <rect x="74" y="55" width="12" height="1.5" rx="0.75" fill="#C45B3F" opacity="0.4" />
          <rect x="74" y="60" width="14" height="1.5" rx="0.75" fill="#C45B3F" opacity="0.5" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

function ResultsIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-full w-full">
      {/* Background circle */}
      <circle cx="60" cy="60" r="56" fill="#FAF9F6" stroke="#e8e6e1" strokeWidth="1" />
      
      {/* Main document/brief */}
      <rect x="30" y="20" width="60" height="80" rx="4" fill="#fff" stroke="#e8e6e1" strokeWidth="1" />
      
      {/* Header accent */}
      <rect x="30" y="20" width="60" height="18" rx="4" fill="#1e3a5f" />
      <rect x="30" y="34" width="60" height="4" fill="#1e3a5f" />
      
      {/* Checkmark badge */}
      <circle cx="60" cy="30" r="8" fill="#2d6a4f" />
      <motion.path
        d="M55 30 L58 33 L65 26"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
      />
      
      {/* Content lines */}
      <rect x="38" y="48" width="44" height="2.5" rx="1.25" fill="#d4cfc7" />
      <rect x="38" y="56" width="36" height="2" rx="1" fill="#e8e6e1" />
      <rect x="38" y="63" width="40" height="2" rx="1" fill="#e8e6e1" />
      
      {/* Checklist items */}
      <g>
        <rect x="38" y="74" width="10" height="10" rx="2" fill="#f0eeea" stroke="#2d6a4f" strokeWidth="1" />
        <path d="M41 79 L43 81 L46 77" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="52" y="77" width="26" height="2" rx="1" fill="#d4cfc7" />
      </g>
      
      <g>
        <rect x="38" y="88" width="10" height="10" rx="2" fill="#f0eeea" stroke="#C45B3F" strokeWidth="1" />
        <rect x="52" y="91" width="20" height="2" rx="1" fill="#d4cfc7" />
      </g>
      
      {/* Floating elements */}
      <motion.g
        animate={{ y: [-3, 3, -3], rotate: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="78" y="55" width="28" height="20" rx="2" fill="#fff" stroke="#C45B3F" strokeWidth="1" />
        <rect x="82" y="60" width="20" height="2" rx="1" fill="#C45B3F" opacity="0.3" />
        <rect x="82" y="66" width="14" height="2" rx="1" fill="#C45B3F" opacity="0.2" />
      </motion.g>
    </svg>
  );
}

const steps = [
  {
    illustration: PassportIllustration,
    title: "Share Your Plans",
    description:
      "Select your passport country, where you want to go, and why you're traveling. Our system supports tourism, business, work, and study visas.",
    accent: "terracotta",
  },
  {
    illustration: SearchIllustration,
    title: "AI Scans Sources",
    description:
      "Our agent queries official government databases, embassy requirements, and immigration rules in real-time to gather the latest information.",
    accent: "navy",
  },
  {
    illustration: ResultsIllustration,
    title: "Receive Your Brief",
    description:
      "Get a comprehensive summary with step-by-step instructions, required documents, processing times, and important warnings to watch for.",
    accent: "green",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-surface">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-20 text-center">
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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-text-secondary"
          >
            From uncertainty to clarity in under 30 seconds
          </motion.p>
        </div>

        {/* Steps - Horizontal Timeline Layout */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-[100px] hidden h-[2px] bg-gradient-to-r from-accent via-accent-secondary to-success md:block" />
          
          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="relative"
              >
                {/* Card */}
                <div className="editorial-card relative overflow-hidden p-6 md:p-8">
                  {/* Step number badge */}
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-background text-sm font-bold text-text-muted">
                    {index + 1}
                  </div>
                  
                  {/* Illustration */}
                  <div className="mx-auto mb-6 h-32 w-32 md:h-40 md:w-40">
                    <step.illustration />
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="mb-3 font-serif text-xl font-semibold text-foreground md:text-2xl">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-secondary md:text-base">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-1 ${
                      step.accent === 'terracotta' ? 'bg-accent' :
                      step.accent === 'navy' ? 'bg-accent-secondary' :
                      'bg-success'
                    }`}
                  />
                </div>
                
                {/* Connection dot on timeline */}
                <div className="absolute left-1/2 top-[100px] hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:block">
                  <div className={`h-full w-full rounded-full border-2 border-white ${
                    step.accent === 'terracotta' ? 'bg-accent' :
                    step.accent === 'navy' ? 'bg-accent-secondary' :
                    'bg-success'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
