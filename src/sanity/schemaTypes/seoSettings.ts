import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      description: "The title shown in browser tabs and search results (e.g., 'Aahad | Senior Full Stack Engineer').",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Default meta description for the site. Recommended: 150-160 characters.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "metaKeywords",
      title: "Meta Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Keywords for SEO (e.g., React, Node.js, Full Stack Developer).",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description: "The main URL of the site (e.g., 'https://aahad.dev').",
      validation: (rule) => rule.uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
      description: "Your full name for meta tags and structured data.",
    }),
    defineField({
      name: "jobTitle",
      title: "Job Title",
      type: "string",
      description: "Your professional title for structured data (e.g., 'Senior Full Stack Engineer').",
    }),
    defineField({
      name: "skills",
      title: "Key Skills",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Top skills for structured data (e.g., React, Node.js, TypeScript).",
    }),
    defineField({
      name: "socialProfiles",
      title: "Social Profile URLs",
      type: "array",
      of: [{ type: "url" }],
      description: "Your social media profile URLs for structured data (GitHub, LinkedIn, etc.).",
    }),
  ],
  preview: {
    prepare() {
      return { title: "SEO Settings" };
    },
  },
});
