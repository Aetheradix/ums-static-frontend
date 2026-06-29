interface Props {
  status: 'normal' | 'warning' | 'violation';
  className?: string;
}

const config = {
  normal: { dot: 'bg-green-500', label: 'Normal' },
  warning: { dot: 'bg-yellow-500', label: 'Warning' },
  violation: { dot: 'bg-red-500', label: 'Violation' },
};

export default function ProctoringStatusBadge({
  status,
  className = '',
}: Props) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
