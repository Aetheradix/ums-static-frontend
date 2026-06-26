import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, NumberBox, TextBox } from 'shared/components/forms';
import { Loader } from 'shared/components/progress';
import {
  FormActions,
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { RECEIPT_VOUCHERS } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type VoucherItem = (typeof RECEIPT_VOUCHERS)[0];
const QK = ['@fsc/receipt-vouchers'];
function useReceiptVouchersQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...RECEIPT_VOUCHERS],
  });
  return { data, isLoading };
}

const PARTICULARS = [
  { label: 'Tuition Fee Income', value: 'Tuition Fee Income', balance: 830000 },
  {
    label: 'Grant Income - UGC',
    value: 'Grant Income - UGC',
    balance: 3700000,
  },
  { label: 'Exam Fee Income', value: 'Exam Fee Income', balance: 95000 },
  {
    label: 'Star Logistics (Vendor)',
    value: 'Star Logistics (Vendor)',
    balance: 12500,
  },
  { label: 'General Fund', value: 'General Fund', balance: 8500000 },
  {
    label: 'Bank - SBI Main Account',
    value: 'Bank - SBI Main Account',
    balance: 3450000,
  },
  {
    label: 'State Govt. Grant Income',
    value: 'State Govt. Grant Income',
    balance: 2500000,
  },
];

const TYPE_OPTIONS = [
  { label: 'Dr', value: 'Dr' },
  { label: 'Cr', value: 'Cr' },
];
const PREV_VOUCHER_NO = 'H026-2027VR10';

type ParticularsRow = {
  id: number;
  type: string;
  particular: string;
  balance: number;
  amount: number;
};
type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; item: VoucherItem };

