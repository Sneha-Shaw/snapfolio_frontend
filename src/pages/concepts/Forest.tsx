import { useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { profileService } from '@/services/profile.service';
import { technologyService } from '@/services/technology.service';
import { projectService } from '@/services/project.service';
import { experienceService } from '@/services/experience.service';
import { socialLinkService } from '@/services/socialLink.service';
import { PageSpinner } from '@/components/ui';
import {
  ForestArrival,
  ForestClearing,
  ForestCloserLook,
  ForestDiscoveries,
  ForestExit,
  ForestFinalScene,
  ForestGrove,
  ForestPhilosophy,
  ForestPlayground,
  ForestRings,
} from './forest/sections';
import './forest.css';
import '../compactPortfolio.css';

/**
 * Forest — a standalone flagship concept experience, reachable at
 * `/concepts/forest`. Deliberately outside `SiteLayout`: this page owns its
 * entire chrome (its own minimal nav, its own footer/final-scene), because
 * the brief this was built against treats "arrival" and "exit" as the first
 * and last beats of one continuous piece, not a page dropped between a
 * shared navbar and a shared footer.
 *
 * The swappable section registry (components/sections/*) stays untouched —
 * this reuses only its pure data helpers (statementLines, groupTech, …),
 * never its section components, so nothing here can drift the rest of the
 * site and nothing in the rest of the site can flatten this into "generic
 * page + green theme."
 */
export default function Forest() {
  const { data: profile, isLoading: profileLoading } = useFetch(() => profileService.get(), []);
  const { data: technologies } = useFetch(() => technologyService.list(), []);
  const { data: projects, isLoading: projectsLoading } = useFetch(() => projectService.listPublic(), []);
  const { data: experiences } = useFetch(() => experienceService.list(), []);
  const { data: socialLinks } = useFetch(() => socialLinkService.list(), []);

  // Anchor links (Enter the grove / Read the field notes) should glide, not
  // jump — scoped to this page's lifetime only.
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  if (profileLoading) return <PageSpinner />;

  const exps = experiences ?? [];

  return (
    <div className="forest-page" id="top">
      <ForestArrival profile={profile} />
      <ForestClearing profile={profile} experiences={exps} />
      <ForestDiscoveries projects={projects ?? []} projectsLoading={projectsLoading} />
      <ForestCloserLook projects={projects ?? []} projectsLoading={projectsLoading} />
      <ForestGrove technologies={technologies ?? []} />
      <ForestRings experiences={exps} />
      <ForestPhilosophy profile={profile} />
      <ForestPlayground />
      <ForestExit profile={profile} socialLinks={socialLinks ?? []} />
      <ForestFinalScene profile={profile} />
    </div>
  );
}
