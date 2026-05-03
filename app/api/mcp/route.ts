import { NextResponse } from "next/server";
import { visaRequestSchema } from "../visa/schema";

export const runtime = "nodejs";

type OfficialDocument = {
  title: string;
  description: string;
  sourceUrl: string;
  downloadUrl?: string;
  sourceName: string;
  confidence: "high" | "medium" | "low";
};

type OfficialSource = {
  title: string;
  url: string;
  publisher: string;
};

type VisaFact = {
  status: "GREEN" | "YELLOW" | "RED";
  summary: string;
  notes: string[];
  steps: string[];
  checklist: string[];
  documents: OfficialDocument[];
  sources: OfficialSource[];
  warnings: string[];
};

const normalize = (value: string) => value.trim().toLowerCase();

const officialDomainsByDestination: Record<string, string[]> = {
  australia: ["immi.homeaffairs.gov.au", "homeaffairs.gov.au"],
  canada: ["canada.ca"],
  india: ["indianvisaonline.gov.in", "boi.gov.in"],
  japan: ["mofa.go.jp"],
  "new zealand": ["immigration.govt.nz"],
  singapore: ["ica.gov.sg", "mfa.gov.sg"],
  "south korea": ["visa.go.kr", "k-eta.go.kr"],
  "sri lanka": ["eta.gov.lk", "immigration.gov.lk"],
  "united arab emirates": ["u.ae", "icp.gov.ae"],
  "united kingdom": ["gov.uk"],
  "united states": ["travel.state.gov", "ustraveldocs.com", "cbp.gov"],
};

function destinationKey(destination: string) {
  const normalized = normalize(destination);
  return (
    Object.keys(officialDomainsByDestination).find((key) =>
      normalized.includes(key),
    ) ?? normalized
  );
}

function publisherFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Official source";
  }
}

function confidenceForUrl(url: string, destination: string): "high" | "medium" | "low" {
  const domains = officialDomainsByDestination[destinationKey(destination)] ?? [];

  if (domains.some((domain) => url.includes(domain))) {
    return "high";
  }

  if (url.includes(".gov") || url.includes(".gouv") || url.includes(".gc.ca")) {
    return "medium";
  }

  return "low";
}

function staticOfficialLinks(destination: string): {
  documents: OfficialDocument[];
  sources: OfficialSource[];
} {
  const to = normalize(destination);

  if (to.includes("united states")) {
    return {
      documents: [
        {
          title: "DS-160 Online Nonimmigrant Visa Application",
          description:
            "Official United States form used for many temporary visitor, study, and work visa applications.",
          sourceUrl: "https://ceac.state.gov/genniv/",
          sourceName: "U.S. Department of State",
          confidence: "high",
        },
        {
          title: "Visitor Visa Overview",
          description:
            "Official guidance for B-1/B-2 business and tourism visitor visa categories.",
          sourceUrl:
            "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html",
          sourceName: "travel.state.gov",
          confidence: "high",
        },
      ],
      sources: [
        {
          title: "U.S. Visas",
          url: "https://travel.state.gov/content/travel/en/us-visas.html",
          publisher: "U.S. Department of State",
        },
      ],
    };
  }

  if (to.includes("united kingdom")) {
    return {
      documents: [
        {
          title: "Check UK Visa Requirements",
          description:
            "Official GOV.UK flow for confirming whether a traveler needs a visa before visiting, studying, or working.",
          sourceUrl: "https://www.gov.uk/check-uk-visa",
          sourceName: "GOV.UK",
          confidence: "high",
        },
        {
          title: "Standard Visitor Visa",
          description:
            "Official guidance for tourism, business visits, short courses, and other visitor activities.",
          sourceUrl: "https://www.gov.uk/standard-visitor",
          sourceName: "GOV.UK",
          confidence: "high",
        },
      ],
      sources: [
        {
          title: "UK Visas and Immigration",
          url: "https://www.gov.uk/browse/visas-immigration",
          publisher: "GOV.UK",
        },
      ],
    };
  }

  if (to.includes("canada")) {
    return {
      documents: [
        {
          title: "Visit Canada",
          description:
            "Official Government of Canada guidance for visitor visas, eTAs, and admissibility.",
          sourceUrl:
            "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
          sourceName: "Government of Canada",
          confidence: "high",
        },
      ],
      sources: [
        {
          title: "Immigration, Refugees and Citizenship Canada",
          url: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
          publisher: "Government of Canada",
        },
      ],
    };
  }

  return {
    documents: [],
    sources: [],
  };
}

