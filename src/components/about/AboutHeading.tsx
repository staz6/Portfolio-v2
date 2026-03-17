import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutHeading() {
  return (
    <SectionHeading
      number="01"
      label="About"
      words={["Crafting", "Digital", "Experiences"]}
      prefix="about"
      headingClassName="font-heading text-4xl font-bold leading-[0.95] tracking-tight md:text-5xl lg:text-6xl"
    />
  );
}
