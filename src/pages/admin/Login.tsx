import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { PRODUCT_NAME } from '@/config/product';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <ThemeToggle className="absolute right-4 top-4" />
      <div className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <p className="font-mono text-lg font-semibold text-[var(--color-text)]">
            {PRODUCT_NAME}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-[var(--color-text-faint)]">
          New here? <Link to="/#pricing" className="underline hover:text-[var(--color-text)]">Choose a plan</Link>
        </p>
      </div>
    </div>
  );
}
