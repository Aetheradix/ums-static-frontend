import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type RABill,
  raBills as initialData,
  mbEntries,
  civilWorks,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const statusVariant = (s: string) =>
  s === 'Paid'
    ? 'approved'
    : s === 'Rejected'
      ? 'rejected'
      : s === 'Finance Cleared' || s === 'EE Approved'
        ? 'pending'
        : 'neutral';

export default function RABillProcessing() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('civil_ra_bills');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [works] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view' | 'process';
    item?: RABill;
  }>({ mode: 'closed' });
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    localStorage.setItem('civil_ra_bills', JSON.stringify(data));
  }, [data]);

  const linkedMBs = (ids: string[]) =>
    mbEntries.filter(m => ids.includes(m.id));

  const handleProcess = () => {
    if (!popup.item) return;
    const mbsApproved = linkedMBs(popup.item.linkedMBs).every(
      m => m.status === 'Approved by EE' || m.status === 'Verified by AE'
    );
    if (!mbsApproved) {
      ToastService.error(
        'Rule 1 Violation: Not all linked MB entries are EE-approved. Finance cannot process this bill.'
      );
      return;
    }
    setData((prev: any[]) =>
      prev.map((b: any) =>
        b.id === popup.item!.id ? { ...b, status: 'Finance Cleared' as any } : b
      )
    );
    ToastService.success(
      'Bill verified and cleared by Finance. Ready for payment release.'
    );
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="RA Bill Processing"
      description="Finance verifies MB linkages, deductions (advance recovery, SD), and clears bills for payment. Rule 1 enforced: no MB = no bill."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.financePortal },
        { label: 'RA Bill Processing' },
      ]}
    >
      {/* Rule 1 Banner */}
      <div
        style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '0.875rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#991b1b',
          marginBottom: '1.25rem',
        }}
      >
        <strong>🔴 Rule 1 — No MB = No Bill (Finance Enforcement):</strong>{' '}
        Finance Department independently verifies that every line item in the RA
        Bill is backed by an EE-approved Measurement Book entry. Bills without
        verified MB linkage are automatically rejected.
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
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
            {
              field: 'raNo',
              header: 'RA No',
              cell: (b: RABill) => (
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {b.raNo}
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
            { field: 'billDate', header: 'Bill Date' },
            {
              field: 'grossAmount',
              header: 'Gross (₹)',
              cell: (b: RABill) => (
                <span>₹{(b.grossAmount / 100000).toFixed(2)}L</span>
              ),
            },
            {
              field: 'advanceRecovery',
              header: 'Adv. Rec.',
              cell: (b: RABill) => (
                <span style={{ color: '#d97706' }}>
                  -₹{(b.advanceRecovery / 1000).toFixed(0)}K
                </span>
              ),
            },
            {
              field: 'securityDeposit',
              header: 'SD',
              cell: (b: RABill) => (
                <span style={{ color: '#7c3aed' }}>
                  -₹{(b.securityDeposit / 1000).toFixed(0)}K
                </span>
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
              field: 'linkedMBs',
              header: 'Linked MBs',
              cell: (b: RABill) => (
                <span style={{ fontWeight: 700 }}>
                  {b.linkedMBs.length} MB(s)
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (b: RABill) => (
                <StatusBadge
                  label={b.status}
                  variant={statusVariant(b.status)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: RABill) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'view', item })}
                  />
                  {item.status === 'EE Approved' && (
                    <Button
                      size="small"
                      label="Process"
                      icon="check"
                      variant="primary"
                      onClick={() => {
                        setRemarks('');
                        setPopup({ mode: 'process', item });
                      }}
                    />
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search RA bills..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'process'
            ? `Process RA Bill — ${popup.item?.billNo}`
            : `Bill Details — ${popup.item?.billNo}`
        }
        subtitle="MB verification and deduction audit."
        size="lg"
      >
        {popup.item && (
          <>
            {/* Financial Summary Row */}
            <div className="civil-qty-row">
              <div className="civil-qty-box">
                <label>Gross Amount</label>
                <div className="civil-qty-val">
                  ₹{(popup.item.grossAmount / 100000).toFixed(2)}L
                </div>
              </div>
              <div className="civil-qty-box">
                <label>Advance Recovery</label>
                <div className="civil-qty-val" style={{ color: '#d97706' }}>
                  -₹{(popup.item.advanceRecovery / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="civil-qty-box">
                <label>Security Deposit</label>
                <div className="civil-qty-val" style={{ color: '#7c3aed' }}>
                  -₹{(popup.item.securityDeposit / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="civil-qty-box">
                <label>Net Payable</label>
                <div className="civil-qty-val" style={{ color: '#16a34a' }}>
                  ₹{(popup.item.netPayable / 100000).toFixed(2)}L
                </div>
              </div>
            </div>

            {/* Linked MB Audit */}
            <FormCard title="Linked MB Entries — Rule 1 Audit">
              <table className="civil-table">
                <thead>
                  <tr>
                    <th>MB No</th>
                    <th>SOR Code</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Bill Amt</th>
                    <th>MB Status</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedMBs(popup.item.linkedMBs).map(m => (
                    <tr key={m.id}>
                      <td>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            color: '#1d4ed8',
                          }}
                        >
                          {m.mbNo}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.72rem',
                          }}
                        >
                          {m.sorCode}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', maxWidth: 160 }}>
                        {m.description}
                      </td>
                      <td>
                        {m.executedQty} {m.unit}
                      </td>
                      <td>₹{(m.billAmount / 100000).toFixed(2)}L</td>
                      <td>
                        <span
                          className={`civil-pill ${m.status === 'Approved by EE' ? 'green' : m.status === 'Rejected' ? 'red' : 'amber'}`}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </FormCard>

            {popup.mode === 'process' && (
              <>
                <TextArea
                  label="Finance Verification Remarks"
                  placeholder="Notes on deduction audit, MB verification result..."
                  value={remarks}
                  onChange={setRemarks}
                  rows={2}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    label="Reject Bill"
                    variant="danger"
                    onClick={() => {
                      ToastService.error('Bill rejected.');
                      setPopup({ mode: 'closed' });
                    }}
                  />
                  <Button
                    label="Clear & Approve for Payment"
                    variant="primary"
                    icon="check"
                    onClick={handleProcess}
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
