import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { BT_CANCELLED_BILLS } from '../../mock-data';

type CB = (typeof BT_CANCELLED_BILLS)[0];

export default function List() {
  const [billType, setBillType] = useState('All');

  const filtered = BT_CANCELLED_BILLS.filter(b => {
    return billType === 'All' || b.billType === billType;
  });

  return (
    <FormPage
      title="Cancelled Bills"
      description="Ledger of all bills that were cancelled or rejected during processing."
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-bold text-indigo-600 tracking-wide mb-4">
          Cancelled Bills Search
        </h3>
        <div className="flex items-end gap-6 flex-wrap">
          <div className="w-48 -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Bill Type
            </p>
            <DropDownList
              data={[
                { label: 'All', value: 'All' },
                { label: 'Vendor', value: 'Vendor' },
                { label: 'Employee', value: 'Employee' },
              ]}
              valueField="value"
              textField="label"
              value={billType}
              onChange={v => setBillType(v as string)}
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
        <GridPanel
          data={filtered}
          searchBox
          searchPlaceholder="Search by bill no, party, reason..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'billNo', header: 'Bill No' },
            { field: 'billType', header: 'Type' },
            { field: 'party', header: 'Party' },
            {
              field: 'amount',
              header: 'Amount (₹)',
              cell: (i: CB) => (
                <span className="font-semibold text-gray-700">
                  ₹{i.amount.toLocaleString('en-IN')}
                </span>
              ),
            },
            { field: 'cancelledAtStage', header: 'Cancelled At Stage' },
            { field: 'cancelledBy', header: 'Cancelled By' },
            { field: 'cancelledDate', header: 'Date' },
            { field: 'reason', header: 'Reason / Remarks', width: '300px' },
            {
              header: 'Status',
              sortable: false,
              cell: () => <StatusBadge label="Cancelled" variant="rejected" />,
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
