import { useState, useEffect, useRef } from "react";

interface ScrollDirectionState {
  direction: "up" | "down" | null;
  isAtTop: boolean;
}

export function useScrollDirection(threshold = 50): ScrollDirectionState {
  const [state, setState] = useState<ScrollDirectionState>({
    direction: null,
    isAtTop: true,
  });

  const lastScrollY = useRef(0);
  const deadzone = 5;

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (Math.abs(delta) > deadzone) {
        setState({
          direction: delta > 0 ? "down" : "up",
          isAtTop: currentY <= threshold,
        });
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return state;
}
