import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { BT_PAYMENT_VOUCHERS, BT_BANK_ACCOUNTS } from '../../mock-data';

const BANK_OPTIONS = ['All', ...BT_BANK_ACCOUNTS.map(b => b.name)];
const MODE_OPTIONS = ['All', 'NEFT', 'RTGS', 'Cheque', 'Cash'];

type PV = (typeof BT_PAYMENT_VOUCHERS)[0];

export default function List() {
  const [bank, setBank] = useState('All');
  const [mode, setMode] = useState('All');

  const filtered = BT_PAYMENT_VOUCHERS.filter(p => {
    const bankMatch = bank === 'All' || p.bankAccount === bank;
    const modeMatch = mode === 'All' || p.paymentMode === mode;
    return bankMatch && modeMatch;
  });

  const totalAmount = filtered.reduce((s, p) => s + p.amount, 0);

  return (
    <FormPage
      title="Bank Payment Register"
      description="Ledger of all payments made, grouped by bank account and payment mode."
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-bold text-indigo-600 tracking-wide mb-4">
          Bank Payment Register
        </h3>
        <div className="flex items-end gap-6 flex-wrap">
          <div className="w-48 -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Bank Account
            </p>
            <DropDownList
              data={BANK_OPTIONS.map(o => ({ label: o, value: o }))}
              valueField="value"
              textField="label"
              value={bank}
              onChange={v => setBank(v as string)}
            />
          </div>
          <div className="w-48 -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Payment Mode
            </p>
            <DropDownList
              data={MODE_OPTIONS.map(o => ({ label: o, value: o }))}
              valueField="value"
              textField="label"
              value={mode}
              onChange={v => setMode(v as string)}
            />
          </div>
          <div className="shrink-0 pt-1">
            <style>{`.search-btn .p-button { height: 38px !important; }`}</style>
            <div className="search-btn">
              <Button
                label="Search"
                icon="search"
                variant="primary"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>

      <FormCard>
        <div className="mb-4 px-4 py-2 bg-green-50 rounded-lg border border-green-200 inline-flex items-center gap-2">
          <span className="text-sm text-green-600 font-medium">Total: </span>
          <span className="text-sm font-bold text-green-700">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <GridPanel
          data={filtered}
          searchBox
          searchPlaceholder="Search by voucher no, bill ref, party..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'voucherNo', header: 'Voucher No' },
            { field: 'paymentDate', header: 'Date' },
            { field: 'party', header: 'Party' },
            { field: 'billRef', header: 'Bill Ref' },
            { field: 'bankAccount', header: 'Bank Account' },
            { field: 'paymentMode', header: 'Mode' },
            { field: 'transactionRef', header: 'Txn Ref' },
            {
              field: 'amount',
              header: 'Amount (₹)',
              cell: (i: PV) => (
                <span className="font-semibold text-green-700">
                  ₹{i.amount.toLocaleString('en-IN')}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
