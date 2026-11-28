import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const FIELD_CLASSES =
  'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text)] ' +
  'placeholder:text-[var(--color-text-faint)] transition-colors focus:border-[var(--color-accent)] focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
}

export function Field({
  label,
  error,
  hint,
  className,
  children,
}: FieldWrapperProps & { children: React.ReactNode }) {
  return (
    <label className={cn('block space-y-1.5', className)}>
      {label && <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>}
      {children}
      {error ? (
        <span className="block text-xs text-red-400">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-[var(--color-text-faint)]">{hint}</span>
      ) : null}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldWrapperProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, hint, className, ...props }, ref) => {
  const field = (
    <input ref={ref} className={cn(FIELD_CLASSES, error && 'border-red-500/50', !label && className)} {...props} />
  );
  if (!label && !error && !hint) return field;
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      {field}
    </Field>
  );
});
Input.displayName = 'Input';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldWrapperProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, rows = 4, ...props }, ref) => {
    const field = (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(FIELD_CLASSES, 'resize-y', error && 'border-red-500/50', !label && className)}
        {...props}
      />
    );
    if (!label && !error && !hint) return field;
    return (
      <Field label={label} error={error} hint={hint} className={className}>
        {field}
      </Field>
    );
  }
);
Textarea.displayName = 'Textarea';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & FieldWrapperProps;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, children, ...props }, ref) => {
    const field = (
      <select ref={ref} className={cn(FIELD_CLASSES, error && 'border-red-500/50', !label && className)} {...props}>
        {children}
      </select>
    );
    if (!label && !error && !hint) return field;
    return (
      <Field label={label} error={error} hint={hint} className={className}>
        {field}
      </Field>
    );
  }
);
Select.displayName = 'Select';
