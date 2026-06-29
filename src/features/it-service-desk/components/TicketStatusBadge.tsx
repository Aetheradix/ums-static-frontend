import { StatusBadge } from 'shared/new-components';
import { TicketStatus } from '../data';

const statusVariant: Record<
  string,
  'approved' | 'pending' | 'rejected' | 'neutral'
> = {
  [TicketStatus.RESOLVED]: 'approved',
  [TicketStatus.CLOSED]: 'approved',
  [TicketStatus.DRAFT]: 'pending',
  [TicketStatus.SUBMITTED]: 'pending',
  [TicketStatus.OPEN]: 'pending',
  [TicketStatus.PENDING]: 'pending',
  [TicketStatus.WAITING_FOR_USER]: 'pending',
  [TicketStatus.ASSIGNED]: 'neutral',
  [TicketStatus.ACCEPTED]: 'neutral',
  [TicketStatus.IN_PROGRESS]: 'neutral',
  [TicketStatus.REOPENED]: 'neutral',
  [TicketStatus.ESCALATED]: 'rejected',
};

interface Props {
  status: string;
  className?: string;
}

export default function TicketStatusBadge({ status, className }: Props) {
  return (
    <StatusBadge
      label={status}
      variant={statusVariant[status] ?? 'neutral'}
      className={className}
    />
  );
}
