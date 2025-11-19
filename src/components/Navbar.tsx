"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  User,
  Code,
  Briefcase,
  Trophy,
  Mail,
  DollarSign,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, href: "#hero" },
  { label: "About", icon: User, href: "#about" },
  { label: "Skills", icon: Code, href: "#skills" },
  { label: "Projects", icon: Briefcase, href: "#projects" },
  { label: "Awards", icon: Trophy, href: "#testimonials" },
  { label: "Pricing", icon: DollarSign, href: "#pricing" },
  { label: "Contact", icon: Mail, href: "#contact" },
];

const MOBILE_LABEL_WIDTH = 72;

type NavBarProps = {
  className?: string;
  defaultIndex?: number;
  stickyTop?: boolean;
};

export function Navbar({
  className,
  defaultIndex = 0,
  stickyTop = true,
}: NavBarProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [suppressSpy, setSuppressSpy] = useState(false);
  const suppressTimer = useRef<number | null>(null);

  const handleNavClick = (index: number, href: string) => {
    setActiveIndex(index);
    setSuppressSpy(true);
    const element = document.querySelector(href);
    if (element) {
      // Prefer native scrollend to re-enable spy
      const onScrollEnd = () => {
        setSuppressSpy(false);
        document.removeEventListener('scrollend', onScrollEnd as any);
        if (suppressTimer.current) {
          window.clearTimeout(suppressTimer.current);
          suppressTimer.current = null;
        }
      };
      document.addEventListener('scrollend', onScrollEnd as any, { once: true } as any);
      // Fallback timer in case scrollend isn't supported
      if (suppressTimer.current) window.clearTimeout(suppressTimer.current);
      suppressTimer.current = window.setTimeout(() => setSuppressSpy(false), 1200);

      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // No element found, re-enable spy immediately
      setSuppressSpy(false);
    }
  };

  // Scroll spy to update active index based on visible section
  useEffect(() => {
    const idToIndex = new Map<string, number>(navItems.map((n, i) => [n.href.replace('#',''), i]));
    const sections = Array.from(document.querySelectorAll(
      navItems.map(n => n.href).join(', ')
    )) as HTMLElement[];

    if (!sections.length) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (suppressSpy) { ticking = false; return; }
        // Find section closest to top (account for fixed navbar height ~64px)
        const offset = 72;
        let bestId: string | null = null;
        let bestDist = Number.POSITIVE_INFINITY;

        for (const sec of sections) {
          const rect = sec.getBoundingClientRect();
          const dist = Math.abs(rect.top - offset);
          if (rect.bottom > offset && rect.top < window.innerHeight * 0.8 && dist < bestDist) {
            bestDist = dist;
            bestId = sec.id;
          }
        }
        if (bestId && idToIndex.has(bestId)) {
          const idx = idToIndex.get(bestId)!;
          if (idx !== activeIndex) setActiveIndex(idx);
        }
        ticking = false;
      });
    };

    const observer = new IntersectionObserver(() => handleScroll(), {
      root: null,
      threshold: [0.1, 0.5, 0.9],
    });

    sections.forEach(s => observer.observe(s));
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex, suppressSpy]);

  return (
    <motion.nav
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Main Navigation"
      className={cn(
        "bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center p-1.5 sm:p-2 shadow-2xl space-x-1 min-w-[280px] sm:min-w-[320px] max-w-[95vw] h-[48px] sm:h-[52px]",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]", // Inner glow
        stickyTop && "fixed inset-x-0 top-4 mx-auto z-50 w-fit",
        className,
      )}
      style={{ 
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent' 
      }}
    >
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;

        return (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex items-center gap-0 px-3 py-2 rounded-full transition-all duration-500 relative h-10 min-w-[48px] min-h-[44px] max-h-[48px]",
              isActive
                ? "bg-white/10 text-white gap-2 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                : "bg-transparent text-zinc-400 hover-hover:hover:text-white hover-hover:hover:bg-white/5 active:text-white active:bg-white/5",
              "focus:outline-none focus-visible:ring-0",
            )}
            onClick={() => handleNavClick(idx, item.href)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            type="button"
            style={{ 
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent' 
            }}
          >
            <Icon
              size={20}
              strokeWidth={1.5}
              aria-hidden
              className="transition-colors duration-500"
            />

            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "8px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className={cn("overflow-hidden flex items-center max-w-[72px]")}
            >
              <span
                className={cn(
                  "font-medium text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis text-[clamp(0.625rem,0.5263rem+0.5263vw,1rem)] leading-[1.9]",
                  isActive ? "text-white" : "opacity-0",
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export default Navbar; 