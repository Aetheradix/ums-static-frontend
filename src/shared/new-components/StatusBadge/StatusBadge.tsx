import './StatusBadge.css';

type StatusBadgeVariant = 'pending' | 'approved' | 'rejected' | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: StatusBadgeVariant;
  className?: string;
}

export default function StatusBadge({
  label,
  variant = 'neutral',
  className = '',
}: StatusBadgeProps) {
  return (
    <span
      className={`status-badge status-badge-${variant} ${className}`.trim()}
    >
      <span className="status-badge-dot" />
      <span>{label}</span>
    </span>
  );
}
