import { cn } from '@/utils/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <label className={cn('inline-flex items-center gap-2.5', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full transition-colors',
          checked ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-hover)]'
        )}
      >
        {/* Anchored to the left edge explicitly — a button centres its content, so
            an unanchored thumb would start mid-track. Track 36px, thumb 16px, 2px inset. */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-0.5 top-0.5 size-4 rounded-full shadow-sm transition-[transform,background-color]',
            // On: the theme's readable-on-accent colour, so the thumb contrasts with any accent (light or dark).
            checked ? 'translate-x-4 bg-[var(--color-on-accent)]' : 'translate-x-0 bg-white'
          )}
        />
      </button>
      {label && <span className="text-sm text-[var(--color-text)]">{label}</span>}
    </label>
  );
}
