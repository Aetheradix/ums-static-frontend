import './IncidentTimeline.css';

type IncidentTimelineAction =
  | 'reported'
  | 'assigned'
  | 'investigating'
  | 'action_taken'
  | 'resolved'
  | 'closed';

export interface IncidentTimelineStep {
  action: IncidentTimelineAction;
  actor: string;
  date: string;
  remarks: string;
}

interface IncidentTimelineProps {
  steps: IncidentTimelineStep[];
}

const ACTION_ICONS: Record<IncidentTimelineAction, string> = {
  reported: 'flag',
  assigned: 'user',
  investigating: 'search',
  action_taken: 'bolt',
  resolved: 'check',
  closed: 'lock',
};

const ACTION_LABELS: Record<IncidentTimelineAction, string> = {
  reported: 'Reported',
  assigned: 'Assigned to Officer',
  investigating: 'Under Investigation',
  action_taken: 'Action Taken',
  resolved: 'Resolved',
  closed: 'Closed',
};

export default function IncidentTimeline({ steps }: IncidentTimelineProps) {
  return (
    <div className="incident-timeline">
      {steps.map((step, idx) => (
        <div key={idx} className="incident-timeline-item">
          <div className="incident-timeline-left">
            <div className={`incident-timeline-dot ${step.action}`}>
              <i className={`pi pi-${ACTION_ICONS[step.action]}`} />
            </div>
            {idx < steps.length - 1 && <div className="incident-timeline-line" />}
          </div>
          <div className="incident-timeline-content">
            <div className="incident-timeline-header">
              <span className="incident-timeline-actor">{step.actor}</span>
              <span className="incident-timeline-date">{step.date}</span>
            </div>
            <span className={`incident-timeline-action-label ${step.action}`}>
              {ACTION_LABELS[step.action]}
            </span>
            {step.remarks && (
              <p className="incident-timeline-remarks">&ldquo;{step.remarks}&rdquo;</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