async function searchTavilyOfficialSources({
  passport,
  destination,
  purpose,
}: {
  passport: string;
  destination: string;
  purpose: string;
}) {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    return {
      documents: [] as OfficialDocument[],
      sources: [] as OfficialSource[],
      warning:
        "Live official document search is not configured because TAVILY_API_KEY is missing.",
    };
  }

  const includeDomains = officialDomainsByDestination[destinationKey(destination)];
  const query = [
    "official visa requirements documents application form pdf",
    `${passport} passport`,
    `${destination} visa`,
    purpose,
  ].join(" ");

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      topic: "general",
      search_depth: "basic",
      max_results: 5,
      include_answer: false,
      include_raw_content: false,
      include_domains: includeDomains,
    }),
  });

  if (!response.ok) {
    return {
      documents: [] as OfficialDocument[],
      sources: [] as OfficialSource[],
      warning: `Live official document search returned ${response.status}.`,
    };
  }

  const payload = (await response.json()) as {
    results?: Array<{
      title?: string;
      url?: string;
      content?: string;
    }>;
  };

  const results =
    payload.results?.filter((result) => typeof result.url === "string") ?? [];

  return {
    documents: results.slice(0, 4).map((result) => {
      const url = result.url ?? "";
      return {
        title: result.title?.trim() || publisherFromUrl(url),
        description:
          result.content?.trim().slice(0, 220) ||
          "Official immigration page found through live source search.",
        sourceUrl: url,
        downloadUrl: url.toLowerCase().includes(".pdf") ? url : undefined,
        sourceName: publisherFromUrl(url),
        confidence: confidenceForUrl(url, destination),
      };
    }),
    sources: results.slice(0, 5).map((result) => {
      const url = result.url ?? "";
      return {
        title: result.title?.trim() || publisherFromUrl(url),
        url,
        publisher: publisherFromUrl(url),
      };
    }),
    warning: undefined,
  };
}

function withOfficialContext(
  destination: string,
  fact: Omit<VisaFact, "documents" | "sources">,
): VisaFact {
  return {
    ...fact,
    ...staticOfficialLinks(destination),
  };
}

