import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
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

interface BonusRow extends Employee {
  basicPay: number;
  daAmount: number;
  bonusAmount: number;
  status: 'Pending' | 'Authorized';
}

export default function Bonus() {
  const { employees } = usePayrollStore();

  const [isListView, setIsListView] = useState(false);

  // FILTERS STATE
  const [officeType, setOfficeType] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState<string | null>(null);
  const [postType, setPostType] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [bonusRows, setBonusRows] = useState<BonusRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Dynamic office names mapping
  const availableOfficeNames = officeType
    ? OFFICE_NAMES_MAPPING[officeType] || []
    : [];

  // Helper to retrieve employee salary details
  const getEmployeeSalaryDetails = (
    desig: string
  ): { basic: number; da: number } => {
    let basic = 35000;
    switch (desig) {
      case 'Professor':
        basic = 144200;
        break;
      case 'Registrar':
        basic = 131400;
        break;
      case 'Associate Professor':
        basic = 115000;
        break;
      case 'Assistant Professor':
        basic = 57700;
        break;
      case 'Lab Technician':
        basic = 35400;
        break;
    }
    const da = Math.round(basic * 0.5); // Dearness Allowance standard 50%
    return { basic, da };
  };

  const handleQueryBonus = () => {
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

    const rows: BonusRow[] = matches.map(emp => {
      const { basic, da } = getEmployeeSalaryDetails(emp.designation);
      // Festive bonus default capped at Rs. 7,000 for demo / MP standards
      const bonusAmount = 7000;

      return {
        ...emp,
        basicPay: basic,
        daAmount: da,
        bonusAmount,
        status: 'Pending',
      };
    });

    setBonusRows(rows);
    setHasSearched(true);
    ToastService.success(
      `Loaded ${matches.length} staff records for bonus processing.`
    );
  };

  const handleClearFilters = () => {
    setOfficeType(null);
    setOfficeName(null);
    setPostType(null);
    setFromDate(null);
    setToDate(null);
    setBonusRows([]);
    setHasSearched(false);
  };

  const updateRowBonusAmount = (empId: string, amtVal: string) => {
    const amt = Number(amtVal) || 0;
    setBonusRows(prev =>
      prev.map(row => {
        if (row.id !== empId) return row;
        return {
          ...row,
          bonusAmount: amt,
        };
      })
    );
  };

  const handleAuthorizeBonus = (empId: string) => {
    setBonusRows(prev =>
      prev.map(row => {
        if (row.id === empId) {
          return { ...row, status: 'Authorized' };
        }
        return row;
      })
    );
    ToastService.success('Employee bonus authorized successfully.');
  };

  return (
    <FormPage
      title="Bonus"
      description="Manage and calculate festive or performance-based staff bonus disbursements."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        { label: 'Bonus' },
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
          // VIEW 1: Calculate Bonus Form & Grid
          <>
            <FormCard title="Employee Bonus">
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
                    onClick={handleQueryBonus}
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
              <FormCard title="Qualifying Bonus Calculations Summary">
                <GridPanel
                  data={bonusRows}
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
                      header: 'Basic Pay',
                      cell: (item: BonusRow) => (
                        <span>₹{item.basicPay.toLocaleString()}</span>
                      ),
                    },
                    {
                      header: 'DA Amount',
                      cell: (item: BonusRow) => (
                        <span>₹{item.daAmount.toLocaleString()}</span>
                      ),
                    },
                    {
                      header: 'Bonus Amount',
                      width: '140px',
                      cell: (item: BonusRow) => (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-semibold text-sm">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={item.bonusAmount}
                            onChange={e =>
                              updateRowBonusAmount(item.id, e.target.value)
                            }
                            className="w-24 px-2.5 py-1 border border-gray-200 rounded-lg text-right text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                          />
                        </div>
                      ),
                    },
                    {
                      header: 'Status',
                      cell: (item: BonusRow) => (
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
                      cell: (item: BonusRow) => (
                        <Button
                          label="Authorize"
                          variant="primary"
                          size="small"
                          disabled={item.status === 'Authorized'}
                          onClick={() => handleAuthorizeBonus(item.id)}
                        />
                      ),
                    },
                  ]}
                />

                {bonusRows.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-semibold uppercase">
                        Pending Claims
                      </span>
                      <span className="text-lg font-bold text-slate-800">
                        {bonusRows.filter(r => r.status === 'Pending').length}{' '}
                        records
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-semibold uppercase">
                        Total Authorized Bonus Value
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ₹
                        {bonusRows
                          .filter(r => r.status === 'Authorized')
                          .reduce((acc, r) => acc + r.bonusAmount, 0)
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
          <FormCard title="Authorized Bonus Register">
            <GridPanel
              data={bonusRows.filter(r => r.status === 'Authorized')}
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
                  header: 'Bonus Paid',
                  cell: (item: BonusRow) => (
                    <span className="font-semibold text-blue-800">
                      ₹{item.bonusAmount.toLocaleString()}
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
