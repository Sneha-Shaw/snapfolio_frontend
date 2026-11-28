import { ArrowDown, ArrowUpRight, AtSign, Code2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getTechIcon } from '@/lib/techIcons';
import type { Education, Experience, SiteSection } from '@/types/models';
import {
  CountUp,
  galleryOf,
  groupTech,
  initials,
  pickProjects,
  servicesOf,
  statementLines,
  statsOf,
  type SectionProps,
  type SectionVariant,
  type StatItem,
} from './shared';
import './signature.css';

const designs = [
  { id: 'signature-index', style: 'index', name: 'Index ✦', description: 'A sharply edited ledger — numbered rows, hairline rules, tabular numerals.' },
  { id: 'signature-fieldnotes', style: 'fieldnotes', name: 'Fieldnotes ✦', description: 'A tactile field journal — tilted note cards, tape tabs, graph-paper grid.' },
  { id: 'signature-signal', style: 'signal', name: 'Signal ✦', description: 'A high-contrast console — scanlines, monospace readouts, meters, hard edges.' },
  { id: 'signature-atlas', style: 'atlas', name: 'Atlas ✦', description: 'An airy cartography — dotted grid, orbiting nodes, generous whitespace.' },
  { id: 'signature-monograph', style: 'monograph', name: 'Monograph ✦', description: 'A quiet printed page — serif voice, big numerals, a narrow column.' },
] as const;

type Design = (typeof designs)[number]['style'];

function date(value?: string) {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(+parsed) ? value : new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short' }).format(parsed);
}

