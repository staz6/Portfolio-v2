import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectsHeading() {
  return (
    <SectionHeading
      number="02"
      label="Projects"
      words={["Selected", "Work"]}
      prefix="projects"
      className="pb-16 pt-24 lg:pb-24 lg:pt-40"
    />
  );
}
