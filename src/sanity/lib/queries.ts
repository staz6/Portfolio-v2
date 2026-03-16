export const PROFILE_QUERY = `
  *[_type == "profile"][0]{
    name,
    title,
    shortDescription,
    location,
    availability,
    stats {
      yearsExperience,
      completedProjects,
      satisfiedCustomers
    }
  }
`;

export const SOCIAL_LINKS_QUERY = `
  *[_type == "socialLinks"][0]{
    githubUrl,
    linkedinUrl
  }
`;

export const FOOTER_QUERY = `
  *[_type == "footerSettings"][0]{
    footerText
  }
`;

export const ABOUT_QUERY = `
  *[_type == "aboutSection"][0]{
    description,
    checkmarks[]{ text }
  }
`;

export const PROJECTS_QUERY = `
  *[_type == "project"] | order(order asc){
    name,
    slug,
    description,
    projectUrl,
    "thumbnail": thumbnail.asset->url,
    role,
    skills,
    order
  }
`;

export const EXPERIENCES_QUERY = `
  *[_type == "experience"] | order(startDate desc){
    companyName,
    position,
    startDate,
    endDate,
    highlights
  }
`;

export const SERVICES_QUERY = `
  *[_id == "service"][0]{
    items
  }
`;

export const REVIEWS_QUERY = `
  *[_type == "review"] | order(order asc){
    name,
    role,
    testimonial,
    "avatarUrl": avatar.asset->url,
    rating,
    order
  }
`;

export const SEO_QUERY = `
  *[_type == "seoSettings"][0]{
    metaDescription,
    metaKeywords,
    canonicalUrl,
    "ogImageUrl": ogImage.asset->url
  }
`;
