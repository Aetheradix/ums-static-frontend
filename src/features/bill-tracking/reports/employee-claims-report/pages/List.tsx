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
import { BT_EMPLOYEE_CLAIMS } from '../../../mock-data';

type EC = (typeof BT_EMPLOYEE_CLAIMS)[0];

function statusVariant(s: string) {
  if (['Approved', 'Paid'].includes(s)) return 'approved';
  if (['Submitted', 'Verified'].includes(s)) return 'pending';
  if (s === 'Cancelled') return 'rejected';
  return 'neutral';
}

export default function List() {
  const [status, setStatus] = useState('All');
  const [employee, setEmployee] = useState('All');

  const employeeOptions = useMemo(() => {
    const unique = Array.from(
      new Set(BT_EMPLOYEE_CLAIMS.map(c => c.employeeName))
    );
    return [
      { label: 'All Employees', value: 'All' },
      ...unique.map(e => ({ label: e, value: e })),
    ];
  }, []);

  const filtered = BT_EMPLOYEE_CLAIMS.filter(c => {
    const sMatch = status === 'All' || c.status === status;
    const eMatch = employee === 'All' || c.employeeName === employee;
    return sMatch && eMatch;
  });

  return (
    <FormPage
      title="Employee Claims Report"
      description="Complete report of all employee reimbursement claims."
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-bold text-indigo-600 tracking-wide mb-4">
          Employee Claims Report
        </h3>
        <div className="flex items-end gap-6 flex-wrap">
          <div className="w-64 -mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Employee
            </p>
            <DropDownList
              data={employeeOptions}
              valueField="value"
              textField="label"
              value={employee}
              onChange={v => setEmployee(v as string)}
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
          searchPlaceholder="Search by claim no, employee..."
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
            { field: 'claimNo', header: 'Claim No' },
            { field: 'employeeName', header: 'Employee' },
            { field: 'employeeId', header: 'Emp ID' },
            { field: 'claimType', header: 'Claim Type' },
            { field: 'claimDate', header: 'Date' },
            {
              field: 'claimAmount',
              header: 'Amount (₹)',
              cell: (i: EC) => (
                <span>₹{i.claimAmount.toLocaleString('en-IN')}</span>
              ),
            },
            { field: 'budgetHead', header: 'Budget Head' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: EC) => (
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
