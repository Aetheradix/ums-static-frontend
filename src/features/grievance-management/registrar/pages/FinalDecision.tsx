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

export default function RegistrarFinalDecision() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const grievance = id ? complaints.find(c => c.id === id) : complaints[0];

  const [decision, setDecision] = useState('');
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [sanctioned, setSanctioned] = useState(false);

  const decisionOptions = [
    { name: 'Uphold — Resolution Letter to be issued', value: 'Uphold' },
    {
      name: 'Partially Upheld — Partial relief granted',
      value: 'Partial Uphold',
    },
    { name: 'Rejected — Complaint not substantiated', value: 'Rejected' },
    { name: 'Referred back to Department for re-inquiry', value: 'Refer Back' },
  ];

  const handleSanction = () => {
    if (!decision || !resolutionRemarks) {
      ToastService.error('Please fill all required fields.');
      return;
    }
    setSanctioned(true);
    ToastService.success('Resolution Letter sanctioned. Complaint closed.');
  };

  if (!grievance) {
    return (
      <FormPage
        title="Final Decision"
        description=""
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          { label: 'Registrar', to: grvUrls.registrar.portal },
          { label: 'Pending', to: grvUrls.registrar.pending },
          { label: 'Decision' },
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
    { id: 'info', label: 'Complaint Info' },
    { id: 'notesheet', label: '🟢 Full Notesheet' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'decision', label: '⚖️ Sanction Order' },
  ];

  if (sanctioned) {
    const letterNo = `DAVV/REG/GRV/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    return (
      <FormPage
        title="Resolution Letter Sanctioned"
        description="Final order issued by Registrar"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          { label: 'Registrar', to: grvUrls.registrar.portal },
          { label: 'Sanctioned' },
        ]}
      >
        <FormCard title="">
          <div className="flex flex-col items-center py-10 gap-4">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-5xl">
              ⚖️
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Resolution Order Issued!
            </h2>
            <p className="text-slate-500 text-sm text-center max-w-md">
              The Resolution Letter has been sanctioned and dispatched to the
              complainant. The grievance file is now closed.
            </p>
            <div className="bg-slate-50 border rounded-lg p-5 w-full max-w-md">
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ticket No</span>
                  <span className="font-mono font-bold text-blue-700">
                    {grievance.ticketNo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Letter No</span>
                  <span className="font-mono font-bold text-green-700">
                    {letterNo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Decision</span>
                  <span className="font-semibold text-slate-700">
                    {decision}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="font-semibold">
                    {new Date().toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                label="Download Letter"
                variant="primary"
                onClick={() => {}}
              />
              <Button
                label="← Pending Decisions"
                variant="outlined"
                onClick={() => navigate(grvUrls.registrar.pending)}
              />
            </div>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Final Decision — Registrar Desk"
      description={`Ticket: ${grievance.ticketNo}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Registrar', to: grvUrls.registrar.portal },
        { label: 'Pending', to: grvUrls.registrar.pending },
        { label: 'Decision' },
      ]}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Status</p>
          <span className={statusColors[grievance.status]}>
            {grievance.status}
          </span>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Complainant</p>
          <p className="text-sm font-semibold">{grievance.studentName}</p>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Category</p>
          <p className="text-xs font-semibold truncate">{grievance.category}</p>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Submitted</p>
          <p className="text-sm font-semibold">{grievance.submittedDate}</p>
        </div>
      </div>

      {/* Tabs */}
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
        <FormCard title="Complaint Information">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">Complainant</p>
              <p className="font-semibold">{grievance.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">ID / Enrollment</p>
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
              <p className="text-xs text-slate-400">Department</p>
              <p>{grievance.assignedDept}</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-50 rounded border">
            <p className="text-xs text-slate-400 mb-1">Subject</p>
            <p className="font-medium text-slate-700 text-sm">
              {grievance.subject}
            </p>
          </div>
          <div className="mt-2 p-3 bg-slate-50 rounded border">
            <p className="text-xs text-slate-400 mb-1">Full Description</p>
            <p className="text-slate-600 text-sm">{grievance.description}</p>
          </div>
        </FormCard>
      )}

      {activeTab === 'notesheet' && (
        <FormCard title="🟢 Complete eOffice Notesheet History">
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
                  <p className="text-slate-400">Department</p>
                  <p>{grievance.notesheet.department}</p>
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
              <p>No notesheet available for this complaint.</p>
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

      {activeTab === 'decision' && (
        <FormCard title="⚖️ Registrar Sanction Order">
          <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700">
            <p className="font-bold mb-1">
              Authority — Vice-Chancellor's Delegated Power:
            </p>
            <p>
              The Registrar is issuing this final order under the authority
              delegated by the Vice-Chancellor per Statute 28(3) of DAVV Act.
              This order is final and binding.
            </p>
          </div>
          <FormGrid columns={1}>
            <DropDownList
              label="Registrar Decision *"
              data={decisionOptions}
              textField="name"
              optionValue="value"
              value={decision}
              onChange={val => setDecision(val as string)}
            />
            <TextArea
              label="Official Resolution Remarks *"
              placeholder="Enter the Registrar's official remarks for the Resolution Letter. This will be included in the formal letter dispatched to the complainant..."
              value={resolutionRemarks}
              onChange={setResolutionRemarks}
              rows={5}
            />
            <div className="flex justify-end gap-3">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => navigate(grvUrls.registrar.pending)}
              />
              <Button
                label="Issue Resolution Letter ⚖️"
                variant="primary"
                onClick={handleSanction}
              />
            </div>
          </FormGrid>
        </FormCard>
      )}
    </FormPage>
  );
}
