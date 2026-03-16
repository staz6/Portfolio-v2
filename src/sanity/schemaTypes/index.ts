import { type SchemaTypeDefinition } from "sanity";

import profile from "./profile";
import aboutSection from "./aboutSection";
import socialLinks from "./socialLinks";
import footerSettings from "./footerSettings";
import seoSettings from "./seoSettings";
import project from "./project";
import experience from "./experience";
import service from "./service";
import review from "./review";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profile,
    aboutSection,
    socialLinks,
    footerSettings,
    seoSettings,
    project,
    experience,
    service,
    review,
  ],
};
