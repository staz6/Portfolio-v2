import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./src/sanity/schemaTypes";

const SINGLETON_TYPES = new Set(["profile", "aboutSection", "socialLinks", "footerSettings", "service", "seoSettings"]);

export default defineConfig({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Hero Section")
              .id("profile")
              .child(
                S.document().schemaType("profile").documentId("profile"),
              ),
            S.listItem()
              .title("About Section")
              .id("aboutSection")
              .child(
                S.document()
                  .schemaType("aboutSection")
                  .documentId("aboutSection"),
              ),
            S.listItem()
              .title("Social Links")
              .id("socialLinks")
              .child(
                S.document()
                  .schemaType("socialLinks")
                  .documentId("socialLinks"),
              ),
            S.listItem()
              .title("Services (Marquee)")
              .id("service")
              .child(
                S.document()
                  .schemaType("service")
                  .documentId("service"),
              ),
            S.listItem()
              .title("Footer")
              .id("footerSettings")
              .child(
                S.document()
                  .schemaType("footerSettings")
                  .documentId("footerSettings"),
              ),
            S.listItem()
              .title("SEO Settings")
              .id("seoSettings")
              .child(
                S.document()
                  .schemaType("seoSettings")
                  .documentId("seoSettings"),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !SINGLETON_TYPES.has(listItem.getId() ?? ""),
            ),
          ]),
    }),
  ],
  schema: {
    ...schema,
    templates: (templates) =>
      templates.filter((template) => !SINGLETON_TYPES.has(template.id)),
  },
});
