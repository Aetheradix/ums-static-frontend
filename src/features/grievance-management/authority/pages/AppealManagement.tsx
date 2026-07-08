import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AuthorityAppealManagement() {
  const [list, setList] = useState(
    complaints.filter(c => c.status === 'Appealed' || c.id === 'GRV002') // GRV002 has CPGRAMS appeal indicators
  );

  const [selectedId, setSelectedId] = useState(list[0]?.id ?? '');
  const [remarks, setRemarks] = useState('');
  const [appealAction, setAppealAction] = useState<
    'Uphold' | 'Modify' | 'Reinvestigate' | ''
  >('');

  const activeTicket = list.find(c => c.id === selectedId);

  const handleDecision = () => {
    if (!appealAction) {
      ToastService.error('Please select an appellate decision action.');
      return;
    }
    if (!remarks.trim()) {
      ToastService.error('Decision justification remarks are required.');
      return;
    }

    setList(prev => prev.filter(c => c.id !== selectedId));
    ToastService.success(
      `Appellate board decision successfully logged: ${appealAction}. Notification sent to SGRC board.`
    );
    setAppealAction('');
    setRemarks('');
  };

  return (
    <FormPage
      title="Appellate Appeals hearings panel"
      description="Hear petitions contested by students or faculty and issue final University decisions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Authority Portal', to: grvUrls.authority.portal },
        { label: 'Appeal Management' },
      ]}
    >
      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 2fr' }}
      >
        {/* Left contested list */}
        <FormCard title="Contested Appeals Queue" icon="gavel">
          <div className="space-y-3">
            {list.length === 0 ? (
              <p className="text-xs text-slate-400">
                All filed appeals have been resolved by the SGRC board.
              </p>
            ) : (
              list.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedId === c.id
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 font-mono text-xs font-bold text-red-600">
                    <span>{c.ticketNo}</span>
                    <span className="grv-status-pill appealed">APPEALED</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs line-clamp-1">
                    {c.subject}
                  </h4>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Nodal: {c.assignedTo}
                  </span>
                </div>
              ))
            )}
          </div>
        </FormCard>

        {/* Right review form */}
        {activeTicket ? (
          <div className="space-y-4">
            <FormCard
              title={`Reviewing Appeal Hearing: ${activeTicket.ticketNo}`}
            >
              <div className="space-y-3 text-xs">
                <div className="grv-info-field">
                  <span className="grv-info-label">Complainant / Student</span>
                  <span className="grv-info-value">
                    {activeTicket.studentName}
                  </span>
                </div>
                <div className="grv-info-field">
                  <span className="grv-info-label">
                    Original Petition Subject
                  </span>
                  <span className="grv-info-value">{activeTicket.subject}</span>
                </div>
                {activeTicket.resolutionRemarks && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-100">
                    <span className="font-bold block mb-1">
                      Lower-Level Department Resolution remarks:
                    </span>
                    <p className="italic">"{activeTicket.resolutionRemarks}"</p>
                  </div>
                )}
                <div className="p-3 bg-red-50 text-red-800 rounded border border-red-100">
                  <span className="font-bold block mb-1">
                    Petitioner's Reason for Appellate Appeal:
                  </span>
                  <p className="italic">
                    "
                    {activeTicket.appealReason ||
                      'Resolution is unsatisfactory. Recheck requested.'}
                    "
                  </p>
                </div>
              </div>
            </FormCard>

            <FormCard title="Appellate Decision Entry" icon="gavel">
              <FormGrid columns={1}>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Select Appellate Ruling
                  </span>
                  <div className="flex gap-4">
                    {[
                      { key: 'Uphold', label: 'Uphold Lower Decision' },
                      { key: 'Modify', label: 'Modify Resolution terms' },
                      {
                        key: 'Reinvestigate',
                        label: 'Direct Re-Investigation',
                      },
                    ].map(act => (
                      <label
                        key={act.key}
                        className="flex items-center gap-2 text-xs font-bold cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="appealAction"
                          checked={appealAction === act.key}
                          onChange={() => setAppealAction(act.key as any)}
                        />
                        <span>{act.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <TextArea
                    label="Decision Justification & Remarks (UGC Audit Trail Logged) *"
                    placeholder="Enter detailed orders, directives for departments, or revaluation orders..."
                    value={remarks}
                    onChange={setRemarks}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                  <Button
                    label="Record appellate order"
                    icon="send"
                    variant="primary"
                    onClick={handleDecision}
                  />
                </div>
              </FormGrid>
            </FormCard>
          </div>
        ) : (
          <FormCard>
            <div className="text-center py-12 text-slate-400">
              Select an contested appeal case to load decision desk.
            </div>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
