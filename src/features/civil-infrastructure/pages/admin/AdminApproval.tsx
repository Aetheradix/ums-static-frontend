import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge,
} from 'shared/new-components';
import { civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState = { mode: 'closed' } | { mode: 'approve'; item: typeof civilWorks[0] } | { mode: 'view'; item: typeof civilWorks[0] };

const AA_ELIGIBLE = ['Registered', 'Requirement Generated', 'AA Approved'];

export default function AdminApproval() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    const worksList = saved ? JSON.parse(saved) : civilWorks;
    return worksList.map((w: any) => ({
      aaAmount: w.aaAmount || w.estimatedCost * 0.98,
      aaRemarks: '',
      aaGrantedBy: 'Hon. Vice Chancellor',
      aaDate: '2025-01-15',
      ...w,
    }));
  });
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [aaAmt, setAaAmt] = useState('');
  const [aaRemarks, setAaRemarks] = useState('');

  useEffect(() => {
    localStorage.setItem('civil_works', JSON.stringify(data));
  }, [data]);

  const handleApprove = () => {
    if (!aaAmt || Number(aaAmt) <= 0) { ToastService.error('AA Amount is required.'); return; }
    if (popup.mode !== 'approve') return;
    setData((prev: any[]) => prev.map((d: any) => d.id === popup.item.id
      ? { ...d, aaAmount: Number(aaAmt), status: 'AA Approved' as any, aaRemarks }
      : d
    ));
    ToastService.success('Administrative Approval (AA) granted. Project budget legally binding.');
    setPopup({ mode: 'closed' }); setAaAmt(''); setAaRemarks('');
  };

  return (
    <FormPage
      title="Administrative Approval (AA)"
      description="Stage 7: Competent authority reviews economic justification and grants formal AA — legally binding the Project Budget."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Administrative Approval' },
      ]}
    >
      <FormCard subtitle="Only works with AA Amount not yet sanctioned or pending re-approval are shown below.">
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'workId', header: 'Work ID', cell: (w: any) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>{w.workId}</span> },
            { field: 'name', header: 'Work Name' },
            { field: 'category', header: 'Work Type', cell: (w: any) => <span style={{ fontSize: '0.75rem' }}>{w.category}</span> },
            { field: 'department', header: 'Category' },
            { field: 'workBasis', header: 'Work Basis', cell: (w: any) => <span className={`civil-pill ${w.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}>{w.workBasis ?? 'SOR Based'}</span> },
            { field: 'estimatedCost', header: 'Estimated Cost', cell: (w: any) => <span>₹{(w.estimatedCost / 100000).toFixed(2)}L</span> },
            { field: 'aaAmount', header: 'AA Amount (₹)',
              cell: (w: any) => w.status === 'AA Approved' || w.aaAmount > 0
                ? <span style={{ fontWeight: 700, color: '#16a34a' }}>₹{(w.aaAmount / 100000).toFixed(2)}L</span>
                : <span className="civil-pill amber">Pending</span> },
            { field: 'status', header: 'Status',
              cell: (w: any) => <StatusBadge label={w.status} variant={w.status === 'AA Approved' ? 'approved' : 'neutral'} /> },
            { field: 'id', header: 'Action', sortable: false,
              cell: (item: any) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined" onClick={() => setPopup({ mode: 'view', item })} />
                  {AA_ELIGIBLE.includes(item.status) && (
                    <Button size="small" label="Grant AA" icon="check" variant="primary"
                      onClick={() => { setAaAmt(String(item.estimatedCost * 0.98)); setAaRemarks(''); setPopup({ mode: 'approve', item }); }} />
                  )}
                </div>
              ) },
          ]}
          searchBox searchPlaceholder="Search works..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'approve' ? `Grant AA — ${(popup as any).item?.workId}` : `View Work — ${(popup as any).item?.workId}`}
        subtitle="Administrative Approval fixes the project budget. This action is legally binding."
        size="lg"
      >
        {popup.mode !== 'closed' && (
          <>
            {/* Work Summary */}
            <FormCard title="Work Details" subtitle="">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem 1.5rem', fontSize: '0.8125rem' }}>
                {[
                  ['Work ID', (popup as any).item.workId],
                  ['Work Name', (popup as any).item.name],
                  ['Category', (popup as any).item.category],
                  ['Department', (popup as any).item.department],
                  ['Campus', (popup as any).item.campus],
                  ['Funding Source', (popup as any).item.fundingSource],
                  ['Estimated Cost', `₹${((popup as any).item.estimatedCost / 100000).toFixed(2)}L`],
                  ['Execution Route', (popup as any).item.executionRoute],
                  ['Site Engineer', (popup as any).item.siteEngineer],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{v}</div>
                  </div>
                ))}
              </div>
            </FormCard>

            {popup.mode === 'approve' && (
              <>
                <FormGrid columns={2}>
                  <TextBox
                    label="AA Amount (₹) — Legally Binding Project Budget"
                    placeholder="e.g. 27800000"
                    value={aaAmt}
                    onChange={setAaAmt}
                    required
                  />
                  <TextBox
                    label="AA Granted By"
                    value="Hon. Vice Chancellor / Board of Management"
                    onChange={() => {}} disabled
                  />
                </FormGrid>
                <TextArea
                  label="AA Justification / Remarks"
                  placeholder="Economic justification for approval..."
                  value={aaRemarks}
                  onChange={setAaRemarks}
                  rows={3}
                />
                <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '0.75rem', padding: '0.875rem 1rem', fontSize: '0.8125rem', color: '#92400e', marginTop: '0.75rem' }}>
                  <strong>⚠ Important:</strong> Granting Administrative Approval legally commits the project budget. The AA Amount becomes the cost ceiling for subsequent Technical Sanction, tendering, and execution.
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button label="Cancel" variant="outlined" onClick={() => setPopup({ mode: 'closed' })} />
                  <Button label="Grant Administrative Approval" variant="primary" icon="check" onClick={handleApprove} />
                </div>
              </>
            )}
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
