import { Canvas } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import type { Theme } from "@/hooks/useTheme";
import { AboutSphere } from "./AboutSphere";

const SCENE_COLORS: Record<Theme, string> = {
  orange: "#ff6b2b",
  "orange-light": "#c45a20",
  "mono-dark": "#b0b0b0",
  "mono-light": "#333333",
};

export function AboutScene() {
  const [color, setColor] = useState(SCENE_COLORS.orange);
  const [entered, setEntered] = useState(false);

  // Theme sync
  useEffect(() => {
    const updateFromTheme = () => {
      const theme = (document.documentElement.getAttribute("data-theme") ?? "orange") as Theme;
      setColor(SCENE_COLORS[theme] ?? SCENE_COLORS.orange);
    };
    updateFromTheme();

    const observer = new MutationObserver(updateFromTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Listen for entrance event from GSAP ScrollTrigger
  useEffect(() => {
    const handler = () => setEntered(true);
    window.addEventListener("about-scene-enter", handler);
    return () => window.removeEventListener("about-scene-enter", handler);
  }, []);

  // Pause canvas when off-screen
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} data-about-scene className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <AboutSphere color={color} entered={entered} />
      </Canvas>
    </div>
  );
}
