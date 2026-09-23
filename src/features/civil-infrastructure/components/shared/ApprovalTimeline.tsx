import type { AuditEntry } from '../../utils/audit';
import { statusColor } from '../../constants/statusFlow';
import { formatDateTime } from '../../utils/format';
import './ApprovalTimeline.css';

interface ApprovalTimelineProps {
  /** Ordered audit entries (oldest first). */
  entries: AuditEntry[] | undefined | null;
  /** Optional heading; omit to render just the list. */
  title?: string;
  /** Shown when there are no entries yet. */
  emptyMessage?: string;
}

/**
 * Vertical who/when/remarks trail for any civil record's `statusHistory`.
 * Colours each node via the central `statusColor()` map so the timeline stays
 * consistent with status chips elsewhere.
 */
export default function ApprovalTimeline({
  entries,
  title = 'Approval Timeline',
  emptyMessage = 'No workflow activity recorded yet.',
}: ApprovalTimelineProps) {
  const list = Array.isArray(entries) ? entries : [];

  return (
    <div className="civil-timeline">
      {title && <h4 className="civil-timeline-title">{title}</h4>}
      {list.length === 0 ? (
        <p className="civil-timeline-empty">{emptyMessage}</p>
      ) : (
        <ol className="civil-timeline-list">
          {list.map((e, i) => (
            <li key={`${e.timestamp}-${i}`} className="civil-timeline-item">
              <span
                className={`civil-timeline-dot civil-timeline-dot--${statusColor(
                  e.status
                )}`}
              />
              <div className="civil-timeline-content">
                <div className="civil-timeline-head">
                  <span className="civil-timeline-action">
                    {e.action || e.status}
                  </span>
                  <span className="civil-timeline-date">
                    {formatDateTime(e.timestamp || e.date)}
                  </span>
                </div>
                <div className="civil-timeline-actor">{e.actor}</div>
                {e.remarks && (
                  <p className="civil-timeline-remarks">{e.remarks}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
