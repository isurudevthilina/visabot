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
    text: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  YELLOW: {
    label: "Verify first",
    caption: "Visa or official check likely",
    text: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  RED: {
    label: "High friction",
    caption: "Special permit or visa likely",
    text: "text-rose-800",
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-500",
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
    <main className="min-h-screen bg-[#f8f7f3] text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Globe2 size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Zero-to-Agent Hackathon
              </p>
              <h1 className="text-xl font-semibold text-slate-950">VisaBot</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Pill icon={<Sparkles size={15} />} label="v0 UI" />
            <Pill icon={<DatabaseZap size={15} />} label="MCP rules" />
            <Pill icon={<Search size={15} />} label="Tavily sources" />
          </div>
        </header>

        <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[430px_minmax(0,1fr)] lg:items-start lg:py-8">
          <aside className="space-y-4 lg:sticky lg:top-6">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold uppercase text-slate-600">
                  <ShieldCheck size={14} aria-hidden="true" />
                  Strict immigration triage
                </div>
                <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950">
                  Check the visa path before you book.
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
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
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <BriefcaseBusiness size={16} aria-hidden="true" />
                    Travel purpose
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                    {purposeOptions.map((purpose) => (
                      <button
                        key={purpose}
                        type="button"
                        onClick={() => updateField("purpose", purpose)}
                        className={`h-10 rounded-md border px-3 text-sm font-medium transition ${
                          form.purpose === purpose
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white"
                        }`}
                      >
                        {purpose}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Trip details
                  </span>
                  <textarea
                    value={form.details ?? ""}
                    onChange={(event) => updateField("details", event.target.value)}
                    placeholder="Duration, invitation, study program, employer, transit route..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:bg-white"
                  />
                </label>

                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                    ) : (
                      <Plane size={18} aria-hidden="true" />
                    )}
                    {isLoading ? "Scanning sources" : "Run visa agent"}
                  </button>

                  {isLoading ? (
                    <button
                      type="button"
                      onClick={stop}
                      className="h-12 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Stop
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

            <section className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {examples.map((example) => (
                <button
                  key={`${example.passport}-${example.destination}`}
                  type="button"
                  onClick={() => fillExample(example)}
                  className="rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-slate-400"
                >
                  <span className="block text-sm font-semibold text-slate-950">
                    {example.passport} to {example.destination}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {example.purpose}
                  </span>
                </button>
              ))}
            </section>
          </aside>

          <section className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Agent output
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                    Immigration brief
                  </h3>
                </div>

                <AnimatePresence mode="wait">
                  {statusStyle ? (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className={`rounded-lg border px-3 py-2 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className={`size-2 rounded-full ${statusStyle.dot}`} />
                        {statusStyle.label}
                      </div>
                      <p className="mt-0.5 text-xs">{statusStyle.caption}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500"
                    >
                      Awaiting scan
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error ? (
                <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
                  {error.message}
                </div>
              ) : null}

              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
                <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <SectionHeading
                    icon={<BadgeCheck size={16} />}
                    title="Overview"
                    caption="Two-sentence agent summary"
                  />
                  <div className="mt-4 min-h-28 rounded-lg bg-white p-4">
                    {object?.tldr ? (
                      <p className="text-base leading-7 text-slate-800">
                        {object.tldr}
                      </p>
                    ) : (
                      <LoadingCopy
                        active={isLoading}
                        text="Submit a route to stream a visa summary."
                      />
                    )}
                  </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <SectionHeading
                    icon={<DatabaseZap size={16} />}
                    title="Source stack"
                    caption="How the answer is grounded"
                  />
                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <SourceStackItem active={Boolean(object)} label="MCP rule lookup" />
                    <SourceStackItem
                      active={documents.length > 0 || sources.length > 0}
                      label="Official source links"
                    />
                    <SourceStackItem active={Boolean(object?.generatedAt)} label="Structured JSON stream" />
                  </div>
                </section>
              </div>
            </div>

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

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
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
                    />
                  ))
                ) : (
                  <EmptyPanel
                    active={isLoading}
                    text="Official document links will appear here when the MCP lookup returns them."
                  />
                )}
              </div>
            </section>

            <div className="grid gap-4 xl:grid-cols-2">
              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionHeading
                  icon={<ExternalLink size={16} />}
                  title="Official sources"
                  caption="Open the source of truth"
                />
                <div className="mt-4 space-y-2">
                  {sources.length > 0 ? (
                    sources.map((source, index) => (
                      <a
                        key={`${source.url}-${index}`}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm transition hover:border-slate-400 hover:bg-white"
                      >
                        <span>
                          <span className="block font-semibold text-slate-900">
                            {source.title}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {source.publisher}
                          </span>
                        </span>
                        <ExternalLink
                          className="shrink-0 text-slate-400"
                          size={16}
                          aria-hidden="true"
                        />
                      </a>
                    ))
                  ) : (
                    <LoadingCopy
                      active={isLoading}
                      text="No official sources loaded yet."
                    />
                  )}
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionHeading
                  icon={<AlertTriangle size={16} />}
                  title="Warnings"
                  caption="What still needs human verification"
                />
                <div className="mt-4 space-y-2">
                  {warnings.length > 0 ? (
                    warnings.map((warning, index) => (
                      <div
                        key={`${warning}-${index}`}
                        className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900"
                      >
                        {warning}
                      </div>
                    ))
                  ) : (
                    <LoadingCopy
                      active={isLoading}
                      text="Warnings and uncertainty notes will appear here."
                    />
                  )}
                </div>
              </section>
            </div>
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
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
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
          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:bg-white"
        />
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
          aria-hidden="true"
        />
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
          aria-hidden="true"
        />
      </div>

      {open ? (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
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
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                {country}
                {value === country ? (
                  <Check size={15} className="text-slate-950" aria-hidden="true" />
                ) : null}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-slate-500">
              Keep typing to use a custom country.
            </div>
          )}
        </div>
      ) : null}
    </label>
  );
}

function Pill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-600 shadow-sm">
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
      <div className="mt-0.5 text-slate-500">{icon}</div>
      <div>
        <h4 className="text-sm font-semibold text-slate-950">{title}</h4>
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
      <div className="h-3 w-11/12 animate-pulse rounded-lg bg-slate-200" />
      <div className="h-3 w-9/12 animate-pulse rounded-lg bg-slate-200" />
      <div className="h-3 w-7/12 animate-pulse rounded-lg bg-slate-200" />
    </div>
  );
}

function EmptyPanel({ active, text }: { active: boolean; text: string }) {
  return (
    <div className="min-h-36 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 lg:col-span-2">
      <LoadingCopy active={active} text={text} />
    </div>
  );
}

function SourceStackItem({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2">
      <span
        className={`size-2 rounded-full ${active ? "bg-emerald-500" : "bg-slate-300"}`}
      />
      {label}
    </div>
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
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <SectionHeading icon={icon} title={title} caption="Ordered path to apply" />
      <div className="mt-4 min-h-56">
        {items.length > 0 ? (
          <ol className="space-y-3">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="grid grid-cols-[32px_1fr] gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex size-8 items-center justify-center rounded-md bg-slate-950 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  {index < items.length - 1 ? (
                    <span className="mt-2 h-full w-px bg-slate-200" />
                  ) : null}
                </div>
                <p className="pb-3 text-sm leading-6 text-slate-700">{item}</p>
              </li>
            ))}
          </ol>
        ) : (
          <LoadingCopy active={isLoading} text={empty} />
        )}
      </div>
    </section>
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
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <SectionHeading icon={icon} title={title} caption="Evidence to prepare" />
      <div className="mt-4 min-h-56">
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-emerald-100 text-emerald-700">
                  <Check size={14} aria-hidden="true" />
                </span>
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <LoadingCopy active={isLoading} text={empty} />
        )}
      </div>
    </section>
  );
}

function DocumentCard({ document }: { document: DocumentResult }) {
  const confidence = document.confidence ?? "medium";

  return (
    <article className="flex min-h-56 flex-col rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600">
          <FileText size={18} aria-hidden="true" />
        </div>
        <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold uppercase text-slate-600">
          {confidence}
        </span>
      </div>

      <h5 className="mt-4 text-base font-semibold leading-6 text-slate-950">
        {document.title}
      </h5>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {document.description || "Official immigration document or source page."}
      </p>
      <p className="mt-3 text-xs font-medium text-slate-500">
        {document.sourceName || "Official source"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={document.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Open official page
          <ExternalLink size={14} aria-hidden="true" />
        </a>
        {document.downloadUrl ? (
          <a
            href={document.downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Download form
            <Download size={14} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
