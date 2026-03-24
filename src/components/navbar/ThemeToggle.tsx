import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, SunDim, Moon, Flame, Check } from "lucide-react";
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
}[] = [
  { value: "orange", label: "Orange Dark", icon: Flame },
  { value: "orange-light", label: "Orange Light", icon: SunDim },
  { value: "mono-dark", label: "Mono Dark", icon: Moon },
  { value: "mono-light", label: "Mono Light", icon: Sun },
];

const CURRENT_ICON: Record<Theme, React.ComponentType<{ className?: string }>> = {
  orange: Flame,
  "orange-light": SunDim,
  "mono-dark": Moon,
  "mono-light": Sun,
};

export function ThemeToggle({ theme, selectTheme }: ThemeToggleProps) {
  const [open, setOpen] = useState(false);
  const CurrentIcon = CURRENT_ICON[theme];

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
                className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-border bg-popover/80 p-1.5 shadow-lg backdrop-blur-xl"
              >
                {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <DropdownMenu.Item
                    key={value}
                    onSelect={() => selectTheme(value)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors",
                      value === theme
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    data-cursor-scale
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 font-medium">{label}</span>
                    {value === theme && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
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
