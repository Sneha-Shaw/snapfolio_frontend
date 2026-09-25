const MONTH_YEAR = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

export function formatMonthYear(date: string | Date | undefined | null): string {
  if (!date) return '';
  return MONTH_YEAR.format(new Date(date));
}

export function formatDateRange(start: string | Date, end: string | Date | undefined | null, current: boolean): string {
  const from = formatMonthYear(start);
  if (current) return `${from} — Present`;
  if (!end) return from;
  return `${from} — ${formatMonthYear(end)}`;
}

export function toInputDate(date: string | Date | undefined | null): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}
