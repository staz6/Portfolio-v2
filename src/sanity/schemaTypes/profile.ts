import { defineField, defineType } from "sanity";

export default defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nameAcronym",
      title: "Name Acronym",
      type: "string",
      description: "Short acronym or initials (e.g., 'AA'). Used in logo/branding.",
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: "title",
      title: "Professional Title",
      type: "string",
      description:
        "Your role/title displayed in the hero section (e.g., 'Full Stack Developer').",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Bio",
      type: "text",
      rows: 3,
      description: "A brief bio for the hero section.",
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City, Country (e.g., 'Karachi, Pakistan').",
    }),
    defineField({
      name: "availability",
      title: "Available for Work",
      type: "boolean",
      initialValue: true,
      description: "Toggle to show/hide availability badge on the site.",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "object",
      description: "Numerical stats displayed on the site.",
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
          title: "Satisfied Customers",
          type: "number",
          validation: (rule) => rule.min(0),
        }),
        defineField({
          name: "websitesLaunched",
          title: "Websites Launched",
          type: "number",
          validation: (rule) => rule.min(0),
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "text",
      rows: 2,
      description: "Custom text displayed in the site footer.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "title",
      media: "profileImage",
    },
  },
});
