import { statusColor } from '../../constants/statusFlow';
import '../../pages/civil.css';

interface CivilStatusBadgeProps {
  /** Canonical status code or a legacy label — colour is resolved centrally. */
  status: string | undefined | null;
  /** Optional label override; defaults to the status text itself. */
  label?: string;
  className?: string;
}

/**
 * Status chip for the civil module. Resolves colour through the central
 * `statusColor()` map (constants/statusFlow) and renders with the existing
 * `.civil-pill <color>` CSS so it matches every other chip in the module.
 *
 * Prefer this over hand-written `<span className="civil-pill ...">` blocks and
 * over ad-hoc colour ternaries scattered in pages.
 */
export default function CivilStatusBadge({
  status,
  label,
  className = '',
}: CivilStatusBadgeProps) {
  const color = statusColor(status);
  const text = label ?? status ?? '—';
  return (
    <span className={`civil-pill ${color} ${className}`.trim()}>{text}</span>
  );
}
