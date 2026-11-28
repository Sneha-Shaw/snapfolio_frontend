import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { getTechIcon } from '@/lib/techIcons';
import type { SiteSection } from '@/types/models';
import { galleryOf, newestFirst, servicesOf, statementLines, statsOf, type SectionProps } from './shared';
import './conceptScenes.css';

/** Objects, spatial arrangements and editorial language, rather than colour skins. */
export const CONCEPT_SCENES = {
  abyss: ['Deep sea', 'Beneath the surface', 'Dive log', 'Rising to the surface', 'Send a message ashore'],
  woodland: ['Forest', 'In the clearing', 'Along the woodland trail', 'A living canopy', 'Meet me in the clearing'],
  canopy: ['Tree', 'From the roots', 'Branches of work', 'Tools in leaf', 'Plant something together'],
  bloom: ['Flower', 'Inside the bloom', 'A garden of ideas', 'In full bloom', 'Let an idea blossom'],
  arachnid: ['Spider web', 'At the centre', 'Threads of work', 'An interconnected web', 'Start a new thread'],
  orbital: ['Globe', 'My coordinates', 'Across the globe', 'A world of tools', 'Make a connection'],
  'origin-story': ['Comic', 'The origin story', 'The next adventure', 'Superpowers', 'To be continued…'],
  mechanical: ['Computer', 'Read me', 'Open applications', 'The command keys', 'Compose a message'],
  handset: ['Mobile', 'My profile', 'On the home screen', 'The app library', 'Start a conversation'],
  salon: ['Painting', 'The artist’s notes', 'On exhibition', 'On the palette', 'Commission something new'],
  dune: ['Desert', 'At the oasis', 'Beyond the dunes', 'Caravan provisions', 'Meet at the oasis'],
  summit: ['Mountain', 'At base camp', 'Expedition records', 'The climbing kit', 'Plan the next ascent'],
  nebula: ['Galaxy', 'From this little planet', 'A chart of discoveries', 'A constellation of tools', 'Send a signal'],
  monsoon: ['Storm', 'Behind the rain', 'Weathering the elements', 'Caught in the rain', 'After the storm'],
  magma: ['Volcanic', 'Under the crust', 'Forged in the heat', 'Elements of the forge', 'Ignite an idea'],
  cirrus: ['Open sky', 'Above the clouds', 'On the horizon', 'Carried by the wind', 'The sky is open'],
  barometer: ['Weather station', 'Station notes', 'Field observations', 'Instrument readings', 'Open a new forecast'],
  macbook: ['Laptop', 'About this person', 'Project windows', 'The tool dock', 'New message'],
  horology: ['Clock', 'Behind the dial', 'Works in time', 'The inner workings', 'Make time for an idea'],
  shortwave: ['Valve radio', 'Station identification', 'Selected broadcasts', 'Tuned to my tools', 'You’re on the air'],
  cathode: ['CRT television', 'Behind the screen', 'Now showing', 'Available channels', 'Stay tuned'],
  concert: ['Musical instrument', 'Liner notes', 'Selected compositions', 'The ensemble', 'Let’s make something resonate'],
  redline: ['Car', 'Under the hood', 'Out on the circuit', 'The pit crew', 'Start your engines'],
  bindery: ['Book', 'The preface', 'Collected works', 'An index of tools', 'Write the next chapter'],
  vitals: ['Medical monitor', 'The chart', 'Case records', 'Connected systems', 'Keep in touch'],
  reagent: ['Chemistry', 'Lab notes', 'Selected experiments', 'The elements', 'Find the right chemistry'],
  quantum: ['Physics', 'Initial conditions', 'Field experiments', 'Particles of possibility', 'Set an idea in motion'],
  meadow: ['Agriculture', 'Where it takes root', 'The harvest', 'Seeds of possibility', 'Grow something together'],
} as const;

export type ConceptId = keyof typeof CONCEPT_SCENES;
export function isConceptId(id: string): id is ConceptId { return Object.hasOwn(CONCEPT_SCENES, id); }

