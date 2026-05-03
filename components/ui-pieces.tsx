"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Check,
  DatabaseZap,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
} from "lucide-react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Section Heading                                                    */
/* ------------------------------------------------------------------ */
export function SectionHeading({
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

/* ------------------------------------------------------------------ */
/*  Header Pill                                                        */
/* ------------------------------------------------------------------ */
export function HeaderPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-slate-700">
      {icon}
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */
export function SkeletonCard() {
  return (
    <div className="space-y-3 p-1">
      <div className="h-3 w-11/12 animate-pulse rounded-lg bg-slate-700" />
      <div className="h-3 w-9/12 animate-pulse rounded-lg bg-slate-700" />
      <div className="h-3 w-7/12 animate-pulse rounded-lg bg-slate-700" />
    </div>
  );
}

export function LoadingCopy({ active, text }: { active: boolean; text: string }) {
  if (!active) return <p className="text-sm leading-6 text-slate-500">{text}</p>;
  return <SkeletonCard />;
}

export function EmptyPanel({ active, text }: { active: boolean; text: string }) {
  return (
    <div className="min-h-28 rounded-xl border border-dashed border-slate-700 bg-slate-800/30 p-4 lg:col-span-2">
      <LoadingCopy active={active} text={text} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Source Stack Item                                                   */
/* ------------------------------------------------------------------ */
export function SourceStackItem({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) {
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

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */
export function ProgressBar() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-1 overflow-hidden rounded-full bg-slate-800"
    >
      <div className="progress-stream absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline List                                                      */
/* ------------------------------------------------------------------ */
export function TimelineList({
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
            {items.map((item, i) => (
              <motion.li
                key={`${item}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative grid grid-cols-[32px_1fr] gap-3 pb-4"
              >
                {i < items.length - 1 && (
                  <div className="timeline-line absolute left-[15px] top-8 h-[calc(100%-16px)] w-0.5" />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/25">
                    {i + 1}
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

/* ------------------------------------------------------------------ */
/*  Checklist                                                          */
/* ------------------------------------------------------------------ */
export function Checklist({
  title,
  icon,
  items,
  isLoading,
  empty,
  checkedItems,
  onToggle,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  isLoading: boolean;
  empty: string;
  checkedItems: Set<string>;
  onToggle: (item: string) => void;
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
            {items.map((item, i) => {
              const checked = checkedItems.has(item);
              return (
                <motion.button
                  key={`${item}-${i}`}
                  type="button"
                  onClick={() => onToggle(item)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex w-full gap-3 rounded-xl p-3 text-left text-sm leading-6 ring-1 transition-all ${
                    checked
                      ? "bg-emerald-500/10 ring-emerald-500/30"
                      : "bg-slate-800/50 ring-slate-700/50 hover:bg-slate-700/50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                      checked
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-700/50 text-slate-500"
                    }`}
                  >
                    {checked && <Check size={14} aria-hidden="true" />}
                  </span>
                  <span
                    className={`${checked ? "text-emerald-300 line-through" : "text-slate-300"}`}
                  >
                    {item}
                  </span>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <LoadingCopy active={isLoading} text={empty} />
        )}
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Document Card                                                      */
/* ------------------------------------------------------------------ */
export type DocumentResult = {
  title?: string;
  description?: string;
  sourceUrl?: string;
  downloadUrl?: string;
  sourceName?: string;
  confidence?: "high" | "medium" | "low";
};

const confidenceStyles = {
  high: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  medium: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
  low: "bg-slate-500/10 text-slate-400 ring-slate-500/30",
};

export function DocumentCard({
  document,
  index,
}: {
  document: DocumentResult;
  index: number;
}) {
  const confidence = document.confidence ?? "medium";

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
        <span
          className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ring-1 ${confidenceStyles[confidence]}`}
        >
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
          Open page
          <ExternalLink size={12} aria-hidden="true" />
        </a>
        {document.downloadUrl && (
          <a
            href={document.downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-2 rounded-lg bg-slate-700/50 px-3 text-xs font-semibold text-slate-300 ring-1 ring-slate-600 transition hover:bg-slate-600/50"
          >
            Download
            <Download size={12} aria-hidden="true" />
          </a>
        )}
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported icon shortcuts                                            */
/* ------------------------------------------------------------------ */
export {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Check,
  DatabaseZap,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
};
