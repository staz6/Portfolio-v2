import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, SunDim, Moon, Flame, Check, Zap, Sparkles, Palette } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import type { Theme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  selectTheme: (theme: Theme) => void;
}

const THEME_OPTIONS: {
  value: Theme;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "classic" | "neon" | "gradient";
}[] = [
  { value: "orange", label: "Orange Dark", icon: Flame, group: "classic" },
  { value: "orange-light", label: "Orange Light", icon: SunDim, group: "classic" },
  { value: "mono-dark", label: "Mono Dark", icon: Moon, group: "classic" },
  { value: "mono-light", label: "Mono Light", icon: Sun, group: "classic" },
  { value: "neon-cyan", label: "Neon Cyan", icon: Zap, group: "neon" },
  { value: "neon-pink", label: "Neon Pink", icon: Sparkles, group: "neon" },
  { value: "neon-green", label: "Neon Green", icon: Zap, group: "neon" },
  { value: "neon-coral", label: "Neon Coral", icon: Flame, group: "neon" },
  { value: "gradient-aurora", label: "Cyber Aurora", icon: Palette, group: "gradient" },
  { value: "gradient-sunset", label: "Neon Sunset", icon: Palette, group: "gradient" },
  { value: "gradient-holo", label: "Holographic", icon: Palette, group: "gradient" },
  { value: "gradient-plasma", label: "Plasma Blaze", icon: Palette, group: "gradient" },
];

const CURRENT_ICON: Record<Theme, React.ComponentType<{ className?: string }>> = {
  orange: Flame,
  "orange-light": SunDim,
  "mono-dark": Moon,
  "mono-light": Sun,
  "neon-cyan": Zap,
  "neon-pink": Sparkles,
  "neon-green": Zap,
  "neon-coral": Flame,
  "gradient-aurora": Palette,
  "gradient-sunset": Palette,
  "gradient-holo": Palette,
  "gradient-plasma": Palette,
};

export function ThemeToggle({ theme, selectTheme }: ThemeToggleProps) {
  const [open, setOpen] = useState(false);
  const CurrentIcon = CURRENT_ICON[theme];

  const classicThemes = THEME_OPTIONS.filter((t) => t.group === "classic");
  const neonThemes = THEME_OPTIONS.filter((t) => t.group === "neon");
  const gradientThemes = THEME_OPTIONS.filter((t) => t.group === "gradient");

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-md",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
            "transition-colors",
          )}
          aria-label="Change theme"
          data-cursor-scale
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentIcon className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>
          </AnimatePresence>
        </button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              asChild
              align="end"
              sideOffset={8}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="z-50 min-w-[200px] overflow-hidden rounded-xl border border-border bg-popover/80 p-1.5 shadow-lg backdrop-blur-xl"
              >
                {/* Classic themes */}
                <div className="px-2 pb-1 pt-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Classic</span>
                </div>
                {classicThemes.map(({ value, label, icon: Icon }) => (
                  <DropdownMenu.Item
                    key={value}
                    onSelect={() => selectTheme(value)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none transition-colors",
                      value === theme
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    data-cursor-scale
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 font-medium">{label}</span>
                    {value === theme && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </DropdownMenu.Item>
                ))}

                {/* Divider */}
                <div className="my-1.5 h-px bg-border/40" />

                {/* Neon themes */}
                <div className="px-2 pb-1 pt-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Neon</span>
                </div>
                {neonThemes.map(({ value, label, icon: Icon }) => (
                  <DropdownMenu.Item
                    key={value}
                    onSelect={() => selectTheme(value)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none transition-colors",
                      value === theme
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    data-cursor-scale
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 font-medium">{label}</span>
                    {value === theme && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </DropdownMenu.Item>
                ))}

                {/* Divider */}
                <div className="my-1.5 h-px bg-border/40" />

                {/* Gradient themes */}
                <div className="px-2 pb-1 pt-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Gradient</span>
                </div>
                {gradientThemes.map(({ value, label, icon: Icon }) => (
                  <DropdownMenu.Item
                    key={value}
                    onSelect={() => selectTheme(value)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none transition-colors",
                      value === theme
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    data-cursor-scale
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 font-medium">{label}</span>
                    {value === theme && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </DropdownMenu.Item>
                ))}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
