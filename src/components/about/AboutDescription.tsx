import { PortableText } from "@portabletext/react";

const DEFAULT_CONTENT = [
  "I'm a full-stack developer based in Karachi, Pakistan, with over 5 years of experience building modern web applications.",
  "I specialize in React, Next.js, and Node.js ecosystems, with a passion for creating interfaces that are both visually compelling and technically robust.",
  "I believe great software is built at the intersection of clean code, thoughtful design, and relentless attention to detail.",
];

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <div className="overflow-hidden">
        <p
          data-about-line
          className="text-sm leading-relaxed text-muted-foreground md:text-base"
        >
          {children}
        </p>
      </div>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc pl-5 space-y-1">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal pl-5 space-y-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em>{children}</em>
    ),
  },
};

export function AboutDescription({ description }: { description?: any[] | null }) {
  if (description?.length) {
    return (
      <div data-about-bio className="flex flex-col gap-4">
        <PortableText value={description} components={portableTextComponents} />
      </div>
    );
  }

  return (
    <div data-about-bio className="flex flex-col gap-4">
      {DEFAULT_CONTENT.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <p
            data-about-line
            className="text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            {line}
          </p>
        </div>
      ))}
    </div>
  );
}
