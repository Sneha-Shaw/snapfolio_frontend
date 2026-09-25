import { useSearchParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { useTheme } from '@/context/ThemeContext';
import { profileService } from '@/services/profile.service';
import { technologyService } from '@/services/technology.service';
import { projectService } from '@/services/project.service';
import { experienceService } from '@/services/experience.service';
import { educationService } from '@/services/education.service';
import { socialLinkService } from '@/services/socialLink.service';
import { AuroraTemplate } from '@/components/templates/AuroraTemplate';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
import { BentoTemplate } from '@/components/templates/BentoTemplate';
import { TerminalTemplate } from '@/components/templates/TerminalTemplate';
import type { TemplateProps } from '@/components/templates/types';
import { PageSpinner } from '@/components/ui';
import type { SiteTemplate } from '@/types/models';

const TEMPLATES: Record<SiteTemplate, (props: TemplateProps) => React.JSX.Element> = {
  aurora: AuroraTemplate,
  minimal: MinimalTemplate,
  bento: BentoTemplate,
  terminal: TerminalTemplate,
};

export default function Home() {
  const { template: savedTemplate } = useTheme();
  const [searchParams] = useSearchParams();
  const { data: profile, isLoading: profileLoading } = useFetch(() => profileService.get(), []);
  const { data: technologies } = useFetch(() => technologyService.list(), []);
  const { data: projects, isLoading: projectsLoading } = useFetch(() => projectService.listPublic(), []);
  const { data: experiences } = useFetch(() => experienceService.list(), []);
  const { data: education } = useFetch(() => educationService.list(), []);
  const { data: socialLinks } = useFetch(() => socialLinkService.list(), []);

  if (profileLoading) return <PageSpinner />;

  // `?template=bento` previews a layout without saving it (used by the admin "Preview" links).
  const requested = searchParams.get('template') as SiteTemplate | null;
  const templateId = requested && requested in TEMPLATES ? requested : (profile?.template ?? savedTemplate);
  const Template = TEMPLATES[templateId] ?? AuroraTemplate;

  return (
    <Template
      profile={profile}
      technologies={technologies ?? []}
      projects={projects ?? []}
      projectsLoading={projectsLoading}
      experiences={experiences ?? []}
      education={education ?? []}
      socialLinks={socialLinks ?? []}
    />
  );
}