const fade = { initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' } } as const;

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

function StatsLedger({ stats }: { stats: StatItem[] }) {
  return (
    <div className="sig-ledger">
      {stats.map((s, i) => (
        <motion.div key={s.label} {...fade} transition={{ duration: 0.45, delay: i * 0.06 }} className="sig-ledger-row">
          <span className="sig-number">{String(i + 1).padStart(2, '0')}</span>
          <span className="sig-ledger-label">{s.label}</span>
          <CountUp to={s.value} suffix={s.suffix} className="sig-ledger-value" />
        </motion.div>
      ))}
    </div>
  );
}

function StatsNotebook({ stats }: { stats: StatItem[] }) {
  return (
    <div className="sig-notebook">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -1.6 : 1.4 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
          className="sig-notebook-card"
        >
          <span className="sig-notebook-tab">{String(i + 1).padStart(2, '0')}</span>
          <CountUp to={s.value} suffix={s.suffix} className="sig-notebook-value" />
          <span className="sig-notebook-label">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

function StatsBars({ stats }: { stats: StatItem[] }) {
  const max = Math.max(...stats.map((s) => s.value), 1);
  return (
    <div className="sig-bars">
      {stats.map((s, i) => (
        <div key={s.label} className="sig-bar-row">
          <span className="sig-bar-label">{s.label}</span>
          <div className="sig-bar-track">
            <motion.div
              className="sig-bar-fill"
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max(8, (s.value / max) * 100)}%` }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <CountUp to={s.value} suffix={s.suffix} className="sig-bar-value" />
        </div>
      ))}
    </div>
  );
}

function StatsGauges({ stats }: { stats: StatItem[] }) {
  const max = Math.max(...stats.map((s) => s.value), 1);
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="sig-gauges">
      {stats.map((s, i) => {
        const pct = Math.max(0.08, Math.min(1, s.value / max));
        return (
          <div key={s.label} className="sig-gauge">
            <svg viewBox="0 0 128 128" className="sig-gauge-ring" aria-hidden>
              <circle cx="64" cy="64" r={r} className="sig-gauge-track" />
              <motion.circle
                cx="64"
                cy="64"
                r={r}
                className="sig-gauge-fill"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                whileInView={{ strokeDashoffset: c * (1 - pct) }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1.1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="sig-gauge-center">
              <CountUp to={s.value} suffix={s.suffix} className="sig-gauge-value" />
            </div>
            <span className="sig-gauge-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function StatsEditorial({ stats }: { stats: StatItem[] }) {
  return (
    <div className="sig-editorial">
      {stats.map((s, i) => (
        <motion.div key={s.label} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="sig-editorial-row">
          <CountUp to={s.value} suffix={s.suffix} className="sig-editorial-value" />
          <span className="sig-editorial-label">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

function SignatureStats({ style, ...props }: SectionProps & { style: Design }) {
  const stats = statsOf(props).slice(0, 5);
  if (stats.length === 0) return null;
  switch (style) {
    case 'index': return <StatsLedger stats={stats} />;
    case 'fieldnotes': return <StatsNotebook stats={stats} />;
    case 'signal': return <StatsBars stats={stats} />;
    case 'atlas': return <StatsGauges stats={stats} />;
    case 'monograph': return <StatsEditorial stats={stats} />;
  }
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function SignatureHero({ style, profile }: SectionProps & { style: Design }) {
  const name = profile?.name || 'Your name';
  const intro = profile?.headline || 'Independent creative developer';
  const statement = statementLines(profile).join(' ');
  const focus = profile?.focusAreas ?? [];

  if (style === 'index') {
    const rows = [
      ['Based in', profile?.location || 'Available worldwide'],
      ['Currently', profile?.heroCurrently || 'Open to select engagements'],
      ['Focus', focus.slice(0, 3).join(', ') || intro],
    ];
    return (
      <div className="hero-index">
        <div>
          <p className="sig-kicker">{profile?.heroEyebrow || 'Independent practice'}</p>
          <h1>{statement}</h1>
          <p className="sig-copy sig-lede">{name}</p>
        </div>
        <dl className="hero-index-facts">
          {rows.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
    );
  }

  if (style === 'fieldnotes') {
    return (
      <div className="hero-fieldnotes">
        <motion.div initial={{ opacity: 0, rotate: -6, y: 20 }} whileInView={{ opacity: 1, rotate: -3, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="hero-fn-photo">
          {profile?.profileImage?.url ? <img src={profile.profileImage.url} alt={name} /> : <span>{initials(name)}</span>}
          <em>{name.split(' ')[0]}</em>
        </motion.div>
        <div className="hero-fn-note">
          <span className="hero-fn-tab">est. {profile?.heroEyebrow || 'now'}</span>
          <h1>{statement}</h1>
          <p className="sig-copy">{intro}</p>
        </div>
      </div>
    );
  }

  if (style === 'signal') {
    return (
      <div className="hero-signal">
        <p className="hero-signal-status"><b>STATUS</b> {profile?.availability || 'AVAILABLE'} <i /></p>
        <h1>{statement}</h1>
        <p className="hero-signal-line">&gt; {intro}</p>
        <div className="hero-signal-actions">
          <a href="#projects">VIEW_WORK()</a>
          <a href="#contact">CONTACT()</a>
        </div>
      </div>
    );
  }

  if (style === 'atlas') {
    return (
      <div className="hero-atlas">
        <span className="hero-atlas-ring" aria-hidden />
        <p className="sig-kicker"><MapPin size={12} /> {profile?.location || 'Available worldwide'}</p>
        <h1>{statement}</h1>
        <p className="sig-copy">{name} — {intro}</p>
      </div>
    );
  }

  return (
    <div className="hero-monograph">
      <blockquote>{statement}</blockquote>
      <p>{name}, <i>{intro}</i></p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

function SignatureAbout({ style, profile }: SectionProps & { style: Design }) {
  const focus = profile?.focusAreas ?? [];
  const about = profile?.aboutText || profile?.bio || 'Thoughtful ideas, shaped into useful digital experiences.';

  if (style === 'index') {
    return (
      <div className="about-index">
        <p className="sig-quote">{about}</p>
        <div className="sig-focus">
          {focus.slice(0, 5).map((f, i) => (
            <span key={f}><b>{String(i + 1).padStart(2, '0')}</b>{f}</span>
          ))}
        </div>
      </div>
    );
  }

  if (style === 'fieldnotes') {
    return (
      <div className="about-fieldnotes">
        <motion.p initial={{ opacity: 0, rotate: -1.5, y: 12 }} whileInView={{ opacity: 1, rotate: -1.5, y: 0 }} viewport={{ once: true }} className="about-fn-note">
          {about}
        </motion.p>
        <div className="about-fn-tags">
          {focus.slice(0, 6).map((f, i) => (
            <motion.span key={f} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1, rotate: i % 2 ? 2 : -2 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              {f}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }

  if (style === 'signal') {
    return (
      <div className="about-signal">
        <p className="about-signal-readout">
          <span>&gt; cat about.txt</span>
          {about}
          <i />
        </p>
        {focus.length > 0 && (
          <div className="about-signal-meters">
            {focus.slice(0, 5).map((f, i) => (
              <div key={f} className="about-signal-meter">
                <span>{f}</span>
                <motion.i initial={{ width: 0 }} whileInView={{ width: `${70 + ((i * 7) % 25)}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.08 }} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (style === 'atlas') {
    const n = Math.min(focus.length, 6);
    return (
      <div className="about-atlas">
        <div className="about-atlas-core">
          <p>{about}</p>
        </div>
        {focus.slice(0, n).map((f, i) => {
          const angle = (360 / n) * i;
          return (
            <span key={f} className="about-atlas-node" style={{ transform: `rotate(${angle}deg) translate(200px) rotate(-${angle}deg)` }}>
              {f}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="about-monograph">
      <p className="about-mono-dropcap"><span>{about[0]}</span>{about.slice(1)}</p>
      {focus.length > 0 && <p className="about-mono-focus">{focus.join(' · ')}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

function SignatureProjects({ style, projects }: SectionProps & { style: Design }) {
  const list = pickProjects(projects, 5);

  if (style === 'index') {
    return (
      <div className="projects-index">
        {list.map((p, i) => (
          <Link to={`/work/${p.slug}`} key={p._id} className="projects-index-row">
            <span className="sig-number">{String(i + 1).padStart(2, '0')}</span>
            <span className="projects-index-thumb">{p.thumbnail?.url ? <img loading="lazy" src={p.thumbnail.url} alt="" /> : <Code2 size={18} />}</span>
            <span className="projects-index-copy"><b>{p.title}</b><small>{p.shortDescription}</small></span>
            <span className="projects-index-year">{p.year}</span>
          </Link>
        ))}
      </div>
    );
  }

  if (style === 'fieldnotes') {
    return (
      <div className="projects-fieldnotes">
        {list.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2.4 : 2 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.06 }}
            className="projects-fn-card"
          >
            <Link to={`/work/${p.slug}`}>
              <span className="projects-fn-photo">{p.thumbnail?.url ? <img loading="lazy" src={p.thumbnail.url} alt="" /> : <Code2 size={22} />}</span>
              <b>{p.title}</b>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  }

  if (style === 'signal') {
    return (
      <div className="projects-signal">
        {list.map((p) => (
          <Link to={`/work/${p.slug}`} key={p._id} className="projects-signal-row">
            <span>$ open ./{p.slug}</span>
            <b>{p.title}</b>
            <i>{p.year || 'active'}</i>
          </Link>
        ))}
      </div>
    );
  }

  if (style === 'atlas') {
    return (
      <div className="projects-atlas">
        {list.slice(0, 3).map((p) => (
          <Link to={`/work/${p.slug}`} key={p._id} className="projects-atlas-item">
            <span className="projects-atlas-thumb">{p.thumbnail?.url ? <img loading="lazy" src={p.thumbnail.url} alt="" /> : <Code2 size={26} />}</span>
            <b>{p.title}</b>
            <small>{p.shortDescription}</small>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="projects-monograph">
      {list.map((p, i) => (
        <Link to={`/work/${p.slug}`} key={p._id} className="projects-mono-row">
          <span>{String(i + 1).padStart(2, '0')}</span>
          <div><b>{p.title}</b><i>{p.shortDescription}</i></div>
        </Link>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Timeline (experience + education share a shape)
// ---------------------------------------------------------------------------

interface TimelineEntry {
  key: string;
  range: string;
  title: string;
  place?: string;
  copy?: string;
}

function timelineOf(kind: 'experience' | 'education', experiences: Experience[], education: Education[]): TimelineEntry[] {
  if (kind === 'experience') {
    return experiences.slice(0, 5).map((x) => ({
      key: x._id,
      range: `${date(x.startDate)} — ${x.current ? 'Now' : date(x.endDate)}`,
      title: x.position,
      place: x.company,
      copy: x.description,
    }));
  }
  return education.slice(0, 5).map((x) => ({
    key: x._id,
    range: `${date(x.startDate)} — ${date(x.endDate) || 'Ongoing'}`,
    title: x.degree,
    place: x.institution,
    copy: x.field || x.description,
  }));
}

function SignatureTimeline({ style, entries }: { style: Design; entries: TimelineEntry[] }) {
  if (style === 'index') {
    return (
      <div className="sig-list">
        {entries.map((x, i) => (
          <article className="sig-entry" key={x.key}>
            <span className="sig-number">{String(i + 1).padStart(2, '0')}</span>
            <div className="sig-entry-main"><p className="sig-detail">{x.range}</p><h3>{x.title}</h3>{x.copy && <p className="sig-copy">{x.copy}</p>}</div>
            {x.place && <span className="sig-detail sig-entry-aside">{x.place}</span>}
          </article>
        ))}
      </div>
    );
  }

  if (style === 'fieldnotes') {
    return (
      <div className="timeline-fieldnotes">
        {entries.map((x, i) => (
          <div key={x.key} className="timeline-fn-row">
            <motion.span initial={{ opacity: 0, rotate: 0 }} whileInView={{ opacity: 1, rotate: i % 2 ? 2.5 : -2.5 }} viewport={{ once: true }} className="timeline-fn-tag">
              {x.range}
            </motion.span>
            <div className="timeline-fn-body"><b>{x.title}</b>{x.place && <small>{x.place}</small>}{x.copy && <p>{x.copy}</p>}</div>
          </div>
        ))}
      </div>
    );
  }

  if (style === 'signal') {
    return (
      <div className="timeline-signal">
        {entries.map((x) => (
          <div key={x.key} className="timeline-signal-row">
            <span className="timeline-signal-time">{x.range}</span>
            <div><b>{x.title}</b>{x.place && <i> @ {x.place}</i>}{x.copy && <p>{x.copy}</p>}</div>
          </div>
        ))}
      </div>
    );
  }

  if (style === 'atlas') {
    return (
      <div className="timeline-atlas">
        {entries.map((x) => (
          <div key={x.key} className="timeline-atlas-row">
            <span className="timeline-atlas-dot" aria-hidden />
            <div><p className="sig-detail">{x.range}</p><h3>{x.title}</h3>{x.place && <p className="sig-copy">{x.place}</p>}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="timeline-monograph">
      {entries.map((x) => (
        <div key={x.key} className="timeline-mono-row">
          <b>{x.title}</b>
          <i>{x.place}</i>
          <span>{x.range}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

function SignatureSkills({ style, technologies }: SectionProps & { style: Design }) {
  const groups = groupTech(technologies).slice(0, 5);

  if (style === 'index') {
    return (
      <div className="sig-skills">
        {groups.map((g) => (
          <div className="sig-skill-group" key={g.cat}>
            <p className="sig-detail">{g.label} <span>{g.items.length}</span></p>
            <div>
              {g.items.slice(0, 8).map((tech) => {
                const Icon = getTechIcon(tech.icon || tech.slug, tech.category);
                return (
                  <span className="sig-skill" key={tech._id}>
                    <Icon className="size-[15px]" />
                    {tech.name}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (style === 'fieldnotes') {
    return (
      <div className="skills-fieldnotes">
        {groups.map((g, gi) => (
          <div key={g.cat} className="skills-fn-group">
            <p>{g.label}</p>
            <div>
              {g.items.slice(0, 7).map((tech, i) => (
                <motion.span
                  key={tech._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: (i + gi) % 2 ? 2 : -2 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  {tech.name}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (style === 'signal') {
    const max = Math.max(...groups.map((g) => g.items.length), 1);
    return (
      <div className="skills-signal">
        {groups.map((g, i) => (
          <div key={g.cat} className="skills-signal-row">
            <span>{g.label}</span>
            <div className="sig-bar-track">
              <motion.div className="sig-bar-fill" initial={{ width: 0 }} whileInView={{ width: `${(g.items.length / max) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} />
            </div>
            <b>{g.items.length}</b>
          </div>
        ))}
      </div>
    );
  }

  if (style === 'atlas') {
    return (
      <div className="skills-atlas">
        {groups.map((g) => (
          <div key={g.cat} className="skills-atlas-cluster">
            <span className="skills-atlas-core">{g.label}</span>
            <div className="skills-atlas-tags">
              {g.items.slice(0, 6).map((tech) => (
                <span key={tech._id}>{tech.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skills-monograph">
      {groups.map((g) => (
        <p key={g.cat}><b>{g.label}.</b> <i>{g.items.map((t) => t.name).join(', ')}</i></p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

function SignatureServices({ style, profile }: SectionProps & { style: Design }) {
  const list = servicesOf(profile).slice(0, 5);

  if (style === 'index') {
    return (
      <div className="services-index">
        {list.map((s, i) => (
          <article key={s.title} className="sig-ledger-row">
            <span className="sig-number">{String(i + 1).padStart(2, '0')}</span>
            <div><h3>{s.title}</h3>{s.description && <p className="sig-copy">{s.description}</p>}</div>
          </article>
        ))}
      </div>
    );
  }

  if (style === 'fieldnotes') {
    return (
      <div className="services-fieldnotes">
        {list.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.6 : -1.6 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="services-fn-card">
            <span>{String(i + 1).padStart(2, '0')}</span>
            <b>{s.title}</b>
            {s.description && <p>{s.description}</p>}
          </motion.div>
        ))}
      </div>
    );
  }

  if (style === 'signal') {
    return (
      <div className="services-signal">
        {list.map((s, i) => (
          <div key={s.title} className="services-signal-row">
            <span>$ service --{String(i + 1).padStart(2, '0')}</span>
            <b>{s.title}</b>
            {s.description && <p>{s.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (style === 'atlas') {
    return (
      <div className="services-atlas">
        {list.map((s) => (
          <div key={s.title} className="services-atlas-card">
            <b>{s.title}</b>
            {s.description && <p>{s.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="services-monograph">
      {list.map((s, i) => (
        <div key={s.title} className="services-mono-row">
          <span>{String(i + 1).padStart(2, '0')}</span>
          <div><b>{s.title}</b>{s.description && <i>{s.description}</i>}</div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

function SignatureTestimonials({ style, profile }: SectionProps & { style: Design }) {
  const list = (profile?.testimonials ?? []).slice(0, 4);
  if (list.length === 0) return null;
  const attribution = (t: (typeof list)[number]) => [t.role, t.company].filter(Boolean).join(' · ');

  if (style === 'index') {
    return (
      <div className="testimonials-index">
        {list.map((t, i) => (
          <div key={`${t.name}-${i}`} className="sig-ledger-row">
            <span className="sig-number">{String(i + 1).padStart(2, '0')}</span>
            <div><p className="sig-copy">“{t.quote}”</p><p className="sig-detail">{t.name} · {attribution(t)}</p></div>
          </div>
        ))}
      </div>
    );
  }

  if (style === 'fieldnotes') {
    return (
      <div className="testimonials-fieldnotes">
        {list.map((t, i) => (
          <motion.blockquote key={`${t.name}-${i}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.8 : -1.8 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="testimonials-fn-card">
            <p>“{t.quote}”</p>
            <footer>{t.name}<small>{attribution(t)}</small></footer>
          </motion.blockquote>
        ))}
      </div>
    );
  }

  if (style === 'signal') {
    return (
      <div className="testimonials-signal">
        {list.map((t, i) => (
          <div key={`${t.name}-${i}`} className="testimonials-signal-row">
            <span>log[{i}]</span>
            <p>“{t.quote}”</p>
            <b>— {t.name}, {attribution(t)}</b>
          </div>
        ))}
      </div>
    );
  }

  if (style === 'atlas') {
    return (
      <div className="testimonials-atlas">
        {list.map((t, i) => (
          <div key={`${t.name}-${i}`} className="testimonials-atlas-item">
            <p>“{t.quote}”</p>
            <span>{t.name} · {attribution(t)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="testimonials-monograph">
      {list.map((t, i) => (
        <blockquote key={`${t.name}-${i}`}>
          <p>{t.quote}</p>
          <footer>{t.name}, <i>{attribution(t)}</i></footer>
        </blockquote>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

function SignatureGallery({ style, projects }: SectionProps & { style: Design }) {
  const items = galleryOf(projects, 6);
  if (items.length === 0) return null;

  if (style === 'index') {
    return (
      <div className="gallery-index">
        {items.map((img, i) => (
          <Link to={`/work/${img.slug}`} key={`${img.slug}-${img.url}`}>
            <img loading="lazy" src={img.url} alt={img.title} />
            <span>{String(i + 1).padStart(2, '0')} / {img.title}</span>
          </Link>
        ))}
      </div>
    );
  }

  if (style === 'fieldnotes') {
    return (
      <div className="gallery-fieldnotes">
        {items.map((img, i) => (
          <motion.div key={`${img.slug}-${img.url}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 3 : -3 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="gallery-fn-card">
            <Link to={`/work/${img.slug}`}><img loading="lazy" src={img.url} alt={img.title} /></Link>
          </motion.div>
        ))}
      </div>
    );
  }

  if (style === 'signal') {
    return (
      <div className="gallery-signal">
        {items.map((img, i) => (
          <Link to={`/work/${img.slug}`} key={`${img.slug}-${img.url}`} className="gallery-signal-cell">
            <img loading="lazy" src={img.url} alt={img.title} />
            <span>FRM_{String(i).padStart(3, '0')}</span>
          </Link>
        ))}
      </div>
    );
  }

  if (style === 'atlas') {
    return (
      <div className="gallery-atlas">
        {items.slice(0, 4).map((img) => (
          <Link to={`/work/${img.slug}`} key={`${img.slug}-${img.url}`} className="gallery-atlas-cell">
            <img loading="lazy" src={img.url} alt={img.title} />
            <small>{img.title}</small>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="gallery-monograph">
      {items.slice(0, 3).map((img, i) => (
        <Link to={`/work/${img.slug}`} key={`${img.slug}-${img.url}`} className="gallery-mono-row">
          <img loading="lazy" src={img.url} alt={img.title} />
          <span>{String(i + 1).padStart(2, '0')} — {img.title}</span>
        </Link>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

function SignatureContact({ style, profile, socialLinks }: SectionProps & { style: Design }) {
  const email = profile?.email || '';
  const links = socialLinks.filter((s) => s.enabled).slice(0, 5);

  if (style === 'index') {
    return (
      <div className="sig-contact">
        <div>
          <p className="sig-kicker"><AtSign size={13} /> Open to good work</p>
          <h3>Have a thoughtful project in mind?</h3>
          <a className="sig-action" href={`mailto:${email}`}>{email || 'Start a conversation'} <ArrowUpRight size={14} /></a>
        </div>
        <div className="sig-socials">
          {links.map((s) => (
            <a key={s._id} href={s.url} target="_blank" rel="noreferrer">{s.label || s.platform}<ArrowUpRight size={13} /></a>
          ))}
        </div>
      </div>
    );
  }

  if (style === 'fieldnotes') {
    return (
      <motion.div initial={{ opacity: 0, rotate: -1.5, y: 14 }} whileInView={{ opacity: 1, rotate: -1.5, y: 0 }} viewport={{ once: true }} className="contact-fieldnotes">
        <span>ps.</span>
        <h3>Let's make something worth shipping.</h3>
        <a href={`mailto:${email}`}>{email || 'Say hello'}</a>
      </motion.div>
    );
  }

  if (style === 'signal') {
    return (
      <div className="contact-signal">
        <p>&gt; send_message()</p>
        <a href={`mailto:${email}`}>{email || 'contact@unknown'}</a>
        <div className="contact-signal-links">
          {links.map((s) => (
            <a key={s._id} href={s.url} target="_blank" rel="noreferrer">[{s.label || s.platform}]</a>
          ))}
        </div>
      </div>
    );
  }

  if (style === 'atlas') {
    return (
      <div className="contact-atlas">
        <h3>Say hello</h3>
        <a className="contact-atlas-cta" href={`mailto:${email}`}>{email || 'Start a conversation'}</a>
        <div className="contact-atlas-links">
          {links.map((s) => (
            <a key={s._id} href={s.url} target="_blank" rel="noreferrer">{s.label || s.platform}</a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="contact-monograph">
      <p>Get in touch —</p>
      <a href={`mailto:${email}`}>{email || 'Start a conversation'}</a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

function SignatureDivider({ style, profile }: SectionProps & { style: Design }) {
  const note = profile?.heroCurrently || `A little more about ${profile?.name || 'me'}`;
  if (style === 'fieldnotes') return <div className="divider-fieldnotes"><span /><p>{note}</p></div>;
  if (style === 'signal') return <div className="divider-signal"><i />{note}</div>;
  if (style === 'atlas') return <div className="divider-atlas"><span aria-hidden /><p>{note}</p></div>;
  if (style === 'monograph') return <div className="divider-monograph">❦ {note}</div>;
  return (
    <div className="sig-divider">
      <span>✳</span>
      <p>{note}</p>
      <a href="#about" aria-label="Continue to about section">Continue <ArrowDown size={14} /></a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dispatch + shell
// ---------------------------------------------------------------------------

function SignatureContent({ section, style, ...props }: SectionProps & { section: SiteSection; style: Design }) {
  switch (section) {
    case 'hero': return <SignatureHero style={style} {...props} />;
    case 'about': return <SignatureAbout style={style} {...props} />;
    case 'projects': return <SignatureProjects style={style} {...props} />;
    case 'experience': return <SignatureTimeline style={style} entries={timelineOf('experience', props.experiences, props.education)} />;
    case 'education': return <SignatureTimeline style={style} entries={timelineOf('education', props.experiences, props.education)} />;
    case 'skills': return <SignatureSkills style={style} {...props} />;
    case 'services': return <SignatureServices style={style} {...props} />;
    case 'stats': return <SignatureStats style={style} {...props} />;
    case 'testimonials': return <SignatureTestimonials style={style} {...props} />;
    case 'gallery': return <SignatureGallery style={style} {...props} />;
    case 'contact': return <SignatureContact style={style} {...props} />;
    case 'divider': return <SignatureDivider style={style} {...props} />;
  }
}

function SignatureSection({ section, style, ...props }: SectionProps & { section: SiteSection; style: Design }) {
  const title = section === 'hero' ? '' : section === 'projects' ? 'Selected work' : section === 'skills' ? 'Tools & materials' : section[0]!.toUpperCase() + section.slice(1);
  return (
    <section className="signature-section" id={section} data-style={style} data-section={section}>
      <div className="sig-shell">
        <div className="sig-heading">
          {section !== 'hero' && (
            <>
              <p className="sig-kicker">{String(section).padStart(2, '0')} <span> / </span> {style}</p>
              <h2>{title}</h2>
            </>
          )}
          <span className="sig-heading-mark" aria-hidden="true">{section === 'hero' ? 'PORTFOLIO / 01' : '✳'}</span>
        </div>
        <SignatureContent section={section} style={style} {...props} />
      </div>
    </section>
  );
}

function variants(section: SiteSection): SectionVariant[] {
  return designs.map((design) => ({ ...design, Component: (props: SectionProps) => <SignatureSection section={section} style={design.style} {...props} /> }));
}

export const SIGNATURE_HERO: SectionVariant[] = variants('hero');
export const SIGNATURE_ABOUT: SectionVariant[] = variants('about');
export const SIGNATURE_PROJECTS: SectionVariant[] = variants('projects');
export const SIGNATURE_EXPERIENCE: SectionVariant[] = variants('experience');
export const SIGNATURE_EDUCATION: SectionVariant[] = variants('education');
export const SIGNATURE_SKILLS: SectionVariant[] = variants('skills');
export const SIGNATURE_SERVICES: SectionVariant[] = variants('services');
export const SIGNATURE_STATS: SectionVariant[] = variants('stats');
export const SIGNATURE_TESTIMONIALS: SectionVariant[] = variants('testimonials');
export const SIGNATURE_GALLERY: SectionVariant[] = variants('gallery');
export const SIGNATURE_CONTACT: SectionVariant[] = variants('contact');
export const SIGNATURE_DIVIDER: SectionVariant[] = variants('divider');