function getVisaFacts(passport: string, destination: string, purpose: string): VisaFact {
  const from = normalize(passport);
  const to = normalize(destination);
  const reason = normalize(purpose);

  if (from.includes("united states") && to.includes("canada")) {
    return withOfficialContext(destination, {
      status: "GREEN",
      summary:
        "Many United States passport holders can visit Canada visa-free for short tourism or business trips, subject to admissibility checks.",
      notes: [
        "Final permission is always decided by the border officer.",
        "Work, study, long stays, prior refusals, or criminal history can change the answer.",
      ],
      steps: [
        "Confirm your passport is valid for the full trip.",
        "Review whether your purpose stays within visitor activities.",
        "Prepare proof of return travel, lodging, funds, and ties to the United States.",
      ],
      checklist: [
        "Valid United States passport",
        "Return or onward ticket",
        "Accommodation details",
        "Proof of funds",
        "Purpose-specific invitation or itinerary",
      ],
      warnings: [
        "VisaBot is a triage agent, not legal advice. Confirm final entry permission with the destination government before booking.",
      ],
    });
  }

  if (from.includes("india") && to.includes("united states")) {
    return withOfficialContext(destination, {
      status: "YELLOW",
      summary:
        "Indian passport holders usually need a United States visa before travel. The exact category depends on whether the trip is tourism, business, study, work, or another purpose.",
      notes: [
        "Tourism and business normally use B-1/B-2 visitor visa categories.",
        "Appointment availability and administrative processing can affect timing.",
      ],
      steps: [
        "Select the correct visa class for the purpose of travel.",
        "Complete the DS-160 form and pay the visa fee.",
        "Schedule biometrics and consular interview appointments.",
        "Attend the interview with strong evidence for the trip purpose and home ties.",
      ],
      checklist: [
        "Valid Indian passport",
        "DS-160 confirmation page",
        "Visa appointment confirmation",
        "Fee payment receipt",
        "Photo meeting United States visa standards",
        "Evidence of funds, employment, study, property, family, or other home ties",
      ],
      warnings: [
        "Appointment availability and administrative processing can change the timeline.",
      ],
    });
  }

  if (from.includes("sri lanka") && to.includes("united kingdom")) {
    return withOfficialContext(destination, {
      status: "YELLOW",
      summary:
        "Sri Lankan passport holders generally need a United Kingdom visa before travel. Visitor, student, work, and family routes have different evidence requirements.",
      notes: [
        "The application is usually submitted online before biometrics.",
        "Weak financial evidence or unclear purpose can lead to refusal.",
      ],
      steps: [
        "Choose the United Kingdom visa route that matches the purpose.",
        "Complete the online application and pay required fees.",
        "Book and attend a biometrics appointment.",
        "Upload or bring evidence proving purpose, funds, and intent to leave.",
      ],
      checklist: [
        "Valid Sri Lankan passport",
        "Completed online application",
        "Biometrics appointment confirmation",
        "Bank statements or sponsor evidence",
        "Employment, study, business, or invitation evidence",
        "Travel itinerary and accommodation details",
      ],
      warnings: [
        "UK visitor, student, work, and family routes have different evidence rules.",
      ],
    });
  }

  if (reason.includes("work") || reason.includes("job") || reason.includes("employment")) {
    return withOfficialContext(destination, {
      status: "RED",
      summary:
        "Work travel is usually not allowed under ordinary visitor entry rules. The user should identify the exact work-authorized visa or permit before booking travel.",
      notes: [
        "Remote work, paid work, volunteering, training, and business meetings can be treated differently by each country.",
        "The safest next step is to confirm the correct work route from the destination government.",
      ],
      steps: [
        "Identify whether the activity is paid work, unpaid work, business, training, or remote work.",
        "Find the destination's official work visa or permit route.",
        "Secure employer, sponsor, or invitation documents before applying.",
        "Do not travel as a visitor if the planned activity requires work authorization.",
      ],
      checklist: [
        "Valid passport",
        "Employment contract or invitation",
        "Sponsor or employer documentation",
        "Proof of qualifications where required",
        "Government visa or permit application confirmation",
      ],
      warnings: [
        "Do not enter as a visitor if the planned activity requires work authorization.",
      ],
    });
  }

  return withOfficialContext(destination, {
    status: "YELLOW",
    summary:
      "The simulated database does not have a guaranteed visa-free rule for this exact passport and destination. Treat the case as requiring official verification before booking non-refundable travel.",
    notes: [
      "Use the destination government's immigration website as the final authority.",
      "Transit, criminal history, prior overstays, and dual nationality can change the answer.",
    ],
    steps: [
      "Check the destination government's official visa page for this passport.",
      "Match the visa route to the exact travel purpose and length of stay.",
      "Gather evidence before submitting any application.",
      "Allow extra time for biometrics, interviews, or administrative processing.",
    ],
    checklist: [
      "Valid passport",
      "Travel purpose evidence",
      "Proof of funds",
      "Accommodation or host details",
      "Return or onward travel plan",
      "Any destination-specific application forms",
    ],
    warnings: [
      "The simulated database does not have a guaranteed rule for this exact route.",
      "Use official government sources as the final authority.",
    ],
  });
}

export async function POST(req: Request) {
  const parsed = visaRequestSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "passport, destination, and purpose are required." },
      { status: 400 },
    );
  }

  const facts = getVisaFacts(
    parsed.data.passport,
    parsed.data.destination,
    parsed.data.purpose,
  );
  const liveSearch = await searchTavilyOfficialSources(parsed.data);
  const documentUrls = new Set(facts.documents.map((document) => document.sourceUrl));
  const sourceUrls = new Set(facts.sources.map((source) => source.url));
  const documents = [
    ...facts.documents,
    ...liveSearch.documents.filter((document) => {
      if (documentUrls.has(document.sourceUrl)) {
        return false;
      }
      documentUrls.add(document.sourceUrl);
      return true;
    }),
  ];
  const sources = [
    ...facts.sources,
    ...liveSearch.sources.filter((source) => {
      if (sourceUrls.has(source.url)) {
        return false;
      }
      sourceUrls.add(source.url);
      return true;
    }),
  ];
  const warnings = liveSearch.warning
    ? [...facts.warnings, liveSearch.warning]
    : facts.warnings;

  return NextResponse.json({
    source: "simulated_mcp_database_with_tavily_official_search",
    query: parsed.data,
    ...facts,
    documents,
    sources,
    warnings,
  });
}
