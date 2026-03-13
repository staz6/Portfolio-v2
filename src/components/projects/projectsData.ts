export interface ProjectData {
  name: string;
  slug: { current: string };
  description: string;
  projectUrl: string;
  thumbnail: string;
  role: string;
  skills: string[];
  order: number;
}
