"use client";

import { Globe2 } from "lucide-react";

const footerLinks = {
  product: [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Check Visa", href: "#check-visa" },
    { label: "Features", href: "#about" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Contact", href: "mailto:hello@visabot.ai" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-accent-secondary text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Globe2 size={20} />
              </div>
              <span className="font-serif text-2xl font-semibold">VisaBot</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Know before you go. AI-powered visa intelligence for the modern traveler.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} VisaBot. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Not legal advice. Always verify with official sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
