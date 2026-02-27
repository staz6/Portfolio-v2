import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import type { NavItem } from "./Navbar";
import { MenuLink } from "./MenuLink";
import { ThemeToggle } from "./ThemeToggle";

interface FullscreenMenuProps {
  items: readonly NavItem[];
  activeSection: string;
  theme: "dark" | "light";
  toggleTheme: () => void;
  onNavigate: () => void;
}

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
  toggleTheme,
  onNavigate,
}: FullscreenMenuProps) {
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
      className="fixed inset-0 z-40 flex flex-col bg-foreground text-background"
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
        className="flex flex-col gap-4 border-t border-background/10 px-8 py-6 md:flex-row md:items-center md:justify-between md:px-16 lg:px-24"
      >
        {/* Social links */}
        <div className="flex items-center gap-5">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/50 transition-colors duration-300 hover:text-background"
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
            className="text-sm text-background/50 transition-colors duration-300 hover:text-background"
            data-cursor-scale
          >
            hello@aahad.dev
          </a>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </motion.footer>
    </motion.div>
  );
}
