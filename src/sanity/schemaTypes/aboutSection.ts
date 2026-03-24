import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutSection",
  title: "About Section",
  type: "document",
  fields: [
    defineField({
      name: "description",
      title: "About — Description",
      type: "array",
      description: "Rich text description for the about section.",
      validation: (rule) => rule.required(),
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "checkmarks",
      title: "About — Skill Badges",
      type: "array",
      description:
        "The small pill-shaped badges below the description (e.g., 'Full Stack Development', 'UI/UX Design').",
      of: [
        {
          type: "object",
          name: "checkmarkItem",
          fields: [
            defineField({
              name: "text",
              title: "Badge Text",
              type: "string",
              validation: (rule) => rule.required(),
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
    prepare() {
      return { title: "About Section" };
    },
  },
});
