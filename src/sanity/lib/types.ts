export interface SanityProfile {
  name: string;
  title: string;
  shortDescription: string;
  location: string;
  availability: boolean;
  stats: {
    yearsExperience: number;
    completedProjects: number;
    satisfiedCustomers: number;
  } | null;
}

export interface SanitySocialLinks {
  githubUrl: string | null;
  linkedinUrl: string | null;
}

export interface SanityFooterSettings {
  footerText: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextBlock = any;

export interface SanityAboutSection {
  description: PortableTextBlock[] | null;
  checkmarks: { text: string }[] | null;
}

export interface SanityProject {
  name: string;
  slug: { current: string };
  description: string;
  projectUrl: string;
  thumbnail: string;
  role: string;
  skills: string[] | null;
  order: number;
}

export interface SanityExperience {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  highlights: string[] | null;
}

export interface SanityService {
  items: string[] | null;
}

export interface SanityReview {
  name: string;
  role: string | null;
  testimonial: string;
  avatarUrl: string | null;
  rating: number | null;
  order: number;
}

export interface SanitySeoSettings {
  metaDescription: string | null;
  metaKeywords: string[] | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
}
