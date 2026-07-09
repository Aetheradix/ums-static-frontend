import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function StudentTrackComplaint() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active mock student
  const STUDENT_ENROLL = 'CS2021001';
  const myComplaints = complaints.filter(
    c => c.enrollmentNo === STUDENT_ENROLL || !c.isAnonymous
  );

  const statuses = [
    'ALL',
    'Submitted',
    'Assigned',
    'Under Review',
    'Forwarded',
    'Escalated',
    'Resolved',
    'Closed',
  ];

  const filtered = myComplaints.filter(c => {
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesSearch =
      c.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <FormPage
      title="Track Active Grievances"
      description="Monitor the real-time processing status, assigned department and SLA metrics of your filed tickets."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'Track Complaint' },
      ]}
    >
      {/* Filters row */}
      <div className="grv-filters-row">
        <input
          type="text"
          className="grv-search-input"
          placeholder="Search by Ticket No., Subject, Category..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select
          className="grv-filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          {statuses.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of complaints */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="grv-empty">
            <i className="pi pi-search text-gray-300"></i>
            <p>
              No active grievances matching the selected filters were found.
            </p>
          </div>
        ) : (
          filtered.map(c => {
            const isEscalated = c.status === 'Escalated';
            const isNearBreach = c.slaStatus === 'Near Breach';
            const isBreached = c.slaStatus === 'Breached';

            return (
              <div
                key={c.id}
                className={`grv-complaint-card ${isEscalated ? 'escalated' : c.status === 'Resolved' ? 'resolved' : 'pending'}`}
                onClick={() =>
                  navigate(grvUrls.student.details, {
                    state: { complaintId: c.id },
                  })
                }
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-400">
                        TICKET
                      </span>
                      <span className="text-sm font-extrabold text-blue-600 font-mono">
                        {c.ticketNo}
                      </span>
                      {c.isAnonymous && (
                        <span className="grv-status-pill anonymous">
                          Anonymous
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">
                      {c.subject}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">
                      {c.category} · Sub-category: {c.subCategory}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>
                        Submitted:{' '}
                        <strong className="text-slate-600">
                          {c.submittedDate}
                        </strong>
                      </span>
                      <span>
                        Assigned to:{' '}
                        <strong className="text-slate-600">
                          {c.assignedDept}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <span
                      className={`grv-status-pill ${c.status.toLowerCase().replace(' ', '-')}`}
                    >
                      {c.status}
                    </span>

                    {/* Live SLA Badge */}
                    {c.status !== 'Closed' && c.status !== 'Resolved' && (
                      <span
                        className={`grv-sla-counter ${isBreached ? 'breached' : isNearBreach ? 'near' : 'ok'}`}
                      >
                        {isBreached
                          ? 'SLA BREACHED'
                          : `SLA: ${c.slaRemainingHrs} hrs left`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-400">
                    Latest Activity:{' '}
                    <strong className="text-slate-600">
                      {c.timeline.find(t => t.active)?.action ||
                        'Awaiting assignment'}
                    </strong>
                  </span>
                  <span className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
                    Action Desk Desk{' '}
                    <i className="pi pi-chevron-right text-[10px]"></i>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </FormPage>
  );
}
