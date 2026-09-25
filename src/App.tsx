import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SiteLayout } from '@/layouts/SiteLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute, GuestOnlyRoute } from '@/router/ProtectedRoute';
import { PageSpinner } from '@/components/ui';

const Home = lazy(() => import('@/pages/Home'));
const Work = lazy(() => import('@/pages/Work'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const Login = lazy(() => import('@/pages/admin/Login'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Projects = lazy(() => import('@/pages/admin/Projects'));
const ProjectForm = lazy(() => import('@/pages/admin/ProjectForm'));
const Experience = lazy(() => import('@/pages/admin/Experience'));
const Education = lazy(() => import('@/pages/admin/Education'));
const Technologies = lazy(() => import('@/pages/admin/Technologies'));
const SocialLinks = lazy(() => import('@/pages/admin/SocialLinks'));
const ProfileSettings = lazy(() => import('@/pages/admin/ProfileSettings'));

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
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="work" element={<Work />} />
            <Route path="work/:slug" element={<ProjectDetail />} />
          </Route>

          <Route path="/admin/login" element={<GuestOnlyRoute />}>
            <Route index element={<Login />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id/edit" element={<ProjectForm />} />
              <Route path="experience" element={<Experience />} />
              <Route path="education" element={<Education />} />
              <Route path="technologies" element={<Technologies />} />
              <Route path="social-links" element={<SocialLinks />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
