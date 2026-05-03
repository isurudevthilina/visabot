import { google } from "@ai-sdk/google";
import {
  extractJsonMiddleware,
  Output,
  streamText,
  wrapLanguageModel,
} from "ai";
import { visaRequestSchema, visaResponseSchema } from "./schema";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = visaRequestSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "passport, destination, and purpose are required.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const { passport, destination, purpose, details } = parsed.data;
  const mcpUrl = new URL("/api/mcp", req.url);
  const generatedAt = new Date().toISOString();
  const mcpResponse = await fetch(mcpUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passport, destination, purpose, details }),
  });

  if (!mcpResponse.ok) {
    return new Response(
      JSON.stringify({
        error: `MCP database returned ${mcpResponse.status}`,
      }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const mcpResult = await mcpResponse.json();

  const result = streamText({
    model: wrapLanguageModel({
      model: google("gemini-2.5-flash"),
      middleware: extractJsonMiddleware(),
    }),
    providerOptions: {
      google: {
        structuredOutputs: false,
      },
    },
    output: Output.object({
      schema: visaResponseSchema,
    }),
    maxRetries: 0,
    system: [
      "You are VisaBot, a strict global immigration triage agent.",
      "The server has already called the MCP database for this request.",
      "Base the structured answer on the MCP result, official document links, source links, and warnings. Be conservative when facts are uncertain.",
      "GREEN means likely visa-free or simple entry, YELLOW means visa or official verification is likely required, and RED means the proposed purpose is likely not allowed without a special permit.",
      "Return only valid JSON with this exact shape: {\"status\":\"GREEN|YELLOW|RED\",\"tldr\":\"two sentences\",\"steps\":[\"step\"],\"checklist\":[\"document\"],\"documents\":[{\"title\":\"string\",\"description\":\"string\",\"sourceUrl\":\"https://...\",\"downloadUrl\":\"https://... optional\",\"sourceName\":\"string\",\"confidence\":\"high|medium|low\"}],\"sources\":[{\"title\":\"string\",\"url\":\"https://...\",\"publisher\":\"string\"}],\"warnings\":[\"warning\"],\"generatedAt\":\"ISO timestamp\"}.",
      "Do not wrap the JSON in markdown fences or explanatory text. The tldr must be exactly two sentences.",
      "Never invent official URLs. Only include documents and sources that are present in the MCP tool result.",
      "Use downloadUrl only when the MCP result provides it, usually for direct PDF links.",
      `Use this exact generatedAt timestamp: ${generatedAt}.`,
      "Do not provide legal guarantees. Make the steps and checklist practical and specific.",
    ].join("\n"),
    prompt: [
      `Passport: ${passport}`,
      `Destination: ${destination}`,
      `Purpose: ${purpose}`,
      details ? `Extra details: ${details}` : "",
      `MCP result: ${JSON.stringify(mcpResult)}`,
      "Assess the visa outlook for this traveler.",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return result.toTextStreamResponse();
}
