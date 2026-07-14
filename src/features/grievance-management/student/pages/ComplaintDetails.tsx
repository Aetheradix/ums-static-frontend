import { useSearchParams, useNavigate } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const statusColors: Record<string, string> = {
  Submitted: 'grv-status-pill pending',
  'Department Review': 'grv-status-pill review',
  'HoD Review': 'grv-status-pill review',
  'Committee Review': 'grv-status-pill review',
  'Registrar Decision': 'grv-status-pill approved',
  Closed: 'grv-status-pill closed',
};

export default function StudentComplaintDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const grievance = id ? complaints.find(c => c.id === id) : complaints[0];

  if (!grievance) {
    return (
      <FormPage
        title="Complaint Details"
        description=""
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          { label: 'Student Portal', to: grvUrls.student.portal },
          { label: 'Details' },
        ]}
      >
        <FormCard title="">
          <div className="text-center py-16 text-slate-400">
            Grievance not found.
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Grievance Details"
      description={`Ticket: ${grievance.ticketNo}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'My Grievances', to: grvUrls.student.myGrievances },
        { label: 'Details' },
      ]}
    >
      <div className="mb-4">
        <Button
          label="← My Grievances"
          variant="outlined"
          onClick={() => navigate(grvUrls.student.myGrievances)}
        />
      </div>

      <FormCard title="Grievance Information">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400">Ticket No</p>
            <p className="font-mono font-bold text-blue-700">
              {grievance.ticketNo}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Status</p>
            <span className={statusColors[grievance.status]}>
              {grievance.status}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400">Category</p>
            <p className="font-semibold">{grievance.category}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Sub-Category</p>
            <p>{grievance.subCategory}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Department</p>
            <p>{grievance.assignedDept}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Submitted</p>
            <p>{grievance.submittedDate}</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-slate-50 rounded text-sm border">
          <p className="text-xs text-slate-400 mb-1">Subject</p>
          <p className="font-medium text-slate-700">{grievance.subject}</p>
        </div>
        <div className="mt-2 p-3 bg-slate-50 rounded text-sm border">
          <p className="text-xs text-slate-400 mb-1">Description</p>
          <p className="text-slate-600">{grievance.description}</p>
        </div>
      </FormCard>

      {grievance.attachments.length > 0 && (
        <FormCard title="Uploaded Attachments">
          <div className="space-y-2">
            {grievance.attachments.map(att => (
              <div
                key={att.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded border text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold">
                    {att.type === 'PDF' ? '📄' : '🖼'}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-700">{att.name}</p>
                    <p className="text-slate-400">
                      {att.size} · Uploaded {att.uploadedOn}
                    </p>
                  </div>
                </div>
                <button className="text-blue-600 hover:underline text-xs font-medium">
                  Download
                </button>
              </div>
            ))}
          </div>
        </FormCard>
      )}

      {grievance.notesheet && (
        <FormCard title="🟢 eOffice Green Notesheet">
          <div className="mb-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-slate-400">Notesheet No</p>
              <p className="font-mono font-bold text-green-700">
                {grievance.notesheet.notesheetNo}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Department</p>
              <p className="font-semibold">{grievance.notesheet.department}</p>
            </div>
            <div>
              <p className="text-slate-400">Created</p>
              <p>{grievance.notesheet.createdDate}</p>
            </div>
            <div>
              <p className="text-slate-400">Status</p>
              <span className="grv-status-pill approved">
                {grievance.notesheet.status}
              </span>
            </div>
          </div>
          {grievance.notesheet.entries.map(entry => (
            <div
              key={entry.id}
              className="border-l-4 border-green-500 bg-green-50 p-3 rounded mb-2 text-xs"
            >
              <div className="flex justify-between">
                <p className="font-bold text-green-800">
                  {entry.officerName} · {entry.officerDesignation}
                </p>
                <p className="text-slate-400">{entry.timestamp}</p>
              </div>
              <p className="text-slate-500 mt-1">
                <span className="font-semibold text-slate-600">
                  Action Taken:
                </span>{' '}
                {entry.actionTaken}
              </p>
              <p className="text-slate-600 mt-1">{entry.remarks}</p>
            </div>
          ))}
        </FormCard>
      )}

      <FormCard title="Activity Timeline">
        <div className="space-y-3">
          {grievance.timeline.map(t => (
            <div
              key={t.id}
              className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 text-xs"
            >
              <div
                className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.active ? 'bg-blue-500' : t.done ? 'bg-green-500' : 'bg-slate-200'}`}
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-700">{t.action}</p>
                <p className="text-slate-400">
                  {t.performedBy} ({t.role}) · {t.date}
                </p>
                <p className="text-slate-500 bg-slate-50 p-1.5 rounded mt-1">
                  {t.remarks}
                </p>
              </div>
              <span className={statusColors[t.status] || 'grv-status-pill'}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
