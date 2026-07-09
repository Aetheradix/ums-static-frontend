const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return INR.format(amount);
}

export function formatDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-IN', opts).format(d);
}

export function formatDateTime(iso: string): string {
  return formatDate(iso, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)}%`;
}

const ROMAN: readonly string[] = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
];

export function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

export function semesterParity(n: number): 'Odd' | 'Even' {
  return n % 2 === 1 ? 'Odd' : 'Even';
}
