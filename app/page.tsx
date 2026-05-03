"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  DatabaseZap,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe2,
  IdCard,
  Loader2,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { visaResponseSchema, type VisaRequest } from "./api/visa/schema";

const countries = [
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Malaysia",
  "Netherlands",
  "New Zealand",
  "Pakistan",
  "Philippines",
  "Singapore",
  "South Africa",
  "South Korea",
  "Sri Lanka",
  "Thailand",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
];

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

const statusStyles = {
  GREEN: {
    label: "Low friction",
    caption: "Likely visa-free or simple entry",
    icon: "✓",
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
    icon: "!",
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
    icon: "✗",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    dot: "bg-rose-500",
    pulseClass: "pulse-dot-red",
    glow: "shadow-rose-500/20",
  },
} as const;

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

type DocumentResult = {
  title?: string;
  description?: string;
  sourceUrl?: string;
  downloadUrl?: string;
  sourceName?: string;
  confidence?: "high" | "medium" | "low";
};

type SourceResult = {
  title?: string;
  url?: string;
  publisher?: string;
};

function compactStrings(items: unknown[] | undefined) {
  return (
    items?.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    ) ?? []
  );
}

function compactDocuments(items: unknown[] | undefined) {
  return (
    items?.filter((item): item is DocumentResult => {
      const document = item as DocumentResult | undefined;
      return (
        typeof document?.title === "string" &&
        typeof document?.sourceUrl === "string" &&
        document.title.length > 0 &&
        document.sourceUrl.length > 0
      );
    }) ?? []
  );
}

function compactSources(items: unknown[] | undefined) {
  return (
    items?.filter((item): item is SourceResult => {
      const source = item as SourceResult | undefined;
      return (
        typeof source?.title === "string" &&
        typeof source?.url === "string" &&
        source.title.length > 0 &&
        source.url.length > 0
      );
    }) ?? []
  );
}

