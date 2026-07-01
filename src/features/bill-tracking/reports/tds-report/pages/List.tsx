import { useState, useMemo } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { BT_VENDOR_BILLS } from '../../../mock-data';

type VB = (typeof BT_VENDOR_BILLS)[0];

export default function List() {
  const [vendor, setVendor] = useState('All');

  const vendorOptions = useMemo(() => {
    const unique = Array.from(new Set(BT_VENDOR_BILLS.map(b => b.vendor)));
    return [
      { label: 'All Vendors', value: 'All' },
      ...unique.map(v => ({ label: v, value: v })),
    ];
  }, []);

  const filtered = BT_VENDOR_BILLS.filter(b => {
    return vendor === 'All' || b.vendor === vendor;
  });

  const totalGst = filtered.reduce((s, b) => s + b.gstAmount, 0);
  const totalTds = filtered.reduce((s, b) => s + b.tdsAmount, 0);
  const totalCess = filtered.reduce((s, b) => s + b.cessAmount, 0);
  const totalSD = filtered.reduce((s, b) => s + b.securityDeposit, 0);

  return (
    <FormPage
      title="TDS / GST Deduction Report"
      description="Summary of all tax and statutory deductions applied to vendor bills."
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-bold text-indigo-600 tracking-wide mb-4">
          TDS / GST Deduction Report
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
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total GST Collected', value: totalGst, color: 'blue' },
            { label: 'Total TDS Deducted', value: totalTds, color: 'orange' },
            { label: 'Total Cess', value: totalCess, color: 'purple' },
            { label: 'Security Deposits', value: totalSD, color: 'teal' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`p-4 rounded-lg border bg-${color}-50 border-${color}-200`}
            >
              <p
                className={`text-xs font-semibold text-${color}-600 uppercase mb-1`}
              >
                {label}
              </p>
              <p className={`text-xl font-bold text-${color}-700`}>
                ₹{value.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
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
            { field: 'vendor', header: 'Vendor' },
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
                <span className="text-orange-600">
                  ₹{i.tdsAmount.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'cessAmount',
              header: 'Cess (₹)',
              cell: (i: VB) => (
                <span>₹{i.cessAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'securityDeposit',
              header: 'Security Dep. (₹)',
              cell: (i: VB) => (
                <span>₹{i.securityDeposit.toLocaleString('en-IN')}</span>
              ),
            },
            {
              header: 'Net Deduction (₹)',
              cell: (i: VB) => (
                <span className="font-semibold text-red-600">
                  ₹
                  {(
                    i.tdsAmount +
                    i.cessAmount +
                    i.securityDeposit
                  ).toLocaleString('en-IN')}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
