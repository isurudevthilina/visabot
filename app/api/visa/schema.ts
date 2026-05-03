import { z } from "zod";

export const visaRequestSchema = z.object({
  passport: z.string().trim().min(2),
  destination: z.string().trim().min(2),
  purpose: z.string().trim().min(2),
  details: z.string().trim().optional(),
});

export const officialDocumentSchema = z.object({
  title: z.string(),
  description: z.string(),
  sourceUrl: z.string().url(),
  downloadUrl: z.string().url().optional(),
  sourceName: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
});

export const officialSourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  publisher: z.string(),
});

export const visaResponseSchema = z.object({
  status: z.enum(["GREEN", "YELLOW", "RED"]),
  tldr: z
    .string()
    .describe("A strict two sentence summary of the visa outlook."),
  steps: z.array(z.string()).describe("Clear application steps for the user."),
  checklist: z
    .array(z.string())
    .describe("Required documents and evidence the user should prepare."),
  documents: z
    .array(officialDocumentSchema)
    .describe("Official document pages, forms, or PDF downloads."),
  sources: z
    .array(officialSourceSchema)
    .describe("Official government or embassy sources used for the answer."),
  warnings: z
    .array(z.string())
    .describe("Important uncertainty, legal, timing, or source warnings."),
  generatedAt: z.string().describe("ISO timestamp when the brief was generated."),
});

export type VisaRequest = z.infer<typeof visaRequestSchema>;
export type VisaResponse = z.infer<typeof visaResponseSchema>;
