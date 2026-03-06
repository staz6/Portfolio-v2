export interface ProjectData {
  name: string;
  slug: { current: string };
  description: string;
  projectUrl: string;
  thumbnail: string;
  role: string;
  skills: string[];
  featured: boolean;
  order: number;
  accentColor: string;
}

export const PROJECTS: ProjectData[] = [
  {
    name: "Apex Dashboard",
    slug: { current: "apex-dashboard" },
    description:
      "A real-time analytics dashboard for SaaS metrics with customizable widgets, live data streaming, and AI-powered insights.",
    projectUrl: "https://example.com",
    thumbnail: "https://picsum.photos/1920/1080?random=1",
    role: "Full Stack Developer",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "WebSocket"],
    featured: true,
    order: 1,
    accentColor: "#1a1a2e",
  },
  {
    name: "Nova Commerce",
    slug: { current: "nova-commerce" },
    description:
      "High-performance headless e-commerce platform with server-side rendering, dynamic pricing engine, and seamless payment integrations.",
    projectUrl: "https://example.com",
    thumbnail: "https://picsum.photos/1920/1080?random=2",
    role: "Lead Developer",
    skills: ["Next.js", "Stripe", "Prisma", "Redis", "Tailwind CSS"],
    featured: true,
    order: 2,
    accentColor: "#0a192f",
  },
  {
    name: "Pulse Social",
    slug: { current: "pulse-social" },
    description:
      "A modern social networking app with real-time messaging, story feeds, content moderation, and scalable microservices architecture.",
    projectUrl: "https://example.com",
    thumbnail: "https://picsum.photos/1920/1080?random=3",
    role: "Full Stack Developer",
    skills: ["React Native", "GraphQL", "AWS", "MongoDB", "Docker"],
    featured: true,
    order: 3,
    accentColor: "#16213e",
  },
  {
    name: "Vertex Studio",
    slug: { current: "vertex-studio" },
    description:
      "Browser-based 3D design tool with collaborative editing, real-time preview, and WebGL-powered rendering engine.",
    projectUrl: "https://example.com",
    thumbnail: "https://picsum.photos/1920/1080?random=4",
    role: "Frontend Architect",
    skills: ["Three.js", "React", "WebGL", "TypeScript", "Zustand"],
    featured: true,
    order: 4,
    accentColor: "#1b1b2f",
  },
  {
    name: "Orbit Finance",
    slug: { current: "orbit-finance" },
    description:
      "Personal finance management app with budgeting tools, investment tracking, bank sync, and intelligent spending insights.",
    projectUrl: "https://example.com",
    thumbnail: "https://picsum.photos/1920/1080?random=5",
    role: "Full Stack Developer",
    skills: ["Vue.js", "Python", "FastAPI", "Plaid API", "PostgreSQL"],
    featured: true,
    order: 5,
    accentColor: "#0d1b2a",
  },
];
