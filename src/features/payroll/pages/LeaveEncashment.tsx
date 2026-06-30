import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, DatePicker } from 'shared/components/forms';
import { ToastService } from 'services';
import { usePayrollStore, type Employee } from '../store/usePayrollStore';

const OFFICE_TYPES = [
  { text: '01 - University Head Office', value: 'University Head Office' },
  { text: '02 - Constituent College', value: 'Constituent College' },
  { text: '03 - Regional Centre', value: 'Regional Centre' },
];

const OFFICE_NAMES_MAPPING: Record<string, { text: string; value: string }[]> =
  {
    'University Head Office': [
      {
        text: 'U001 - Main Campus (Admin Block)',
        value: 'Main Campus (Admin Block)',
      },
      {
        text: 'U002 - University Library & Information Centre',
        value: 'University Library & Information Centre',
      },
    ],
    'Constituent College': [
      {
        text: 'C001 - School of Engineering & Technology',
        value: 'School of Engineering & Technology',
      },
      { text: 'C002 - School of Sciences', value: 'School of Sciences' },
    ],
    'Regional Centre': [
      {
        text: 'R001 - Regional Centre Bhopal',
        value: 'Regional Centre Bhopal',
      },
      {
        text: 'R002 - Regional Centre Indore',
        value: 'Regional Centre Indore',
      },
    ],
  };

const POST_TYPES = [
  { text: '01 - Regular/Permanent', value: 'Regular/Permanent' },
  { text: '02 - Contractual', value: 'Contractual' },
  { text: '03 - Guest Faculty', value: 'Guest Faculty' },
];

interface LeaveEncashmentRow extends Employee {
  accumulatedLeaves: number;
  encashDays: number;
  basicPay: number;
  daAmount: number;
  encashAmount: number;
  status: 'Pending' | 'Authorized';
}

