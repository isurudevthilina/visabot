"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

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

const countryFlags: Record<string, string> = {
  Australia: "AU",
  Brazil: "BR",
  Canada: "CA",
  China: "CN",
  France: "FR",
  Germany: "DE",
  India: "IN",
  Indonesia: "ID",
  Italy: "IT",
  Japan: "JP",
  Malaysia: "MY",
  Netherlands: "NL",
  "New Zealand": "NZ",
  Pakistan: "PK",
  Philippines: "PH",
  Singapore: "SG",
  "South Africa": "ZA",
  "South Korea": "KR",
  "Sri Lanka": "LK",
  Thailand: "TH",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  Vietnam: "VN",
};

function getFlagUrl(country: string): string | null {
  const code = countryFlags[country];
  if (!code) return null;
  return `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;
}

export { countries };

export function CountrySelect({
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
    if (!query) return countries.slice(0, 10);
    return countries
      .filter((c) => c.toLowerCase().includes(query))
      .slice(0, 10);
  }, [value]);

  const flagUrl = getFlagUrl(value);

  return (
    <label className="relative block">
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
        {icon}
        {label}
      </span>
      <div className="relative">
        {flagUrl && (
          <img
            src={flagUrl}
            alt=""
            className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[24px] -translate-y-1/2 rounded-sm object-cover"
            crossOrigin="anonymous"
          />
        )}
        <input
          value={value}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className={`h-12 w-full rounded-xl bg-slate-800/50 pr-10 text-sm text-slate-200 outline-none ring-1 ring-slate-700 transition-all placeholder:text-slate-500 focus:bg-slate-800 focus:ring-blue-500/50 ${
            flagUrl ? "pl-12" : "pl-10"
          }`}
        />
        {!flagUrl && (
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
            aria-hidden="true"
          />
        )}
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
              filteredCountries.map((country) => {
                const flag = getFlagUrl(country);
                return (
                  <button
                    key={country}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(country);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-700"
                  >
                    {flag && (
                      <img
                        src={flag}
                        alt=""
                        className="h-[14px] w-[20px] rounded-sm object-cover"
                        crossOrigin="anonymous"
                      />
                    )}
                    <span className="flex-1">{country}</span>
                    {value === country && (
                      <Check size={15} className="text-blue-400" aria-hidden="true" />
                    )}
                  </button>
                );
              })
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
