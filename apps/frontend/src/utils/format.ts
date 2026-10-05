// Number and date formatting shared by the dashboard and admin pages.

const compact = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});
const whole = new Intl.NumberFormat();

// 1234 → "1,234"; with compact, 1234567 → "1.2M".
export function formatNumber(value: number, { short = false } = {}) {
  return short && Math.abs(value) >= 10_000
    ? compact.format(value)
    : whole.format(value);
}

export function formatDate(iso: string, withYear = true) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

// "2h 14m", "3d 4h", "45m", "less than a minute".
export function formatDuration(ms: number) {
  if (ms < 60_000) return "less than a minute";
  const minutes = Math.floor(ms / 60_000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  if (days) return hours ? `${days}d ${hours}h` : `${days}d`;
  if (hours) return mins ? `${hours}h ${mins}m` : `${hours}h`;
  return `${mins}m`;
}

// "5 minutes ago", "3 days ago", or a date when older than a month.
export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff > 30 * 86_400_000) return formatDate(iso);
  return `${formatDuration(diff)} ago`;
}

// "2026-10-05" (UTC day) → "Oct 5".
export function formatDay(day: string) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

// Micro-dollars → "$3.00", "$0.0042", "$1,250.00" (admin pages only).
export function formatUsd(micros: number) {
  const dollars = micros / 1_000_000;
  const digits = dollars !== 0 && Math.abs(dollars) < 0.01 ? 4 : 2;
  return `$${dollars.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}
