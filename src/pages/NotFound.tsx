import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-[var(--color-accent)]">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-[var(--color-text-muted)]">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-11 items-center rounded-lg bg-[var(--color-accent)] px-6 text-sm font-medium text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]"
      >
        Back to home
      </Link>
    </div>
  );
}