export default function LeaveEncashment() {
  const { employees } = usePayrollStore();

  const [isListView, setIsListView] = useState(false);

  // FILTERS STATE
  const [officeType, setOfficeType] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState<string | null>(null);
  const [postType, setPostType] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [encashRows, setEncashRows] = useState<LeaveEncashmentRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Dynamic office names mapping
  const availableOfficeNames = officeType
    ? OFFICE_NAMES_MAPPING[officeType] || []
    : [];

  // Helper to retrieve employee salary & mock accumulated leave balances
  const getEmployeeLeaveDetails = (
    desig: string
  ): { basic: number; leaves: number } => {
    let basic = 35000;
    let leaves = 90;

    switch (desig) {
      case 'Professor':
        basic = 144200;
        leaves = 300; // Cap
        break;
      case 'Registrar':
        basic = 131400;
        leaves = 240;
        break;
      case 'Associate Professor':
        basic = 115000;
        leaves = 180;
        break;
      case 'Assistant Professor':
        basic = 57700;
        leaves = 120;
        break;
      case 'Lab Technician':
        basic = 35400;
        leaves = 75;
        break;
    }
    return { basic, leaves };
  };

  const handleQueryLeaveDetails = () => {
    if (!officeType || !officeName || !postType || !fromDate || !toDate) {
      ToastService.error('Please select all mandatory fields.');
      return;
    }

    const matches = employees.filter(emp => {
      const officeTypeMatch = emp.officeType === officeType;
      const officeNameMatch = emp.officeName === officeName;
      const postMatch = emp.postType === postType;
      return officeTypeMatch && officeNameMatch && postMatch;
    });

    const rows: LeaveEncashmentRow[] = matches.map(emp => {
      const { basic, leaves } = getEmployeeLeaveDetails(emp.designation);
      const da = Math.round(basic * 0.5);
      const encashAmount = Math.round(((basic + da) / 30) * leaves);

      return {
        ...emp,
        accumulatedLeaves: leaves,
        encashDays: leaves,
        basicPay: basic,
        daAmount: da,
        encashAmount,
        status: 'Pending',
      };
    });

    setEncashRows(rows);
    setHasSearched(true);
    ToastService.success(
      `Loaded ${matches.length} leave files for encashment processing.`
    );
  };

  const handleClearFilters = () => {
    setOfficeType(null);
    setOfficeName(null);
    setPostType(null);
    setFromDate(null);
    setToDate(null);
    setEncashRows([]);
    setHasSearched(false);
  };

  const updateRowEncashDays = (empId: string, daysVal: string) => {
    const days = Number(daysVal) || 0;
    setEncashRows(prev =>
      prev.map(row => {
        if (row.id !== empId) return row;

        const finalDays = Math.min(days, row.accumulatedLeaves); // cap at balance
        const encashAmount = Math.round(
          ((row.basicPay + row.daAmount) / 30) * finalDays
        );

        return {
          ...row,
          encashDays: finalDays,
          encashAmount,
        };
      })
    );
  };

  const handleAuthorizeClaim = (empId: string) => {
    setEncashRows(prev =>
      prev.map(row => {
        if (row.id === empId) {
          return { ...row, status: 'Authorized' };
        }
        return row;
      })
    );
    ToastService.success('Leave encashment claim authorized successfully.');
  };

  return (
    <FormPage
      title="Leave Encashment"
      description="Process and calculate staff financial conversions for unused accumulated leave balances."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        { label: 'Leave Encashment' },
      ]}
      headerAction={
        <Button
          label={isListView ? 'Back To Entry Page' : 'View Claim List'}
          icon={isListView ? 'undo' : 'eye'}
          variant="outlined"
          onClick={() => {
            setIsListView(!isListView);
            handleClearFilters();
          }}
        />
      }
    >
      <div className="flex flex-col gap-6">
        {!isListView ? (
          // VIEW 1: Calculate Leave Encashment Form & Grid
          <>
            <FormCard title="Leave Encashment">
              <FormGrid columns={4} className="gap-4 mb-4">
                <DropDownList
                  label="Office Type (Code)"
                  data={OFFICE_TYPES}
                  textField="text"
                  valueField="value"
                  value={officeType}
                  onChange={val => {
                    setOfficeType(val as string);
                    setOfficeName(null);
                  }}
                  required
                  defaultOptionText="Select"
                />

                <DropDownList
                  label="Office Name (Code)"
                  data={availableOfficeNames}
                  textField="text"
                  valueField="value"
                  value={officeName}
                  onChange={val => setOfficeName(val as string)}
                  required
                  defaultOptionText="Select"
                  disabled={!officeType}
                />

                <DropDownList
                  label="Post Type"
                  data={POST_TYPES}
                  textField="text"
                  valueField="value"
                  value={postType}
                  onChange={val => setPostType(val as string)}
                  required
                  defaultOptionText="Select"
                />

                <DatePicker
                  label="From Date"
                  value={fromDate || undefined}
                  onChange={val => setFromDate(val || null)}
                  placeholder="dd-mm-yyyy"
                  required
                />
              </FormGrid>

              <FormGrid columns={4} className="gap-4 mb-4 items-end">
                <DatePicker
                  label="To Date"
                  value={toDate || undefined}
                  onChange={val => setToDate(val || null)}
                  placeholder="dd-mm-yyyy"
                  required
                />
                <div className="flex gap-3 mb-4">
                  <Button
                    label="Search"
                    variant="primary"
                    onClick={handleQueryLeaveDetails}
                  />
                  <Button
                    label="Clear"
                    variant="outlined"
                    onClick={handleClearFilters}
                  />
                </div>
              </FormGrid>

              <div className="text-red-500 text-xs mt-2 font-semibold">
                Note: All Asterisk (*) Marked Fields Are Mandatory
              </div>
            </FormCard>

            {hasSearched && (
              <FormCard title="Qualifying Leave Balances Grid">
                <GridPanel
                  data={encashRows}
                  emptyMessage="No employee records found matching search filters."
                  columns={[
                    {
                      header: 'Sr.No.',
                      width: '70px',
                      cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                    },
                    {
                      header: 'Employee Code',
                      field: 'code',
                    },
                    {
                      header: 'Employee Name',
                      field: 'name',
                    },
                    {
                      header: 'Designation',
                      field: 'designation',
                    },
                    {
                      header: 'Total Balance (Days)',
                      field: 'accumulatedLeaves',
                      width: '100px',
                    },
                    {
                      header: 'Encash Days',
                      width: '120px',
                      cell: (item: LeaveEncashmentRow) => (
                        <input
                          type="number"
                          min="0"
                          max={item.accumulatedLeaves}
                          value={item.encashDays}
                          onChange={e =>
                            updateRowEncashDays(item.id, e.target.value)
                          }
                          className="w-20 px-2.5 py-1 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                        />
                      ),
                    },
                    {
                      header: 'Encashment Amount',
                      cell: (item: LeaveEncashmentRow) => (
                        <span className="font-bold text-green-700">
                          ₹{item.encashAmount.toLocaleString()}
                        </span>
                      ),
                    },
                    {
                      header: 'Status',
                      cell: (item: LeaveEncashmentRow) => (
                        <StatusBadge
                          label={item.status}
                          variant={
                            item.status === 'Authorized'
                              ? 'approved'
                              : 'pending'
                          }
                        />
                      ),
                    },
                    {
                      header: 'Action',
                      width: '120px',
                      cell: (item: LeaveEncashmentRow) => (
                        <Button
                          label="Authorize"
                          variant="primary"
                          size="small"
                          disabled={item.status === 'Authorized'}
                          onClick={() => handleAuthorizeClaim(item.id)}
                        />
                      ),
                    },
                  ]}
                />

                {encashRows.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-semibold uppercase">
                        Pending Claims
                      </span>
                      <span className="text-lg font-bold text-slate-800">
                        {encashRows.filter(r => r.status === 'Pending').length}{' '}
                        records
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-semibold uppercase">
                        Total Encashment Value
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ₹
                        {encashRows
                          .filter(r => r.status === 'Authorized')
                          .reduce((acc, r) => acc + r.encashAmount, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </FormCard>
            )}
          </>
        ) : (
          // VIEW 2: Authorized Disbursements Archive
          <FormCard title="Authorized Leave Encashment Register">
            <GridPanel
              data={encashRows.filter(r => r.status === 'Authorized')}
              emptyMessage="No authorized claims found in the current session. Please search and authorize claims first."
              columns={[
                {
                  header: 'Sr.No.',
                  width: '70px',
                  cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                },
                {
                  header: 'Employee Code',
                  field: 'code',
                },
                {
                  header: 'Employee Name',
                  field: 'name',
                },
                {
                  header: 'Designation',
                  field: 'designation',
                },
                {
                  header: 'Leaves Encashed (Days)',
                  field: 'encashDays',
                },
                {
                  header: 'Total Paid',
                  cell: (item: LeaveEncashmentRow) => (
                    <span className="font-semibold text-blue-800">
                      ₹{item.encashAmount.toLocaleString()}
                    </span>
                  ),
                },
                {
                  header: 'Disbursement Log',
                  cell: () => (
                    <span className="text-xs font-semibold text-green-700">
                      Sent to Treasury
                    </span>
                  ),
                },
              ]}
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
