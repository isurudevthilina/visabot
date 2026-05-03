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

// Country highlight regions - all supported countries
const countryRegions: Record<string, { cx: number; cy: number; r: number }> = {
  // North America
  "United States": { cx: 130, cy: 95, r: 28 },
  "Canada": { cx: 140, cy: 60, r: 30 },
  
  // Europe
  "United Kingdom": { cx: 275, cy: 62, r: 14 },
  "Germany": { cx: 305, cy: 68, r: 12 },
  "France": { cx: 285, cy: 78, r: 14 },
  "Netherlands": { cx: 295, cy: 62, r: 8 },
  "Italy": { cx: 308, cy: 85, r: 12 },
  
  // Asia
  "India": { cx: 415, cy: 120, r: 22 },
  "China": { cx: 475, cy: 85, r: 28 },
  "Japan": { cx: 530, cy: 80, r: 14 },
  "South Korea": { cx: 512, cy: 82, r: 10 },
  "Thailand": { cx: 462, cy: 138, r: 14 },
  "Vietnam": { cx: 475, cy: 130, r: 12 },
  "Malaysia": { cx: 470, cy: 158, r: 14 },
  "Singapore": { cx: 472, cy: 165, r: 10 },
  "Indonesia": { cx: 495, cy: 172, r: 22 },
  "Philippines": { cx: 515, cy: 145, r: 14 },
  "Pakistan": { cx: 395, cy: 108, r: 14 },
  "Sri Lanka": { cx: 420, cy: 152, r: 8 },
  
  // Middle East
  "United Arab Emirates": { cx: 375, cy: 118, r: 10 },
  
  // Oceania
  "Australia": { cx: 520, cy: 205, r: 28 },
  "New Zealand": { cx: 570, cy: 235, r: 14 },
  
  // South America
  "Brazil": { cx: 155, cy: 195, r: 28 },
  
  // Africa
  "South Africa": { cx: 320, cy: 215, r: 16 },
};

