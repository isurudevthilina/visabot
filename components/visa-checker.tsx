"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Compass,
  Database,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { visaResponseSchema, type VisaRequest } from "@/app/api/visa/schema";
import { WorldMap } from "./world-map";

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
];

const popularRoutes = [
  { passport: "India", destination: "United States", purpose: "Tourism" },
  { passport: "United Kingdom", destination: "Canada", purpose: "Business" },
  { passport: "China", destination: "Australia", purpose: "Study" },
];

const statusStyles = {
  GREEN: {
    label: "Low Friction",
    caption: "Likely visa-free or simple entry",
    className: "status-green",
    dotClass: "pulse-dot-green",
  },
  YELLOW: {
    label: "Verify First",
    caption: "Visa or official check likely required",
    className: "status-yellow",
    dotClass: "pulse-dot-yellow",
  },
  RED: {
    label: "High Friction",
    caption: "Special permit or visa likely required",
    className: "status-red",
    dotClass: "pulse-dot-red",
  },
} as const;

const loadingSteps = [
  "Consulting immigration databases...",
  "Cross-referencing official sources...",
  "Analyzing visa requirements...",
  "Compiling your brief...",
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
      (item): item is string => typeof item === "string" && item.trim().length > 0
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

// Country Dropdown Component
function CountryDropdown({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-input flex w-full items-center justify-between text-left"
      >
        <span className={value ? "text-foreground" : "text-text-muted"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
        >
          <div className="border-b border-border p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md bg-background px-3 py-2 text-sm outline-none placeholder:text-text-muted"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => {
                  onChange(country);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-background ${
                  value === country ? "bg-accent/5 text-accent" : "text-foreground"
                }`}
              >
                {country}
                {value === country && <Check size={16} className="ml-auto" />}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Loading Stepper Component
function LoadingStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="space-y-4 py-8">
      {loadingSteps.map((step, index) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className="flex items-center gap-4"
        >
          <div
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
              index < currentStep
                ? "border-accent bg-accent text-white"
                : index === currentStep
                ? "border-accent text-accent"
                : "border-border text-text-muted"
            }`}
          >
            {index < currentStep ? (
              <Check size={14} />
            ) : index === currentStep ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <span className="text-xs">{index + 1}</span>
            )}
          </div>
          <span
            className={`text-sm ${
              index <= currentStep ? "text-foreground" : "text-text-muted"
            }`}
          >
            {step}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// Checklist Item with localStorage persistence
function ChecklistItem({ item, index }: { item: string; index: number }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`checklist-${index}`);
    if (stored === "true") setChecked(true);
  }, [index]);

  const toggleCheck = () => {
    const newValue = !checked;
    setChecked(newValue);
    localStorage.setItem(`checklist-${index}`, String(newValue));
  };

  return (
    <motion.button
      type="button"
      onClick={toggleCheck}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-background"
    >
      <div className={`custom-checkbox ${checked ? "checked" : ""}`}>
        {checked && <Check size={12} className="text-white" />}
      </div>
      <span
        className={`text-sm leading-relaxed ${
          checked ? "text-text-muted line-through" : "text-foreground"
        }`}
      >
        {item}
      </span>
    </motion.button>
  );
}

