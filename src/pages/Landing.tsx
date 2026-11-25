import { Link } from 'react-router-dom';
import { ArrowRight, Check, Eye, Layers, LayoutTemplate, Palette, PenLine, Sparkles, Type } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { planService } from '@/services/plan.service';
import { LAYOUT_PRESETS, SECTIONS } from '@/components/sections/registry';
import { FOOTER_DESIGNS } from '@/components/site/footers';
import { THEME_PRESETS } from '@/lib/themes';
import { PRODUCT_NAME } from '@/config/product';
import { cn } from '@/utils/cn';
import { perMonthNote, priceLabel } from '@/lib/plans';
import type { Plan } from '@/types/models';

// Real counts, straight from the design registry — they grow as designs are added.
const DESIGN_COUNT = SECTIONS.reduce((n, s) => n + s.variants.length, 0);
const COUNTS = [
  { value: DESIGN_COUNT, label: 'section designs' },
  { value: LAYOUT_PRESETS.length, label: 'ready-made layouts' },
  { value: THEME_PRESETS.length, label: 'colour themes' },
  { value: FOOTER_DESIGNS.length, label: 'footers' },
];

/** The landing page's own editorial palette, in the app's light and dark modes. */
const PALETTES: Record<'light' | 'dark', React.CSSProperties> = {
  light: {
    '--lp-bg': '#f6f2ea',
    '--lp-surface': '#fffdf8',
    '--lp-ink': '#17140f',
    '--lp-muted': '#6a6258',
    '--lp-line': 'rgba(23, 20, 15, 0.12)',
    '--lp-accent': '#e8512f',
    '--lp-accent-ink': '#ffffff',
  } as React.CSSProperties,
  dark: {
    '--lp-bg': '#14120f',
    '--lp-surface': '#1c1915',
    '--lp-ink': '#f3eee6',
    '--lp-muted': '#a89f93',
    '--lp-line': 'rgba(243, 238, 230, 0.12)',
    '--lp-accent': '#f26a4b',
    '--lp-accent-ink': '#14120f',
  } as React.CSSProperties,
};

const SERIF = "font-['Fraunces',ui-serif,Georgia,serif]";

const FEATURES = [
  { icon: Layers, title: 'Mix any section with any other', body: `Every section — hero, about, projects, experience, skills and more — comes in its own range of designs. Combine them freely; there are ${DESIGN_COUNT} to choose from.` },
  { icon: LayoutTemplate, title: 'Or start from a finished layout', body: `${LAYOUT_PRESETS.length} complete layouts, from quiet editorial pages to concept pieces built around a single object, tuned for different lines of work.` },
  { icon: Palette, title: 'Colour that is actually yours', body: `Pick one of ${THEME_PRESETS.length} themes, then fine-tune the accent, background, font and corner style until it feels right.` },
  { icon: Eye, title: 'Preview before you publish', body: 'Open any layout, theme or footer in a live preview with your real content, then save only the one you like.' },
  { icon: PenLine, title: 'A real CMS behind it', body: 'Projects with case studies and galleries, experience, education, tech stack, services, testimonials and links — all edited in one place.' },
  { icon: Type, title: 'Details that finish the page', body: `${FOOTER_DESIGNS.length} footer designs, typography pairings and section dividers, so the page ends as deliberately as it starts.` },
];

const STEPS = [
  { title: 'Add your work', body: 'Fill in your profile, projects and experience once.' },
  { title: 'Choose your style', body: 'Start from a layout or build one section by section.' },
  { title: 'Make it yours', body: 'Tune colours, fonts and footer, preview, then publish.' },
];

