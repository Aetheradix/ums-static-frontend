import './ApprovalTimeline.css';

type TimelineStatus =
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'pending'
  | 'forwarded';

export interface TimelineStep {
  actor: string;
  role?: string;
  action: TimelineStatus;
  date: string;
  remarks?: string;
}

interface ApprovalTimelineProps {
  steps: TimelineStep[];
}

const ACTION_ICONS: Record<TimelineStatus, string> = {
  submitted: 'send',
  approved: 'check',
  rejected: 'times',
  pending: 'clock',
  forwarded: 'arrow-right',
};

const ACTION_LABELS: Record<TimelineStatus, string> = {
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
  pending: 'Awaiting Review',
  forwarded: 'Forwarded',
};

export default function ApprovalTimeline({ steps }: ApprovalTimelineProps) {
  return (
    <div className="approval-timeline">
      {steps.map((step, idx) => (
        <div key={idx} className="approval-timeline-item">
          <div className="approval-timeline-left">
            <div className={`approval-timeline-dot ${step.action}`}>
              <i className={`pi pi-${ACTION_ICONS[step.action]}`} />
            </div>
            {idx < steps.length - 1 && (
              <div className="approval-timeline-line" />
            )}
          </div>
          <div className="approval-timeline-content">
            <div className="approval-timeline-header">
              <span className="approval-timeline-actor">{step.actor}</span>
              <span className="approval-timeline-date">{step.date}</span>
            </div>
            {step.role && (
              <span
                className="approval-timeline-date"
                style={{ marginBottom: '0.25rem', display: 'block' }}
              >
                {step.role}
              </span>
            )}
            <span className={`approval-timeline-action-label ${step.action}`}>
              {ACTION_LABELS[step.action]}
            </span>
            {step.remarks && (
              <p className="approval-timeline-remarks">
                &ldquo;{step.remarks}&rdquo;
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
