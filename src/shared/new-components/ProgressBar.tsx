export interface ProgressBarProps {
  value: number; // 0 to 100
  colorClass?: string; // e.g. 'bg-blue-600', 'bg-indigo-600'
  heightClass?: string; // e.g. 'h-2'
  trackColorClass?: string; // e.g. 'bg-gray-200'
  roundedClass?: string; // e.g. 'rounded' or 'rounded-full'
  className?: string; // wrapper class
}

export default function ProgressBar({
  value,
  colorClass = 'bg-blue-600',
  heightClass = 'h-2',
  trackColorClass = 'bg-gray-200',
  roundedClass = 'rounded',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`w-full ${roundedClass} ${trackColorClass} ${heightClass} ${className}`}
    >
      <div
        className={`${roundedClass} ${colorClass} ${heightClass}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
