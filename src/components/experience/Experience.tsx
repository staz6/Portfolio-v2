import { ExperienceHeading } from "./ExperienceHeading";
import { useExperienceAnimations } from "./useExperienceAnimations";
import { OrbitalSystem } from "./versions/OrbitalSystem";
import type { ExperienceProps as ExperienceItemProps } from "@/sanity/lib/mappers";

interface ExperienceSectionProps {
  experiences?: ExperienceItemProps[];
}

export function Experience({ experiences = [] }: ExperienceSectionProps) {
  const sectionRef = useExperienceAnimations();

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative overflow-x-hidden bg-background"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 lg:px-10 lg:pt-40">
        <ExperienceHeading />
      </div>

      <div data-exp-content className="relative z-10 mt-10 opacity-0">
        <OrbitalSystem experiences={experiences} />
      </div>
    </section>
  );
}
