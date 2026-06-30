import { StatusBadge } from 'shared/new-components';

interface Props {
  priority: string;
  className?: string;
}

const variantMap: Record<
  string,
  'approved' | 'pending' | 'rejected' | 'neutral'
> = {
  Critical: 'rejected',
  High: 'pending',
  Medium: 'neutral',
  Low: 'approved',
};

export default function PriorityBadge({ priority, className = '' }: Props) {
  return (
    <StatusBadge
      label={priority}
      variant={variantMap[priority] ?? 'neutral'}
      className={className}
    />
  );
}
