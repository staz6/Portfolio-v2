import { type SchemaTypeDefinition } from "sanity";

import profile from "./profile";
import aboutSection from "./aboutSection";
import seoSettings from "./seoSettings";
import project from "./project";
import experience from "./experience";
import skill from "./skill";
import service from "./service";
import review from "./review";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profile,
    aboutSection,
    seoSettings,
    project,
    experience,
    skill,
    service,
    review,
  ],
};
