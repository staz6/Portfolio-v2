import { defineField, defineType } from "sanity";

export default defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Skill Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      description: "Used for filtering projects by skill.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Skill Icon",
      type: "image",
      options: { hotspot: true },
      description: "Logo/icon for this technology.",
    }),
    defineField({
      name: "proficiency",
      title: "Proficiency",
      type: "number",
      description: "Proficiency level from 0 to 100.",
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Frontend", value: "frontend" },
          { title: "Backend", value: "backend" },
          { title: "Database", value: "database" },
          { title: "DevOps", value: "devops" },
          { title: "Design", value: "design" },
          { title: "Other", value: "other" },
        ],
        layout: "dropdown",
      },
      description: "Category for grouping/filtering skills.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Proficiency (Highest First)",
      name: "proficiencyDesc",
      by: [{ field: "proficiency", direction: "desc" }],
    },
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "icon",
    },
  },
});