export default function Home() {
  const [form, setForm] = useState<VisaRequest>({
    passport: "",
    destination: "",
    purpose: "Tourism",
    details: "",
  });

  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/visa",
    schema: visaResponseSchema,
  });

  const status = object?.status;
  const statusStyle =
    status === "GREEN" || status === "YELLOW" || status === "RED"
      ? statusStyles[status]
      : undefined;

  const steps = useMemo(() => compactStrings(object?.steps), [object?.steps]);
  const checklist = useMemo(
    () => compactStrings(object?.checklist),
    [object?.checklist],
  );
  const warnings = useMemo(
    () => compactStrings(object?.warnings),
    [object?.warnings],
  );
  const documents = useMemo(
    () => compactDocuments(object?.documents),
    [object?.documents],
  );
  const sources = useMemo(() => compactSources(object?.sources), [object?.sources]);

  const canSubmit =
    form.passport.trim().length > 1 &&
    form.destination.trim().length > 1 &&
    form.purpose.trim().length > 1 &&
    !isLoading;

  const hasResults = object?.tldr || steps.length > 0 || checklist.length > 0;

  function updateField(field: keyof VisaRequest, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function fillExample(example: VisaRequest) {
    setForm(example);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    submit({
      passport: form.passport.trim(),
      destination: form.destination.trim(),
      purpose: form.purpose.trim(),
      details: form.details?.trim() || undefined,
    });
  }

  return (
    <main className="min-h-screen gradient-mesh text-slate-100">
      {/* Floating glassmorphism header */}
      <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="glass rounded-2xl px-4 py-3 shadow-xl shadow-black/10 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

              <div className="flex flex-wrap items-center gap-2">
                <HeaderPill icon={<Sparkles size={14} />} label="v0 UI" />
                <HeaderPill icon={<DatabaseZap size={14} />} label="MCP rules" />
                <HeaderPill icon={<Search size={14} />} label="Tavily sources" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid flex-1 gap-6 lg:grid-cols-[430px_minmax(0,1fr)] lg:items-start">
          {/* Left sidebar - Form */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-5 shadow-xl shadow-black/10 glow-border-focus transition-shadow duration-300 sm:p-6"
            >
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400 ring-1 ring-blue-500/20">
                  <ShieldCheck size={14} aria-hidden="true" />
                  Strict immigration triage
                </div>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-white">
                  Check the visa path before you book.
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  VisaBot combines a local MCP rule base with official-source
                  search, then streams a structured travel brief.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <CountryCombobox
                  label="Passport country"
                  icon={<IdCard size={16} aria-hidden="true" />}
                  value={form.passport}
                  placeholder="Search passport country"
                  onChange={(value) => updateField("passport", value)}
                />

                <CountryCombobox
                  label="Destination"
                  icon={<MapPin size={16} aria-hidden="true" />}
                  value={form.destination}
                  placeholder="Search destination"
                  onChange={(value) => updateField("destination", value)}
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
                    onChange={(event) => updateField("details", event.target.value)}
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
                      <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                    ) : (
                      <Plane size={18} aria-hidden="true" />
                    )}
                    {isLoading ? "Scanning sources" : "Run visa agent"}
                  </motion.button>

                  {isLoading ? (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={stop}
                      className="h-12 rounded-xl bg-slate-800/50 px-4 text-sm font-semibold text-slate-300 ring-1 ring-slate-700 transition hover:bg-slate-700/50"
                    >
                      Stop
                    </motion.button>
                  ) : null}
                </div>
              </form>
            </motion.section>

            {/* Example cards */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1"
            >
              {examples.map((example, index) => (
                <motion.button
                  key={`${example.passport}-${example.destination}`}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
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

          {/* Right column - Results */}
          <section className="space-y-4">
            {/* Progress bar when loading */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative h-1 overflow-hidden rounded-full bg-slate-800"
                >
                  <div className="progress-stream absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500" />
                </motion.div>
              )}
            </AnimatePresence>

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

                <AnimatePresence mode="wait">
                  {statusStyle ? (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`rounded-xl px-4 py-2.5 shadow-lg ${statusStyle.bg} ${statusStyle.border} border ${statusStyle.glow}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`relative flex size-3 items-center justify-center`}>
                          <span className={`pulse-dot ${statusStyle.pulseClass} relative size-3 rounded-full ${statusStyle.dot}`} />
                        </div>
                        <div>
                          <div className={`text-sm font-bold ${statusStyle.text}`}>
                            {statusStyle.label}
                          </div>
                          <p className="text-xs text-slate-400">{statusStyle.caption}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl bg-slate-800/50 px-4 py-2.5 text-sm font-semibold text-slate-500 ring-1 ring-slate-700"
                    >
                      Awaiting scan
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-300"
                >
                  {error.message}
                </motion.div>
              ) : null}

              {/* Empty state */}
              {!hasResults && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <motion.div 
                    className="float-animation mb-6 text-slate-600"
                  >
                    <Globe2 size={80} strokeWidth={1} />
                  </motion.div>
                  <h4 className="text-lg font-semibold text-slate-300">Enter a route to begin</h4>
                  <p className="mt-2 max-w-sm text-sm text-slate-500">
                    Select your passport country, destination, and travel purpose to receive an AI-powered immigration brief.
                  </p>
                </div>
              )}

              {/* Results content */}
              {(hasResults || isLoading) && (
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
                      icon={<DatabaseZap size={16} />}
                      title="Source stack"
                      caption="How the answer is grounded"
                    />
                    <div className="mt-4 space-y-2 text-sm">
                      <SourceStackItem active={Boolean(object)} label="MCP rule lookup" />
                      <SourceStackItem
                        active={documents.length > 0 || sources.length > 0}
                        label="Official source links"
                      />
                      <SourceStackItem active={Boolean(object?.generatedAt)} label="Structured JSON stream" />
                    </div>
                  </section>
                </div>
              )}
            </motion.div>

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
                  />
                </div>

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
                      documents.map((document, index) => (
                        <DocumentCard
                          key={`${document.sourceUrl}-${index}`}
                          document={document}
                          index={index}
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
                        sources.map((source, index) => (
                          <motion.a
                            key={`${source.url}-${index}`}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
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
                        warnings.map((warning, index) => (
                          <motion.div
                            key={`${warning}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
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
      </section>
    </main>
  );
}

function CountryCombobox({
  label,
  icon,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const filteredCountries = useMemo(() => {
    const query = value.trim().toLowerCase();

    if (!query) {
      return countries.slice(0, 10);
    }

    return countries
      .filter((country) => country.toLowerCase().includes(query))
      .slice(0, 10);
  }, [value]);

  return (
    <label className="relative block">
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
        {icon}
        {label}
      </span>
      <div className="relative">
        <input
          value={value}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl bg-slate-800/50 pl-10 pr-10 text-sm text-slate-200 outline-none ring-1 ring-slate-700 transition-all placeholder:text-slate-500 focus:bg-slate-800 focus:ring-blue-500/50"
        />
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={16}
          aria-hidden="true"
        />
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={16}
          aria-hidden="true"
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl bg-slate-800 p-1 shadow-xl ring-1 ring-slate-700"
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-700"
                >
                  {country}
                  {value === country ? (
                    <Check size={15} className="text-blue-400" aria-hidden="true" />
                  ) : null}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-slate-500">
                Keep typing to use a custom country.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </label>
  );
}

function HeaderPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-slate-700">
      {icon}
      {label}
    </span>
  );
}

function SectionHeading({
  icon,
  title,
  caption,
}: {
  icon: ReactNode;
  title: string;
  caption: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-blue-400">{icon}</div>
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{caption}</p>
      </div>
    </div>
  );
}

function LoadingCopy({ active, text }: { active: boolean; text: string }) {
  if (!active) {
    return <p className="text-sm leading-6 text-slate-500">{text}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="h-3 w-11/12 animate-pulse rounded-lg bg-slate-700" />
      <div className="h-3 w-9/12 animate-pulse rounded-lg bg-slate-700" />
      <div className="h-3 w-7/12 animate-pulse rounded-lg bg-slate-700" />
    </div>
  );
}

function EmptyPanel({ active, text }: { active: boolean; text: string }) {
  return (
    <div className="min-h-28 rounded-xl border border-dashed border-slate-700 bg-slate-800/30 p-4 lg:col-span-2">
      <LoadingCopy active={active} text={text} />
    </div>
  );
}

function SourceStackItem({ active, label }: { active: boolean; label: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2 text-slate-400"
    >
      <span
        className={`relative size-2 rounded-full ${active ? "bg-emerald-500" : "bg-slate-600"}`}
      >
        {active && (
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-50" />
        )}
      </span>
      {label}
    </motion.div>
  );
}

function TimelineList({
  title,
  icon,
  items,
  isLoading,
  empty,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  isLoading: boolean;
  empty: string;
}) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-card rounded-2xl p-5 shadow-xl shadow-black/10 sm:p-6"
    >
      <SectionHeading icon={icon} title={title} caption="Ordered path to apply" />
      <div className="mt-4 min-h-44">
        {items.length > 0 ? (
          <ol className="relative space-y-0">
            {items.map((item, index) => (
              <motion.li 
                key={`${item}-${index}`} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative grid grid-cols-[32px_1fr] gap-3 pb-4"
              >
                {/* Timeline line */}
                {index < items.length - 1 && (
                  <div className="timeline-line absolute left-[15px] top-8 h-[calc(100%-16px)] w-0.5" />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/25">
                    {index + 1}
                  </span>
                </div>
                <p className="pt-1 text-sm leading-6 text-slate-300">{item}</p>
              </motion.li>
            ))}
          </ol>
        ) : (
          <LoadingCopy active={isLoading} text={empty} />
        )}
      </div>
    </motion.section>
  );
}

function Checklist({
  title,
  icon,
  items,
  isLoading,
  empty,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  isLoading: boolean;
  empty: string;
}) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-card rounded-2xl p-5 shadow-xl shadow-black/10 sm:p-6"
    >
      <SectionHeading icon={icon} title={title} caption="Evidence to prepare" />
      <div className="mt-4 min-h-44">
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 rounded-xl bg-slate-800/50 p-3 text-sm leading-6 ring-1 ring-slate-700/50"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
                  <Check size={14} aria-hidden="true" />
                </span>
                <span className="text-slate-300">{item}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <LoadingCopy active={isLoading} text={empty} />
        )}
      </div>
    </motion.section>
  );
}

