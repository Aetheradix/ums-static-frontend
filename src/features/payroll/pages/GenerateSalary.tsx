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

const DESIGNATION_TYPES = [
  { text: 'All', value: 'All' },
  { text: '01 - Teaching', value: 'Teaching' },
  { text: '02 - Non-Teaching', value: 'Non-Teaching' },
];

const DESIGNATIONS = [
  { text: 'All', value: 'All' },
  { text: 'D001 - Professor', value: 'Professor' },
  { text: 'D002 - Associate Professor', value: 'Associate Professor' },
  { text: 'D003 - Assistant Professor', value: 'Assistant Professor' },
  { text: 'D004 - Registrar', value: 'Registrar' },
  { text: 'D009 - Lab Technician', value: 'Lab Technician' },
];

interface EmployeeSalaryRow extends Employee {
  basicPay: number;
  earnings: number;
  deductions: number;
  netPay: number;
  status: 'Pending' | 'Generated';
}

export default function GenerateSalary() {
  const { employees } = usePayrollStore();

  // FILTER STATE
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date | null>(
    new Date()
  );
  const [officeType, setOfficeType] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState<string | null>(null);
  const [postType, setPostType] = useState<string | null>(null);
  const [desigType, setDesigType] = useState('All');
  const [designation, setDesignation] = useState<string | null>(null);

  const [salaryRows, setSalaryRows] = useState<EmployeeSalaryRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Dynamic office names based on selected office type
  const availableOfficeNames = officeType
    ? OFFICE_NAMES_MAPPING[officeType] || []
    : [];

  // Helper to compute payroll elements based on designation
  const calculateSalaryMetrics = (
    desig: string
  ): {
    basicPay: number;
    earnings: number;
    deductions: number;
    netPay: number;
  } => {
    let basicPay = 30000;
    let tax = 1000;

    switch (desig) {
      case 'Professor':
      case 'Registrar':
        basicPay = 144200;
        tax = 5000;
        break;
      case 'Associate Professor':
        basicPay = 131400;
        tax = 4000;
        break;
      case 'Assistant Professor':
        basicPay = 57700;
        tax = 2000;
        break;
      case 'Lab Technician':
        basicPay = 35400;
        tax = 1000;
        break;
    }

    const da = Math.round(basicPay * 0.5); // 50% Dearness Allowance
    const hra = Math.round(basicPay * 0.27); // 27% HRA
    const allowance = 5000; // Conveyance
    const earnings = basicPay + da + hra + allowance;

    const nps = Math.round((basicPay + da) * 0.1); // 10% NPS contribution
    const deductions = nps + tax;

    const netPay = earnings - deductions;

    return { basicPay, earnings, deductions, netPay };
  };

  const handleQuerySalaries = () => {
    if (
      !selectedMonthDate ||
      !officeType ||
      !officeName ||
      !postType ||
      !desigType ||
      !designation
    ) {
      ToastService.error('Please select all mandatory fields.');
      return;
    }

    // Filter employees from state matching selection
    const matches = employees.filter(emp => {
      const officeTypeMatch = emp.officeType === officeType;
      const officeNameMatch = emp.officeName === officeName;
      const postMatch = emp.postType === postType;
      const desigTypeMatch =
        desigType === 'All' || emp.designationType === desigType;
      const desigMatch =
        designation === 'All' || emp.designation === designation;

      return (
        officeTypeMatch &&
        officeNameMatch &&
        postMatch &&
        desigTypeMatch &&
        desigMatch
      );
    });

    const rows: EmployeeSalaryRow[] = matches.map(emp => {
      const metrics = calculateSalaryMetrics(emp.designation);
      return {
        ...emp,
        ...metrics,
        status: 'Pending',
      };
    });

    setSalaryRows(rows);
    setHasSearched(true);
    ToastService.success(
      `Found ${matches.length} matching employee salary profiles.`
    );
  };

  const handleClearFilters = () => {
    setSelectedMonthDate(new Date());
    setOfficeType(null);
    setOfficeName(null);
    setPostType(null);
    setDesigType('All');
    setDesignation(null);
    setSalaryRows([]);
    setHasSearched(false);
  };

  const handleGenerateSalary = (empId: string) => {
    setSalaryRows(prev =>
      prev.map(row => {
        if (row.id === empId) {
          return { ...row, status: 'Generated' };
        }
        return row;
      })
    );
    ToastService.success(
      'Salary sheet generated successfully for this employee.'
    );
  };

  const handleGenerateAll = () => {
    setSalaryRows(prev => prev.map(row => ({ ...row, status: 'Generated' })));
    ToastService.success(
      'Salary sheet generated successfully for all displayed employees.'
    );
  };

  return (
    <FormPage
      title="Generate Salary"
      description="Calculate monthly earnings, deductions, and finalize net pay calculations for university staff."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        {
          label: 'Salary Process',
          to: '/payroll-management/salary-process/salary-process',
        },
        { label: 'Generate Salary' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Generate Monthly salary">
          <FormGrid columns={4} className="gap-4 mb-4">
            <DatePicker
              label="Month"
              value={selectedMonthDate || undefined}
              onChange={val => setSelectedMonthDate(val || null)}
              view="month"
              dateFormat="mm/yy"
              placeholder="MM/YYYY"
              required
            />

            <DropDownList
              label="Office Type (Code)"
              data={OFFICE_TYPES}
              textField="text"
              valueField="value"
              value={officeType}
              onChange={val => {
                setOfficeType(val as string);
                setOfficeName(null); // Reset child dropdown
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
              label="Type Of Post"
              data={POST_TYPES}
              textField="text"
              valueField="value"
              value={postType}
              onChange={val => setPostType(val as string)}
              required
              defaultOptionText="Select"
            />
          </FormGrid>

          <FormGrid columns={4} className="gap-4 mb-4 items-end">
            <DropDownList
              label="Designation Type"
              data={DESIGNATION_TYPES}
              textField="text"
              valueField="value"
              value={desigType}
              onChange={val => setDesigType(val as string)}
              required
            />

            <DropDownList
              label="Designation"
              data={DESIGNATIONS}
              textField="text"
              valueField="value"
              value={designation}
              onChange={val => setDesignation(val as string)}
              required
              defaultOptionText="Select"
            />

            <div className="flex gap-3 mb-4">
              <Button
                label="Search"
                variant="primary"
                onClick={handleQuerySalaries}
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
          <FormCard title="Salary Calculations Grid">
            <GridPanel
              data={salaryRows}
              emptyMessage="No employee records found matching the selection criteria."
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
                  cell: (item: EmployeeSalaryRow) => (
                    <span>₹{item.basicPay.toLocaleString()}</span>
                  ),
                },
                {
                  header: 'Total Earnings',
                  cell: (item: EmployeeSalaryRow) => (
                    <span className="text-green-600 font-semibold">
                      ₹{item.earnings.toLocaleString()}
                    </span>
                  ),
                },
                {
                  header: 'Total Deductions',
                  cell: (item: EmployeeSalaryRow) => (
                    <span className="text-red-600 font-semibold">
                      ₹{item.deductions.toLocaleString()}
                    </span>
                  ),
                },
                {
                  header: 'Net Pay',
                  cell: (item: EmployeeSalaryRow) => (
                    <span className="text-blue-700 font-bold">
                      ₹{item.netPay.toLocaleString()}
                    </span>
                  ),
                },
                {
                  header: 'Status',
                  cell: (item: EmployeeSalaryRow) => (
                    <StatusBadge
                      label={item.status}
                      variant={
                        item.status === 'Generated' ? 'approved' : 'pending'
                      }
                    />
                  ),
                },
                {
                  header: 'Action',
                  width: '140px',
                  cell: (item: EmployeeSalaryRow) => (
                    <Button
                      label={
                        item.status === 'Generated' ? 'Regenerate' : 'Generate'
                      }
                      variant={
                        item.status === 'Generated' ? 'outlined' : 'primary'
                      }
                      size="small"
                      onClick={() => handleGenerateSalary(item.id)}
                    />
                  ),
                },
              ]}
              toolbar={
                <div className="flex justify-end w-full">
                  <Button
                    label="Generate All Salaries"
                    variant="success"
                    onClick={handleGenerateAll}
                  />
                </div>
              }
            />

            {/* Calculations Summary Block */}
            {salaryRows.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase">
                    Total Employees
                  </span>
                  <span className="text-xl font-bold text-slate-800">
                    {salaryRows.length}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase">
                    Total Earnings
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    ₹
                    {salaryRows
                      .reduce((acc, row) => acc + row.earnings, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase">
                    Total Deductions
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    ₹
                    {salaryRows
                      .reduce((acc, row) => acc + row.deductions, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase">
                    Total Net Distributed
                  </span>
                  <span className="text-xl font-bold text-blue-700">
                    ₹
                    {salaryRows
                      .reduce((acc, row) => acc + row.netPay, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
