import './AparStatusBadge.css';

interface AparStatusBadgeProps {
  status: CareerAdvancement.AparApplication.AparApplicationItem['status'];
}

export default function AparStatusBadge({ status }: AparStatusBadgeProps) {
  const statusClass = `apar-status-badge apar-status-badge--${status.toLowerCase()}`;
  return <span className={statusClass}>{status}</span>;
}
