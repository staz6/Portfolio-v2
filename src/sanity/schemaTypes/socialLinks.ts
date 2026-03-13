import { defineField, defineType } from "sanity";

export default defineType({
  name: "socialLinks",
  title: "Social Links",
  type: "document",
  fields: [
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      description: "Full URL to your GitHub profile.",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      description: "Full URL to your LinkedIn profile.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Social Links" };
    },
  },
});
