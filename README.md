# VisaBot

AI-powered visa intelligence for travelers. Check visa requirements, get personalized immigration briefs, and navigate borders with confidence — all in seconds.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)

## What it does

VisaBot helps travelers understand visa requirements before they book a flight. Enter your passport country, destination, and travel purpose, and the AI agent returns a structured immigration brief including:

- **Traffic-light status** — Green (low friction), Yellow (verify first), or Red (high friction)
- **Step-by-step guidance** — Clear actions to take for your visa application
- **Document checklist** — Interactive checklist with localStorage persistence
- **Official sources** — Links to government forms, embassy pages, and official documents
- **Warnings & caveats** — Important legal and timing considerations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com) |
| Animation | [Framer Motion](https://www.framer.com/motion) |
| AI | [Google Gemini 2.5 Flash](https://ai.google.dev) via [AI SDK](https://sdk.vercel.ai) |
| Search | [Tavily API](https://tavily.com) for live official source discovery |
| Maps | [react-simple-maps](https://www.react-simple-maps.io) for interactive world map |
| Icons | [Lucide React](https://lucide.dev) |

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── mcp/route.ts        # MCP-style database + Tavily live search
│   │   └── visa/route.ts       # AI streaming agent (Gemini)
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── visa-checker.tsx        # Main visa check form & results
│   ├── world-map.tsx           # Interactive SVG world map
│   ├── hero.tsx                # Landing hero section
│   ├── features.tsx            # Feature highlights
│   ├── how-it-works.tsx        # Process explanation
│   ├── stats.tsx               # Trust metrics
│   ├── navigation.tsx          # Top nav
│   └── footer.tsx              # Site footer
├── types/
│   └── react-simple-maps.d.ts  # Type declarations for react-simple-maps
└── public/                     # Static assets
```

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Client    │ ───▶ │  /api/visa   │ ───▶ │  /api/mcp       │
│  (React)    │ ◀─── │  (AI Agent)  │ ◀─── │  (DB + Search)  │
└─────────────┘      └──────────────┘      └─────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   Gemini     │
                    │  (Google AI) │
                    └──────────────┘
```

1. **Client** submits passport, destination, and purpose
2. **`/api/visa`** calls **`/api/mcp`** to fetch static visa facts + live official sources via Tavily
3. **Gemini** receives the MCP result and generates a structured JSON response (status, steps, checklist, documents, warnings)
4. **Client** receives a streaming object response rendered with Framer Motion animations

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### 1. Clone & Install

```bash
git clone <repo-url>
cd visabot
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required — Google AI SDK for the visa agent
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

# Optional — Tavily for live official source search
TAVILY_API_KEY=your_tavily_key
```

- Get a Google AI key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Get a Tavily key at [tavily.com](https://tavily.com) (optional — without it the app falls back to static official links)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## API Routes

### `POST /api/visa`

The main AI agent endpoint. Streams a structured visa brief.

**Request body:**
```json
{
  "passport": "India",
  "destination": "United States",
  "purpose": "Tourism",
  "details": "2-week vacation"
}
```

**Response:** Streaming JSON object with `status`, `tldr`, `steps`, `checklist`, `documents`, `sources`, `warnings`, `generatedAt`.

### `POST /api/mcp`

MCP-style database endpoint. Returns static visa facts merged with live Tavily search results for official government sources.

## Custom Type Declarations

`react-simple-maps` does not ship with TypeScript declarations. The project includes `types/react-simple-maps.d.ts` with full type coverage for all components used (`ComposableMap`, `Geographies`, `Geography`, `Marker`, `Line`, `ZoomableGroup`).

## Customization

### Adding New Country Routes

Edit `app/api/mcp/route.ts` and add new rules to `getVisaFacts()`:

```typescript
if (from.includes("your-country") && to.includes("destination")) {
  return withOfficialContext(destination, {
    status: "GREEN",
    summary: "...",
    notes: ["..."],
    steps: ["..."],
    checklist: ["..."],
    warnings: ["..."],
  });
}
```

### Adding Official Domains for Tavily Search

Add destination domains to `officialDomainsByDestination` in `app/api/mcp/route.ts`:

```typescript
const officialDomainsByDestination: Record<string, string[]> = {
  "your country": ["gov.yourcountry", "immigration.yourcountry"],
};
```

## Notes

- VisaBot is a **triage agent**, not legal advice. Always confirm final entry requirements with the destination government's official immigration website before booking non-refundable travel.
- The MCP database contains a limited set of pre-programmed visa facts. For routes not explicitly covered, it returns conservative guidance with official source links.

## License

MIT