export default function Landing() {
  const { user } = useAuth();
  const { resolvedMode } = useTheme();
  const { data: plans, isLoading: plansLoading, error: plansError } = useFetch(() => planService.list(), []);
  const showcase = LAYOUT_PRESETS.slice(0, 12);

  return (
    <div style={PALETTES[resolvedMode]} className="min-h-screen bg-[var(--lp-bg)] font-['Inter',ui-sans-serif,system-ui,sans-serif] text-[var(--lp-ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--lp-line)] bg-[var(--lp-bg)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className={`${SERIF} text-xl font-semibold tracking-tight`}>
            {PRODUCT_NAME}
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-[var(--lp-muted)] md:flex">
            <a href="#features" className="hover:text-[var(--lp-ink)]">Features</a>
            <a href="#layouts" className="hover:text-[var(--lp-ink)]">Layouts</a>
            <a href="#pricing" className="hover:text-[var(--lp-ink)]">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle className="mr-1 hidden sm:inline-flex" />
            {user ? (
              <Link to="/admin" className="rounded-full bg-[var(--lp-ink)] px-4 py-2 text-sm font-medium text-[var(--lp-bg)] hover:opacity-90">
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link to="/admin/login" className="rounded-full px-4 py-2 text-sm font-medium hover:bg-[var(--lp-line)]">
                  Log in
                </Link>
                <a href="#pricing" className="rounded-full bg-[var(--lp-ink)] px-4 py-2 text-sm font-medium text-[var(--lp-bg)] hover:opacity-90">
                  Get started
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--lp-line)] bg-[var(--lp-surface)] px-3 py-1 text-xs font-medium text-[var(--lp-muted)]">
            <Sparkles className="size-3.5 text-[var(--lp-accent)]" /> A portfolio builder for people with taste
          </p>
          <h1 className={`mt-6 max-w-4xl ${SERIF} text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl`}>
            Your portfolio, in a style <em className="text-[var(--lp-accent)]">nobody else</em> has.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--lp-muted)]">
            Build a personal site from {DESIGN_COUNT} section designs, {LAYOUT_PRESETS.length} layouts and {THEME_PRESETS.length} themes —
            then tune every colour, font and corner. No code, no template that looks like everyone else's.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#pricing" className="inline-flex items-center gap-2 rounded-full bg-[var(--lp-accent)] px-6 py-3 text-sm font-semibold text-[var(--lp-accent-ink)] hover:opacity-90">
              Start building <ArrowRight className="size-4" />
            </a>
            <a href="#layouts" className="inline-flex items-center gap-2 rounded-full border border-[var(--lp-line)] px-6 py-3 text-sm font-semibold hover:bg-[var(--lp-surface)]">
              Browse layouts
            </a>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--lp-line)] bg-[var(--lp-line)] sm:grid-cols-4">
            {COUNTS.map((c) => (
              <div key={c.label} className="bg-[var(--lp-surface)] p-5">
                <dt className="text-sm text-[var(--lp-muted)]">{c.label}</dt>
                <dd className={`mt-1 ${SERIF} text-4xl font-semibold tabular-nums`}>{c.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* How it works */}
        <section className="border-y border-[var(--lp-line)] bg-[var(--lp-surface)]">
          <ol className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className={`${SERIF} text-3xl font-semibold text-[var(--lp-accent)]`}>{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--lp-muted)]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <h2 className={`max-w-2xl ${SERIF} text-4xl font-semibold tracking-tight sm:text-5xl`}>Too many options — on purpose.</h2>
          <p className="mt-4 max-w-2xl text-[var(--lp-muted)]">
            Most builders give you five templates and a colour picker. {PRODUCT_NAME} gives you the parts, so the result looks like you made it.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="rounded-2xl border border-[var(--lp-line)] bg-[var(--lp-surface)] p-6">
                <f.icon className="size-5 text-[var(--lp-accent)]" />
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--lp-muted)]">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Layout showcase */}
        <section id="layouts" className="scroll-mt-20 border-t border-[var(--lp-line)] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className={`${SERIF} text-4xl font-semibold tracking-tight sm:text-5xl`}>Start from a layout.</h2>
            <p className="mt-4 max-w-2xl text-[var(--lp-muted)]">
              A few of the {LAYOUT_PRESETS.length} ready-made layouts. Each is a starting point — swap any section, theme or footer afterwards.
            </p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {showcase.map((preset, i) => {
                const theme = THEME_PRESETS[(i * 7) % THEME_PRESETS.length]!;
                return (
                  <li key={preset.id} className="overflow-hidden rounded-2xl border border-[var(--lp-line)] bg-[var(--lp-surface)]">
                    {/* A tiny abstract "page" in one of the real themes. */}
                    <div className="relative h-36 p-4" style={{ background: theme.background }} aria-hidden="true">
                      <div className="h-2 w-16 rounded-full" style={{ background: theme.accent }} />
                      <div className="mt-4 h-4 w-3/4 rounded" style={{ background: `${theme.accent}55` }} />
                      <div className="mt-2 h-4 w-1/2 rounded" style={{ background: `${theme.accent}33` }} />
                      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                        {[0, 1, 2].map((n) => (
                          <div key={n} className="h-8 rounded" style={{ background: `${theme.accentStrong}${n === 0 ? '66' : '2e'}` }} />
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold">{preset.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--lp-muted)]">{preset.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-14">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--lp-muted)]">{THEME_PRESETS.length} themes to start from</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {THEME_PRESETS.slice(0, 40).map((t) => (
                  <li key={t.id} title={t.name} className="flex items-center gap-2 rounded-full border border-[var(--lp-line)] bg-[var(--lp-surface)] py-1 pl-1 pr-3 text-xs">
                    <span className="size-5 rounded-full border border-black/10" style={{ background: `linear-gradient(135deg, ${t.background} 50%, ${t.accent} 50%)` }} />
                    {t.name}
                  </li>
                ))}
                <li className="rounded-full px-3 py-1 text-xs text-[var(--lp-muted)]">+ {THEME_PRESETS.length - 40} more</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 border-t border-[var(--lp-line)] bg-[var(--lp-surface)] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className={`text-center ${SERIF} text-4xl font-semibold tracking-tight sm:text-5xl`}>Simple pricing.</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-[var(--lp-muted)]">Start with a free 30-day trial — no card needed. Then keep going monthly or yearly.</p>

            {plansLoading && <p className="mt-12 text-center text-sm text-[var(--lp-muted)]">Loading plans…</p>}
            {plansError && <p className="mt-12 text-center text-sm text-red-700">Couldn't load plans. Is the API running?</p>}
            {plans && (
              <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
                {plans.map((plan) => <PlanCard key={plan.id} plan={plan} signedIn={Boolean(user)} />)}
              </div>
            )}
            <p className="mt-8 text-center text-xs text-[var(--lp-muted)]">Demo checkout — no real payment is taken.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--lp-line)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-[var(--lp-muted)] sm:px-6">
          <p>
            © {new Date().getFullYear()} {PRODUCT_NAME}
          </p>
          <nav className="flex gap-5">
            <a href="#features" className="hover:text-[var(--lp-ink)]">Features</a>
            <a href="#pricing" className="hover:text-[var(--lp-ink)]">Pricing</a>
            <Link to="/admin/login" className="hover:text-[var(--lp-ink)]">Log in</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function PlanCard({ plan, signedIn }: { plan: Plan; signedIn: boolean }) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-2xl border p-6',
        plan.highlighted ? 'border-[var(--lp-ink)] bg-[var(--lp-ink)] text-[var(--lp-bg)]' : 'border-[var(--lp-line)] bg-[var(--lp-bg)]'
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{plan.name}</h3>
        {(plan.badge || plan.interval === 'trial') && (
          <span className="rounded-full bg-[var(--lp-accent)] px-2.5 py-0.5 text-xs font-semibold text-[var(--lp-accent-ink)]">
            {plan.badge ?? 'No card needed'}
          </span>
        )}
      </div>
      <p className="mt-4">
        <span className={`${SERIF} text-5xl font-semibold tabular-nums`}>{priceLabel(plan).amount}</span>
        <span className={cn('text-sm', plan.highlighted ? 'opacity-70' : 'text-[var(--lp-muted)]')}> {priceLabel(plan).per}</span>
      </p>
      {perMonthNote(plan) && <p className={cn('mt-1 text-xs', plan.highlighted ? 'opacity-70' : 'text-[var(--lp-muted)]')}>{perMonthNote(plan)}</p>}
      <p className={cn('mt-3 text-sm', plan.highlighted ? 'opacity-80' : 'text-[var(--lp-muted)]')}>{plan.tagline}</p>
      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-[var(--lp-accent)]" /> {f}
          </li>
        ))}
      </ul>
      {signedIn ? (
        <Link to="/admin" className="mt-8 rounded-full border border-current px-4 py-2.5 text-center text-sm font-semibold opacity-80 hover:opacity-100">
          You're signed in
        </Link>
      ) : (
        <Link
          to={`/subscribe?plan=${plan.id}`}
          className={cn(
            'mt-8 rounded-full px-4 py-2.5 text-center text-sm font-semibold hover:opacity-90',
            plan.highlighted ? 'bg-[var(--lp-accent)] text-[var(--lp-accent-ink)]' : 'bg-[var(--lp-ink)] text-[var(--lp-bg)]'
          )}
        >
          {plan.interval === 'trial' ? 'Start free trial' : `Choose ${plan.name}`}
        </Link>
      )}
    </article>
  );
}
