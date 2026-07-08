import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { type Milestone, milestones as initialData, civilWorks, qualityTests } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function MilestoneSignoff() {
  const [data, setData] = useState(initialData);
  const [popup, setPopup] = useState<{ mode: 'closed' | 'signoff' | 'view'; item?: Milestone }>({ mode: 'closed' });

  const canSignOff = (m: Milestone) => {
    if (m.status === 'Completed') return false;
    if (!m.qualityTestRequired) return m.status === 'In Progress';
    const tests = qualityTests.filter(t => t.milestoneId === m.id);
    return tests.length > 0 && tests.every(t => t.result === 'Pass');
  };

  const handleSignOff = (item: Milestone) => {
    if (item.qualityTestRequired) {
      const tests = qualityTests.filter(t => t.milestoneId === item.id);
      const anyFail = tests.some(t => t.result === 'Fail');
      const anyPending = tests.some(t => t.result === 'Pending');
      if (anyFail) { ToastService.error('Quality test has FAILED. Milestone cannot be closed until re-test passes.'); return; }
      if (anyPending) { ToastService.error('Quality test is still PENDING. Milestone cannot be signed off until lab results are uploaded.'); return; }
    }
    setData(prev => prev.map(m => m.id === item.id
      ? { ...m, status: 'Completed' as any, actualEndDate: new Date().toISOString().split('T')[0] }
      : m
    ));
    ToastService.success('Milestone signed off. Next phase can now commence.');
    setPopup({ mode: 'closed' });
  };

  const statusCls = (s: string) =>
    s === 'Completed' ? 'green' : s === 'In Progress' ? 'blue' : s === 'Delayed' ? 'red' : s === 'Quality Fail' ? 'red' : 'gray';

  return (
    <FormPage
      title="Milestone Sign-offs"
      description="Milestone sign-off is blocked if any mandatory quality test is failed or pending. Next phases cannot begin without sign-off."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Milestone Sign-offs' },
      ]}
    >
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '0.875rem', padding: '1rem 1.25rem', fontSize: '0.8125rem', color: '#92400e', marginBottom: '1.25rem' }}>
        <strong>🚫 Dependency Rule:</strong> A milestone CANNOT be signed off and the subsequent phase CANNOT begin if: (a) a mandatory material test has failed, or (b) a test result has not been uploaded by the lab.
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'workName', header: 'Work', cell: (m: Milestone) => <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{civilWorks.find(w => w.id === m.workId)?.workId}</span> },
            { field: 'sequenceNo', header: 'Seq.', cell: (m: Milestone) => <span style={{ fontWeight: 700 }}>#{m.sequenceNo}</span> },
            { field: 'milestoneName', header: 'Milestone', cell: (m: Milestone) => <span style={{ fontWeight: 600 }}>{m.milestoneName}</span> },
            { field: 'weightage', header: 'Weightage', cell: (m: Milestone) => <span style={{ fontWeight: 700 }}>{m.weightage}%</span> },
            { field: 'plannedEndDate', header: 'Planned End' },
            { field: 'actualEndDate', header: 'Actual End', cell: (m: Milestone) => m.actualEndDate ? <span style={{ color: '#16a34a', fontWeight: 600 }}>{m.actualEndDate}</span> : <span style={{ color: '#9ca3af' }}>—</span> },
            { field: 'qualityTestRequired', header: 'QA Test',
              cell: (m: Milestone) => {
                if (!m.qualityTestRequired) return <span style={{ color: '#9ca3af', fontSize: '0.72rem' }}>N/A</span>;
                return <span className={`civil-pill ${m.qualityTestStatus === 'Pass' ? 'green' : m.qualityTestStatus === 'Fail' ? 'red' : 'amber'}`}>{m.qualityTestStatus ?? 'Pending'}</span>;
              } },
            { field: 'status', header: 'Status', cell: (m: Milestone) => <span className={`civil-pill ${statusCls(m.status)}`}>{m.status}</span> },
            { field: 'id', header: 'Action', sortable: false,
              cell: (item: Milestone) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined" onClick={() => setPopup({ mode: 'view', item })} />
                  {canSignOff(item) && (
                    <Button size="small" label="Sign Off" icon="check-circle" variant="primary"
                      onClick={() => setPopup({ mode: 'signoff', item })} />
                  )}
                  {!canSignOff(item) && item.status !== 'Completed' && (
                    <span className="civil-pill red" style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem' }}>
                      {item.qualityTestRequired && item.qualityTestStatus !== 'Pass' ? '🔒 QA Pending' : '⏳ Not Started'}
                    </span>
                  )}
                </div>
              ) },
          ]}
          searchBox searchPlaceholder="Search milestones..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`Milestone — ${popup.item?.milestoneName}`}
        subtitle={popup.mode === 'signoff' ? 'Confirm sign-off. Next phase will be unlocked.' : 'Milestone details.'}
        size="lg"
      >
        {popup.item && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem 2rem', fontSize: '0.8125rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem', marginBottom: '1rem' }}>
              {[
                ['Milestone', popup.item.milestoneName],
                ['Description', popup.item.description],
                ['Weightage', `${popup.item.weightage}%`],
                ['Planned End', popup.item.plannedEndDate],
                ['QA Test Required', popup.item.qualityTestRequired ? 'Yes' : 'No'],
                ['QA Status', popup.item.qualityTestStatus ?? 'N/A'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            {popup.mode === 'signoff' && (
              <>
                {popup.item.qualityTestRequired && popup.item.qualityTestStatus !== 'Pass' && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.75rem', padding: '0.875rem 1rem', color: '#991b1b', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
                    ❌ Quality test not yet passed. Sign-off is blocked.
                  </div>
                )}
                {(!popup.item.qualityTestRequired || popup.item.qualityTestStatus === 'Pass') && (
                  <>
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '0.75rem', padding: '0.875rem 1rem', color: '#15803d', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
                      ✅ All prerequisites met. This milestone can be signed off.
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button label="Cancel" variant="outlined" onClick={() => setPopup({ mode: 'closed' })} />
                      <Button label="Confirm Milestone Sign-off (EE)" variant="primary" icon="check-circle"
                        onClick={() => handleSignOff(popup.item!)} />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
