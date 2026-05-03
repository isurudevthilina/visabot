"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface WorldMapProps {
  className?: string;
  selectedCountry?: string;
  destinationCountry?: string;
}

// Simplified world map SVG paths - low-poly style for performance
const continentPaths = {
  // North America
  northAmerica: "M 80,60 L 120,55 L 160,65 L 180,80 L 190,100 L 180,120 L 160,140 L 140,150 L 120,145 L 100,130 L 80,120 L 70,100 L 75,80 Z",
  // South America
  southAmerica: "M 130,160 L 150,155 L 165,170 L 170,200 L 165,230 L 155,260 L 140,270 L 125,260 L 120,230 L 125,200 L 130,170 Z",
  // Europe
  europe: "M 280,60 L 320,55 L 350,65 L 360,80 L 355,95 L 340,100 L 320,105 L 300,100 L 285,90 L 275,75 Z",
  // Africa
  africa: "M 280,110 L 320,105 L 350,115 L 360,140 L 355,180 L 340,210 L 310,220 L 280,215 L 265,190 L 260,160 L 265,130 Z",
  // Asia
  asia: "M 360,50 L 420,45 L 480,50 L 520,65 L 540,90 L 530,120 L 500,140 L 460,145 L 420,140 L 380,130 L 360,110 L 355,80 Z",
  // Australia
  australia: "M 480,180 L 520,175 L 550,185 L 560,205 L 550,225 L 520,235 L 490,230 L 475,210 L 475,190 Z",
  // Greenland
  greenland: "M 180,30 L 210,25 L 230,35 L 235,50 L 225,60 L 200,65 L 180,55 L 175,40 Z",
  // Japan & Islands
  japan: "M 520,75 L 535,70 L 545,80 L 540,95 L 525,100 L 515,90 Z",
  // UK & Ireland
  uk: "M 265,60 L 280,55 L 290,65 L 285,80 L 270,85 L 260,75 Z",
  // Indonesia
  indonesia: "M 465,165 L 500,160 L 530,165 L 545,175 L 530,185 L 495,190 L 465,185 L 455,175 Z",
  // Middle East
  middleEast: "M 330,95 L 360,90 L 385,100 L 390,120 L 375,135 L 345,140 L 320,130 L 315,110 Z",
  // Central America
  centralAmerica: "M 100,130 L 130,125 L 145,135 L 140,150 L 120,160 L 100,155 L 95,140 Z",
};

// Country highlight regions (simplified)
const countryRegions: Record<string, { cx: number; cy: number; r: number }> = {
  "United States": { cx: 130, cy: 95, r: 25 },
  "Canada": { cx: 130, cy: 65, r: 25 },
  "United Kingdom": { cx: 275, cy: 68, r: 12 },
  "India": { cx: 415, cy: 125, r: 20 },
  "China": { cx: 470, cy: 90, r: 25 },
  "Japan": { cx: 530, cy: 85, r: 12 },
  "Australia": { cx: 520, cy: 205, r: 25 },
  "Germany": { cx: 310, cy: 70, r: 10 },
  "France": { cx: 290, cy: 78, r: 10 },
  "Brazil": { cx: 145, cy: 200, r: 25 },
  "South Africa": { cx: 315, cy: 210, r: 15 },
  "Singapore": { cx: 480, cy: 160, r: 8 },
  "Thailand": { cx: 460, cy: 140, r: 12 },
  "Indonesia": { cx: 490, cy: 175, r: 20 },
  "Malaysia": { cx: 475, cy: 155, r: 12 },
  "Vietnam": { cx: 475, cy: 130, r: 10 },
  "Philippines": { cx: 510, cy: 145, r: 12 },
  "South Korea": { cx: 515, cy: 80, r: 8 },
  "New Zealand": { cx: 570, cy: 240, r: 12 },
  "United Arab Emirates": { cx: 375, cy: 120, r: 8 },
  "Netherlands": { cx: 300, cy: 65, r: 6 },
  "Italy": { cx: 310, cy: 85, r: 10 },
  "Pakistan": { cx: 395, cy: 110, r: 12 },
  "Sri Lanka": { cx: 420, cy: 150, r: 6 },
};

export function WorldMap({ className = "", selectedCountry, destinationCountry }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

  const selectedRegion = selectedCountry ? countryRegions[selectedCountry] : null;
  const destinationRegion = destinationCountry ? countryRegions[destinationCountry] : null;

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        style={{ y, scale }}
        className="map-breathe absolute inset-0 flex items-center justify-center opacity-40"
      >
        <svg
          viewBox="0 0 600 300"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {/* Gradient for path line */}
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C45B3F" />
              <stop offset="100%" stopColor="#1e3a5f" />
            </linearGradient>
            
            {/* Glow filter for highlights */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle noise pattern */}
            <pattern id="mapNoise" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="#f0eeea" />
            </pattern>
          </defs>

          {/* Background */}
          <rect width="600" height="300" fill="#FAF9F6" />

          {/* Grid lines for subtle texture */}
          <g stroke="#e8e6e1" strokeWidth="0.3" opacity="0.5">
            {/* Horizontal lines */}
            {[50, 100, 150, 200, 250].map((y) => (
              <line key={`h-${y}`} x1="0" y1={y} x2="600" y2={y} />
            ))}
            {/* Vertical lines */}
            {[100, 200, 300, 400, 500].map((x) => (
              <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="300" />
            ))}
          </g>

          {/* Continent paths */}
          <g fill="#f0eeea" stroke="#d4cfc7" strokeWidth="1.5">
            {Object.entries(continentPaths).map(([name, path]) => (
              <motion.path
                key={name}
                d={path}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.1 }}
              />
            ))}
          </g>

          {/* Selected country highlight */}
          {selectedRegion && (
            <motion.circle
              cx={selectedRegion.cx}
              cy={selectedRegion.cy}
              r={selectedRegion.r}
              fill="#C45B3F"
              fillOpacity="0.15"
              stroke="#C45B3F"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          )}

          {/* Destination country highlight */}
          {destinationRegion && (
            <motion.circle
              cx={destinationRegion.cx}
              cy={destinationRegion.cy}
              r={destinationRegion.r}
              fill="#1e3a5f"
              fillOpacity="0.15"
              stroke="#1e3a5f"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            />
          )}

          {/* Connection path between countries */}
          {selectedRegion && destinationRegion && (
            <motion.path
              d={`M ${selectedRegion.cx} ${selectedRegion.cy} Q ${(selectedRegion.cx + destinationRegion.cx) / 2} ${Math.min(selectedRegion.cy, destinationRegion.cy) - 40} ${destinationRegion.cx} ${destinationRegion.cy}`}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            />
          )}

          {/* Map pins */}
          {selectedRegion && (
            <motion.g
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
            >
              <circle cx={selectedRegion.cx} cy={selectedRegion.cy} r="6" fill="#C45B3F" />
              <circle cx={selectedRegion.cx} cy={selectedRegion.cy} r="3" fill="#fff" />
            </motion.g>
          )}

          {destinationRegion && (
            <motion.g
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
            >
              <circle cx={destinationRegion.cx} cy={destinationRegion.cy} r="6" fill="#1e3a5f" />
              <circle cx={destinationRegion.cx} cy={destinationRegion.cy} r="3" fill="#fff" />
            </motion.g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