function DocumentCard({ document, index }: { document: DocumentResult; index: number }) {
  const confidence = document.confidence ?? "medium";
  const confidenceStyles = {
    high: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
    medium: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
    low: "bg-slate-500/10 text-slate-400 ring-slate-500/30",
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ y: -4 }}
      className="card-lift flex flex-col rounded-xl bg-slate-800/50 p-4 ring-1 ring-slate-700/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400">
          <FileText size={18} aria-hidden="true" />
        </div>
        <span className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ring-1 ${confidenceStyles[confidence]}`}>
          {confidence}
        </span>
      </div>

      <h5 className="mt-3 text-base font-semibold leading-6 text-white">
        {document.title}
      </h5>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">
        {document.description || "Official immigration document or source page."}
      </p>
      <p className="mt-2 text-xs font-medium text-slate-500">
        {document.sourceName || "Official source"}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={document.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-8 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-3 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-xl hover:shadow-blue-500/30"
        >
          Open official page
          <ExternalLink size={12} aria-hidden="true" />
        </a>
        {document.downloadUrl ? (
          <a
            href={document.downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-2 rounded-lg bg-slate-700/50 px-3 text-xs font-semibold text-slate-300 ring-1 ring-slate-600 transition hover:bg-slate-600/50"
          >
            Download form
            <Download size={12} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}
