import { defineField, defineType } from "sanity";

export default defineType({
  name: "footerSettings",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
      description: "Text displayed in the footer (e.g., '© 2026 Aahad. All rights reserved.').",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Footer" };
    },
  },
});
