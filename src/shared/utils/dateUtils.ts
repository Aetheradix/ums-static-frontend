import moment from 'moment';

/**
 * Formats a date string into a specified format.
 * Defaults to 'DD-MM-YYYY'.
 * Returns '-' if the date is null, undefined, or invalid.
 */
export const formatDate = (
  date: string | Date | null | undefined,
  format: string = 'DD-MM-YYYY'
): string => {
  if (!date) return '-';
  const m = moment(date);
  return m.isValid() ? m.format(format) : '-';
};

/**
 * Format a Date object to 'YYYY-MM-DD' string for Backend DateOnly fields
 * but keep the TypeScript type as `Date` to prevent type errors in payload interfaces.
 *
 * @param date - Date object or string
 * @returns Formatted string disguised as a Date object for TS
 */
export function toDateOnly(date: Date | string | null | undefined): Date {
  if (!date) return date as any;
  const m = moment(date);
  return (m.isValid() ? m.format('YYYY-MM-DD') : date) as unknown as Date;
}

/**
 * Recursively formats all Date objects in a payload to 'YYYY-MM-DD' strings
 * using `toDateOnly`, keeping the TypeScript types intact.
 */
export function formatDatesInPayload<T>(payload: T): T {
  if (!payload || typeof payload !== 'object') return payload;

  if (payload instanceof Date) {
    return toDateOnly(payload) as unknown as T;
  }

  if (Array.isArray(payload)) {
    return payload.map(item => formatDatesInPayload(item)) as unknown as T;
  }

  const newPayload = { ...payload } as any;
  for (const key in newPayload) {
    if (Object.prototype.hasOwnProperty.call(newPayload, key)) {
      if (newPayload[key] instanceof Date) {
        newPayload[key] = toDateOnly(newPayload[key]);
      } else if (
        typeof newPayload[key] === 'object' &&
        newPayload[key] !== null
      ) {
        newPayload[key] = formatDatesInPayload(newPayload[key]);
      }
    }
  }

  return newPayload;
}
