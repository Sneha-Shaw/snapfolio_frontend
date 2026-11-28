interface ThemeColorFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function ThemeColorField({ label, hint, value, onChange }: ThemeColorFieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1.5">
        <input
          type="color"
          value={HEX_PATTERN.test(value) ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 shrink-0 cursor-pointer rounded border-none bg-transparent p-0"
          aria-label={`${label} color picker`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-full bg-transparent font-mono text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-faint)]"
        />
      </div>
      {hint && <span className="block text-xs text-[var(--color-text-faint)]">{hint}</span>}
    </label>
  );
}
