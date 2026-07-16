import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const statusOrder = [
  'Submitted',
  'Department Review',
  'HoD Review',
  'Committee Review',
  'Registrar Decision',
  'Closed',
];

const statusColors: Record<string, string> = {
  Submitted: 'grv-status-pill pending',
  'Department Review': 'grv-status-pill review',
  'HoD Review': 'grv-status-pill review',
  'Committee Review': 'grv-status-pill review',
  'Registrar Decision': 'grv-status-pill approved',
  Closed: 'grv-status-pill closed',
};

export default function StudentTrackComplaint() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const grievance = id ? complaints.find(c => c.id === id) : complaints[0];

  if (!grievance) {
    return (
      <FormPage
        title="Track Complaint"
        description="Real-time status of your grievance"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          { label: 'Student Login', to: grvUrls.student.portal },
          { label: 'Track' },
        ]}
      >
        <FormCard title="">
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-medium">Grievance not found</p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const currentIdx = statusOrder.indexOf(grievance.status);

  return (
    <FormPage
      title="Track Grievance"
      description={`Ticket No: ${grievance.ticketNo}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Login', to: grvUrls.student.portal },
        { label: 'My Grievances', to: grvUrls.student.myGrievances },
        { label: 'Track' },
      ]}
    >
      <div className="mb-4">
        <Button
          label="← My Grievances"
          variant="outlined"
          onClick={() => navigate(grvUrls.student.myGrievances)}
        />
      </div>

      <FormCard title="Grievance Overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400">Ticket Number</p>
            <p className="font-mono font-bold text-blue-700">
              {grievance.ticketNo}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Category</p>
            <p className="font-semibold">{grievance.category}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Submitted On</p>
            <p className="font-semibold">{grievance.submittedDate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Current Status</p>
            <span className={statusColors[grievance.status]}>
              {grievance.status}
            </span>
          </div>
        </div>
        <div className="mt-3 p-3 bg-slate-50 rounded text-sm">
          <p className="text-xs text-slate-400 mb-1">Subject</p>
          <p className="font-medium text-slate-700">{grievance.subject}</p>
        </div>
      </FormCard>

      <FormCard title="Workflow Progress">
        <div className="flex items-start justify-between relative">
          <div
            className="absolute top-4 left-0 right-0 h-1 bg-slate-100 z-0"
            style={{ margin: '0 32px' }}
          >
            <div
              className="h-full bg-blue-500 rounded transition-all"
              style={{
                width: `${(currentIdx / (statusOrder.length - 1)) * 100}%`,
              }}
            />
          </div>
          {statusOrder.map((status, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            return (
              <div
                key={status}
                className="flex flex-col items-center gap-2 z-10 flex-1"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 font-bold transition-all ${done ? 'bg-blue-600 border-blue-600 text-white' : active ? 'bg-white border-blue-600 text-blue-600' : 'bg-white border-slate-200 text-slate-300'}`}
                >
                  {done ? '✓' : idx + 1}
                </div>
                <p
                  className={`text-center text-[9px] font-medium leading-tight max-w-16 ${active ? 'text-blue-700' : done ? 'text-slate-600' : 'text-slate-300'}`}
                >
                  {status}
                </p>
              </div>
            );
          })}
        </div>
      </FormCard>

      <FormCard title="Activity Timeline">
        <div className="space-y-4">
          {grievance.timeline.map(t => (
            <div
              key={t.id}
              className="flex gap-4 pb-4 border-b border-slate-100 last:border-0"
            >
              <div
                className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${t.active ? 'bg-blue-500 ring-4 ring-blue-100' : t.done ? 'bg-green-500' : 'bg-slate-200'}`}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {t.action}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t.performedBy} ({t.role}) · {t.date}
                    </p>
                  </div>
                  <span className={statusColors[t.status] || 'grv-status-pill'}>
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded border">
                  {t.remarks}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {grievance.notesheet && (
        <FormCard title="🟢 eOffice Green Notesheet">
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <p className="text-slate-400">Notesheet No</p>
                <p className="font-mono font-bold text-green-700">
                  {grievance.notesheet.notesheetNo}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Department</p>
                <p className="font-semibold">
                  {grievance.notesheet.department}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Created</p>
                <p className="font-semibold">
                  {grievance.notesheet.createdDate}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <span className="grv-status-pill approved">
                  {grievance.notesheet.status}
                </span>
              </div>
            </div>
            {grievance.notesheet.entries.map(e => (
              <div
                key={e.id}
                className="border border-green-200 bg-green-50 rounded p-3 text-xs"
              >
                <div className="flex justify-between mb-2">
                  <p className="font-bold text-green-800">
                    {e.officerName} — {e.officerDesignation}
                  </p>
                  <p className="text-slate-400">{e.timestamp}</p>
                </div>
                <p className="text-slate-600 mb-1">
                  <span className="font-semibold">Action:</span> {e.actionTaken}
                </p>
                <p className="text-slate-600">{e.remarks}</p>
              </div>
            ))}
          </div>
        </FormCard>
      )}

      <div className="flex gap-3">
        <Button
          label="← My Grievances"
          variant="outlined"
          onClick={() => navigate(grvUrls.student.myGrievances)}
        />
        <Button
          label="View Full Details"
          variant="primary"
          onClick={() =>
            navigate(`${grvUrls.student.details}?id=${grievance.id}`)
          }
        />
      </div>
    </FormPage>
  );
}
