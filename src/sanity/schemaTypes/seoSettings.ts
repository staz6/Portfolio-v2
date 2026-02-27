import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "document",
  fields: [
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description:
        "Default meta description for the site. Recommended: 150-160 characters.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "metaKeywords",
      title: "Meta Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Keywords for SEO.",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description:
        "The canonical URL of the site (e.g., 'https://aahad.dev').",
      validation: (rule) => rule.uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      description: "Default social sharing image. Recommended: 1200x630px.",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: "SEO Settings" };
    },
  },
});
