import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { BT_PAYMENT_VOUCHERS } from '../../../mock-data';

type PV = (typeof BT_PAYMENT_VOUCHERS)[0];

export default function List() {
  const [mode, setMode] = useState('All');
  const [bank, setBank] = useState('All');

  const filtered = BT_PAYMENT_VOUCHERS.filter(p => {
    return (
      (mode === 'All' || p.paymentMode === mode) &&
      (bank === 'All' || p.bankAccount === bank)
    );
  });

  const total = filtered.reduce((s, p) => s + p.amount, 0);

  return (
    <FormPage
      title="Payment Report"
      description="Complete report of all payments processed to vendors and employees."
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-bold text-indigo-600 tracking-wide mb-4">
          Payment Report
        </h3>
        <div className="flex items-end gap-6 flex-wrap">
          <div className="w-48 -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Payment Mode
            </p>
            <DropDownList
              data={[
                { label: 'All', value: 'All' },
                { label: 'NEFT', value: 'NEFT' },
                { label: 'RTGS', value: 'RTGS' },
                { label: 'Cheque', value: 'Cheque' },
              ]}
              valueField="value"
              textField="label"
              value={mode}
              onChange={v => setMode(v as string)}
            />
          </div>
          <div className="w-48 -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Bank Account
            </p>
            <DropDownList
              data={[
                { label: 'All', value: 'All' },
                { label: 'SBI - 1234', value: 'SBI - 1234' },
                { label: 'HDFC - 5678', value: 'HDFC - 5678' },
              ]}
              valueField="value"
              textField="label"
              value={bank}
              onChange={v => setBank(v as string)}
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
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200 inline-flex gap-2 items-center">
          <span className="text-sm text-green-600 font-medium">
            Total Payments:
          </span>
          <span className="text-lg font-bold text-green-700">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
        <GridPanel
          data={filtered}
          searchBox
          searchPlaceholder="Search by voucher no, party..."
          toolbar={
            <Button
              label="Export"
              icon="download"
              variant="outlined"
              onClick={() =>
                ToastService.success('Report exported successfully.')
              }
            />
          }
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'voucherNo', header: 'Voucher No' },
            { field: 'billRef', header: 'Bill Ref' },
            { field: 'party', header: 'Party' },
            { field: 'paymentDate', header: 'Payment Date' },
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
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: () => <StatusBadge label="Paid" variant="approved" />,
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
