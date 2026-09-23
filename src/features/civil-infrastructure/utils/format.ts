/**
 * Shared formatting helpers for the Civil Infrastructure module.
 *
 * The module spec mandates:
 *   - Indian currency grouping: ₹1,23,45,678
 *   - Dates as DD/MM/YYYY
 *
 * Existing pages format inline and inconsistently (en-IN vs L/Cr, ISO dates).
 * These helpers are the single place to fix that as pages migrate.
 */

/**
 * Formats a number as Indian-grouped rupees, e.g. 12345678 → "₹1,23,45,678".
 * Non-finite / nullish input renders as "₹0".
 */
export function formatCurrency(
  value: number | string | null | undefined
): string {
  const num = typeof value === 'string' ? Number(value) : value;
  if (num == null || !Number.isFinite(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

/**
 * Compact Indian currency for dashboards, e.g. 12500000 → "₹1.25 Cr".
 * Falls back to full grouping below ₹1 lakh.
 */
export function formatCurrencyCompact(
  value: number | string | null | undefined
): string {
  const num = typeof value === 'string' ? Number(value) : value;
  if (num == null || !Number.isFinite(num)) return '₹0';
  const abs = Math.abs(num);
  if (abs >= 1e7) return `₹${(num / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(num / 1e5).toFixed(2)} L`;
  return formatCurrency(num);
}

/**
 * Formats a date as DD/MM/YYYY. Accepts a Date, an ISO string, or any string
 * Date can parse. Returns "—" for empty/invalid input.
 */
export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return typeof value === 'string' ? value : '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Today's date as an ISO yyyy-mm-dd string (for storing in records). */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/** A timestamp for audit-trail entries: DD/MM/YYYY HH:mm. */
export function formatDateTime(
  value: Date | string | null | undefined
): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return typeof value === 'string' ? value : '—';
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${formatDate(d)} ${hh}:${min}`;
}
