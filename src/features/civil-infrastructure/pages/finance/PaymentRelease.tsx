import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
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

  const [activeTab, setActiveTab] = useState<'ra_bill' | 'milestone'>('ra_bill');

  const [paymentRequests, setPaymentRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_milestone_payment_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'release' | 'view' | 'release_milestone' | 'view_milestone';
    item?: RABill;
    requestItem?: any;
  }>({ mode: 'closed' });
  const [payRef, setPayRef] = useState('');
  const [payRemarks, setPayRemarks] = useState('');

  // Watch local storage for external updates (e.g. from admin approval)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('civil_milestone_payment_requests');
      if (saved) {
        setPaymentRequests(JSON.parse(saved));
      }
      const savedBills = localStorage.getItem('civil_ra_bills');
      if (savedBills) {
        setData(JSON.parse(savedBills));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('civil_ra_bills', JSON.stringify(data));
  }, [data]);

  const readyToPay = data.filter((b: any) => b.status === 'Finance Cleared');
  const paid = data.filter((b: any) => b.status === 'Paid');

  const handleRelease = () => {
    if (!popup.item) return;
    if (!payRef) {
      ToastService.error(
        'Payment reference number (UTR/NEFT Ref) is required.'
      );
      return;
    }
    setData((prev: any[]) =>
      prev.map((b: any) =>
        b.id === popup.item!.id
          ? {
              ...b,
              status: 'Paid' as any,
              paymentDate: new Date().toISOString().split('T')[0],
              paymentRef: payRef,
            }
          : b
      )
    );
    ToastService.success(
      `Payment released. UTR: ${payRef}. Contractor account credited.`
    );
    setPopup({ mode: 'closed' });
    setPayRef('');
    setPayRemarks('');
  };

  const handleReleaseMilestone = () => {
    if (!popup.requestItem) return;
    if (!payRef) {
      ToastService.error('Payment reference number (UTR/NEFT Ref) is required.');
      return;
    }
    
    const savedRequests = localStorage.getItem('civil_milestone_payment_requests');
    const requests = savedRequests ? JSON.parse(savedRequests) : [];
    const updated = requests.map((r: any) =>
      r.id === popup.requestItem.id
        ? {
            ...r,
            status: 'Payment Released',
            paymentDate: new Date().toISOString().split('T')[0],
            paymentRef: payRef,
            paymentRemarks: payRemarks,
          }
        : r
    );
    localStorage.setItem('civil_milestone_payment_requests', JSON.stringify(updated));
    setPaymentRequests(updated);
    
    ToastService.success(`Milestone payment of ₹${popup.requestItem.amountToRelease.toLocaleString('en-IN')} released. UTR: ${payRef}`);
    setPopup({ mode: 'closed' });
    setPayRef('');
    setPayRemarks('');
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {[
          {
            label: 'Ready to Pay',
            value: activeTab === 'ra_bill'
              ? readyToPay.length
              : paymentRequests.filter((r: any) => r.status === 'Approved by Admin').length,
            color: '#d97706',
            bg: '#fef3c7',
          },
          {
            label: 'Paid This FY',
            value: activeTab === 'ra_bill'
              ? paid.length
              : paymentRequests.filter((r: any) => r.status === 'Payment Released').length,
            color: '#16a34a',
            bg: '#f0fdf4',
          },
          {
            label: 'Total Released',
            value: activeTab === 'ra_bill'
              ? `₹${(paid.reduce((s: number, b: any) => s + b.netPayable, 0) / 100000).toFixed(1)}L`
              : `₹${(paymentRequests.filter((r: any) => r.status === 'Payment Released').reduce((s: number, r: any) => s + r.amountToRelease, 0) / 100000).toFixed(1)}L`,
            color: '#1d4ed8',
            bg: '#dbeafe',
          },
        ].map(s => (
          <FormCard key={s.label}>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#9ca3af',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
              }}
            >
              {s.label}
            </div>
            <div
              style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}
            >
              {s.value}
            </div>
          </FormCard>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1.25rem',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('ra_bill')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: activeTab === 'ra_bill' ? '#1d4ed8' : '#64748b',
            borderBottom: activeTab === 'ra_bill' ? '2px solid #1d4ed8' : 'none',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          📁 Contract RA Bill Payments
        </button>
        <button
          onClick={() => setActiveTab('milestone')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: activeTab === 'milestone' ? '#1d4ed8' : '#64748b',
            borderBottom: activeTab === 'milestone' ? '2px solid #1d4ed8' : 'none',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          📍 Milestone Release Payments
          {paymentRequests.filter((r: any) => r.status === 'Approved by Admin').length > 0 && (
            <span
              style={{
                marginLeft: '0.5rem',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '9999px',
                padding: '0.125rem 0.375rem',
                fontSize: '0.7rem',
              }}
            >
              {paymentRequests.filter((r: any) => r.status === 'Approved by Admin').length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'ra_bill' ? (
        <>
          <FormCard title="Finance-Cleared Bills — Ready for Payment">
            {readyToPay.length === 0 && (
              <div
                style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}
              >
                No bills ready for payment. Process RA Bills first.
              </div>
            )}
            {readyToPay.length > 0 && (
              <GridPanel
                data={readyToPay}
                columns={[
                  {
                    field: 'billNo',
                    header: 'Bill No',
                    cell: (b: RABill) => (
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: '#1d4ed8',
                        }}
                      >
                        {b.billNo}
                      </span>
                    ),
                  },
                  { field: 'workName', header: 'Work Name' },
                  {
                    field: 'workType' as any,
                    header: 'Work Type',
                    cell: (b: RABill) => {
                      const wk = works.find(
                        (w: any) =>
                          w.name === b.workName ||
                          w.id === b.workId ||
                          w.workId === b.workId
                      );
                      return (
                        <span style={{ fontSize: '0.75rem' }}>
                          {wk?.category ?? '—'}
                        </span>
                      );
                    },
                  },
                  {
                    field: 'category' as any,
                    header: 'Category',
                    cell: (b: RABill) => {
                      const wk = works.find(
                        (w: any) =>
                          w.name === b.workName ||
                          w.id === b.workId ||
                          w.workId === b.workId
                      );
                      return (
                        <span style={{ fontSize: '0.75rem' }}>
                          {wk?.department ?? '—'}
                        </span>
                      );
                    },
                  },
                  {
                    field: 'workBasis' as any,
                    header: 'Work Basis',
                    cell: (b: RABill) => {
                      const wk = works.find(
                        (w: any) =>
                          w.name === b.workName ||
                          w.id === b.workId ||
                          w.workId === b.workId
                      );
                      return (
                        <span
                          className={`civil-pill ${wk?.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                          style={{ fontSize: '0.65rem' }}
                        >
                          {wk?.workBasis ?? 'SOR Based'}
                        </span>
                      );
                    },
                  },
                  {
                    field: 'contractorName',
                    header: 'Contractor',
                    cell: (b: RABill) => (
                      <span style={{ fontWeight: 600 }}>{b.contractorName}</span>
                    ),
                  },
                  {
                    field: 'grossAmount',
                    header: 'Gross',
                    cell: (b: RABill) => (
                      <span>₹{(b.grossAmount / 100000).toFixed(2)}L</span>
                    ),
                  },
                  {
                    field: 'netPayable',
                    header: 'Net Payable',
                    cell: (b: RABill) => (
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>
                        ₹{(b.netPayable / 100000).toFixed(2)}L
                      </span>
                    ),
                  },
                  {
                    field: 'id',
                    header: 'Action',
                    sortable: false,
                    cell: (item: RABill) => (
                      <Button
                        size="small"
                        label="Release Payment"
                        icon="money-bill"
                        variant="primary"
                        onClick={() => {
                          setPayRef('');
                          setPayRemarks('');
                          setPopup({ mode: 'release', item });
                        }}
                      />
                    ),
                  },
                ]}
              />
            )}
          </FormCard>

          <div style={{ marginTop: '1.5rem' }}>
            <FormCard title="Payment History">
              <GridPanel
                data={paid}
                columns={[
                  {
                    field: 'billNo',
                    header: 'Bill No',
                    cell: (b: RABill) => (
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: '#1d4ed8',
                        }}
                      >
                        {b.billNo}
                      </span>
                    ),
                  },
                  { field: 'workName', header: 'Work Name' },
                  {
                    field: 'workType' as any,
                    header: 'Work Type',
                    cell: (b: RABill) => {
                      const wk = works.find(
                        (w: any) =>
                          w.name === b.workName ||
                          w.id === b.workId ||
                          w.workId === b.workId
                      );
                      return (
                        <span style={{ fontSize: '0.75rem' }}>
                          {wk?.category ?? '—'}
                        </span>
                      );
                    },
                  },
                  {
                    field: 'category' as any,
                    header: 'Category',
                    cell: (b: RABill) => {
                      const wk = works.find(
                        (w: any) =>
                          w.name === b.workName ||
                          w.id === b.workId ||
                          w.workId === b.workId
                      );
                      return (
                        <span style={{ fontSize: '0.75rem' }}>
                          {wk?.department ?? '—'}
                        </span>
                      );
                    },
                  },
                  {
                    field: 'workBasis' as any,
                    header: 'Work Basis',
                    cell: (b: RABill) => {
                      const wk = works.find(
                        (w: any) =>
                          w.name === b.workName ||
                          w.id === b.workId ||
                          w.workId === b.workId
                      );
                      return (
                        <span
                          className={`civil-pill ${wk?.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                          style={{ fontSize: '0.65rem' }}
                        >
                          {wk?.workBasis ?? 'SOR Based'}
                        </span>
                      );
                    },
                  },
                  { field: 'contractorName', header: 'Contractor' },
                  {
                    field: 'netPayable',
                    header: 'Amount Paid',
                    cell: (b: RABill) => (
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>
                        ₹{(b.netPayable / 100000).toFixed(2)}L
                      </span>
                    ),
                  },
                  { field: 'paymentDate', header: 'Paid Date' },
                  {
                    field: 'paymentRef',
                    header: 'UTR Reference',
                    cell: (b: RABill) => (
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {b.paymentRef}
                      </span>
                    ),
                  },
                ]}
                searchBox
                searchPlaceholder="Search payment logs..."
              />
            </FormCard>
          </div>
        </>
      ) : (
        <>
          <FormCard title="Milestone Sign-off Releases — Ready for Treasury Payment">
            {paymentRequests.filter((r: any) => r.status === 'Approved by Admin').length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                No milestone payment releases approved by Admin yet.
              </div>
            )}
            {paymentRequests.filter((r: any) => r.status === 'Approved by Admin').length > 0 && (
              <GridPanel
                data={paymentRequests.filter((r: any) => r.status === 'Approved by Admin')}
                columns={[
                  { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
                  {
                    field: 'workId',
                    header: 'Work ID',
                    cell: (r: any) => (
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8', fontSize: '0.75rem' }}>
                        {works.find((w: any) => w.id === r.workId)?.workId || r.workId}
                      </span>
                    ),
                  },
                  {
                    field: 'milestoneName',
                    header: 'Milestone Stage',
                    cell: (r: any) => (
                      <span style={{ fontWeight: 600 }}>
                        {r.milestoneName} (Milestone #{r.sequenceNo})
                      </span>
                    ),
                  },
                  {
                    field: 'contractorName',
                    header: 'Contractor',
                    cell: (r: any) => <span style={{ fontSize: '0.75rem' }}>{r.contractorName}</span>,
                  },
                  {
                    field: 'amountToRelease',
                    header: 'Release Amount',
                    cell: (r: any) => (
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>
                        ₹{Number(r.amountToRelease).toLocaleString('en-IN')}
                      </span>
                    ),
                  },
                  { field: 'requestDate', header: 'Request Date' },
                  {
                    field: 'id',
                    header: 'Action',
                    sortable: false,
                    cell: (r: any) => (
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <Button
                          size="small"
                          label="Release Payment"
                          icon="money-bill"
                          variant="primary"
                          onClick={() => {
                            setPayRef('');
                            setPayRemarks('');
                            setPopup({ mode: 'release_milestone', requestItem: r });
                          }}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </FormCard>

          <div style={{ marginTop: '1.5rem' }}>
            <FormCard title="Milestone Payment Release History">
              <GridPanel
                data={paymentRequests.filter((r: any) => r.status === 'Payment Released')}
                columns={[
                  { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
                  {
                    field: 'workId',
                    header: 'Work ID',
                    cell: (r: any) => (
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8', fontSize: '0.75rem' }}>
                        {works.find((w: any) => w.id === r.workId)?.workId || r.workId}
                      </span>
                    ),
                  },
                  {
                    field: 'milestoneName',
                    header: 'Milestone Stage',
                    cell: (r: any) => (
                      <span style={{ fontWeight: 600 }}>
                        {r.milestoneName} (Milestone #{r.sequenceNo})
                      </span>
                    ),
                  },
                  { field: 'contractorName', header: 'Contractor' },
                  {
                    field: 'amountToRelease',
                    header: 'Amount Paid',
                    cell: (r: any) => (
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>
                        ₹{Number(r.amountToRelease).toLocaleString('en-IN')}
                      </span>
                    ),
                  },
                  { field: 'paymentDate', header: 'Paid Date' },
                  {
                    field: 'paymentRef',
                    header: 'UTR Reference',
                    cell: (r: any) => (
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600 }}>
                        {r.paymentRef}
                      </span>
                    ),
                  },
                  {
                    field: 'id',
                    header: 'Action',
                    sortable: false,
                    cell: (r: any) => (
                      <Button
                        size="small"
                        label=""
                        icon="eye"
                        variant="outlined"
                        onClick={() => setPopup({ mode: 'view_milestone', requestItem: r })}
                      />
                    ),
                  },
                ]}
                searchBox
                searchPlaceholder="Search payment logs..."
              />
            </FormCard>
          </div>
        </>
      )}

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'release_milestone' || popup.mode === 'view_milestone'
            ? `${popup.mode === 'release_milestone' ? 'Release' : 'View'} Milestone Payment — ${popup.requestItem?.milestoneName}`
            : `Release Payment — ${popup.item?.billNo}`
        }
        subtitle={
          popup.mode === 'release_milestone' || popup.mode === 'view_milestone'
            ? 'This action releases funds via NEFT/RTGS transfer for approved milestones.'
            : 'This action releases funds via EFT transfer to contractor bank account.'
        }
        size="lg"
      >
        {popup.mode === 'release' && popup.item && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem 1.5rem',
                fontSize: '0.8125rem',
                marginBottom: '1.25rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
              }}
            >
              {[
                ['Contractor', popup.item.contractorName],
                [
                  'Gross Bill Value',
                  `₹${(popup.item.grossAmount / 100000).toFixed(2)}L`,
                ],
                [
                  'Advance Recovery',
                  `-₹${(popup.item.advanceRecovery / 1000).toFixed(0)}K`,
                ],
                [
                  'Security Deposit Ded.',
                  `-₹${(popup.item.securityDeposit / 1000).toFixed(0)}K`,
                ],
                [
                  'Net Release Amount',
                  `₹${(popup.item.netPayable / 100000).toFixed(2)}L`,
                ],
              ].map(([k, v]) => (
                <div key={k}>
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: '0.875rem',
                padding: '1rem',
                marginBottom: '1.25rem',
                fontSize: '0.8125rem',
                color: '#15803d',
              }}
            >
              <strong>🏦 Authorized Transfer:</strong> Initiating EFT transfer
              releases funds directly. Ensure UTR number matches bank dispatch
              confirmation.
            </div>

            <FormGrid columns={2}>
              <TextBox
                label="UTR / NEFT Reference Number *"
                placeholder="e.g. UTR1029384756"
                value={payRef}
                onChange={setPayRef}
              />
            </FormGrid>

            <div style={{ marginTop: '0.75rem' }}>
              <TextArea
                label="EFT Dispatch Remarks"
                placeholder="Payment release remarks..."
                value={payRemarks}
                onChange={setPayRemarks}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4 border-top pt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Release EFT Transfer"
                variant="primary"
                icon="check"
                onClick={handleRelease}
              />
            </div>
          </>
        )}

        {(popup.mode === 'release_milestone' || popup.mode === 'view_milestone') && popup.requestItem && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem 1.5rem',
                fontSize: '0.8125rem',
                marginBottom: '1.25rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
              }}
            >
              {[
                ['Contractor / Vendor', popup.requestItem.contractorName],
                ['Milestone Stage', `${popup.requestItem.milestoneName} (Milestone #${popup.requestItem.sequenceNo})`],
                ['Weightage', `${popup.requestItem.weightage}%`],
                ['Net Release Amount', `₹${popup.requestItem.amountToRelease.toLocaleString('en-IN')}`],
                ['Request Date', popup.requestItem.requestDate],
                ['Status', popup.requestItem.status],
                ['Justification Remarks', popup.requestItem.remarks],
                ['Approval Date', popup.requestItem.approvalDate || '—'],
                ['Approval Remarks', popup.requestItem.approvalRemarks || '—'],
                ['UTR Reference', popup.requestItem.paymentRef || '—'],
                ['Paid Date', popup.requestItem.paymentDate || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ gridColumn: k === 'Justification Remarks' || k === 'Approval Remarks' ? 'span 3' : 'span 1' }}>
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            {popup.mode === 'release_milestone' && (
              <>
                <div
                  style={{
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    borderRadius: '0.875rem',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.8125rem',
                    color: '#15803d',
                  }}
                >
                  <strong>🏦 Authorized Transfer:</strong> Initiating EFT transfer releases milestone funds directly. Ensure UTR number matches bank dispatch confirmation.
                </div>

                <FormGrid columns={2}>
                  <TextBox
                    label="UTR / NEFT Reference Number *"
                    placeholder="e.g. UTR1029384756"
                    value={payRef}
                    onChange={setPayRef}
                  />
                </FormGrid>

                <div style={{ marginTop: '0.75rem' }}>
                  <TextArea
                    label="EFT Dispatch Remarks"
                    placeholder="Payment release remarks..."
                    value={payRemarks}
                    onChange={setPayRemarks}
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4 border-top pt-4">
                  <Button
                    label="Cancel"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'closed' })}
                  />
                  <Button
                    label="Release EFT Transfer"
                    variant="primary"
                    icon="check"
                    onClick={handleReleaseMilestone}
                  />
                </div>
              </>
            )}
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
