import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SiteLayout } from '@/layouts/SiteLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute, GuestOnlyRoute, RequireRole } from '@/router/ProtectedRoute';
import { PageSpinner } from '@/components/ui';
import { PortfolioThemeScope } from '@/components/theme/PortfolioThemeScope';
import { PreviewBase } from '@/components/theme/PreviewBase';
import { lastPortfolioBase } from '@/lib/portfolioBase';

const Landing = lazy(() => import('@/pages/Landing'));
const Subscribe = lazy(() => import('@/pages/Subscribe'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const PublicPortfolio = lazy(() => import('@/pages/PublicPortfolio'));
const Home = lazy(() => import('@/pages/Home'));
const Work = lazy(() => import('@/pages/Work'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Forest = lazy(() => import('@/pages/concepts/Forest'));

const Login = lazy(() => import('@/pages/admin/Login'));
const PersonalInfo = lazy(() => import('@/pages/admin/PersonalInfo'));
const BuildPortfolio = lazy(() => import('@/pages/admin/BuildPortfolio'));
const ProjectForm = lazy(() => import('@/pages/admin/ProjectForm'));
const Users = lazy(() => import('@/pages/admin/Users'));
const Billing = lazy(() => import('@/pages/admin/Billing'));

function WorkRedirect() {
  const { slug } = useParams();
  const base = lastPortfolioBase();
  return <Navigate to={slug ? `${base}/work/${slug}` : `${base}/work`} replace />;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-elevated-2)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          {/* Product marketing + checkout — public. */}
          <Route index element={<Landing />} />
          {/* Signing up flips this guard the instant the account exists — so it agrees with Subscribe's own redirect. */}
          <Route element={<GuestOnlyRoute redirectTo="/onboarding" />}>
            <Route path="subscribe" element={<Subscribe />} />
          </Route>

          {/* First-run setup — never a gate; reachable any time while signed in. */}
          <Route path="/onboarding" element={<ProtectedRoute />}>
            <Route index element={<Onboarding />} />
          </Route>

          <Route path="/admin/login" element={<GuestOnlyRoute />}>
            <Route index element={<Login />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute />}>
            {/* Portfolio pages wear the portfolio's theme; everything else wears the app's. */}
            <Route element={<PortfolioThemeScope />}>
              {/* The signed-in account's portfolio, rendered with its saved (or a
                  `?layout=` / `?template=` previewed) design. */}
              <Route path="preview" element={<PreviewBase />}>
                <Route element={<SiteLayout />}>
                  <Route index element={<Home />} />
                  <Route path="work" element={<Work />} />
                  <Route path="work/:slug" element={<ProjectDetail />} />
                </Route>
              </Route>
              {/* Flagship concept experience: standalone, owns its full chrome. */}
              <Route path="concepts/forest" element={<Forest />} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="personal" replace />} />
              <Route path="personal" element={<PersonalInfo />} />
              <Route path="build" element={<BuildPortfolio />} />
              <Route path="billing" element={<Billing />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id/edit" element={<ProjectForm />} />
              {/* Old per-page addresses now live as sections of Personal information. */}
              {['projects', 'experience', 'education', 'technologies', 'social-links', 'profile'].map((id) => (
                <Route key={id} path={id} element={<Navigate to={`/admin/personal#${id}`} replace />} />
              ))}
              <Route element={<RequireRole roles={['super_admin']} />}>
                <Route path="users" element={<Users />} />
              </Route>
            </Route>
          </Route>

          {/* A shared portfolio — public, no sign-in. */}
          <Route path="p/:username" element={<PublicPortfolio />}>
            <Route element={<PortfolioThemeScope />}>
              <Route element={<SiteLayout />}>
                <Route index element={<Home />} />
                <Route path="work" element={<Work />} />
                <Route path="work/:slug" element={<ProjectDetail />} />
              </Route>
            </Route>
          </Route>

          {/* Section designs link to plain /work/… (right on portfolio-site); here it
              resolves against whichever portfolio this tab last showed. */}
          <Route path="work/:slug?" element={<WorkRedirect />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
