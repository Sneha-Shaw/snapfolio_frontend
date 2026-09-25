export type TechCategory = 'frontend' | 'backend' | 'database' | 'ai-data' | 'devops' | 'language' | 'tooling';

export const TECH_CATEGORIES: TechCategory[] = [
  'frontend',
  'backend',
  'database',
  'ai-data',
  'devops',
  'language',
  'tooling',
];

export interface Technology {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  category: TechCategory;
  documentationUrl: string;
  enabled: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  _id?: string;
  url: string;
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  displayOrder: number;
}

export interface ProjectThumbnail {
  url: string;
  publicId: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: ProjectThumbnail;
  images: ProjectImage[];
  featured: boolean;
  published: boolean;
  displayOrder: number;
  year: number;
  role: string;
  liveUrl: string;
  githubUrl: string;
  challenges: string;
  solution: string;
  results: string;
  technologies: Technology[];
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  _id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: Technology[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  _id: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  profileImage: { url: string; publicId: string };
  resumeUrl: string;
  availability: string;
  heroEyebrow: string;
  heroStatement: string;
  heroCurrently: string;
  heroTimezone: string;
  aboutText: string;
  focusAreas: string[];
  services: Service[];
  testimonials: Testimonial[];
  theme: SiteTheme;
  template: SiteTemplate;
  layout: LayoutSection[];
  createdAt: string;
  updatedAt: string;
}

export type SiteFont = 'sans' | 'grotesk' | 'serif' | 'mono';
export type SiteRadius = 'sharp' | 'rounded' | 'soft';
/** Id of a layout preset (see `LAYOUT_PRESETS`), or 'custom'. */
export type SiteTemplate = string;

export type SiteSection =
  | 'hero'
  | 'about'
  | 'projects'
  | 'experience'
  | 'education'
  | 'skills'
  | 'services'
  | 'stats'
  | 'testimonials'
  | 'gallery'
  | 'contact'
  | 'divider';

export interface Service {
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl: string;
}

export interface LayoutSection {
  section: SiteSection;
  variant: string;
  enabled: boolean;
}

export interface SiteTheme {
  preset?: string;
  accent: string;
  accentStrong: string;
  background: string;
  font?: SiteFont;
  radius?: SiteRadius;
}

export type SocialPlatform = 'github' | 'linkedin' | 'email' | 'twitter' | 'portfolio' | 'other';

export const SOCIAL_PLATFORMS: SocialPlatform[] = ['github', 'linkedin', 'email', 'twitter', 'portfolio', 'other'];

export interface SocialLink {
  _id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  icon: string;
  displayOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  featuredProjects: number;
  totalTechnologies: number;
  totalExperience: number;
  recentProjects: Pick<Project, '_id' | 'title' | 'slug' | 'published' | 'featured' | 'updatedAt' | 'thumbnail'>[];
}
