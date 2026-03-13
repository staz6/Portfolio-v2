import type {
  SanityProfile,
  SanitySocialLinks,
  SanityFooterSettings,
  SanityAboutSection,
  SanityProject,
  SanityExperience,
  SanityService,
  SanityReview,
  PortableTextBlock,
} from "./types";

// ── Hero ───────────────────────────────────────────────────────

export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
}

export interface HeroSocial {
  href: string;
  label: string;
  icon: "github" | "linkedin";
}

export interface HeroProps {
  name: string;
  title: string;
  bio: string;
  location: string;
  availability: boolean;
  stats: HeroStat[];
  socials: HeroSocial[];
}

export function mapProfileToHeroProps(
  profile: SanityProfile,
  socialLinks: SanitySocialLinks | null,
): HeroProps {
  const stats: HeroStat[] = [];
  if (profile.stats?.yearsExperience != null) {
    stats.push({ value: profile.stats.yearsExperience, suffix: "+", label: "Years Experience" });
  }
  if (profile.stats?.completedProjects != null) {
    stats.push({ value: profile.stats.completedProjects, suffix: "+", label: "Projects Completed" });
  }
  if (profile.stats?.satisfiedCustomers != null) {
    stats.push({ value: profile.stats.satisfiedCustomers, suffix: "+", label: "Happy Clients" });
  }

  const socials: HeroSocial[] = [];
  if (socialLinks?.githubUrl) socials.push({ href: socialLinks.githubUrl, label: "GitHub", icon: "github" });
  if (socialLinks?.linkedinUrl) socials.push({ href: socialLinks.linkedinUrl, label: "LinkedIn", icon: "linkedin" });

  return {
    name: profile.name,
    title: profile.title,
    bio: profile.shortDescription,
    location: profile.location,
    availability: profile.availability ?? true,
    stats,
    socials,
  };
}

// ── About ──────────────────────────────────────────────────────

export interface AboutProps {
  description: PortableTextBlock[] | null;
  highlights: { text: string }[];
}

export function mapAboutToProps(about: SanityAboutSection): AboutProps {
  return {
    description: about.description,
    highlights: about.checkmarks ?? [],
  };
}

// ── Projects ───────────────────────────────────────────────────

export interface ProjectProps {
  name: string;
  slug: { current: string };
  description: string;
  projectUrl: string;
  thumbnail: string;
  role: string;
  skills: string[];
  order: number;
}

export function mapProjects(projects: SanityProject[]): ProjectProps[] {
  return projects.map((p) => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    projectUrl: p.projectUrl,
    thumbnail: p.thumbnail,
    role: p.role,
    skills: p.skills ?? [],
    order: p.order,
  }));
}

// ── Experience ─────────────────────────────────────────────────

export interface ExperienceProps {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  highlights: string[];
  order: number;
  year: string;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function mapExperiences(experiences: SanityExperience[]): ExperienceProps[] {
  return experiences.map((e) => ({
    companyName: e.companyName,
    position: e.position,
    startDate: formatDate(e.startDate),
    endDate: e.endDate ? formatDate(e.endDate) : null,
    isCurrent: e.isCurrent,
    highlights: e.highlights ?? [],
    order: e.order,
    year: new Date(e.startDate + "T00:00:00").getFullYear().toString(),
  }));
}

// ── Contact ────────────────────────────────────────────────────

export interface ContactSocialLink {
  label: string;
  url: string;
  icon: "github" | "linkedin";
}

export interface ContactProps {
  socialLinks: ContactSocialLink[];
  footerText: string | null;
}

export function mapToContactProps(
  socialLinks: SanitySocialLinks | null,
  footer: SanityFooterSettings | null,
): ContactProps {
  const links: ContactSocialLink[] = [];
  if (socialLinks?.githubUrl) links.push({ label: "GitHub", url: socialLinks.githubUrl, icon: "github" });
  if (socialLinks?.linkedinUrl) links.push({ label: "LinkedIn", url: socialLinks.linkedinUrl, icon: "linkedin" });

  return {
    socialLinks: links,
    footerText: footer?.footerText ?? null,
  };
}

// ── Reviews ────────────────────────────────────────────────────

export interface ReviewProps {
  name: string;
  role: string;
  testimonial: string;
  avatarUrl: string | null;
  rating: number;
}

export function mapReviews(reviews: SanityReview[]): ReviewProps[] {
  return reviews.map((r) => ({
    name: r.name,
    role: r.role || "",
    testimonial: r.testimonial,
    avatarUrl: r.avatarUrl,
    rating: r.rating ?? 5,
  }));
}

// ── Services (for HeroMarquee) ─────────────────────────────────

export function mapServices(services: SanityService): string[] {
  return services.items ?? [];
}
