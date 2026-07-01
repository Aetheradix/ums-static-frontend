import { useState, useMemo } from 'react';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { BT_VENDOR_BILLS } from '../../../mock-data';

type VB = (typeof BT_VENDOR_BILLS)[0];

function statusVariant(s: string) {
  if (['Approved', 'Paid'].includes(s)) return 'approved';
  if (['Submitted', 'Verified'].includes(s)) return 'pending';
  if (s === 'Cancelled') return 'rejected';
  return 'neutral';
}

export default function List() {
  const [status, setStatus] = useState('All');
  const [vendor, setVendor] = useState('All');

  const vendorOptions = useMemo(() => {
    const unique = Array.from(new Set(BT_VENDOR_BILLS.map(b => b.vendor)));
    return [
      { label: 'All Vendors', value: 'All' },
      ...unique.map(v => ({ label: v, value: v })),
    ];
  }, []);

  const filtered = BT_VENDOR_BILLS.filter(b => {
    const sMatch = status === 'All' || b.status === status;
    const vMatch = vendor === 'All' || b.vendor === vendor;
    return sMatch && vMatch;
  });

  return (
    <FormPage
      title="Vendor Bills Report"
      description="Complete report of all vendor bills with amounts, taxes, and status."
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-bold text-indigo-600 tracking-wide mb-4">
          Vendor Bills Report
        </h3>
        <div className="flex items-end gap-6 flex-wrap">
          <div className="w-64 -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Vendor
            </p>
            <DropDownList
              data={vendorOptions}
              valueField="value"
              textField="label"
              value={vendor}
              onChange={v => setVendor(v as string)}
            />
          </div>
          <div className="w-48 -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Status
            </p>
            <DropDownList
              data={[
                { label: 'All', value: 'All' },
                { label: 'Draft', value: 'Draft' },
                { label: 'Submitted', value: 'Submitted' },
                { label: 'Verified', value: 'Verified' },
                { label: 'Approved', value: 'Approved' },
                { label: 'Paid', value: 'Paid' },
                { label: 'Cancelled', value: 'Cancelled' },
              ]}
              valueField="value"
              textField="label"
              value={status}
              onChange={v => setStatus(v as string)}
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
          searchPlaceholder="Search by bill no, vendor..."
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
            { field: 'billNo', header: 'Bill No' },
            { field: 'billDate', header: 'Bill Date' },
            { field: 'vendor', header: 'Vendor' },
            { field: 'invoiceNo', header: 'Invoice No' },
            {
              field: 'baseAmount',
              header: 'Base Amt (₹)',
              cell: (i: VB) => (
                <span>₹{i.baseAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'gstAmount',
              header: 'GST (₹)',
              cell: (i: VB) => (
                <span>₹{i.gstAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'tdsAmount',
              header: 'TDS (₹)',
              cell: (i: VB) => (
                <span>₹{i.tdsAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'netPayable',
              header: 'Net Payable (₹)',
              cell: (i: VB) => (
                <span className="font-semibold text-blue-700">
                  ₹{i.netPayable.toLocaleString('en-IN')}
                </span>
              ),
            },
            { field: 'dueDate', header: 'Due Date' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: VB) => (
                <StatusBadge
                  label={i.status}
                  variant={statusVariant(i.status)}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
