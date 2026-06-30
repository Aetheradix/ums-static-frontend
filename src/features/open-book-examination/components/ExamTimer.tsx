import { useEffect, useState } from 'react';

interface Props {
  startTime: string;
  endTime: string;
  onExpire: () => void;
  className?: string;
}

function getRemaining(endTime: string): number {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((end - now) / 1000));
}

export default function ExamTimer({
  endTime,
  onExpire,
  className = '',
}: Props) {
  const [remaining, setRemaining] = useState(() => getRemaining(endTime));

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const interval = setInterval(() => {
      const r = getRemaining(endTime);
      setRemaining(r);
      if (r <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire, remaining]);

  const hours = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;

  const color =
    remaining > 300
      ? 'text-gray-800'
      : remaining > 60
        ? 'text-orange-500'
        : 'text-red-500 animate-pulse';

  return (
    <span className={`font-mono text-lg font-bold ${color} ${className}`}>
      {String(hours).padStart(2, '0')}:{String(mins).padStart(2, '0')}:
      {String(secs).padStart(2, '0')}
    </span>
  );
}
