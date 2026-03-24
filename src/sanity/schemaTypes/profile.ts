import { defineField, defineType } from "sanity";

export default defineType({
  name: "profile",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The large heading in the hero (e.g., 'Aahad').",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Professional Title",
      type: "string",
      description: "Subtitle under your name (e.g., 'Full Stack Developer').",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Description",
      type: "text",
      rows: 3,
      description: "The short paragraph below your name.",
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Location badge text (e.g., 'Karachi, Pakistan').",
    }),
    defineField({
      name: "availability",
      title: "Available for Work",
      type: "boolean",
      initialValue: true,
      description: "Controls the availability badge.",
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "object",
      description: "The 3 stat cards in the hero.",
      fields: [
        defineField({
          name: "yearsExperience",
          title: "Years of Experience",
          type: "number",
          validation: (rule) => rule.min(0),
        }),
        defineField({
          name: "completedProjects",
          title: "Completed Projects",
          type: "number",
          validation: (rule) => rule.min(0),
        }),
        defineField({
          name: "satisfiedCustomers",
          title: "Happy Clients",
          type: "number",
          validation: (rule) => rule.min(0),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "title",
    },
  },
});
