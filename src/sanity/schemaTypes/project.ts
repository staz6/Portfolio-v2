import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Project Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Project Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectUrl",
      title: "Live Project URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: { hotspot: true },
      description: "Main image displayed in the project list.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "My Role",
      type: "string",
      description: "Your role in this project (e.g., 'Full Stack Developer').",
    }),
    defineField({
      name: "skills",
      title: "Technologies Used",
      type: "array",
      of: [{ type: "string" }],
      description: "Type a skill name and press enter (e.g., React, Node.js, Stripe).",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first. Each project must have a unique number.",
      validation: (rule) =>
        rule.required().custom(async (value, context) => {
          if (value === undefined) return true;
          const client = context.getClient({ apiVersion: "2024-01-01" });
          const id = context.document?._id?.replace(/^drafts\./, "");
          const conflicts = await client.fetch<{ name: string }[]>(
            `*[_type == "project" && order == $order && !(_id in [$id, "drafts." + $id])]{ name }`,
            { order: value, id },
          );
          return conflicts.length > 0
            ? `Order ${value} is already used by "${conflicts[0].name}".`
            : true;
        }),
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "thumbnail",
    },
  },
});
