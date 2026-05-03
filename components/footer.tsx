"use client";

export function Footer() {
  return (
    <footer className="bg-accent-secondary text-white">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        {/* Main Content */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex h-9 w-9 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/30" />
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            <span className="font-serif text-xl font-semibold">VisaBot</span>
          </div>
          
          {/* Tagline */}
          <p className="text-sm text-white/60 max-w-xs">
            Know before you go. AI-powered visa intelligence for the modern traveler.
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
            <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">
              How it Works
            </a>
            <a href="#check-visa" className="text-sm text-white/60 hover:text-white transition-colors">
              Check Visa
            </a>
            <a href="#about" className="text-sm text-white/60 hover:text-white transition-colors">
              Features
            </a>
            <a href="mailto:hello@visabot.ai" className="text-sm text-white/60 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} VisaBot. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white/60 transition-colors">Terms</a>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-white/30 mt-6">
          Not legal advice. Always verify with official government sources.
        </p>
      </div>
    </footer>
  );
}
