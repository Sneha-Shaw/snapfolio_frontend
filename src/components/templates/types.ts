import type { Education, Experience, Profile, Project, SocialLink, Technology } from '@/types/models';

/** Everything a home-page template can render — fetched once by the Home page. */
export interface TemplateProps {
  profile: Profile | null;
  technologies: Technology[];
  projects: Project[];
  projectsLoading: boolean;
  experiences: Experience[];
  education: Education[];
  socialLinks: SocialLink[];
}