const sectionNames: Record<SiteSection, string> = {
  hero: 'Welcome', about: 'About', projects: 'Projects', skills: 'Technologies', experience: 'Experience',
  education: 'Education', services: 'Services', stats: 'By the numbers', testimonials: 'Testimonials',
  gallery: 'Gallery', contact: 'Contact', divider: 'Continue',
};

/** Decorative geometry is separate from content: labels and links stay real HTML. */
function Scenery({ motif }: { motif: ConceptId }) {
  const trees = motif === 'woodland' || motif === 'canopy' || motif === 'meadow';
  return <div className="cs-scenery" aria-hidden="true">
    <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="cs-landscape">
      {trees ? <>
        {[70, 250, 500, 750, 930].map((x, i) => <g key={x} style={{ opacity: .25 + i % 3 * .12 }}>
          <path d={`M${x} 600 Q${x - 30} 350 ${x} 55 M${x} 220 Q${x - 90} 170 ${x - 125} 65 M${x} 320 Q${x + 100} 230 ${x + 135} 95 M${x} 450 Q${x - 100} 370 ${x - 155} 265`} />
          {[0, 1, 2].map(n => <ellipse key={n} cx={x - 65 + n * 60} cy={95 + n % 2 * 65} rx="70" ry="32" transform={`rotate(-30 ${x - 65 + n * 60} ${95 + n % 2 * 65})`} />)}
        </g>)}
      </> : motif === 'arachnid' ? <>
        {[80, 155, 235, 320, 410].map(r => <ellipse key={r} cx="500" cy="300" rx={r} ry={r * .65} />)}
        {Array.from({ length: 12 }, (_, i) => <path key={i} d="M500 300 L1000 300" transform={`rotate(${i * 30} 500 300)`} />)}
      </> : ['orbital', 'nebula', 'quantum', 'horology'].includes(motif) ? <>
        {[0, 60, 120].map(a => <ellipse key={a} cx="500" cy="300" rx="420" ry="160" transform={`rotate(${a} 500 300)`} />)}
        <circle cx="500" cy="300" r="85" />
        {Array.from({ length: 24 }, (_, i) => <path key={i} d="M500 35 v20" transform={`rotate(${i * 15} 500 300)`} />)}
      </> : ['vitals', 'concert', 'shortwave', 'barometer'].includes(motif) ? <>
        {[100, 200, 300, 400, 500].map(y => <path key={y} d={`M0 ${y} H1000`} />)}
        <path className="cs-trace" d="M0 300 H120 L150 270 L180 300 H280 L305 350 L330 170 L350 380 L380 300 H540 Q590 210 640 300 H1000" />
      </> : ['dune', 'summit', 'magma'].includes(motif) ? <>
        {[0, 100, 200].map(y => <path key={y} d={motif === 'dune' ? `M-100 ${400+y} Q150 ${100+y} 400 ${350+y} T1100 ${270+y} V700 H-100Z` : `M-100 ${600+y} L230 ${100+y} L390 ${320+y} L630 ${50+y} L1100 ${600+y}Z`} />)}
      </> : <>
        {[100, 240, 380, 520].map((y, i) => <path key={y} d={`M-100 ${y} Q150 ${y-100} 400 ${y} T1100 ${y}`} className={`cs-current cs-current-${i}`} />)}
      </>}
    </svg>
    {Array.from({ length: 4 }, (_, i) => <i key={i} className="cs-particle" style={{ '--i': i, left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23 + 9) % 100}%` } as CSSProperties} />)}
  </div>;
}

/** Recognisable hardware / natural objects carried by each individual content item. */
function ObjectDetail({ motif, index }: { motif: ConceptId; index: number }) {
  if (['woodland', 'canopy', 'meadow', 'bloom'].includes(motif)) return <span className="cs-stem" aria-hidden="true"><i /><i /></span>;
  if (['abyss', 'monsoon', 'cirrus'].includes(motif)) return <span className="cs-shine" aria-hidden="true" />;
  if (['macbook', 'mechanical', 'cathode', 'handset'].includes(motif)) return <div className="cs-windowbar" aria-hidden="true"><i /><i /><i /><span>{motif === 'cathode' ? 'CH' : 'FILE'} {String(index + 1).padStart(2, '0')}</span></div>;
  if (['shortwave', 'concert', 'barometer', 'redline', 'vitals'].includes(motif)) return <div className="cs-instrument" aria-hidden="true"><i /><span /><b /></div>;
  if (motif === 'horology') return <span className="cs-clockwork" aria-hidden="true">{['XII', 'III', 'VI', 'IX'].map(n => <i key={n}>{n}</i>)}</span>;
  if (motif === 'reagent') return <span className="cs-graduations" aria-hidden="true">100 ─<br />75 ─<br />50 ─<br />25 ─</span>;
  if (motif === 'bindery') return <span className="cs-page-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>;
  if (motif === 'salon') return <span className="cs-picture-wire" aria-hidden="true" />;
  if (motif === 'summit') return <span className="cs-summit-flag" aria-hidden="true">⚑</span>;
  if (motif === 'origin-story') return <span className="cs-caption" aria-hidden="true">{['MEANWHILE…', 'NEXT UP!', 'A NEW CHAPTER'][index % 3]}</span>;
  if (['nebula', 'orbital', 'quantum', 'arachnid'].includes(motif)) return <span className="cs-satellite" aria-hidden="true" />;
  return <span className="cs-strata" aria-hidden="true" />;
}

interface SceneItem { key: string; title: string; text?: string; meta?: string; image?: string; to?: string; href?: string; icon?: ReactNode; }
function dateRange(start: string, end?: string, current?: boolean) {
  return `${new Date(start).getFullYear()} — ${current ? 'Present' : end ? new Date(end).getFullYear() : 'Ongoing'}`;
}

function itemsFor(section: SiteSection, p: SectionProps): SceneItem[] {
  switch (section) {
    case 'hero': return [{ key: 'hero', title: p.profile?.name || 'Welcome', text: statementLines(p.profile).join(' '), image: p.profile?.profileImage.url }];
    case 'about': return [{ key: 'about', title: p.profile?.headline || 'A little about me', text: p.profile?.aboutText || p.profile?.bio, image: p.profile?.profileImage.url, meta: p.profile?.location }, ...(p.profile?.focusAreas ?? []).map((title, i) => ({ key: `focus-${i}`, title }))];
    case 'projects': return p.projectsLoading ? [] : p.projects.map(project => ({ key: project._id, title: project.title, text: project.shortDescription, image: project.thumbnail?.url, meta: [project.year, project.role].filter(Boolean).join(' / '), to: `/work/${project.slug}` }));
    case 'skills': return p.technologies.filter(t => t.enabled !== false).map(t => { const Icon = getTechIcon(t.icon || t.slug, t.category); return { key: t._id, title: t.name, meta: t.category, icon: <Icon />, href: /^https?:\/\//.test(t.documentationUrl) ? t.documentationUrl : undefined }; });
    case 'experience': return newestFirst(p.experiences).map(e => ({ key: e._id, title: e.position, meta: `${e.company} / ${dateRange(e.startDate, e.endDate, e.current)}`, text: [e.description, ...e.responsibilities].filter(Boolean).join('\n') }));
    case 'education': return newestFirst(p.education).map(e => ({ key: e._id, title: e.degree, meta: `${e.institution} / ${dateRange(e.startDate, e.endDate)}`, text: [e.field, e.description].filter(Boolean).join('\n') }));
    case 'services': return servicesOf(p.profile).map((s, i) => ({ key: `service-${i}`, title: s.title, text: s.description }));
    case 'testimonials': return (p.profile?.testimonials ?? []).map((t, i) => ({ key: `quote-${i}`, title: t.name, text: t.quote, meta: [t.role, t.company].filter(Boolean).join(' / ') }));
    case 'stats': return statsOf(p).map(s => ({ key: s.label, title: `${s.value}${s.suffix}`, text: s.label }));
    case 'gallery': return galleryOf(p.projects, 30).map((g, i) => ({ key: `${g.slug}-${i}`, title: g.title, image: g.url, to: `/work/${g.slug}` }));
    case 'contact': return [...(p.profile?.email ? [{ key: 'email', title: p.profile.email, text: p.profile.availability || 'Let’s create something together.', href: `mailto:${p.profile.email}` }] : []), ...p.socialLinks.map(s => ({ key: s._id, title: s.label || s.platform, href: s.url }))];
    default: return [];
  }
}

function SceneCard({ item, motif, section, index }: { item: SceneItem; motif: ConceptId; section: SiteSection; index: number }) {
  const content = <>
    <ObjectDetail motif={motif} index={index} />
    {item.image && <div className="cs-image"><img src={item.image} alt={item.title} loading={section === 'hero' ? 'eager' : 'lazy'} /></div>}
    <div className="cs-copy">
      {item.icon && <span className="cs-tech-icon" aria-hidden="true">{item.icon}</span>}
      {item.meta && <p className="cs-meta">{item.meta}</p>}
      {section === 'hero' ? <h1>{item.title}</h1> : <h3>{item.title}</h3>}
      {item.text && (section === 'testimonials' ? <blockquote>“{item.text}”</blockquote> : <p className="cs-description">{item.text}</p>)}
      {(item.to || item.href) && <ArrowUpRight className="cs-link-arrow" aria-hidden="true" />}
    </div>
  </>;
  const style = { '--i': index, '--tilt': `${index % 2 ? 3 : -3}deg`, '--delay': `${-index * 2.7}s` } as CSSProperties;
  return <li className="cs-item" style={style}>
    {item.to ? <Link to={item.to} className="cs-object">{content}</Link> : item.href ? <a href={item.href} className="cs-object" target={item.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">{content}</a> : <article className="cs-object">{content}</article>}
  </li>;
}

export function ConceptSection({ motif, section, ...props }: SectionProps & { motif: ConceptId; section: SiteSection }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { margin: '100px' });
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const items = itemsFor(section, props);
  const limit = section === 'skills' ? 12 : section === 'experience' || section === 'education' ? 3 : 6;
  const shown = expanded ? items : items.slice(0, limit);
  const words = CONCEPT_SCENES[motif];
  const title = section === 'about' ? words[1] : section === 'projects' ? words[2] : section === 'skills' ? words[3] : section === 'contact' ? words[4] : sectionNames[section];
  const animate = visible && !paused && !reduced;
  if (!items.length && section !== 'projects') return null;
  return <section ref={ref} id={section === 'hero' ? undefined : section} className="concept-scene" data-motif={motif} data-section={section} data-motion={animate ? 'running' : 'paused'}>
    {['hero', 'skills', 'contact'].includes(section) && <Scenery motif={motif} />}
    <div className="cs-inner">
      <header className="cs-heading">
        <div><p className="cs-eyebrow">{words[0]} / {sectionNames[section]}</p><h2>{title}</h2></div>
        {section === 'skills' && !reduced && <button type="button" className="cs-motion-toggle" onClick={() => setPaused(v => !v)} aria-pressed={paused}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? 'Resume motion' : 'Pause motion'}</button>}
      </header>
      <div className="cs-stage">
        <div className="cs-spine" aria-hidden="true" />
        {items.length ? <ul className="cs-items">{shown.map((item, index) => <SceneCard key={item.key} item={item} motif={motif} section={section} index={index} />)}</ul> : <p role="status">{props.projectsLoading ? 'Loading projects…' : 'New work is on its way.'}</p>}
      </div>
      {items.length > limit && <button type="button" className="cs-show-more" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? 'Show less' : `Show all ${items.length} ${section === 'skills' ? 'technologies' : section}`}</button>}
      {section === 'hero' && <div className="cs-hero-links"><a href="#projects">Explore the work <ArrowUpRight size={18} /></a><a href="#contact">Get in touch</a></div>}
    </div>
  </section>;
}

export function conceptVariant(motif: ConceptId, section: SiteSection) {
  return function ConceptVariant(props: SectionProps) { return <ConceptSection {...props} motif={motif} section={section} />; };
}
