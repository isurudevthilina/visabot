"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  Copy,
  DatabaseZap,
  ExternalLink,
  FileCheck2,
  Globe2,
  IdCard,
  Loader2,
  MapPin,
  Plane,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
  BookOpen,
  Clock,
  Lock,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { visaResponseSchema, type VisaRequest } from "./api/visa/schema";

import { CountrySelect } from "@/components/country-select";
import { StatusBadge } from "@/components/status-badge";
import {
  SectionHeading,
  HeaderPill,
  SourceStackItem,
  ProgressBar,
  TimelineList,
  Checklist,
  DocumentCard,
  LoadingCopy,
  EmptyPanel,
  BadgeCheck,
  DatabaseZap as DatabaseZapIcon,
  FileText,
} from "@/components/ui-pieces";
import type { DocumentResult } from "@/components/ui-pieces";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const purposeOptions = [
  "Tourism",
  "Business",
  "Study",
  "Work",
  "Transit",
  "Family Visit",
  "Medical",
  "Other",
];

const examples: VisaRequest[] = [
  {
    passport: "India",
    destination: "United States",
    purpose: "Tourism",
    details: "Two-week holiday with hotel booking and return flight.",
  },
  {
    passport: "Sri Lanka",
    destination: "United Kingdom",
    purpose: "Study",
    details: "Short course visit before applying for a longer student route.",
  },
  {
    passport: "United States",
    destination: "Canada",
    purpose: "Business",
    details: "Three days of client meetings, no paid work in Canada.",
  },
];

type SourceResult = {
  title?: string;
  url?: string;
  publisher?: string;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function compactStrings(items: unknown[] | undefined) {
  return (
    items?.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0
    ) ?? []
  );
}

function compactDocuments(items: unknown[] | undefined) {
  return (
    items?.filter((item): item is DocumentResult => {
      const doc = item as DocumentResult | undefined;
      return (
        typeof doc?.title === "string" &&
        typeof doc?.sourceUrl === "string" &&
        doc.title.length > 0 &&
        doc.sourceUrl.length > 0
      );
    }) ?? []
  );
}

function compactSources(items: unknown[] | undefined) {
  return (
    items?.filter((item): item is SourceResult => {
      const src = item as SourceResult | undefined;
      return (
        typeof src?.title === "string" &&
        typeof src?.url === "string" &&
        src.title.length > 0 &&
        src.url.length > 0
      );
    }) ?? []
  );
}

