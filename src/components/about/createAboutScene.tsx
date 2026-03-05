import { Canvas } from "@react-three/fiber";
import { useState, useEffect, type ComponentType } from "react";
import type { Theme } from "@/hooks/useTheme";

const SCENE_COLORS: Record<Theme, string> = {
  orange: "#ff6b2b",
  "orange-light": "#c45a20",
  "mono-dark": "#b0b0b0",
  "mono-light": "#333333",
};

interface SphereProps {
  color: string;
  entered?: boolean;
}

/**
 * Factory that creates a themed About scene wrapper for any sphere component.
 * Avoids duplicating the theme sync + entrance event logic across V3–V6.
 */
export function createAboutScene(
  SphereComponent: ComponentType<SphereProps>,
  options?: { lights?: boolean },
) {
  return function AboutSceneVariant() {
    const [color, setColor] = useState(SCENE_COLORS.orange);
    const [entered, setEntered] = useState(false);

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

    useEffect(() => {
      const handler = () => setEntered(true);
      window.addEventListener("about-scene-enter", handler);
      return () => window.removeEventListener("about-scene-enter", handler);
    }, []);

    return (
      <div data-about-scene className="h-full w-full">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          frameloop="demand"
          dpr={[1, 1.25]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          {options?.lights && (
            <>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={0.3} />
            </>
          )}
          <SphereComponent color={color} entered={entered} />
        </Canvas>
      </div>
    );
  };
}
