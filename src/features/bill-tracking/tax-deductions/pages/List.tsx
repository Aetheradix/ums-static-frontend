import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { BT_VENDOR_BILLS, BT_EMPLOYEE_CLAIMS } from '../../mock-data';

const TYPE_OPTIONS = ['All', 'Vendor', 'Employee'];

type DeductionRow = {
  id: number;
  billNo: string;
  billType: string;
  party: string;
  gstAmount: number;
  tdsAmount: number;
  cessAmount: number;
  securityDeposit: number;
  netDeduction: number;
  status: string;
};

function buildRows(): DeductionRow[] {
  const vendorRows: DeductionRow[] = BT_VENDOR_BILLS.map(b => ({
    id: b.id,
    billNo: b.billNo,
    billType: 'Vendor',
    party: b.vendor,
    gstAmount: b.gstAmount,
    tdsAmount: b.tdsAmount,
    cessAmount: b.cessAmount,
    securityDeposit: b.securityDeposit,
    netDeduction: b.tdsAmount + b.cessAmount + b.securityDeposit,
    status: b.status,
  }));
  const empRows: DeductionRow[] = BT_EMPLOYEE_CLAIMS.map(c => ({
    id: c.id + 1000,
    billNo: c.claimNo,
    billType: 'Employee',
    party: c.employeeName,
    gstAmount: 0,
    tdsAmount: 0,
    cessAmount: 0,
    securityDeposit: 0,
    netDeduction: 0,
    status: c.status,
  }));
  return [...vendorRows, ...empRows];
}

function statusVariant(s: string) {
  if (['Approved', 'Paid'].includes(s)) return 'approved';
  if (['Submitted', 'Verified'].includes(s)) return 'pending';
  if (s === 'Cancelled') return 'rejected';
  return 'neutral';
}

export default function List() {
  const [type, setType] = useState('All');

  const allRows = buildRows();
  const filtered = allRows.filter(r => {
    return type === 'All' || r.billType === type;
  });

  return (
    <FormPage
      title="Tax & Deductions"
      description="Summary of GST, TDS, Cess and Security Deposits applied across all bills and claims."
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-bold text-indigo-600 tracking-wide mb-4">
          Tax & Deductions
        </h3>
        <div className="flex items-end gap-6 flex-wrap">
          <div className="w-48 -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Bill Type
            </p>
            <DropDownList
              data={TYPE_OPTIONS.map(o => ({ label: o, value: o }))}
              valueField="value"
              textField="label"
              value={type}
              onChange={v => setType(v as string)}
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
          searchPlaceholder="Search by bill no, party..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'billNo', header: 'Bill / Claim No' },
            { field: 'billType', header: 'Type' },
            { field: 'party', header: 'Party' },
            {
              field: 'gstAmount',
              header: 'GST (₹)',
              cell: (i: DeductionRow) => (
                <span>₹{i.gstAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'tdsAmount',
              header: 'TDS (₹)',
              cell: (i: DeductionRow) => (
                <span>₹{i.tdsAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'cessAmount',
              header: 'Cess (₹)',
              cell: (i: DeductionRow) => (
                <span>₹{i.cessAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'securityDeposit',
              header: 'Security Dep. (₹)',
              cell: (i: DeductionRow) => (
                <span>₹{i.securityDeposit.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'netDeduction',
              header: 'Net Deduction (₹)',
              cell: (i: DeductionRow) => (
                <span className="font-semibold text-red-600">
                  ₹{i.netDeduction.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: DeductionRow) => (
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
