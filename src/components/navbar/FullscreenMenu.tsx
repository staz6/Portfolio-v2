import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./Navbar";
import type { Theme } from "@/hooks/useTheme";
import { MenuLink } from "./MenuLink";
import { ThemeToggle } from "./ThemeToggle";

interface FullscreenMenuProps {
  items: readonly NavItem[];
  theme: Theme;
  selectTheme: (theme: Theme) => void;
  onNavigate: () => void;
}

const MENU_THEME: Record<Theme, { text: string; textMuted: string; bg: string; border: string }> = {
  orange: { text: "text-[#ff6b2b]", textMuted: "text-[#ff6b2b]/50 hover:text-[#ff6b2b]", bg: "bg-[#1a1a1a]", border: "border-[#ff6b2b]/20" },
  "orange-light": { text: "text-[#c45a20]", textMuted: "text-[#c45a20]/50 hover:text-[#c45a20]", bg: "bg-[#faf5f0]", border: "border-[#c45a20]/20" },
  "mono-dark": { text: "text-background", textMuted: "text-background/50 hover:text-background", bg: "bg-foreground", border: "border-background/10" },
  "mono-light": { text: "text-background", textMuted: "text-background/50 hover:text-background", bg: "bg-foreground", border: "border-background/10" },
};

const menuEase = [0.76, 0, 0.24, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const linkVariants = {
  hidden: { y: 80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: menuEase },
  },
  exit: {
    y: -40,
    opacity: 0,
    transition: { duration: 0.4, ease: menuEase },
  },
};

const footerVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: menuEase, delay: 0.6 },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.3, ease: menuEase },
  },
};

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

export function FullscreenMenu({
  items,
  theme,
  selectTheme,
  onNavigate,
}: FullscreenMenuProps) {
  const colors = MENU_THEME[theme];

  const handleNavigate = (href: string) => {
    onNavigate();
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.8, ease: menuEase }}
      className={cn(
        "fixed inset-0 z-40 flex flex-col",
        colors.bg,
        colors.text,
      )}
    >
      {/* Main content area */}
      <div className="flex flex-1 flex-col justify-center px-8 pt-24 md:px-16 lg:px-24">
        <motion.nav
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ul className="flex flex-col gap-2 md:gap-3">
            {items.map((item, index) => (
              <motion.li key={item.href} variants={linkVariants}>
                <MenuLink
                  label={item.label}
                  href={item.href}
                  index={index}
                  onClick={handleNavigate}
                />
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </div>

      {/* Footer */}
      <motion.footer
        variants={footerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          "flex flex-col gap-4 border-t px-8 py-6 md:flex-row md:items-center md:justify-between md:px-16 lg:px-24",
          colors.border,
        )}
      >
        {/* Social links */}
        <div className="flex items-center gap-5">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("transition-colors duration-300", colors.textMuted)}
              aria-label={label}
              data-cursor-scale
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        {/* Theme toggle + email */}
        <div className="flex items-center gap-6">
          <a
            href="mailto:hello@aahad.dev"
            className={cn("text-sm transition-colors duration-300", colors.textMuted)}
            data-cursor-scale
          >
            hello@aahad.dev
          </a>
          <ThemeToggle theme={theme} selectTheme={selectTheme} />
        </div>
      </motion.footer>
    </motion.div>
  );
}
