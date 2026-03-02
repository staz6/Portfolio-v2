import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NavItem } from "./Navbar";

interface NavLinksProps {
  items: readonly NavItem[];
  activeSection: string;
}

export function NavLinks({ items, activeSection }: NavLinksProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="hidden md:block"
      data-nav-link
    >
      <div className="rounded-full border border-primary/15 bg-primary/5 px-1.5 py-1.5 backdrop-blur-md">
        <ul
          className="flex items-center gap-0.5"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {items.map((item, index) => {
            const isActive = activeSection === item.href.slice(1);
            const isHovered = hoveredIndex === index;

            return (
              <li key={item.href} className="relative">
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={cn(
                    "relative z-10 block rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300",
                    isActive
                      ? "text-primary-foreground"
                      : isHovered
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                  data-cursor-scale
                >
                  {item.label}
                </a>

                {/* Active pill — slides between links */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                {/* Hover pill — appears on hover (only when not active) */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="hoverPill"
                    className="absolute inset-0 rounded-full bg-primary/10"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
