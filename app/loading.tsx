export default function Loading() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Animated Logo */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-transparent border-t-accent border-r-accent/50 animate-spin" />
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-2 w-20 h-20 rounded-full border border-accent/30 animate-pulse" />
          
          {/* Inner glowing core */}
          <div className="w-24 h-24 rounded-full glass flex items-center justify-center">
            <div className="relative">
              {/* Globe icon */}
              <svg 
                className="w-10 h-10 text-accent animate-pulse" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <path 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" 
                />
              </svg>
              
              {/* Orbiting dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-bounce shadow-lg shadow-accent/50" />
            </div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-accent/20 blur-xl animate-pulse" />
        </div>
        
        {/* Loading text */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl font-medium text-foreground tracking-tight">
            VisaBot
          </h2>
          
          {/* Animated dots */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Loading</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent via-purple-500 to-accent bg-[length:200%_100%] animate-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
}
