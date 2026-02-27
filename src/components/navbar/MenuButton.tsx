import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MenuButton({ isOpen, onClick }: MenuButtonProps) {
  const magneticRef = useMagnetic<HTMLDivElement>({ strength: 0.4 });

  return (
    <div ref={magneticRef} className="relative z-[60]" data-menu-button>
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 hover:scale-110",
          isOpen
            ? "bg-background text-foreground"
            : "bg-foreground text-background",
        )}
        data-cursor-scale
      >
        <div className="relative flex h-[10px] w-5 flex-col justify-between">
          <motion.span
            className={cn(
              "block h-[1.5px] w-full origin-center transition-colors duration-500",
              isOpen ? "bg-foreground" : "bg-background",
            )}
            animate={
              isOpen
                ? { rotate: 45, y: 4.25 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.span
            className={cn(
              "block h-[1.5px] w-full origin-center transition-colors duration-500",
              isOpen ? "bg-foreground" : "bg-background",
            )}
            animate={
              isOpen
                ? { rotate: -45, y: -4.25 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          />
        </div>
      </button>
    </div>
  );
}
