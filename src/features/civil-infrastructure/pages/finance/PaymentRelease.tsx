import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { type RABill, raBills as initialData, civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function PaymentRelease() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('civil_ra_bills');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [works] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const [popup, setPopup] = useState<{ mode: 'closed' | 'release' | 'view'; item?: RABill }>({ mode: 'closed' });
  const [payRef, setPayRef] = useState('');
  const [payRemarks, setPayRemarks] = useState('');

  useEffect(() => {
    localStorage.setItem('civil_ra_bills', JSON.stringify(data));
  }, [data]);

  const readyToPay = data.filter((b: any) => b.status === 'Finance Cleared');
  const paid       = data.filter((b: any) => b.status === 'Paid');

  const handleRelease = () => {
    if (!popup.item) return;
    if (!payRef) { ToastService.error('Payment reference number (UTR/NEFT Ref) is required.'); return; }
    setData((prev: any[]) => prev.map((b: any) => b.id === popup.item!.id
      ? { ...b, status: 'Paid' as any, paymentDate: new Date().toISOString().split('T')[0], paymentRef: payRef }
      : b
    ));
    ToastService.success(`Payment released. UTR: ${payRef}. Contractor account credited.`);
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Payment Release"
      description="Treasury initiates EFT/NEFT transfers for finance-cleared RA bills. Payment reference and UTR number are mandatory."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.financePortal },
        { label: 'Payment Release' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Ready to Pay', value: readyToPay.length, color: '#d97706', bg: '#fef3c7' },
          { label: 'Paid This FY', value: paid.length, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Total Released', value: `₹${(paid.reduce((s: number, b: any) => s + b.netPayable, 0) / 100000).toFixed(1)}L`, color: '#1d4ed8', bg: '#dbeafe' },
        ].map(s => (
          <FormCard key={s.label}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </FormCard>
        ))}
      </div>

      <FormCard title="Finance-Cleared Bills — Ready for Payment">
        {readyToPay.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No bills ready for payment. Process RA Bills first.</div>
        )}
        {readyToPay.length > 0 && (
          <GridPanel
            data={readyToPay}
            columns={[
              { field: 'billNo', header: 'Bill No', cell: (b: RABill) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>{b.billNo}</span> },
              { field: 'workName', header: 'Work Name' },
              { field: 'workType' as any, header: 'Work Type', cell: (b: RABill) => {
                const wk = works.find((w: any) => w.name === b.workName || w.id === b.workId || w.workId === b.workId);
                return <span style={{ fontSize: '0.75rem' }}>{wk?.category ?? '—'}</span>;
              } },
              { field: 'category' as any, header: 'Category', cell: (b: RABill) => {
                const wk = works.find((w: any) => w.name === b.workName || w.id === b.workId || w.workId === b.workId);
                return <span style={{ fontSize: '0.75rem' }}>{wk?.department ?? '—'}</span>;
              } },
              { field: 'workBasis' as any, header: 'Work Basis', cell: (b: RABill) => {
                const wk = works.find((w: any) => w.name === b.workName || w.id === b.workId || w.workId === b.workId);
                return <span className={`civil-pill ${wk?.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`} style={{ fontSize: '0.65rem' }}>{wk?.workBasis ?? 'SOR Based'}</span>;
              } },
              { field: 'contractorName', header: 'Contractor', cell: (b: RABill) => <span style={{ fontWeight: 600 }}>{b.contractorName}</span> },
              { field: 'grossAmount', header: 'Gross', cell: (b: RABill) => <span>₹{(b.grossAmount / 100000).toFixed(2)}L</span> },
              { field: 'netPayable', header: 'Net Payable', cell: (b: RABill) => <span style={{ fontWeight: 700, color: '#16a34a' }}>₹{(b.netPayable / 100000).toFixed(2)}L</span> },
              { field: 'id', header: 'Action', sortable: false,
                cell: (item: RABill) => (
                  <Button size="small" label="Release Payment" icon="money-bill" variant="primary"
                    onClick={() => { setPayRef(''); setPayRemarks(''); setPopup({ mode: 'release', item }); }} />
                ) },
            ]}
          />
        )}
      </FormCard>

      <div style={{ marginTop: '1.5rem' }}>
        <FormCard title="Payment History">
          <GridPanel
            data={paid}
            columns={[
              { field: 'billNo', header: 'Bill No', cell: (b: RABill) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>{b.billNo}</span> },
              { field: 'workName', header: 'Work Name' },
              { field: 'workType' as any, header: 'Work Type', cell: (b: RABill) => {
                const wk = works.find((w: any) => w.name === b.workName || w.id === b.workId || w.workId === b.workId);
                return <span style={{ fontSize: '0.75rem' }}>{wk?.category ?? '—'}</span>;
              } },
              { field: 'category' as any, header: 'Category', cell: (b: RABill) => {
                const wk = works.find((w: any) => w.name === b.workName || w.id === b.workId || w.workId === b.workId);
                return <span style={{ fontSize: '0.75rem' }}>{wk?.department ?? '—'}</span>;
              } },
              { field: 'workBasis' as any, header: 'Work Basis', cell: (b: RABill) => {
                const wk = works.find((w: any) => w.name === b.workName || w.id === b.workId || w.workId === b.workId);
                return <span className={`civil-pill ${wk?.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`} style={{ fontSize: '0.65rem' }}>{wk?.workBasis ?? 'SOR Based'}</span>;
              } },
              { field: 'contractorName', header: 'Contractor' },
              { field: 'netPayable', header: 'Amount Paid', cell: (b: RABill) => <span style={{ fontWeight: 700, color: '#16a34a' }}>₹{(b.netPayable / 100000).toFixed(2)}L</span> },
              { field: 'paymentDate', header: 'Paid Date' },
              { field: 'paymentRef', header: 'UTR Reference', cell: (b: RABill) => <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600 }}>{b.paymentRef}</span> },
            ]}
            searchBox searchPlaceholder="Search payment logs..."
          />
        </FormCard>
      </div>

      <FormPopup
        visible={popup.mode === 'release'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`Release Payment — ${popup.item?.billNo}`}
        subtitle="This action releases funds via EFT transfer to contractor bank account."
        size="lg"
      >
        {popup.item && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem 1.5rem', fontSize: '0.8125rem', marginBottom: '1.25rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
              {[
                ['Contractor', popup.item.contractorName],
                ['Gross Bill Value', `₹${(popup.item.grossAmount / 100000).toFixed(2)}L`],
                ['Advance Recovery', `-₹${(popup.item.advanceRecovery / 1000).toFixed(0)}K`],
                ['Security Deposit Ded.', `-₹${(popup.item.securityDeposit / 1000).toFixed(0)}K`],
                ['Net Release Amount', `₹${(popup.item.netPayable / 100000).toFixed(2)}L`],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '0.875rem', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.8125rem', color: '#15803d' }}>
              <strong>🏦 Authorized Transfer:</strong> Initiating EFT transfer releases funds directly. Ensure UTR number matches bank dispatch confirmation.
            </div>

            <FormGrid columns={2}>
              <TextBox label="UTR / NEFT Reference Number *" placeholder="e.g. UTR1029384756" value={payRef} onChange={setPayRef} />
            </FormGrid>

            <div style={{ marginTop: '0.75rem' }}>
              <TextArea label="EFT Dispatch Remarks" placeholder="Payment release remarks..." value={payRemarks} onChange={setPayRemarks} rows={2} />
            </div>

            <div className="flex justify-end gap-3 mt-4 border-top pt-4">
              <Button label="Cancel" variant="outlined" onClick={() => setPopup({ mode: 'closed' })} />
              <Button label="Release EFT Transfer" variant="primary" icon="check" onClick={handleRelease} />
            </div>
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
