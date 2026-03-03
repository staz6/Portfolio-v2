import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { MenuButton } from "./MenuButton";
import { FullscreenMenu } from "./FullscreenMenu";
import { ThemeToggle } from "./ThemeToggle";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useTheme } from "@/hooks/useTheme";
import { useAfterPreloader } from "@/hooks/useAfterPreloader";

const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const activeSection = useScrollSpy(NAV_ITEMS);
  const { direction, isAtTop } = useScrollDirection(50);
  const { theme, selectTheme } = useTheme();

  // Whether the user has scrolled past the top — controls which navbar mode is shown
  const showFloatingButton = !isAtTop && !menuOpen;

  // GSAP entrance animation for the top navbar — waits for preloader
  const navTl = useRef<gsap.core.Timeline>();

  useEffect(() => {
    if (!navRef.current) return;
    gsap.set(navRef.current, { visibility: "hidden" });
    return () => { navTl.current?.kill(); };
  }, []);

  useAfterPreloader(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.set(nav, { visibility: "visible" });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    navTl.current = tl;

    tl.from(nav.querySelector("[data-nav-logo]"), {
      scale: 0, opacity: 0, duration: 0.6, delay: 0.3, ease: "back.out(1.7)",
    });
    tl.from(nav.querySelector("[data-nav-link]"), {
      y: 20, opacity: 0, scale: 0.9, duration: 0.5,
    }, "-=0.3");
    tl.from(nav.querySelector("[data-nav-actions]"), {
      x: 20, opacity: 0, duration: 0.4,
    }, "-=0.2");
  });

  // Hide/show the top navbar on scroll
  useEffect(() => {
    if (!navRef.current) return;

    if (isAtTop) {
      gsap.to(navRef.current, {
        y: "0%",
        duration: 0.4,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    } else {
      gsap.to(navRef.current, {
        y: "-100%",
        duration: 0.4,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    }
  }, [isAtTop]);

  // Escape key closes menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Body scroll lock when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Fullscreen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <FullscreenMenu
            items={NAV_ITEMS}
            theme={theme}
            selectTheme={selectTheme}
            onNavigate={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ===== TOP NAVBAR — visible at top of page ===== */}
      <header ref={navRef} className="fixed top-0 right-0 left-0 z-50">
        <nav className="mx-auto flex items-center px-6 py-5 lg:px-10 lg:py-6">
          {/* Logo — left */}
          <div className="flex-shrink-0">
            <Logo menuOpen={menuOpen} theme={theme} />
          </div>

          {/* Glass pill nav — centered */}
          <div className="flex flex-1 justify-center">
            <NavLinks items={NAV_ITEMS} activeSection={activeSection} />
          </div>

          {/* Actions — right */}
          <div className="flex flex-shrink-0 items-center gap-3" data-nav-actions>
            <ThemeToggle theme={theme} selectTheme={selectTheme} />
          </div>
        </nav>
      </header>

      {/* ===== FLOATING MENU BUTTON ===== */}
      {/* Always visible on mobile, appears on scroll on desktop */}
      <div className="fixed top-5 right-6 z-[60] md:hidden lg:top-6 lg:right-10">
        <MenuButton
          isOpen={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        />
      </div>

      <AnimatePresence>
        {(showFloatingButton || menuOpen) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-5 right-6 z-[60] hidden md:block lg:top-6 lg:right-10"
          >
            <MenuButton
              isOpen={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
