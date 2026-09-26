import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSiteLayout } from '@/layouts/SiteLayout';
import { useFetch } from '@/hooks/useFetch';
import { profileService } from '@/services/profile.service';
import { technologyService } from '@/services/technology.service';
import { projectService } from '@/services/project.service';
import { experienceService } from '@/services/experience.service';
import { educationService } from '@/services/education.service';
import { socialLinkService } from '@/services/socialLink.service';
import { decodeLayout, getVariant, presetLayout, resolveLayout } from '@/components/sections/registry';
import type { SectionProps } from '@/components/sections/shared';
import { PageSpinner } from '@/components/ui';
import { SectionViewport } from '@/components/sections/SectionViewport';
import './compactPortfolio.css';

export default function Home() {
  const [searchParams] = useSearchParams();
  const setCompactFooter = useSiteLayout()?.setCompactFooter;
  const { data: profile, isLoading: profileLoading } = useFetch(() => profileService.get(), []);
  const { data: technologies } = useFetch(() => technologyService.list(), []);
  const { data: projects, isLoading: projectsLoading } = useFetch(() => projectService.listPublic(), []);
  const { data: experiences } = useFetch(() => experienceService.list(), []);
  const { data: education } = useFetch(() => educationService.list(), []);
  const { data: socialLinks } = useFetch(() => socialLinkService.list(), []);

  // Admin "Preview" links: `?layout=hero.glass,about.stats,…` or `?template=studio` render
  // an unsaved layout without touching the saved one.
  const previewLayout = searchParams.get('layout');
  const previewTemplate = searchParams.get('template');
  const layout = previewLayout
    ? decodeLayout(previewLayout)
    : previewTemplate
      ? presetLayout(previewTemplate)
      : resolveLayout(profile?.layout, profile?.template);

  const hasContact = layout.some((s) => s.enabled && s.section === 'contact');
  useEffect(() => {
    setCompactFooter?.(hasContact);
    return () => setCompactFooter?.(false);
  }, [hasContact, setCompactFooter]);

  if (profileLoading) return <PageSpinner />;

  const props: SectionProps = {
    profile,
    technologies: technologies ?? [],
    projects: projects ?? [],
    projectsLoading,
    experiences: experiences ?? [],
    education: education ?? [],
    socialLinks: socialLinks ?? [],
  };

  return (
    <div className="portfolio-home">
      {layout
        .filter((s) => s.enabled)
        .map((s, i) => {
          const variant = getVariant(s.section, s.variant);
          if (!variant) return null;
          const { Component } = variant;
          return <SectionViewport key={`${s.section}-${s.variant}-${i}`} section={s.section} eager={i === 0}>
            <Component {...props} />
          </SectionViewport>;
        })}
    </div>
  );
}
