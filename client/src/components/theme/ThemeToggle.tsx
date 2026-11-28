import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';

const OPTIONS: { id: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'dark', label: 'Dark', Icon: Moon },
  { id: 'system', label: 'System', Icon: Monitor },
];

/** Light / Dark / System switcher for the app's own appearance (never a portfolio's theme). */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, setMode, portfolioThemeActive } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Appearance"
      aria-disabled={portfolioThemeActive || undefined}
      // Build portfolio paints the portfolio's own theme; the app mode returns when you leave.
      title={portfolioThemeActive ? 'This page shows your portfolio theme — app appearance applies elsewhere' : undefined}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-0.5',
        portfolioThemeActive && 'opacity-50',
        className
      )}
    >
      {OPTIONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={mode === id}
          aria-label={label}
          title={portfolioThemeActive ? undefined : label}
          disabled={portfolioThemeActive}
          onClick={() => setMode(id)}
          className={cn(
            'grid size-7 place-items-center rounded-md transition-colors',
            mode === id
              ? 'bg-[var(--color-bg-elevated-2)] text-[var(--color-text)]'
              : 'text-[var(--color-text-faint)] enabled:hover:text-[var(--color-text)]',
            portfolioThemeActive && 'cursor-not-allowed'
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
