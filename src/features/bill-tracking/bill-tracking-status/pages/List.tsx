import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Stepper,
} from 'shared/new-components';
import {
  BT_VENDOR_BILLS,
  BT_EMPLOYEE_CLAIMS,
  BT_PAYMENT_VOUCHERS,
} from '../../mock-data';

const STAGES = ['Received', 'Submitted', 'Verified', 'Approved', 'Paid'];

type TrackRow = {
  id: string;
  billNo: string;
  billType: string;
  party: string;
  amount: number;
  currentStage: string;
  lastUpdated: string;
};

function buildTrackRows(): TrackRow[] {
  const vb: TrackRow[] = BT_VENDOR_BILLS.map(b => ({
    id: `VB-${b.id}`,
    billNo: b.billNo,
    billType: 'Vendor',
    party: b.vendor,
    amount: b.netPayable,
    currentStage: b.status,
    lastUpdated: b.billDate,
  }));
  const ec: TrackRow[] = BT_EMPLOYEE_CLAIMS.map(c => ({
    id: `EC-${c.id}`,
    billNo: c.claimNo,
    billType: 'Employee',
    party: c.employeeName,
    amount: c.claimAmount,
    currentStage: c.status,
    lastUpdated: c.claimDate,
  }));
  return [...vb, ...ec];
}

function statusVariant(s: string) {
  if (['Approved', 'Paid'].includes(s)) return 'approved';
  if (['Submitted', 'Verified'].includes(s)) return 'pending';
  if (s === 'Cancelled') return 'rejected';
  return 'neutral';
}

function getStageIndex(status: string): number {
  const map: Record<string, number> = {
    Received: 0,
    Draft: 0,
    Submitted: 1,
    Verified: 2,
    Approved: 3,
    Paid: 4,
  };
  return map[status] ?? 0;
}

type PopupState = { mode: 'closed' } | { mode: 'view'; item: TrackRow };

export default function List() {
  const allRows = buildTrackRows();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  function getPaymentInfo(billNo: string) {
    return BT_PAYMENT_VOUCHERS.find(p => p.billRef === billNo);
  }

  return (
    <FormPage
      title="Bill Tracking"
      description="Track the movement and current status of every bill from receipt to payment."
    >
      <FormCard>
        <GridPanel
          data={allRows}
          searchBox
          searchPlaceholder="Search by bill no, party, type..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'billNo', header: 'Bill / Claim No' },
            { field: 'billType', header: 'Type' },
            { field: 'party', header: 'Party' },
            {
              field: 'amount',
              header: 'Amount (₹)',
              cell: (i: TrackRow) => (
                <span>₹{i.amount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'currentStage',
              header: 'Current Stage',
              sortable: false,
              cell: (i: TrackRow) => (
                <StatusBadge
                  label={i.currentStage}
                  variant={statusVariant(i.currentStage)}
                />
              ),
            },
            { field: 'lastUpdated', header: 'Last Updated' },
            {
              header: 'Track',
              sortable: false,
              width: '80px',
              cell: (i: TrackRow) => (
                <Button
                  icon="search"
                  variant="outlined"
                  onClick={() => setPopup({ mode: 'view', item: i })}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title={`Bill Tracking — ${popup.mode === 'view' ? popup.item.billNo : ''}`}
        subtitle="Full lifecycle view of this bill."
        size="lg"
      >
        {popup.mode === 'view' &&
          (() => {
            const item = popup.item;
            const stageIdx = getStageIndex(item.currentStage);
            const pv = getPaymentInfo(item.billNo);
            return (
              <div className="flex flex-col gap-5">
                <Stepper
                  steps={STAGES.map(s => ({ label: s }))}
                  activeStep={stageIdx}
                />
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {[
                    ['Bill No.', item.billNo],
                    ['Type', item.billType],
                    ['Party', item.party],
                    ['Amount', `₹${item.amount.toLocaleString('en-IN')}`],
                    ['Current Stage', item.currentStage],
                    ['Last Updated', item.lastUpdated],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        {l}
                      </p>
                      <p className="text-sm font-medium text-gray-900">{v}</p>
                    </div>
                  ))}
                </div>
                {pv && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-xs font-semibold text-green-600 uppercase mb-2">
                      Payment Details
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-500">Voucher No:</span>{' '}
                      <span className="font-medium">{pv.voucherNo}</span>
                      <span className="text-gray-500">Bank:</span>{' '}
                      <span className="font-medium">{pv.bankAccount}</span>
                      <span className="text-gray-500">Mode:</span>{' '}
                      <span className="font-medium">{pv.paymentMode}</span>
                      <span className="text-gray-500">Txn Ref:</span>{' '}
                      <span className="font-medium">{pv.transactionRef}</span>
                      <span className="text-gray-500">Payment Date:</span>{' '}
                      <span className="font-medium">{pv.paymentDate}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <Button
                    label="Close"
                    variant="outlined"
                    onClick={closePopup}
                  />
                </div>
              </div>
            );
          })()}
      </FormPopup>
    </FormPage>
  );
}
