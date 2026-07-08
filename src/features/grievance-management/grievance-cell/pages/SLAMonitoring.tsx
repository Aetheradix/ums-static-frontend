import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function GrievanceCellSLAMonitoring() {
  const [list, setList] = useState(complaints);

  const handleEscalateForce = (id: string) => {
    setList(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'Escalated',
            escalationLevel: Math.min(c.escalationLevel + 1, 5),
            slaStatus: 'Breached',
            timeline: [
              ...c.timeline,
              {
                id: `TL${Date.now()}`,
                action: 'Manual Escalation Triggered',
                performedBy: 'Grievance Cell Head',
                role: 'Appellate Admin',
                date: 'Just Now',
                remarks: 'Escalation forced due to lack of response.',
                status: 'Escalated',
                done: true,
                active: true,
              },
            ],
          };
        }
        return c;
      })
    );
    ToastService.success(
      'Manual escalation successfully triggered. Ticket routed to higher authority.'
    );
  };

  return (
    <FormPage
      title="SLA Performance & Countdown Desk"
      description="Monitor statutory timelines, response windows, and trigger emergency manual escalations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell Portal', to: grvUrls.cell.portal },
        { label: 'SLA Monitoring' },
      ]}
    >
      <div className="grv-alert error">
        <i className="pi pi-clock"></i>
        <div>
          <strong>SLA Critical Alert:</strong> Any ticket remaining in
          "Submitted" or "Assigned" status for more than 48 hours is marked as
          Near Breach automatically.
        </div>
      </div>

      <FormCard title="Statutory SLA Timelines Monitor" icon="timer">
        <table className="grv-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Category</th>
              <th>Urgency</th>
              <th>Assigned Custodian</th>
              <th>Deadline</th>
              <th>Time Left</th>
              <th>Timeline Compliance</th>
              <th>Forced Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map(c => {
              const isResolved =
                c.status === 'Resolved' || c.status === 'Closed';
              const isBreached = c.slaStatus === 'Breached';
              const isNearBreach = c.slaStatus === 'Near Breach';

              return (
                <tr key={c.id}>
                  <td className="font-mono font-bold">{c.ticketNo}</td>
                  <td>{c.category}</td>
                  <td>
                    <span
                      className={`grv-status-pill ${c.priority.toLowerCase()}`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td>
                    <div className="font-bold text-slate-800">
                      {c.assignedTo}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {c.assignedDept}
                    </span>
                  </td>
                  <td>{c.slaDeadline}</td>
                  <td className="font-mono font-bold">
                    {isResolved
                      ? 'Settled'
                      : isBreached
                        ? 'Breached'
                        : `${c.slaRemainingHrs} hrs`}
                  </td>
                  <td>
                    <span
                      className={`grv-status-pill ${isResolved ? 'active' : isBreached ? 'sla-breached' : isNearBreach ? 'sla-near' : 'sla-ok'}`}
                    >
                      {isResolved ? 'SLA Met' : c.slaStatus}
                    </span>
                  </td>
                  <td>
                    {!isResolved && (
                      <Button
                        label="Force Escalate"
                        icon="arrow-up"
                        variant="danger"
                        size="small"
                        onClick={() => handleEscalateForce(c.id)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