export function VisaChecker() {
  const [form, setForm] = useState<VisaRequest>({
    passport: "",
    destination: "",
    purpose: "Tourism",
    details: "",
  });
  const [loadingStep, setLoadingStep] = useState(0);

  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/visa",
    schema: visaResponseSchema,
  });

  // Simulate loading steps
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
    }
  }, [isLoading]);

  const status = object?.status;
  const statusStyle =
    status === "GREEN" || status === "YELLOW" || status === "RED"
      ? statusStyles[status]
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    // Clear old checklist items
    for (let i = 0; i < 20; i++) {
      localStorage.removeItem(`checklist-${i}`);
    }

    submit({
      passport: form.passport.trim(),
      destination: form.destination.trim(),
      purpose: form.purpose.trim(),
      details: form.details?.trim() || undefined,
    });
  }

  return (
    <section id="check-visa" className="section-padding relative overflow-hidden">
      {/* Background Map */}
      <WorldMap
        className="z-0 opacity-30"
        selectedCountry={form.passport}
        destinationCountry={form.destination}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted"
          >
            Your Journey
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl font-medium text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Where are you headed?
          </motion.h2>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:items-start">
          {/* Left Panel - Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="editorial-card p-6 lg:sticky lg:top-28"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <CountryDropdown
                label="Passport Country"
                value={form.passport}
                onChange={(value) => updateField("passport", value)}
                placeholder="Select your passport country"
              />

              <CountryDropdown
                label="Destination"
                value={form.destination}
                onChange={(value) => updateField("destination", value)}
                placeholder="Select your destination"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Travel Purpose
                </label>
                <div className="flex flex-wrap gap-2">
                  {purposeOptions.map((purpose) => (
                    <button
                      key={purpose}
                      type="button"
                      onClick={() => updateField("purpose", purpose)}
                      className={`purpose-pill ${form.purpose === purpose ? "active" : ""}`}
                    >
                      {purpose}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Trip Details
                </label>
                <textarea
                  value={form.details ?? ""}
                  onChange={(e) => updateField("details", e.target.value)}
                  placeholder="Duration, purpose specifics, any special circumstances..."
                  rows={3}
                  className="form-input resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-primary flex-1"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Check Requirements
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {isLoading && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={stop}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background"
                  >
                    Stop
                  </motion.button>
                )}
              </div>
            </form>

            {/* Popular Routes */}
            <div className="mt-6 border-t border-border pt-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                Popular Routes
              </p>
              <div className="flex flex-wrap gap-2">
                {popularRoutes.map((route) => (
                  <button
                    key={`${route.passport}-${route.destination}`}
                    type="button"
                    onClick={() =>
                      setForm({ ...route, details: "" })
                    }
                    className="link-underline text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    {route.passport} to {route.destination}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="editorial-card min-h-[500px] p-6"
          >
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  Immigration Brief
                </p>
                <h3 className="mt-1 font-serif text-2xl font-medium text-foreground">
                  Results
                </h3>
              </div>

              <AnimatePresence mode="wait">
                {statusStyle ? (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`status-badge ${statusStyle.className}`}
                  >
                    <span className={`pulse-dot ${statusStyle.dotClass}`} />
                    <div>
                      <div className="font-semibold">{statusStyle.label}</div>
                      <p className="text-xs opacity-75">{statusStyle.caption}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-full border border-border px-4 py-2 text-sm text-text-muted"
                  >
                    Awaiting scan
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="warning-card mb-6"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-danger" />
                  <p className="text-sm text-foreground">{error.message}</p>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && !hasResults && (
              <div className="flex flex-col items-center py-8">
                <Compass size={48} className="mb-4 animate-spin text-accent" style={{ animationDuration: "3s" }} />
                <p className="mb-2 font-medium text-foreground">
                  Researching your route...
                </p>
                <LoadingStepper currentStep={loadingStep} />
              </div>
            )}

            {/* Empty State */}
            {!hasResults && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <motion.div className="float-animation mb-6">
                  <Compass size={64} className="text-text-muted" strokeWidth={1} />
                </motion.div>
                <h4 className="font-serif text-xl font-medium text-foreground">
                  Your journey brief will appear here
                </h4>
                <p className="mt-2 max-w-sm text-sm text-text-secondary">
                  Select your passport, destination, and purpose to receive an
                  AI-powered immigration brief.
                </p>
              </div>
            )}

            {/* Results Content */}
            {hasResults && (
              <div className="space-y-6">
                {/* TL;DR */}
                {object?.tldr && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="tldr-box"
                  >
                    <p className="text-base leading-relaxed text-foreground">
                      {object.tldr}
                    </p>
                  </motion.div>
                )}

                {/* Timeline/Steps */}
                {steps.length > 0 && (
                  <div>
                    <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                      <FileText size={16} className="text-accent" />
                      Steps to Follow
                    </h4>
                    <div className="relative ml-4 border-l-2 border-border pl-6">
                      {steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative pb-4 last:pb-0"
                        >
                          <div className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-relaxed text-foreground">
                            {step}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checklist */}
                {checklist.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <Check size={16} className="text-accent" />
                      Required Documents
                    </h4>
                    <div className="rounded-lg border border-border">
                      {checklist.map((item, index) => (
                        <ChecklistItem key={index} item={item} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {documents.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <Database size={16} className="text-accent" />
                      Official Documents
                    </h4>
                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{doc.title}</p>
                            {doc.description && (
                              <p className="mt-1 text-sm text-text-secondary">
                                {doc.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center gap-3">
                              {doc.confidence && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-medium confidence-${doc.confidence}`}
                                >
                                  {doc.confidence} confidence
                                </span>
                              )}
                              {doc.sourceName && (
                                <span className="text-xs text-text-muted">
                                  {doc.sourceName}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            {doc.downloadUrl && (
                              <a
                                href={doc.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
                              >
                                <Download size={16} />
                              </a>
                            )}
                            <a
                              href={doc.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources */}
                {sources.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <Search size={16} className="text-accent" />
                      Sources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
                        >
                          {source.publisher || source.title}
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {warnings.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <AlertTriangle size={16} className="text-warning" />
                      Important Notes
                    </h4>
                    <div className="space-y-2">
                      {warnings.map((warning, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="warning-card"
                        >
                          <p className="text-sm text-foreground">{warning}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
