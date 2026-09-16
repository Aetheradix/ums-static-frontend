const DEFAULT_LOCALE = 'en-IN';
const DEFAULT_CURRENCY_SYMBOL = '₹';

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number'
    ? Number.isFinite(value)
    : Number.isFinite(Number(value)) && value !== null && value !== '';
}

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(
  locale: string,
  options: Intl.NumberFormatOptions
): Intl.NumberFormat {
  const key = `${locale}:${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    formatterCache.set(key, formatter);
  }
  return formatter;
}

export interface FormatCurrencyOptions {
  symbol?: string;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  fallback?: string;
}

export function formatCurrency(
  amount: number | null | undefined,
  options: FormatCurrencyOptions = {}
): string {
  const {
    symbol = DEFAULT_CURRENCY_SYMBOL,
    locale = DEFAULT_LOCALE,
    maximumFractionDigits = 2,
    minimumFractionDigits = 0,
    fallback = `${DEFAULT_CURRENCY_SYMBOL} 0`,
  } = options;

  if (!isValidNumber(amount)) {
    return fallback;
  }

  const formatter = getFormatter(locale, {
    maximumFractionDigits,
    minimumFractionDigits,
  });

  return `${symbol} ${formatter.format(Number(amount))}`;
}

export interface FormatCompactCurrencyOptions {
  symbol?: string;
  locale?: string;
  fractionDigits?: number;
  fallback?: string;
}

export function formatCompactCurrency(
  amount: number | null | undefined,
  options: FormatCompactCurrencyOptions = {}
): string {
  const {
    symbol = DEFAULT_CURRENCY_SYMBOL,
    locale = DEFAULT_LOCALE,
    fractionDigits = 2,
    fallback = `${DEFAULT_CURRENCY_SYMBOL} 0`,
  } = options;

  if (!isValidNumber(amount) || Number(amount) === 0) {
    return fallback;
  }

  const numericAmount = Number(amount);
  const absValue = Math.abs(numericAmount);
  const sign = numericAmount < 0 ? '-' : '';

  const CRORE = 10000000;
  const LAKH = 100000;

  const formatUnit = (value: number, unitLabel: string): string => {
    const isWhole = value % 1 === 0;
    const formatted = value.toFixed(isWhole ? 0 : fractionDigits);
    const trimmed = isWhole ? formatted : parseFloat(formatted).toString();
    return `${sign}${symbol} ${trimmed} ${unitLabel}`;
  };

  if (absValue >= CRORE) {
    return formatUnit(absValue / CRORE, 'Cr');
  }

  if (absValue >= LAKH) {
    return formatUnit(absValue / LAKH, 'Lakh');
  }

  const formatter = getFormatter(locale, { maximumFractionDigits: 0 });
  return `${sign}${symbol} ${formatter.format(absValue)}`;
}
