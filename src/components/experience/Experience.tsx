import { useState, useEffect } from "react";
import { ExperienceHeading } from "./ExperienceHeading";
import { useExperienceAnimations } from "./useExperienceAnimations";
import { VersionSwitcher, type VersionId } from "./VersionSwitcher";
import { Timeline3D } from "./versions/Timeline3D";
import { OrbitalSystem } from "./versions/OrbitalSystem";
import { Carousel3D } from "./versions/Carousel3D";
import { CurrentCinematic } from "./versions/CurrentCinematic";
import type { ExperienceProps as ExperienceItemProps } from "@/sanity/lib/mappers";

interface ExperienceSectionProps {
  experiences?: ExperienceItemProps[];
}

export function Experience({ experiences = [] }: ExperienceSectionProps) {
  const sectionRef = useExperienceAnimations();
  const [version, setVersion] = useState<VersionId>("timeline");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {!isMobile && <VersionSwitcher active={version} onChange={setVersion} />}

      <section
        ref={sectionRef}
        id="experience"
        className="relative overflow-hidden bg-background"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 lg:px-10 lg:pt-40">
          <ExperienceHeading />
        </div>

        <div className="relative z-10 mt-10">
          {isMobile ? (
            <Timeline3D experiences={experiences} />
          ) : (
            <>
              {version === "timeline" && <Timeline3D experiences={experiences} />}
              {version === "orbital" && <OrbitalSystem experiences={experiences} />}
              {version === "carousel" && <Carousel3D experiences={experiences} />}
              {version === "cinematic" && <CurrentCinematic experiences={experiences} />}
            </>
          )}
        </div>
      </section>
    </>
  );
}