export function WorldMap({ className = "", selectedCountry, destinationCountry }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Multi-layer parallax transforms - different speeds for depth effect
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const mapScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.08, 1.15]);
  const mapRotate = useTransform(scrollYProgress, [0, 1], [0, 2]);
  
  // Grid moves slower (background layer)
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 0.7, 0.4, 0.2]);
  
  // Continents move at medium speed
  const continentsY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  
  // Highlights/pins move faster (foreground layer)
  const highlightsY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  
  // Overall opacity fade as you scroll
  const overallOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.6, 0.3]);

  const selectedRegion = selectedCountry ? countryRegions[selectedCountry] : null;
  const destinationRegion = destinationCountry ? countryRegions[destinationCountry] : null;

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        style={{ 
          y: mapY, 
          scale: mapScale, 
          rotate: mapRotate,
          opacity: overallOpacity 
        }}
        className="map-breathe absolute inset-0 flex items-center justify-center"
        animate={{ opacity: selectedRegion || destinationRegion ? 0.7 : 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          viewBox="0 0 600 300"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          style={{ overflow: "visible" }}
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

          {/* Grid lines for subtle texture - slowest parallax layer */}
          <motion.g 
            stroke="#e8e6e1" 
            strokeWidth="0.3"
            style={{ 
              y: gridY,
              opacity: gridOpacity 
            }}
          >
            {/* Horizontal lines */}
            {[50, 100, 150, 200, 250].map((yPos) => (
              <line key={`h-${yPos}`} x1="0" y1={yPos} x2="600" y2={yPos} />
            ))}
            {/* Vertical lines */}
            {[100, 200, 300, 400, 500].map((x) => (
              <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="300" />
            ))}
          </motion.g>

          {/* Continent paths - medium parallax layer */}
          <motion.g 
            fill="#f0eeea" 
            stroke="#d4cfc7" 
            strokeWidth="1.5"
            style={{ y: continentsY }}
          >
            {Object.entries(continentPaths).map(([name, path]) => (
              <motion.path
                key={name}
                d={path}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.1 }}
              />
            ))}
          </motion.g>

          {/* Interactive elements - fastest parallax layer (foreground) */}
          <motion.g style={{ y: highlightsY }}>
          {/* Selected country highlight (passport) */}
          {selectedRegion && (
            <g>
              {/* Outer pulse ring */}
              <motion.circle
                cx={selectedRegion.cx}
                cy={selectedRegion.cy}
                r={selectedRegion.r}
                fill="none"
                stroke="#C45B3F"
                strokeWidth="1"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
              {/* Main highlight */}
              <motion.circle
                cx={selectedRegion.cx}
                cy={selectedRegion.cy}
                r={selectedRegion.r}
                fill="#C45B3F"
                fillOpacity="0.25"
                stroke="#C45B3F"
                strokeWidth="2.5"
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </g>
          )}

          {/* Destination country highlight */}
          {destinationRegion && (
            <g>
              {/* Outer pulse ring */}
              <motion.circle
                cx={destinationRegion.cx}
                cy={destinationRegion.cy}
                r={destinationRegion.r}
                fill="none"
                stroke="#1e3a5f"
                strokeWidth="1"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              />
              {/* Main highlight */}
              <motion.circle
                cx={destinationRegion.cx}
                cy={destinationRegion.cy}
                r={destinationRegion.r}
                fill="#1e3a5f"
                fillOpacity="0.25"
                stroke="#1e3a5f"
                strokeWidth="2.5"
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              />
            </g>
          )}

          {/* Connection path between countries */}
          {selectedRegion && destinationRegion && (
            <g>
              {/* Background path glow */}
              <motion.path
                d={`M ${selectedRegion.cx} ${selectedRegion.cy} Q ${(selectedRegion.cx + destinationRegion.cx) / 2} ${Math.min(selectedRegion.cy, destinationRegion.cy) - 50} ${destinationRegion.cx} ${destinationRegion.cy}`}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              />
              {/* Main path */}
              <motion.path
                d={`M ${selectedRegion.cx} ${selectedRegion.cy} Q ${(selectedRegion.cx + destinationRegion.cx) / 2} ${Math.min(selectedRegion.cy, destinationRegion.cy) - 50} ${destinationRegion.cx} ${destinationRegion.cy}`}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="2.5"
                strokeDasharray="8 4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              />
              {/* Animated travel dot */}
              <motion.circle
                r="4"
                fill="#C45B3F"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path={`M ${selectedRegion.cx} ${selectedRegion.cy} Q ${(selectedRegion.cx + destinationRegion.cx) / 2} ${Math.min(selectedRegion.cy, destinationRegion.cy) - 50} ${destinationRegion.cx} ${destinationRegion.cy}`}
                />
              </motion.circle>
            </g>
          )}

          {/* Map pins */}
          {selectedRegion && (
            <motion.g
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
            >
              {/* Pin shadow */}
              <ellipse cx={selectedRegion.cx} cy={selectedRegion.cy + 2} rx="6" ry="3" fill="rgba(0,0,0,0.2)" />
              {/* Pin body */}
              <circle cx={selectedRegion.cx} cy={selectedRegion.cy} r="8" fill="#C45B3F" filter="url(#glow)" />
              <circle cx={selectedRegion.cx} cy={selectedRegion.cy} r="4" fill="#fff" />
              {/* Label */}
              <rect x={selectedRegion.cx - 35} y={selectedRegion.cy - 28} width="70" height="18" rx="9" fill="#C45B3F" />
              <text x={selectedRegion.cx} y={selectedRegion.cy - 16} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">PASSPORT</text>
            </motion.g>
          )}

          {destinationRegion && (
            <motion.g
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
            >
              {/* Pin shadow */}
              <ellipse cx={destinationRegion.cx} cy={destinationRegion.cy + 2} rx="6" ry="3" fill="rgba(0,0,0,0.2)" />
              {/* Pin body */}
              <circle cx={destinationRegion.cx} cy={destinationRegion.cy} r="8" fill="#1e3a5f" filter="url(#glow)" />
              <circle cx={destinationRegion.cx} cy={destinationRegion.cy} r="4" fill="#fff" />
              {/* Label */}
              <rect x={destinationRegion.cx - 40} y={destinationRegion.cy - 28} width="80" height="18" rx="9" fill="#1e3a5f" />
              <text x={destinationRegion.cx} y={destinationRegion.cy - 16} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">DESTINATION</text>
            </motion.g>
          )}
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
