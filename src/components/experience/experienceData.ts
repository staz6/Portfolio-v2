export interface ExperienceData {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  highlights: string[];
  order: number;
  year: string;
}

export const EXPERIENCES: ExperienceData[] = [
  {
    companyName: "TechCorp",
    position: "Senior Frontend Engineer",
    startDate: "Mar 2024",
    endDate: null,
    isCurrent: true,
    highlights: [
      "Led migration of legacy app to Next.js 14, reducing load times by 60%",
      "Architected design system used by 12 product teams",
      "Mentored 4 junior developers through onboarding program",
    ],
    order: 1,
    year: "2024",
  },
  {
    companyName: "CloudBase",
    position: "Full Stack Developer",
    startDate: "Jan 2023",
    endDate: "Feb 2024",
    isCurrent: false,
    highlights: [
      "Built real-time collaboration features serving 50k+ daily users",
      "Reduced API response times by 40% with Redis caching layer",
      "Implemented CI/CD pipeline cutting deployment time from 45min to 8min",
    ],
    order: 2,
    year: "2023",
  },
  {
    companyName: "PixelForge",
    position: "Frontend Developer",
    startDate: "Jun 2021",
    endDate: "Dec 2022",
    isCurrent: false,
    highlights: [
      "Developed interactive data visualization dashboards with D3.js",
      "Shipped 3 client projects from concept to production",
      "Introduced component testing, reaching 85% coverage",
    ],
    order: 3,
    year: "2021",
  },
  {
    companyName: "StartupLab",
    position: "Junior Developer",
    startDate: "Aug 2020",
    endDate: "May 2021",
    isCurrent: false,
    highlights: [
      "Built MVP for fintech startup that secured $2M seed funding",
      "Integrated Stripe payments and KYC verification flows",
      "Collaborated with design team on responsive mobile-first UI",
    ],
    order: 4,
    year: "2020",
  },
];
