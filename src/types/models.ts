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
  /** Footer design id; empty means the active preset's footer, else classic. */
  footer?: string;
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

/** super_admin runs the platform; user is a subscriber managing their own portfolio. */
export type Role = 'super_admin' | 'user';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Subscription plan id; absent for the super admin. */
  plan?: string;
  /** Trial / paid status; `active` false once the trial (or plan) has ended. */
  subscription: Subscription;
  /** Public address of the portfolio: /p/<username>. */
  username?: string;
  /** Whether anyone with the link can view the portfolio. */
  portfolioPublic: boolean;
  /** Chosen during onboarding; the builder leads with designs made for it. Empty until chosen. */
  profession: string;
}

export type PlanInterval = 'trial' | 'month' | 'year';

export interface Plan {
  id: 'trial' | 'monthly' | 'yearly';
  name: string;
  /** 0 for the trial; otherwise per `interval`, in `currency`. */
  price: number;
  /** ISO 4217, e.g. 'INR'. */
  currency: string;
  interval: PlanInterval;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

/** Where an account stands — computed by the API. */
export interface Subscription {
  plan: Plan['id'] | null;
  status: 'trialing' | 'active' | 'expired' | 'canceled' | 'none';
  /** Trial end, the next renewal date, or (canceled) the last day of access. */
  periodEnd: string | null;
  daysLeft: number | null;
  /** May use the service (edit, publish). */
  active: boolean;
  /** Monthly ↔ Yearly switch that takes effect at `periodEnd`. */
  pendingPlan: 'monthly' | 'yearly' | null;
  /** Canceled, still within the paid period — ends at `periodEnd` unless resumed. */
  cancelAtPeriodEnd: boolean;
  cardBrand?: string;
  cardLast4?: string;
}

/** An account as the super admin sees it. */
export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  subscription: Subscription | null;
  projects: number;
  createdAt: string;
}

export interface PlatformSummary {
  total: number;
  /** Paying (monthly + yearly). */
  activeSubscriptions: number;
  trialing: number;
  expired: number;
  currency: string;
  byPlan: Record<string, number>;
  mrr: number;
}