export default function List() {
  const { data, isLoading } = useReceiptVouchersQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Receipt Voucher"
      description="Record and manage all incoming receipts."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by voucher no, received from, account..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'voucherNo', header: 'Voucher No' },
            { field: 'date', header: 'Date' },
            { field: 'receivedFrom', header: 'Received From' },
            { field: 'account', header: 'Account' },
            {
              field: 'amount',
              header: 'Amount (₹)',
              cell: (i: VoucherItem) => (
                <span className="font-semibold text-green-700">
                  ₹{i.amount.toLocaleString('en-IN')}
                </span>
              ),
            },
            { field: 'mode', header: 'Mode' },
            { field: 'narration', header: 'Narration' },
            {
              field: 'status',
              header: 'Status',
              cell: (i: VoucherItem) => (
                <StatusBadge label={i.status} variant="approved" />
              ),
            },
            {
              header: '',
              width: '70px',
              cell: (i: VoucherItem) => (
                <Button
                  label="View"
                  variant="text"
                  size="small"
                  onClick={() => setPopup({ mode: 'view', item: i })}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="New Receipt"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>

      {/* CREATE POPUP */}
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Create Receipt Voucher"
        subtitle="Record a new receipt."
        size="xl"
      >
        <ReceiptVoucherForm onClose={closePopup} />
      </FormPopup>

      {/* VIEW POPUP */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title="Voucher Details"
        subtitle="View receipt voucher."
        size="lg"
      >
        {popup.mode === 'view' && <VoucherView item={popup.item} />}
      </FormPopup>
    </FormPage>
  );
}

/* ─── VIEW ─────────────────────────────────────────────────────────────────── */
function VoucherView({ item }: { item: VoucherItem }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 font-medium">Voucher No:</span>
          <span className="ml-2 font-bold text-gray-800">{item.voucherNo}</span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Date:</span>
          <span className="ml-2 text-gray-800">{item.date}</span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Received From:</span>
          <span className="ml-2 text-gray-800">{item.receivedFrom}</span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Account:</span>
          <span className="ml-2 text-gray-800">{item.account}</span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Amount:</span>
          <span className="ml-2 font-bold text-green-700 text-base">
            ₹{item.amount.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Mode:</span>
          <span className="ml-2 text-gray-800">{item.mode}</span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 font-medium">Narration:</span>
          <span className="ml-2 text-gray-800">{item.narration}</span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Status:</span>
          <span className="ml-2">
            <StatusBadge label={item.status} variant="approved" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── CREATE FORM ───────────────────────────────────────────────────────────── */
function ReceiptVoucherForm({ onClose }: { onClose: () => void }) {
  const [voucherNo, setVoucherNo] = useState('');
  const [isExisting, setIsExisting] = useState(false);
  const [narration, setNarration] = useState('');
  const [printReceipt, setPrintReceipt] = useState<'yes' | 'no'>('no');

  const [rowType, setRowType] = useState('Dr');
  const [rowParticular, setRowParticular] = useState('');
  const [rowBalance, setRowBalance] = useState<number | null>(null);
  const [rowAmount, setRowAmount] = useState<number>(0);
  const [rows, setRows] = useState<ParticularsRow[]>([]);

  const handleParticularChange = (val: string) => {
    setRowParticular(val);
    const found = PARTICULARS.find(p => p.value === val);
    setRowBalance(found ? found.balance : null);
  };

  const handleAddRow = () => {
    if (!rowParticular || rowAmount <= 0) return;
    setRows(prev => [
      ...prev,
      {
        id: Date.now(),
        type: rowType,
        particular: rowParticular,
        balance: rowBalance ?? 0,
        amount: rowAmount,
      },
    ]);
    setRowType('Dr');
    setRowParticular('');
    setRowBalance(null);
    setRowAmount(0);
  };

  const handleRemoveRow = (id: number) =>
    setRows(prev => prev.filter(r => r.id !== id));
  const totalAmount = rows.reduce((s, r) => s + r.amount, 0);

  const displayCls =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 bg-white';

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onClose();
      }}
      className="space-y-0"
    >
      {/* ══ Section 1: VOUCHER DETAILS ══ */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <svg
            width="15"
            height="15"
            className="text-indigo-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Voucher Details
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          The voucher number will be available after the voucher is saved.
        </p>

        <div className="flex items-end gap-4 flex-wrap">
          {/* Previous Voucher No */}
          <div className="flex-1 min-w-[160px]">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Previous Voucher Number
            </p>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2.5 border border-gray-200 h-[38px]">
              <span className="text-sm text-gray-600 font-medium flex-1">
                {PREV_VOUCHER_NO}
              </span>
              <svg
                className="text-indigo-400 shrink-0"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
            </div>
          </div>

          {/* Voucher No */}
          <div className="flex-1 min-w-[160px] -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Voucher Number <span className="text-red-500">*</span>
            </p>
            <TextBox
              placeholder="Enter voucher number"
              value={voucherNo}
              onChange={v => setVoucherNo(v)}
            />
          </div>

          {/* Voucher Date */}
          <div className="flex-1 min-w-[150px]">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Voucher Date <span className="text-red-500">*</span>
            </p>
            <div
              className={`${displayCls} cursor-default text-gray-600 h-[38px] flex items-center`}
            >
              {new Date().toLocaleDateString('en-GB').split('/').join(' / ')}
            </div>
          </div>

          {/* Existing Voucher toggle */}
          <div className="flex items-center gap-2 h-[38px]">
            <button
              type="button"
              onClick={() => setIsExisting(v => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isExisting ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isExisting ? 'translate-x-4' : 'translate-x-0.5'}`}
              />
            </button>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Existing Voucher
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 my-4" />

      {/* ══ Section 2: PARTICULAR DETAIL ══ */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <svg
            width="15"
            height="15"
            className="text-amber-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Particular Detail
          </span>
        </div>

        {/* Input Row */}
        <div className="flex items-end gap-3 flex-wrap mb-4">
          <div className="w-24 -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Type <span className="text-red-500">*</span>
            </p>
            <DropDownList
              data={TYPE_OPTIONS}
              textField="label"
              valueField="value"
              value={rowType}
              onChange={v => setRowType(v as string)}
            />
          </div>

          <div className="flex-1 min-w-[200px] -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Particulars <span className="text-red-500">*</span>
            </p>
            <DropDownList
              data={PARTICULARS}
              textField="label"
              valueField="value"
              value={rowParticular}
              onChange={v => handleParticularChange(v as string)}
            />
          </div>

          <div className="w-36 shrink-0">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Current Balance
            </p>
            <div
              className={`rounded-lg border px-3 py-2.5 text-sm font-bold text-center h-[38px] flex items-center justify-center ${rowBalance !== null ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
            >
              {rowBalance !== null
                ? rowBalance.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })
                : '—'}
            </div>
          </div>

          <div className="w-48 shrink-0 -mb-4 relative">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Amount <span className="text-red-500">*</span>
            </p>
            <style>{`
              .amount-padded .p-inputtext { padding-right: 90px !important; border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important; border-right: none !important; }
              .amount-add-btn .p-button { border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important; height: 38px !important; padding-left: 12px !important; padding-right: 12px !important; }
            `}</style>
            <div className="amount-padded relative">
              <NumberBox
                placeholder="0"
                value={rowAmount}
                onChange={v => setRowAmount(v ?? 0)}
              />
              <div className="absolute top-0 right-0 amount-add-btn z-10">
                <Button
                  label="Add"
                  icon="plus"
                  variant="primary"
                  onClick={handleAddRow}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Added Rows Table */}
        {rows.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">
                    #
                  </th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">
                    Particular
                  </th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase text-right">
                    Balance (₹)
                  </th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase text-right">
                    Amount (₹)
                  </th>
                  <th className="px-2 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${row.type === 'Dr' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-800">
                      {row.particular}
                    </td>
                    <td className="px-4 py-2.5 text-right text-green-700 font-medium">
                      ₹{row.balance.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-gray-800">
                      ₹{row.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <Button
                        icon="times"
                        variant="danger"
                        size="small"
                        onClick={() => handleRemoveRow(row.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-indigo-50 border-t-2 border-indigo-200">
                  <td
                    colSpan={4}
                    className="px-4 py-2.5 text-sm font-bold text-indigo-700 text-right"
                  >
                    Total Amount
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold text-indigo-700">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-gray-200 my-4" />

      {/* ══ Section 3: NARRATION & PRINT ══ */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <svg
            width="15"
            height="15"
            className="text-amber-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Narration &amp; Print Settings
          </span>
        </div>

        <div className="flex gap-6 items-start flex-wrap">
          {/* Narration */}
          <div className="flex-1 min-w-[260px]">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Narration <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Enter narration here..."
              value={narration}
              onChange={e => setNarration(e.target.value)}
              className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Print Receipt */}
          <div className="w-56 shrink-0">
            <p className="text-xs font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">
              Print Receipt
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Choose whether to print after saving
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="print"
                  value="yes"
                  checked={printReceipt === 'yes'}
                  onChange={() => setPrintReceipt('yes')}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  Yes, print receipt
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="print"
                  value="no"
                  checked={printReceipt === 'no'}
                  onChange={() => setPrintReceipt('no')}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700">No, print receipt</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Footer Actions ══ */}
      <FormActions
        isEditMode={false}
        isLoading={false}
        onSave={() => {}}
        onReset={onClose}
      />
    </form>
  );
}
