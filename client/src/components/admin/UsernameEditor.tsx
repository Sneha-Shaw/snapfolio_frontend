import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { USERNAME_STATUS_TEXT, normalizeUsername, useUsernameStatus } from '@/lib/username';
import { cn } from '@/utils/cn';

/**
 * Edit the account's username — its public address /p/<username>. Self-contained:
 * live availability check, its own Save (it's an account setting, not part of
 * any surrounding form). Used by the Profile section and the Share dialog.
 */
export function UsernameEditor({ id, prefix = '/p/', label = 'Username' }: { id: string; prefix?: string; label?: string }) {
  const { user, updateSharing } = useAuth();
  const current = user?.username ?? '';
  const [draft, setDraft] = useState(current);
  const [busy, setBusy] = useState(false);
  const status = useUsernameStatus(draft, current);

  // Follow the saved value (e.g. after it changes elsewhere) until the user types.
  useEffect(() => setDraft(current), [current]);

  const changed = draft !== current;
  const canSave = changed && status === 'available' && !busy;
  const blocked = status === 'invalid' || status === 'taken';

  const save = async () => {
    setBusy(true);
    try {
      await updateSharing({ username: draft });
      toast.success('Username updated — your link changed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update username');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-text)]">
        {label}
      </label>
      <div className="flex gap-2">
        <div
          className={cn(
            'flex min-w-0 flex-1 items-center overflow-hidden rounded-lg border bg-[var(--color-bg)] focus-within:border-[var(--color-accent)]',
            changed && blocked ? 'border-red-500/50' : 'border-[var(--color-border)]'
          )}
        >
          <span className="select-none whitespace-nowrap border-r border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-faint)]">{prefix}</span>
          <input
            id={id}
            value={draft}
            onChange={(e) => setDraft(normalizeUsername(e.target.value))}
            onKeyDown={(e) => {
              // Enter saves this field only — never submits a surrounding form.
              if (e.key !== 'Enter') return;
              e.preventDefault();
              if (canSave) void save();
            }}
            spellCheck={false}
            autoComplete="username"
            aria-describedby={`${id}-status`}
            aria-invalid={changed && blocked}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
          />
        </div>
        {changed && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setDraft(current)} disabled={busy}>
            Cancel
          </Button>
        )}
        <Button type="button" size="sm" onClick={save} disabled={!canSave} isLoading={busy}>
          Save
        </Button>
      </div>
      <p
        id={`${id}-status`}
        aria-live="polite"
        className={cn(
          'text-xs',
          changed && blocked ? 'text-red-400' : changed && status === 'available' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-faint)]'
        )}
      >
        {changed ? USERNAME_STATUS_TEXT[status] : 'Changing it changes your link — old links stop working.'}
      </p>
    </div>
  );
}
