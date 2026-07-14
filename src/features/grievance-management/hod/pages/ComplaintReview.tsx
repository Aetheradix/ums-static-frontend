import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextArea, DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
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

export default function HodComplaintReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const grievance = id ? complaints.find(c => c.id === id) : complaints[0];

  const [activeTab, setActiveTab] = useState('info');
  const [remarks, setRemarks] = useState('');
  const [action, setAction] = useState('');
  const [forwarded, setForwarded] = useState(false);

  const actionOptions = [
    { name: 'Forward to Grievance Committee', value: 'Forward to Committee' },
    { name: 'Forward to Registrar', value: 'Forward to Registrar' },
    { name: 'Return to Department Officer', value: 'Return to Department' },
    { name: 'Approve & Close', value: 'Approve & Close' },
  ];

  const handleForward = () => {
    if (!remarks || !action) {
      ToastService.error('Please fill HoD remarks and select action.');
      return;
    }
    setForwarded(true);
    ToastService.success(`File forwarded successfully. Action: ${action}`);
  };

  if (!grievance) {
    return (
      <FormPage
        title="Complaint Review"
        description=""
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          { label: 'HoD Portal', to: grvUrls.hod.portal },
          { label: 'Review' },
        ]}
      >
        <FormCard title="">
          <div className="text-center py-16 text-slate-400">
            Complaint not found.
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const tabs = [
    { id: 'info', label: 'Complainant Info' },
    { id: 'notesheet', label: '🟢 Notesheet' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'action', label: 'HoD Action' },
  ];

  return (
    <FormPage
      title="Complaint Review — HoD Desk"
      description={`Ticket: ${grievance.ticketNo} · ${grievance.status}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'HoD Portal', to: grvUrls.hod.portal },
        { label: 'Pending', to: grvUrls.hod.pending },
        { label: 'Review' },
      ]}
    >
      <div className="mb-4">
        <Button
          label="← Pending Complaints"
          variant="outlined"
          onClick={() => navigate(grvUrls.hod.pending)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-xs text-slate-400">Status</p>
          <span className={statusColors[grievance.status]}>
            {grievance.status}
          </span>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-xs text-slate-400">Category</p>
          <p className="text-sm font-semibold text-slate-700">
            {grievance.category}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-xs text-slate-400">Submitted</p>
          <p className="text-sm font-semibold">{grievance.submittedDate}</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-xs text-slate-400">Department</p>
          <p className="text-xs font-semibold text-slate-700 truncate">
            {grievance.assignedDept}
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-4 border-b border-slate-200">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <FormCard title="Complainant & Grievance Details">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">Complainant</p>
              <p className="font-semibold">{grievance.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Enrollment / Emp ID</p>
              <p className="font-mono">{grievance.enrollmentNo}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Course / Designation</p>
              <p>{grievance.course}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Sub-Category</p>
              <p>{grievance.subCategory}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Incident Date</p>
              <p>{grievance.incidentDate}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Location</p>
              <p>{grievance.location}</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-50 rounded border">
            <p className="text-xs text-slate-400 mb-1">Subject</p>
            <p className="text-sm font-medium text-slate-700">
              {grievance.subject}
            </p>
          </div>
          <div className="mt-2 p-3 bg-slate-50 rounded border">
            <p className="text-xs text-slate-400 mb-1">Description</p>
            <p className="text-sm text-slate-600">{grievance.description}</p>
          </div>
        </FormCard>
      )}

      {activeTab === 'notesheet' && (
        <FormCard title="🟢 eOffice Green Notesheet">
          {grievance.notesheet ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                <div>
                  <p className="text-slate-400">Notesheet No</p>
                  <p className="font-mono font-bold text-green-700">
                    {grievance.notesheet.notesheetNo}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Grievance No</p>
                  <p className="font-mono">{grievance.notesheet.grievanceNo}</p>
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
              {grievance.notesheet.entries.map((e, idx) => (
                <div
                  key={e.id}
                  className="border-l-4 border-green-400 bg-green-50 p-3 rounded mb-3 text-xs"
                >
                  <div className="flex justify-between mb-1">
                    <p className="font-bold text-green-800">
                      Entry {idx + 1} — {e.officerName} ({e.officerDesignation})
                    </p>
                    <p className="text-slate-400">{e.timestamp}</p>
                  </div>
                  <p className="text-slate-500">
                    <span className="font-semibold text-slate-700">
                      Action:
                    </span>{' '}
                    {e.actionTaken}
                  </p>
                  <p className="text-slate-600 mt-1">{e.remarks}</p>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <p className="text-3xl mb-2">📝</p>
              <p>No notesheet initiated yet.</p>
            </div>
          )}
        </FormCard>
      )}

      {activeTab === 'timeline' && (
        <FormCard title="Activity Timeline">
          <div className="space-y-3">
            {grievance.timeline.map(t => (
              <div
                key={t.id}
                className="flex gap-3 pb-3 border-b last:border-0 text-xs"
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
      )}

      {activeTab === 'action' && (
        <FormCard title="HoD Remarks & Action">
          {forwarded ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-green-700 font-semibold">
                File has been forwarded successfully!
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Action taken: <strong>{action}</strong>
              </p>
              <div className="mt-4">
                <Button
                  label="← Back to Pending List"
                  variant="outlined"
                  onClick={() => navigate(grvUrls.hod.pending)}
                />
              </div>
            </div>
          ) : (
            <FormGrid columns={1}>
              <DropDownList
                label="Action to be Taken *"
                data={actionOptions}
                textField="name"
                optionValue="value"
                value={action}
                onChange={val => setAction(val as string)}
              />
              <TextArea
                label="HoD Official Remarks *"
                placeholder="Enter your official remarks for the eOffice notesheet..."
                value={remarks}
                onChange={setRemarks}
                rows={5}
              />
              <div className="flex justify-end gap-3">
                <Button
                  label="Cancel"
                  variant="outlined"
                  onClick={() => navigate(grvUrls.hod.pending)}
                />
                <Button
                  label="Forward File →"
                  variant="primary"
                  onClick={handleForward}
                />
              </div>
            </FormGrid>
          )}
        </FormCard>
      )}
    </FormPage>
  );
}
