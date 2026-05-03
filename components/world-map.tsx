"use client";

import { memo, useRef, useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, useScroll, useTransform } from "framer-motion";

interface WorldMapProps {
  className?: string;
  selectedCountry?: string;
  destinationCountry?: string;
}

// World map topology URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Country name to ISO code mapping for react-simple-maps
const countryToISO: Record<string, string> = {
  "United States": "USA",
  "Canada": "CAN",
  "United Kingdom": "GBR",
  "Germany": "DEU",
  "France": "FRA",
  "Netherlands": "NLD",
  "Italy": "ITA",
  "India": "IND",
  "China": "CHN",
  "Japan": "JPN",
  "South Korea": "KOR",
  "Thailand": "THA",
  "Vietnam": "VNM",
  "Malaysia": "MYS",
  "Singapore": "SGP",
  "Indonesia": "IDN",
  "Philippines": "PHL",
  "Pakistan": "PAK",
  "Sri Lanka": "LKA",
  "United Arab Emirates": "ARE",
  "Australia": "AUS",
  "New Zealand": "NZL",
  "Brazil": "BRA",
  "South Africa": "ZAF",
};

// Country coordinates for markers and flight paths
const countryCoordinates: Record<string, [number, number]> = {
  "United States": [-95.7129, 37.0902],
  "Canada": [-106.3468, 56.1304],
  "United Kingdom": [-3.4360, 55.3781],
  "Germany": [10.4515, 51.1657],
  "France": [2.2137, 46.2276],
  "Netherlands": [5.2913, 52.1326],
  "Italy": [12.5674, 41.8719],
  "India": [78.9629, 20.5937],
  "China": [104.1954, 35.8617],
  "Japan": [138.2529, 36.2048],
  "South Korea": [127.7669, 35.9078],
  "Thailand": [100.9925, 15.8700],
  "Vietnam": [108.2772, 14.0583],
  "Malaysia": [101.9758, 4.2105],
  "Singapore": [103.8198, 1.3521],
  "Indonesia": [113.9213, -0.7893],
  "Philippines": [121.7740, 12.8797],
  "Pakistan": [69.3451, 30.3753],
  "Sri Lanka": [80.7718, 7.8731],
  "United Arab Emirates": [53.8478, 23.4241],
  "Australia": [133.7751, -25.2744],
  "New Zealand": [174.8860, -40.9006],
  "Brazil": [-51.9253, -14.2350],
  "South Africa": [22.9375, -30.5595],
};

// Calculate great arc path for flight route
function calculateArcPath(
  start: [number, number],
  end: [number, number]
): [number, number][] {
  const points: [number, number][] = [];
  const numPoints = 50;
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lng = start[0] + (end[0] - start[0]) * t;
    const lat = start[1] + (end[1] - start[1]) * t;
    // Add arc effect - curve upward in the middle
    const arcHeight = Math.sin(t * Math.PI) * 15;
    points.push([lng, lat + arcHeight]);
  }
  
  return points;
}

