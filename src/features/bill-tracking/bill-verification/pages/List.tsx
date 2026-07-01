import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Stepper,
  Tabs,
} from 'shared/new-components';
import { BT_VENDOR_BILLS, BT_EMPLOYEE_CLAIMS } from '../../mock-data';

type BillRow = {
  id: string;
  billNo: string;
  billType: string;
  party: string;
  amount: number;
  submittedDate: string;
  status: string;
};

function buildQueue(): BillRow[] {
  const vb: BillRow[] = BT_VENDOR_BILLS.filter(
    b => b.status === 'Submitted'
  ).map(b => ({
    id: `VB-${b.id}`,
    billNo: b.billNo,
    billType: 'Vendor',
    party: b.vendor,
    amount: b.netPayable,
    submittedDate: b.billDate,
    status: b.status,
  }));
  const ec: BillRow[] = BT_EMPLOYEE_CLAIMS.filter(
    c => c.status === 'Submitted'
  ).map(c => ({
    id: `EC-${c.id}`,
    billNo: c.claimNo,
    billType: 'Employee',
    party: c.employeeName,
    amount: c.claimAmount,
    submittedDate: c.claimDate,
    status: c.status,
  }));
  return [...vb, ...ec];
}

const BILL_STAGES = ['Received', 'Submitted', 'Verified', 'Approved', 'Paid'];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'action'; item: BillRow; action: 'verify' | 'reject' | 'view' };

export default function List() {
  const [rows, setRows] = useState<BillRow[]>(buildQueue);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [remarks, setRemarks] = useState('');
  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setRemarks('');
  }, []);

  function handleVerify(item: BillRow) {
    setRows(prev =>
      prev.map(r => (r.id === item.id ? { ...r, status: 'Verified' } : r))
    );
    closePopup();
  }
  function handleReject(item: BillRow) {
    setRows(prev => prev.filter(r => r.id !== item.id));
    closePopup();
  }

  const pending = rows.filter(r => r.status === 'Submitted');

  return (
    <FormPage
      title="Bill Verification"
      description="Review and verify submitted bills before forwarding for approval."
    >
      <FormCard>
        <Tabs
          tabs={[
            {
              title: `Pending Verification (${pending.length})`,
              content: (
                <GridPanel
                  data={pending}
                  searchBox
                  searchPlaceholder="Search by bill no, party..."
                  columns={[
                    {
                      cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                      width: '40px',
                    },
                    { field: 'billNo', header: 'Bill / Claim No' },
                    { field: 'billType', header: 'Type' },
                    { field: 'party', header: 'Party' },
                    {
                      field: 'amount',
                      header: 'Amount (₹)',
                      cell: (i: BillRow) => (
                        <span>₹{i.amount.toLocaleString('en-IN')}</span>
                      ),
                    },
                    { field: 'submittedDate', header: 'Submitted Date' },
                    {
                      field: 'status',
                      header: 'Status',
                      sortable: false,
                      cell: (i: BillRow) => (
                        <StatusBadge label={i.status} variant="pending" />
                      ),
                    },
                    {
                      header: 'Actions',
                      sortable: false,
                      width: '160px',
                      cell: (i: BillRow) => (
                        <div className="flex gap-2">
                          <Button
                            label="Verify"
                            variant="primary"
                            onClick={() =>
                              setPopup({
                                mode: 'action',
                                item: i,
                                action: 'verify',
                              })
                            }
                          />
                          <Button
                            label="Reject"
                            variant="outlined"
                            onClick={() =>
                              setPopup({
                                mode: 'action',
                                item: i,
                                action: 'reject',
                              })
                            }
                          />
                        </div>
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: 'All Bills',
              content: (
                <GridPanel
                  data={rows}
                  searchBox
                  searchPlaceholder="Search by bill no, party..."
                  columns={[
                    {
                      cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                      width: '40px',
                    },
                    { field: 'billNo', header: 'Bill / Claim No' },
                    { field: 'billType', header: 'Type' },
                    { field: 'party', header: 'Party' },
                    {
                      field: 'amount',
                      header: 'Amount (₹)',
                      cell: (i: BillRow) => (
                        <span>₹{i.amount.toLocaleString('en-IN')}</span>
                      ),
                    },
                    { field: 'submittedDate', header: 'Submitted Date' },
                    {
                      field: 'status',
                      header: 'Status',
                      sortable: false,
                      cell: (i: BillRow) => {
                        let variant:
                          | 'pending'
                          | 'approved'
                          | 'rejected'
                          | 'neutral' = 'neutral';
                        if (['Approved', 'Paid', 'Verified'].includes(i.status))
                          variant = 'approved';
                        if (['Submitted', 'Received'].includes(i.status))
                          variant = 'pending';
                        if (i.status === 'Cancelled' || i.status === 'Rejected')
                          variant = 'rejected';
                        return (
                          <StatusBadge label={i.status} variant={variant} />
                        );
                      },
                    },
                    {
                      header: 'Actions',
                      sortable: false,
                      width: '100px',
                      cell: (i: BillRow) => (
                        <Button
                          label="View"
                          icon="eye"
                          variant="outlined"
                          onClick={() =>
                            setPopup({
                              mode: 'action',
                              item: i,
                              action: 'view',
                            })
                          }
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'action'}
        onHide={closePopup}
        title={
          popup.mode === 'action'
            ? `${popup.action === 'verify' ? 'Verify' : 'Reject'} Bill — ${popup.item.billNo}`
            : ''
        }
        subtitle="Review bill lifecycle and take action."
        size="lg"
      >
        {popup.mode === 'action' && (
          <div className="flex flex-col gap-5">
            <Stepper
              steps={BILL_STAGES.map(s => ({ label: s }))}
              activeStep={Math.max(1, BILL_STAGES.indexOf(popup.item.status))}
            />
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {[
                ['Bill No.', popup.item.billNo],
                ['Type', popup.item.billType],
                ['Party', popup.item.party],
                ['Amount', `₹${popup.item.amount.toLocaleString('en-IN')}`],
                ['Submitted Date', popup.item.submittedDate],
                ['Status', popup.item.status],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                    {l}
                  </p>
                  <p className="text-sm font-medium text-gray-900">{v}</p>
                </div>
              ))}
            </div>

            {popup.action !== 'view' && (
              <FormGrid columns={1}>
                <TextBox
                  label={
                    popup.action === 'reject'
                      ? 'Rejection Remarks (required)'
                      : 'Verification Remarks (optional)'
                  }
                  placeholder="Enter remarks..."
                  value={remarks}
                  onChange={setRemarks}
                  required={popup.action === 'reject'}
                />
              </FormGrid>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <Button label="Close" variant="outlined" onClick={closePopup} />
              {popup.action === 'verify' && (
                <Button
                  label="Verify Bill"
                  variant="primary"
                  icon="check"
                  onClick={() => handleVerify(popup.item)}
                />
              )}
              {popup.action === 'reject' && (
                <Button
                  label="Reject Bill"
                  variant="outlined"
                  icon="x"
                  onClick={() =>
                    remarks ? handleReject(popup.item) : undefined
                  }
                />
              )}
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
