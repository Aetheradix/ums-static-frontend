import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextArea, DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import { complaints, committees } from '../../mocks';
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

export default function GrievanceCellCommitteeReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const grievance = id ? complaints.find(c => c.id === id) : complaints[0];

  const [activeTab, setActiveTab] = useState('info');
  const [committeeId, setCommitteeId] = useState('');
  const [hearingDate, setHearingDate] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [forwarded, setForwarded] = useState(false);

  const committeeOptions = committees.map(c => ({
    name: `${c.acronym} — ${c.name}`,
    value: c.id,
  }));

  const handleForward = () => {
    if (!committeeId || !recommendation) {
      ToastService.error('Please select committee and enter recommendation.');
      return;
    }
    setForwarded(true);
    ToastService.success(
      'Case forwarded to Registrar with committee recommendation.'
    );
  };

  if (!grievance) {
    return (
      <FormPage
        title="Committee Review"
        description=""
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          { label: 'Grievance Cell', to: grvUrls.cell.portal },
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
    { id: 'info', label: 'Complaint Info' },
    { id: 'notesheet', label: '🟢 Notesheet' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'committee', label: 'Committee Action' },
  ];

  return (
    <FormPage
      title="Committee Review"
      description={`Ticket: ${grievance.ticketNo}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell', to: grvUrls.cell.portal },
        { label: 'Management', to: grvUrls.cell.management },
        { label: 'Review' },
      ]}
    >
      <div className="mb-4">
        <Button
          label="← Complaint Management"
          variant="outlined"
          onClick={() => navigate(grvUrls.cell.management)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Current Status</p>
          <span className={statusColors[grievance.status]}>
            {grievance.status}
          </span>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Category</p>
          <p className="text-sm font-semibold truncate">{grievance.category}</p>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Complainant</p>
          <p className="text-sm font-semibold">{grievance.studentName}</p>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Submitted</p>
          <p className="text-sm font-semibold">{grievance.submittedDate}</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
          <p className="text-xs text-indigo-500 font-medium">Hearing Date</p>
          <p className="text-sm font-bold text-indigo-700">
            {grievance.hearingDate ?? '—'}
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
        <FormCard title="Grievance Details">
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
              <p className="text-xs text-slate-400">Department</p>
              <p>{grievance.assignedDept}</p>
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
              <p className="text-xs text-indigo-500 font-semibold">
                Hearing Date
              </p>
              <p className="font-semibold text-indigo-700">
                {grievance.hearingDate ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Location</p>
              <p>{grievance.location}</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-50 rounded border">
            <p className="text-xs text-slate-400 mb-1">Subject</p>
            <p className="font-medium text-slate-700 text-sm">
              {grievance.subject}
            </p>
          </div>
          <div className="mt-2 p-3 bg-slate-50 rounded border">
            <p className="text-xs text-slate-400 mb-1">Description</p>
            <p className="text-slate-600 text-sm">{grievance.description}</p>
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
              <p>No notesheet available yet.</p>
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

      {activeTab === 'committee' && (
        <FormCard title="Committee Assignment & Recommendation">
          {forwarded ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-green-700 font-semibold text-lg">
                Case forwarded to Registrar!
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Committee recommendation has been submitted for final sanction.
              </p>
              <div className="mt-4">
                <Button
                  label="← Back to Management"
                  variant="outlined"
                  onClick={() => navigate(grvUrls.cell.management)}
                />
              </div>
            </div>
          ) : (
            (() => {
              const selectedCommittee = committees.find(
                c => c.id === committeeId
              );
              return (
                <FormGrid columns={2}>
                  <DropDownList
                    label="Assign to Committee *"
                    data={committeeOptions}
                    textField="name"
                    optionValue="value"
                    value={committeeId}
                    onChange={val => setCommitteeId(val as string)}
                  />
                  <div>
                    <label className="grv-label">Hearing Date</label>
                    <input
                      className="grv-input w-full"
                      type="date"
                      value={hearingDate}
                      onChange={e => setHearingDate(e.target.value)}
                    />
                  </div>

                  {selectedCommittee && (
                    <div className="md:col-span-2 border border-purple-200 rounded-xl p-3 bg-purple-50/40">
                      <p className="text-xs font-bold text-purple-900 mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">
                          groups
                        </span>
                        Committee Members Panel ({selectedCommittee.acronym})
                      </p>
                      <div className="overflow-x-auto rounded-lg border border-purple-100 bg-white">
                        <table className="w-full text-xs">
                          <thead className="bg-purple-50/80 border-b border-purple-100">
                            <tr>
                              <th className="px-3 py-1.5 text-left text-slate-500 font-semibold">
                                Name
                              </th>
                              <th className="px-3 py-1.5 text-left text-slate-500 font-semibold">
                                Role
                              </th>
                              <th className="px-3 py-1.5 text-left text-slate-500 font-semibold">
                                Designation
                              </th>
                              <th className="px-3 py-1.5 text-left text-slate-500 font-semibold">
                                Department
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-purple-50">
                            {selectedCommittee.members.map(member => (
                              <tr
                                key={member.id}
                                className="hover:bg-purple-50/20 transition-colors"
                              >
                                <td className="px-3 py-2 font-bold text-slate-800">
                                  {member.name}
                                </td>
                                <td className="px-3 py-2">
                                  <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                    {member.role}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-slate-600">
                                  {member.designation}
                                </td>
                                <td className="px-3 py-2 text-slate-500">
                                  {member.department}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <TextArea
                      label="Committee Recommendation *"
                      placeholder="Enter the committee's formal recommendation / findings to be forwarded to the Registrar for final sanction..."
                      value={recommendation}
                      onChange={setRecommendation}
                      rows={5}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3">
                    <Button
                      label="Cancel"
                      variant="outlined"
                      onClick={() => navigate(grvUrls.cell.management)}
                    />
                    <Button
                      label="Forward to Registrar →"
                      variant="primary"
                      onClick={handleForward}
                    />
                  </div>
                </FormGrid>
              );
            })()
          )}
        </FormCard>
      )}
    </FormPage>
  );
}