const MapComponent = memo(function MapComponent({
  selectedCountry,
  destinationCountry,
  hoveredCountry,
  setHoveredCountry,
}: {
  selectedCountry?: string;
  destinationCountry?: string;
  hoveredCountry: string | null;
  setHoveredCountry: (country: string | null) => void;
}) {
  const selectedISO = selectedCountry ? countryToISO[selectedCountry] : null;
  const destinationISO = destinationCountry ? countryToISO[destinationCountry] : null;
  const selectedCoords = selectedCountry ? countryCoordinates[selectedCountry] : null;
  const destinationCoords = destinationCountry ? countryCoordinates[destinationCountry] : null;

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 120,
        center: [20, 30],
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <ZoomableGroup center={[20, 30]} zoom={1} minZoom={1} maxZoom={4}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoISO = geo.properties?.ISO_A3 || geo.id;
              const isSelected = geoISO === selectedISO;
              const isDestination = geoISO === destinationISO;
              const isHovered = hoveredCountry === geoISO;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredCountry(geoISO)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  style={{
                    default: {
                      fill: isSelected
                        ? "#C45B3F"
                        : isDestination
                        ? "#1e3a5f"
                        : "#f0eeea",
                      stroke: isSelected || isDestination ? "#fff" : "#d4cfc7",
                      strokeWidth: isSelected || isDestination ? 1.5 : 0.5,
                      outline: "none",
                      transition: "all 0.3s ease",
                    },
                    hover: {
                      fill: isSelected
                        ? "#a84a32"
                        : isDestination
                        ? "#152d4a"
                        : "#e8e4dc",
                      stroke: "#1e3a5f",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: isSelected ? "#8a3d2a" : "#e0dcd4",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* Flight path arc */}
        {selectedCoords && destinationCoords && (
          <Line
            from={selectedCoords}
            to={destinationCoords}
            stroke="url(#flightGradient)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="6 4"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />
        )}

        {/* Selected country marker (Passport) */}
        {selectedCoords && (
          <Marker coordinates={selectedCoords}>
            <g transform="translate(-12, -24)">
              {/* Pin body */}
              <ellipse cx="12" cy="24" rx="4" ry="2" fill="rgba(0,0,0,0.2)" />
              <path
                d="M12 0C7 0 3 4 3 9c0 7 9 15 9 15s9-8 9-15c0-5-4-9-9-9z"
                fill="#C45B3F"
                stroke="#fff"
                strokeWidth="1"
              />
              <circle cx="12" cy="9" r="4" fill="#fff" />
            </g>
            <text
              textAnchor="middle"
              y={-30}
              style={{
                fontFamily: "system-ui",
                fontSize: "10px",
                fontWeight: "600",
                fill: "#C45B3F",
                textShadow: "0 1px 2px rgba(255,255,255,0.8)",
              }}
            >
              PASSPORT
            </text>
          </Marker>
        )}

        {/* Destination country marker */}
        {destinationCoords && (
          <Marker coordinates={destinationCoords}>
            <g transform="translate(-12, -24)">
              {/* Pin body */}
              <ellipse cx="12" cy="24" rx="4" ry="2" fill="rgba(0,0,0,0.2)" />
              <path
                d="M12 0C7 0 3 4 3 9c0 7 9 15 9 15s9-8 9-15c0-5-4-9-9-9z"
                fill="#1e3a5f"
                stroke="#fff"
                strokeWidth="1"
              />
              <circle cx="12" cy="9" r="4" fill="#fff" />
            </g>
            <text
              textAnchor="middle"
              y={-30}
              style={{
                fontFamily: "system-ui",
                fontSize: "10px",
                fontWeight: "600",
                fill: "#1e3a5f",
                textShadow: "0 1px 2px rgba(255,255,255,0.8)",
              }}
            >
              DESTINATION
            </text>
          </Marker>
        )}

        {/* Gradient definition for flight path */}
        <defs>
          <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C45B3F" />
            <stop offset="100%" stopColor="#1e3a5f" />
          </linearGradient>
        </defs>
      </ZoomableGroup>
    </ComposableMap>
  );
});

export function WorldMap({ className = "", selectedCountry, destinationCountry }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const mapScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);
  const overallOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.7, 0.4]);

  const handleSetHoveredCountry = useCallback((country: string | null) => {
    setHoveredCountry(country);
  }, []);

  const hasSelection = selectedCountry || destinationCountry;

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        style={{ 
          y: mapY, 
          scale: mapScale,
          opacity: overallOpacity 
        }}
        className="map-breathe absolute inset-0 flex items-center justify-center"
        animate={{ opacity: hasSelection ? 0.85 : 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-full w-full" style={{ minHeight: "400px" }}>
          <MapComponent
            selectedCountry={selectedCountry}
            destinationCountry={destinationCountry}
            hoveredCountry={hoveredCountry}
            setHoveredCountry={handleSetHoveredCountry}
          />
        </div>
      </motion.div>
      
      {/* Hover tooltip */}
      {hoveredCountry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground/90 px-4 py-2 text-sm text-background shadow-lg backdrop-blur-sm"
        >
          {hoveredCountry}
        </motion.div>
      )}
    </div>
  );
}
