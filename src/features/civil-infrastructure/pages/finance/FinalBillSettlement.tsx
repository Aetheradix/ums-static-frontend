import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { raBills as initialBills, civilWorks as initialWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function FinalBillSettlement() {
  const [works] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [bills] = useState(() => {
    const saved = localStorage.getItem('civil_ra_bills');
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [popup, setPopup] = useState<{ mode: 'closed' | 'settle'; item?: any }>({ mode: 'closed' });
  const [finalRemarks, setFinalRemarks] = useState('');
  const [voucherNo, setVoucherNo] = useState('');
  
  const [settled, setSettled] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('civil_settled_bills');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('civil_settled_bills', JSON.stringify(Array.from(settled)));
  }, [settled]);

  const handleSettle = () => {
    if (!voucherNo) { ToastService.error('Voucher number is required.'); return; }
    setSettled(prev => new Set([...prev, popup.item?.id]));
    ToastService.success('Final Bill settled. Project fully closed in ERP. Contractor liability discharged.');
    setPopup({ mode: 'closed' });
  };

  // Final bills are a special settlement after project completion
  const finalBillData = works
    .filter((w: any) => w.physicalProgress >= 95)
    .map((w: any) => {
      const paid = bills
        .filter((b: any) => b.workId === w.id && b.status === 'Paid')
        .reduce((s: number, b: any) => s + b.netPayable, 0);
      return {
        id: w.id,
        workId: w.workId,
        workName: w.name,
        category: w.category,
        department: w.department,
        workBasis: w.workBasis,
        contractAmount: w.contractAmount,
        totalPaid: paid,
        balance: w.contractAmount > 0 ? w.contractAmount - paid : 0,
        physicalProgress: w.physicalProgress,
        status: w.status === 'Completed' || w.status === 'DLP Active' ? 'Ready for Final Bill' : 'Work Ongoing',
      };
    });

  return (
    <FormPage
      title="Final Bill Settlement"
      description="Post-completion reconciliation: total measurements verified, all deductions settled, and final balance released."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.financePortal },
        { label: 'Final Bill Settlement' },
      ]}
    >
      <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '0.875rem', padding: '1rem 1.25rem', fontSize: '0.8125rem', color: '#15803d', marginBottom: '1.25rem' }}>
        <strong>Final Bill Process:</strong> (1) All RA Bills must be settled. (2) Joint measurement of final quantities. (3) Reconciliation of BOQ vs. MB cumulative quantities. (4) Final deductions. (5) Balance payment. (6) Project closure in ERP.
      </div>

      <FormCard>
        <GridPanel
          data={finalBillData}
          columns={[
            { field: 'workId', header: 'Work ID', cell: (w: any) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>{w.workId}</span> },
            { field: 'workName', header: 'Work Name' },
            { field: 'category', header: 'Work Type', cell: (w: any) => <span style={{ fontSize: '0.75rem' }}>{w.category}</span> },
            { field: 'department', header: 'Category' },
            { field: 'workBasis', header: 'Work Basis', cell: (w: any) => <span className={`civil-pill ${w.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}>{w.workBasis ?? 'SOR Based'}</span> },
            { field: 'contractAmount', header: 'Contract Amt', cell: (w: any) => w.contractAmount > 0 ? <span>₹{(w.contractAmount / 100000).toFixed(2)}L</span> : <span style={{ color: '#9ca3af' }}>—</span> },
            { field: 'totalPaid', header: 'Paid Till Date', cell: (w: any) => <span style={{ fontWeight: 600 }}>₹{(w.totalPaid / 100000).toFixed(2)}L</span> },
            { field: 'balance', header: 'Balance', cell: (w: any) => <span style={{ fontWeight: 700, color: w.balance > 0 ? '#d97706' : '#16a34a' }}>{w.balance > 0 ? `₹${(w.balance / 100000).toFixed(2)}L` : 'Nil'}</span> },
            { field: 'physicalProgress', header: 'Physical %', cell: (w: any) => <span style={{ fontWeight: 700, color: w.physicalProgress >= 100 ? '#16a34a' : '#d97706' }}>{w.physicalProgress}%</span> },
            { field: 'status', header: 'Status', cell: (w: any) => <span className={`civil-pill ${settled.has(w.id) ? 'green' : w.status === 'Ready for Final Bill' ? 'teal' : 'gray'}`}>{settled.has(w.id) ? '✓ Settled & Closed' : w.status}</span> },
            { field: 'id', header: 'Action', sortable: false,
              cell: (item: any) => settled.has(item.id)
                ? <span className="civil-pill green">Closed ✓</span>
                : item.status === 'Ready for Final Bill'
                  ? <Button size="small" label="Settle Final Bill" icon="check-circle" variant="primary"
                      onClick={() => { setVoucherNo(''); setFinalRemarks(''); setPopup({ mode: 'settle', item }); }} />
                  : <span className="civil-pill gray">Not Ready</span> },
          ]}
          searchBox searchPlaceholder="Search works..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'settle'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`Final Settlement — ${popup.item?.workId}`}
        subtitle="This action settles all outstanding measurements and closes project in ERP ledger."
        size="lg"
      >
        {popup.item && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem 1.5rem', fontSize: '0.8125rem', marginBottom: '1.25rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
              {[
                ['Work Name', popup.item.workName],
                ['Contract Value', `₹${(popup.item.contractAmount / 100000).toFixed(2)}L`],
                ['Total Paid Till Date', `₹${(popup.item.totalPaid / 100000).toFixed(2)}L`],
                ['Final Settlement Release', `₹${(popup.item.balance / 100000).toFixed(2)}L`],
                ['Physical Progress', `${popup.item.physicalProgress}%`],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '0.875rem', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.8125rem', color: '#15803d' }}>
              <strong>🔒 Settle & Close:</strong> Clicking approve releases the final balance payment, closes the Work ID, and marks the project as completed.
            </div>

            <FormGrid columns={2}>
              <TextBox label="Voucher No *" placeholder="e.g. VOUCH/FIN/2026/045" value={voucherNo} onChange={setVoucherNo} />
            </FormGrid>

            <div style={{ marginTop: '0.75rem' }}>
              <TextArea label="Settlement Remarks" placeholder="Final ledger reconciliation remarks..." value={finalRemarks} onChange={setFinalRemarks} rows={2} />
            </div>

            <div className="flex justify-end gap-3 mt-4 border-top pt-4">
              <Button label="Cancel" variant="outlined" onClick={() => setPopup({ mode: 'closed' })} />
              <Button label="Authorize Settle & Close" variant="primary" icon="check" onClick={handleSettle} />
            </div>
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
