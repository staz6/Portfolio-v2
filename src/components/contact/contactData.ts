export interface SocialLink {
  label: string;
  url: string;
  icon: "github" | "linkedin" | "twitter" | "dribbble";
}

export const CONTACT_EMAIL = "hello@aahad.dev";

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", url: "https://github.com", icon: "github" },
  { label: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
  { label: "Twitter", url: "https://x.com", icon: "twitter" },
  { label: "Dribbble", url: "https://dribbble.com", icon: "dribbble" },
];
