import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-10">
        {/* Passport scan illustration with animated overlays */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute -inset-6 rounded-full bg-blue-500/10 blur-2xl animate-pulse" />

          {/* Rotating scan ring */}
          <div className="absolute -inset-4 rounded-2xl border-2 border-transparent border-t-blue-500/60 border-r-blue-400/30 animate-[spin_3s_linear_infinite]" />

          {/* Second rotating ring (opposite direction) */}
          <div className="absolute -inset-2 rounded-xl border border-transparent border-b-indigo-500/40 border-l-indigo-400/20 animate-[spin_4s_linear_infinite_reverse]" />

          {/* Passport image */}
          <div className="relative h-48 w-48 overflow-hidden rounded-xl">
            <Image
              src="/images/passport-scan-loader.jpg"
              alt="Passport being scanned"
              fill
              className="object-cover"
              priority
            />
            {/* Scan line overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="scan-line absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/80 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            </div>
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]" />
            {/* Corner accents */}
            <div className="absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-blue-400/60 rounded-tl-sm" />
            <div className="absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-blue-400/60 rounded-tr-sm" />
            <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-blue-400/60 rounded-bl-sm" />
            <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-blue-400/60 rounded-br-sm" />
          </div>
        </div>

        {/* App name and status */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              VisaBot
            </h2>
          </div>

          {/* Cycling status messages */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-2 items-center justify-center">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
              </div>
              <p className="text-sm text-slate-400 animate-pulse">
                Initializing visa intelligence...
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64">
          <div className="h-1 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 bg-[length:200%_100%] animate-shimmer rounded-full" />
          </div>
          <div className="mt-3 flex justify-between text-xs text-slate-600">
            <span>Loading application</span>
            <span className="loading-dots">Please wait</span>
          </div>
        </div>
      </div>
    </div>
  );
}
