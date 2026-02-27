import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

interface LogoProps {
  menuOpen?: boolean;
}

export function Logo({ menuOpen = false }: LogoProps) {
  const magneticRef = useMagnetic<HTMLDivElement>({ strength: 0.3 });

  return (
    <div ref={magneticRef} className="relative z-50" data-nav-logo>
      <a href="#hero" data-cursor-scale>
        <motion.span
          className={cn(
            "font-heading text-xl font-black tracking-tighter transition-colors duration-500 lg:text-2xl",
            menuOpen ? "text-background" : "text-foreground",
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          AA<span className={menuOpen ? "text-background/60" : "text-primary"}>.</span>
        </motion.span>
      </a>
    </div>
  );
}
