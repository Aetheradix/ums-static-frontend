import moment from 'moment';

/**
 * Format date string to readable format
 * @param dateString - ISO date string or date value
 * @param format - Optional format string (default: 'DD/MM/YYYY HH:mm')
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  format: string = 'DD/MM/YYYY HH:mm'
): string {
  if (!dateString) return '-';

  const date = moment(dateString);
  return date.isValid() ? date.format(format) : '-';
}

/**
 * Format date only (without time)
 * @param dateString - ISO date string or date value
 * @returns Formatted date string (DD/MM/YYYY)
 */
export function formatDateOnly(
  dateString: string | Date | null | undefined
): string {
  return formatDate(dateString, 'DD/MM/YYYY');
}

/**
 * Format time only
 * @param dateString - ISO date string or date value
 * @returns Formatted time string (HH:mm)
 */
export function formatTimeOnly(
  dateString: string | Date | null | undefined
): string {
  return formatDate(dateString, 'HH:mm');
}

/**
 * Convert date string to ISO format for API
 * @param date - Date object or string
 * @returns ISO format string
 */
export function toISOString(date: Date | string | null | undefined): string {
  if (!date) return '';

  if (typeof date === 'string') {
    return moment(date).toISOString();
  }

  return moment(date).toISOString();
}

/**
 * Parse date string to Date object
 * @param dateString - Date string in various formats
 * @returns Date object or null
 */
export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;

  const date = moment(dateString);
  return date.isValid() ? date.toDate() : null;
}