/* ------------------------------------------------------------------ */
/*  Loading Stepper (simulated progress during AI processing)          */
/* ------------------------------------------------------------------ */
function LoadingStepper({ isLoading }: { isLoading: boolean }) {
  const loadingSteps = [
    { label: "Checking MCP rule base...", delay: 0 },
    { label: "Searching official sources...", delay: 1.5 },
    { label: "Analyzing visa requirements...", delay: 3.5 },
    { label: "Building your brief...", delay: 5.5 },
  ];

  if (!isLoading) return null;

  return (
    <div className="flex flex-col gap-3 py-8">
      {loadingSteps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: step.delay, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: step.delay + 0.2 }}
            className="flex size-6 items-center justify-center rounded-full bg-blue-500/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
              className="size-3 rounded-full border-2 border-blue-400 border-t-transparent"
            />
          </motion.div>
          <span className="text-sm text-slate-400">{step.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function Home() {
  const [form, setForm] = useState<VisaRequest>({
    passport: "",
    destination: "",
    purpose: "Tourism",
    details: "",
  });
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const appSectionRef = useRef<HTMLDivElement>(null);

  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/visa",
    schema: visaResponseSchema,
  });

  const status = object?.status;
  const validStatus =
    status === "GREEN" || status === "YELLOW" || status === "RED"
      ? status
      : undefined;

  const steps = useMemo(() => compactStrings(object?.steps), [object?.steps]);
  const checklist = useMemo(
    () => compactStrings(object?.checklist),
    [object?.checklist]
  );
  const warnings = useMemo(
    () => compactStrings(object?.warnings),
    [object?.warnings]
  );
  const documents = useMemo(
    () => compactDocuments(object?.documents),
    [object?.documents]
  );
  const sources = useMemo(
    () => compactSources(object?.sources),
    [object?.sources]
  );

  const canSubmit =
    form.passport.trim().length > 1 &&
    form.destination.trim().length > 1 &&
    form.purpose.trim().length > 1 &&
    !isLoading;

  const hasResults =
    object?.tldr || steps.length > 0 || checklist.length > 0;

  function updateField(field: keyof VisaRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function fillExample(example: VisaRequest) {
    setForm(example);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setCheckedItems(new Set());
    submit({
      passport: form.passport.trim(),
      destination: form.destination.trim(),
      purpose: form.purpose.trim(),
      details: form.details?.trim() || undefined,
    });
  }

  const toggleChecked = useCallback((item: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }, []);

  function handleCopyBrief() {
    if (!object) return;
    const text = [
      `VisaBot Brief: ${form.passport} -> ${form.destination}`,
      `Status: ${object.status}`,
      `Summary: ${object.tldr}`,
      steps.length > 0 ? `\nSteps:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}` : "",
      checklist.length > 0 ? `\nChecklist:\n${checklist.map((c) => `- ${c}`).join("\n")}` : "",
      warnings.length > 0 ? `\nWarnings:\n${warnings.map((w) => `- ${w}`).join("\n")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  function scrollToApp() {
    appSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen gradient-mesh text-slate-100">
      {/* ============================================================ */}
      {/*  HEADER                                                      */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="glass rounded-2xl px-4 py-3 shadow-xl shadow-black/10 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                >
                  <Globe2 size={20} aria-hidden="true" />
                </motion.div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Zero-to-Agent Hackathon
                  </p>
                  <h1 className="text-xl font-bold text-white">VisaBot</h1>
                </div>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <HeaderPill icon={<Sparkles size={14} />} label="v0 UI" />
                <HeaderPill
                  icon={<DatabaseZap size={14} />}
                  label="MCP rules"
                />
                <HeaderPill
                  icon={<Search size={14} />}
                  label="Tavily sources"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToApp}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition sm:hidden"
              >
                Check Visa
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/*  HERO SECTION                                                */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        {/* Background grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 ring-1 ring-blue-500/20">
                <Zap size={14} aria-hidden="true" />
                AI-Powered Immigration Triage
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Visa Intelligence
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                in Seconds
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 max-w-xl text-pretty text-lg leading-8 text-slate-400 lg:max-w-lg"
            >
              VisaBot combines a local MCP rule base with live official-source
              search and streams a structured travel brief. Know before you book.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToApp}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30"
              >
                Check Your Visa
                <ArrowRight size={16} aria-hidden="true" />
              </motion.button>
              <span className="text-sm text-slate-500">
                Free to use. No sign-up required.
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative flex-shrink-0"
          >
            <div className="relative h-[320px] w-[480px] max-w-full">
              <Image
                src="/images/hero-illustration.jpg"
                alt="Isometric illustration of a passport, airplane and globe"
                fill
                className="rounded-2xl object-cover"
                priority
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                */}
      {/* ============================================================ */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              How It Works
            </h3>
            <p className="mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
              Three steps to your travel brief
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Enter Details",
                desc: "Select your passport country, destination, and travel purpose.",
                img: "/images/step-1-input.jpg",
              },
              {
                step: "02",
                title: "AI Agent Scans",
                desc: "VisaBot queries MCP rules and searches official government sources.",
                img: "/images/step-2-scan.jpg",
              },
              {
                step: "03",
                title: "Get Your Brief",
                desc: "Receive a structured immigration brief with steps, checklist, and sources.",
                img: "/images/step-3-brief.jpg",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-lift glass-card group relative overflow-hidden rounded-2xl p-6"
              >
                <span className="text-5xl font-black text-slate-800/80">
                  {item.step}
                </span>
                <div className="relative mt-4 h-40 w-full overflow-hidden rounded-xl">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h4 className="mt-5 text-lg font-bold text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MAIN APP INTERFACE                                          */}
      {/* ============================================================ */}
      <section
        ref={appSectionRef}
        id="app"
        className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Visa Checker
            </h3>
            <p className="mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
              Check the visa path before you book
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[430px_minmax(0,1fr)] lg:items-start">
            {/* ----- LEFT SIDEBAR: Form ----- */}
            <aside className="space-y-4 lg:sticky lg:top-24">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card glow-border-focus rounded-2xl p-5 shadow-xl shadow-black/10 transition-shadow duration-300 sm:p-6"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400 ring-1 ring-blue-500/20">
                    <ShieldCheck size={14} aria-hidden="true" />
                    Strict immigration triage
                  </div>
                  <h2 className="mt-4 text-2xl font-bold leading-tight text-white">
                    Enter your travel route
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    VisaBot combines a local MCP rule base with official-source
                    search, then streams a structured travel brief.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <CountrySelect
                    label="Passport country"
                    icon={<IdCard size={16} aria-hidden="true" />}
                    value={form.passport}
                    placeholder="Search passport country"
                    onChange={(v) => updateField("passport", v)}
                  />

                  <CountrySelect
                    label="Destination"
                    icon={<MapPin size={16} aria-hidden="true" />}
                    value={form.destination}
                    placeholder="Search destination"
                    onChange={(v) => updateField("destination", v)}
                  />

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <BriefcaseBusiness size={16} aria-hidden="true" />
                      Travel purpose
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                      {purposeOptions.map((purpose) => (
                        <motion.button
                          key={purpose}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateField("purpose", purpose)}
                          className={`h-10 rounded-lg px-3 text-sm font-medium transition-all duration-200 ${
                            form.purpose === purpose
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
                              : "bg-slate-800/50 text-slate-400 ring-1 ring-slate-700 hover:bg-slate-700/50 hover:text-slate-200"
                          }`}
                        >
                          {purpose}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-300">
                      Trip details
                    </span>
                    <textarea
                      value={form.details ?? ""}
                      onChange={(e) => updateField("details", e.target.value)}
                      placeholder="Duration, invitation, study program, employer, transit route..."
                      rows={4}
                      className="w-full resize-none rounded-xl bg-slate-800/50 px-4 py-3 text-sm leading-6 text-slate-200 outline-none ring-1 ring-slate-700 transition-all placeholder:text-slate-500 focus:bg-slate-800 focus:ring-blue-500/50"
                    />
                  </label>

                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <motion.button
                      type="submit"
                      disabled={!canSubmit}
                      whileHover={canSubmit ? { scale: 1.02 } : {}}
                      whileTap={canSubmit ? { scale: 0.98 } : {}}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-600 disabled:shadow-none"
                    >
                      {isLoading ? (
                        <Loader2
                          className="animate-spin"
                          size={18}
                          aria-hidden="true"
                        />
                      ) : (
                        <Plane size={18} aria-hidden="true" />
                      )}
                      {isLoading ? "Scanning sources..." : "Run visa agent"}
                    </motion.button>

                    {isLoading && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={stop}
                        className="h-12 rounded-xl bg-slate-800/50 px-4 text-sm font-semibold text-slate-300 ring-1 ring-slate-700 transition hover:bg-slate-700/50"
                      >
                        Stop
                      </motion.button>
                    )}
                  </div>
                </form>
              </motion.section>

              {/* Example quick-fill cards */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1"
              >
                <p className="col-span-full text-xs font-medium uppercase tracking-wider text-slate-500 lg:col-span-1">
                  Quick examples
                </p>
                {examples.map((example, i) => (
                  <motion.button
                    key={`${example.passport}-${example.destination}`}
                    type="button"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fillExample(example)}
                    className="card-lift glass-card rounded-xl p-3 text-left"
                  >
                    <span className="block text-sm font-semibold text-white">
                      {example.passport} to {example.destination}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">
                      {example.purpose}
                    </span>
                  </motion.button>
                ))}
              </motion.section>
            </aside>

            {/* ----- RIGHT PANEL: Results ----- */}
            <section className="space-y-4">
              {/* Progress bar */}
              <AnimatePresence>
                {isLoading && <ProgressBar />}
              </AnimatePresence>

              {/* Main results card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-5 shadow-xl shadow-black/10 sm:p-6"
              >
                <div className="flex flex-col gap-4 border-b border-slate-700/50 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Agent output
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-white">
                      Immigration brief
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasResults && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopyBrief}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 text-xs font-medium text-slate-400 ring-1 ring-slate-700 transition hover:bg-slate-700/50 hover:text-slate-300"
                          title="Copy brief"
                        >
                          <Copy size={12} aria-hidden="true" />
                          {copied ? "Copied" : "Copy"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePrint}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 text-xs font-medium text-slate-400 ring-1 ring-slate-700 transition hover:bg-slate-700/50 hover:text-slate-300"
                          title="Print brief"
                        >
                          <Printer size={12} aria-hidden="true" />
                          Print
                        </motion.button>
                      </>
                    )}
                    <AnimatePresence mode="wait">
                      <StatusBadge status={validStatus} />
                    </AnimatePresence>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-300"
                  >
                    {error.message}
                  </motion.div>
                )}

                {/* Empty state */}
                {!hasResults && !isLoading && !error && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <motion.div className="float-animation relative mb-6 h-[200px] w-[300px]">
                      <Image
                        src="/images/empty-state-globe.jpg"
                        alt="Globe searching illustration"
                        fill
                        className="rounded-xl object-cover opacity-70"
                      />
                    </motion.div>
                    <h4 className="text-lg font-semibold text-slate-300">
                      Enter a route to begin
                    </h4>
                    <p className="mt-2 max-w-sm text-sm text-slate-500">
                      Select your passport country, destination, and travel
                      purpose to receive an AI-powered immigration brief.
                    </p>
                  </div>
                )}

                {/* Loading stepper */}
                {isLoading && !hasResults && (
                  <LoadingStepper isLoading={isLoading} />
                )}

                {/* Results content */}
                {(hasResults || (isLoading && hasResults)) && (
                  <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
                    <section className="rounded-xl bg-slate-800/30 p-4 ring-1 ring-slate-700/50">
                      <SectionHeading
                        icon={<BadgeCheck size={16} />}
                        title="Overview"
                        caption="Two-sentence agent summary"
                      />
                      <div className="mt-4 min-h-28 rounded-lg bg-slate-800/50 p-4">
                        {object?.tldr ? (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-base leading-7 text-slate-200"
                          >
                            {object.tldr}
                          </motion.p>
                        ) : (
                          <LoadingCopy
                            active={isLoading}
                            text="Submit a route to stream a visa summary."
                          />
                        )}
                      </div>
                    </section>

                    <section className="rounded-xl bg-slate-800/30 p-4 ring-1 ring-slate-700/50">
                      <SectionHeading
                        icon={<DatabaseZapIcon size={16} />}
                        title="Source stack"
                        caption="How the answer is grounded"
                      />
                      <div className="mt-4 space-y-2 text-sm">
                        <SourceStackItem
                          active={Boolean(object)}
                          label="MCP rule lookup"
                        />
                        <SourceStackItem
                          active={
                            documents.length > 0 || sources.length > 0
                          }
                          label="Official source links"
                        />
                        <SourceStackItem
                          active={Boolean(object?.generatedAt)}
                          label="Structured JSON stream"
                        />
                      </div>
                    </section>
                  </div>
                )}
              </motion.div>

              {/* Below the main card: steps, checklist, documents, etc. */}
              {(hasResults || isLoading) && (
                <>
                  <div className="grid gap-4 xl:grid-cols-2">
                    <TimelineList
                      title="Application steps"
                      icon={<ArrowRight size={16} />}
                      items={steps}
                      isLoading={isLoading}
                      empty="The agent will place the application path here."
                    />
                    <Checklist
                      title="Required checklist"
                      icon={<FileCheck2 size={16} />}
                      items={checklist}
                      isLoading={isLoading}
                      empty="Documents will appear as the object streams."
                      checkedItems={checkedItems}
                      onToggle={toggleChecked}
                    />
                  </div>

                  {/* Official documents */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-2xl p-5 shadow-xl shadow-black/10 sm:p-6"
                  >
                    <SectionHeading
                      icon={<FileText size={16} />}
                      title="Official documents"
                      caption="Government pages, forms, and downloads"
                    />
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      {documents.length > 0 ? (
                        documents.map((doc, i) => (
                          <DocumentCard
                            key={`${doc.sourceUrl}-${i}`}
                            document={doc}
                            index={i}
                          />
                        ))
                      ) : (
                        <EmptyPanel
                          active={isLoading}
                          text="Official document links will appear here when the MCP lookup returns them."
                        />
                      )}
                    </div>
                  </motion.section>

                  {/* Sources & Warnings */}
                  <div className="grid gap-4 xl:grid-cols-2">
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="glass-card rounded-2xl p-5 shadow-xl shadow-black/10 sm:p-6"
                    >
                      <SectionHeading
                        icon={<ExternalLink size={16} />}
                        title="Official sources"
                        caption="Open the source of truth"
                      />
                      <div className="mt-4 space-y-2">
                        {sources.length > 0 ? (
                          sources.map((source, i) => (
                            <motion.a
                              key={`${source.url}-${i}`}
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              whileHover={{ x: 4 }}
                              className="card-lift flex items-center justify-between gap-3 rounded-xl bg-slate-800/50 p-3 text-sm ring-1 ring-slate-700 transition-colors hover:bg-slate-700/50"
                            >
                              <span>
                                <span className="block font-semibold text-slate-200">
                                  {source.title}
                                </span>
                                <span className="mt-1 block text-xs text-slate-500">
                                  {source.publisher}
                                </span>
                              </span>
                              <ExternalLink
                                className="shrink-0 text-slate-500"
                                size={16}
                                aria-hidden="true"
                              />
                            </motion.a>
                          ))
                        ) : (
                          <LoadingCopy
                            active={isLoading}
                            text="No official sources loaded yet."
                          />
                        )}
                      </div>
                    </motion.section>

                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="glass-card rounded-2xl p-5 shadow-xl shadow-black/10 sm:p-6"
                    >
                      <SectionHeading
                        icon={<AlertTriangle size={16} />}
                        title="Warnings"
                        caption="What still needs human verification"
                      />
                      <div className="mt-4 space-y-2">
                        {warnings.length > 0 ? (
                          warnings.map((warning, i) => (
                            <motion.div
                              key={`${warning}-${i}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm leading-6 text-amber-200"
                            >
                              {warning}
                            </motion.div>
                          ))
                        ) : (
                          <LoadingCopy
                            active={isLoading}
                            text="Warnings and uncertainty notes will appear here."
                          />
                        )}
                      </div>
                    </motion.section>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURES / WHY VISABOT                                      */}
      {/* ============================================================ */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Why VisaBot
            </h3>
            <p className="mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
              Built for confident travel planning
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Sparkles size={24} />,
                title: "AI-Powered",
                desc: "Gemini-backed agent with MCP tool integration for accurate, grounded answers.",
              },
              {
                icon: <BookOpen size={24} />,
                title: "Official Sources",
                desc: "Every brief links to real government pages, embassy sites, and official forms.",
              },
              {
                icon: <Clock size={24} />,
                title: "Real-time Rules",
                desc: "MCP rule base stays current with immigration policy changes worldwide.",
              },
              {
                icon: <Lock size={24} />,
                title: "Free & Private",
                desc: "No account needed. No data stored. Your travel plans stay yours.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-lift glass-card rounded-2xl p-6"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400">
                  {feature.icon}
                </div>
                <h4 className="mt-4 text-lg font-bold text-white">
                  {feature.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <footer className="border-t border-slate-800 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Globe2 size={16} aria-hidden="true" />
            </div>
            <span className="text-sm font-bold text-white">VisaBot</span>
          </div>

          <p className="text-center text-sm text-slate-500">
            Built for the Zero-to-Agent Hackathon. Not legal advice.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>Powered by Gemini + MCP + Tavily</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
