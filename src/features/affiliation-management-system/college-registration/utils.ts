export function generateApplicationNumber(collegeCode: string): string {
  const now = new Date();
  const codePart = (collegeCode || '').slice(-3).toUpperCase();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');

  return `${codePart}${yy}${mm}${ss}${ms}`;
}
