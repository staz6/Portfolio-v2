import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutSection",
  title: "About Section",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
      description: "The main about-me paragraph.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "checkmarks",
      title: "Highlight Checkmarks",
      type: "array",
      description: "Short highlight items displayed with checkmark icons.",
      of: [
        {
          type: "object",
          name: "checkmarkItem",
          fields: [
            defineField({
              name: "text",
              title: "Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "bgColor",
              title: "Background Color Class",
              type: "string",
              description:
                "Tailwind background color class (e.g., 'bg-blue-800').",
            }),
          ],
          preview: {
            select: { title: "text" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
