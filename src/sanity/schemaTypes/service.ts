import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Services (Marquee)",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Services",
      type: "array",
      description:
        "Add your services here. Drag to reorder — they appear in the hero marquee in this order.",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Services (Marquee)" };
    },
  },
});
