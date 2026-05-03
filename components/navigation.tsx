"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Globe2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#how-it-works", label: "How it Works" },
    { href: "#check-visa", label: "Check Visa" },
    { href: "#about", label: "About" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "nav-scrolled" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <nav className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a href="#" className="group flex items-center gap-3">
            <motion.div 
              className="relative flex h-10 w-10 items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {/* Animated ring */}
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-accent"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              {/* Inner circle with globe */}
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                  {/* Globe base */}
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  {/* Latitude lines */}
                  <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" />
                  {/* Longitude curve */}
                  <path d="M2 12c0-3 4.5-5.5 10-5.5s10 2.5 10 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  {/* Airplane */}
                  <motion.g
                    animate={{ 
                      rotate: [0, 360],
                      x: [0, 2, 0, -2, 0],
                      y: [0, -1, 0, 1, 0]
                    }}
                    transition={{ 
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                      x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                    }}
                    style={{ originX: "12px", originY: "12px" }}
                  >
                    <path d="M18 6l-1.5 1.5L15 8l1-2 2-1z" fill="currentColor" />
                  </motion.g>
                </svg>
              </div>
              {/* Decorative dots */}
              <motion.div 
                className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-semibold text-foreground leading-tight">
                VisaBot
              </span>
              <span className="text-[10px] uppercase tracking-widest text-text-muted">
                Travel Smart
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-underline text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#check-visa"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20"
            >
              Check Your Visa
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border pb-6 md:hidden"
          >
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-text-secondary transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#check-visa"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-dark"
              >
                Check Your Visa
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
