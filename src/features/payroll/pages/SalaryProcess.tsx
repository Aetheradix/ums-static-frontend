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

interface EmployeeProcessRow extends Employee {
  basicPay: number;
  netPay: number;
  processStatus: 'Draft' | 'Finalized' | 'Supplementary' | 'Reset';
}

export default function SalaryProcess() {
  const { employees } = usePayrollStore();

  // MODE STATE: 'final' | 'supplementary' | 'reset' (defaulting to 'reset' as in screenshot)
  const [processMode, setProcessMode] = useState<
    'final' | 'supplementary' | 'reset'
  >('reset');

  // FILTER STATE
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date | null>(
    new Date()
  );
  const [officeType, setOfficeType] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState<string | null>(null);
  const [postType, setPostType] = useState<string | null>(null);
  const [desigType, setDesigType] = useState('All');
  const [designation, setDesignation] = useState<string | null>(null);

  const [processRows, setProcessRows] = useState<EmployeeProcessRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Dynamic office names based on selected office type
  const availableOfficeNames = officeType
    ? OFFICE_NAMES_MAPPING[officeType] || []
    : [];

  // Helper to compute mock pay details
  const getPayDetails = (
    desig: string
  ): { basicPay: number; netPay: number } => {
    let basicPay = 30000;
    switch (desig) {
      case 'Professor':
      case 'Registrar':
        basicPay = 144200;
        break;
      case 'Associate Professor':
        basicPay = 131400;
        break;
      case 'Assistant Professor':
        basicPay = 57700;
        break;
      case 'Lab Technician':
        basicPay = 35400;
        break;
    }
    const da = Math.round(basicPay * 0.5);
    const hra = Math.round(basicPay * 0.27);
    const earnings = basicPay + da + hra + 5000;
    const deductions = Math.round((basicPay + da) * 0.1) + 2000;
    return { basicPay, netPay: earnings - deductions };
  };

  const handleQueryProcess = () => {
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

    const rows: EmployeeProcessRow[] = matches.map(emp => {
      const pay = getPayDetails(emp.designation);
      return {
        ...emp,
        ...pay,
        processStatus:
          processMode === 'final'
            ? 'Draft'
            : processMode === 'supplementary'
              ? 'Supplementary'
              : 'Finalized',
      };
    });

    setProcessRows(rows);
    setHasSearched(true);
    ToastService.success(
      `Loaded ${matches.length} salaries for monthly processing.`
    );
  };

  const handleClearFilters = () => {
    setSelectedMonthDate(new Date());
    setOfficeType(null);
    setOfficeName(null);
    setPostType(null);
    setDesigType('All');
    setDesignation(null);
    setProcessRows([]);
    setHasSearched(false);
  };

  const handleProcessIndividual = (empId: string) => {
    setProcessRows(prev =>
      prev.map(row => {
        if (row.id === empId) {
          const nextStatus =
            processMode === 'final'
              ? 'Finalized'
              : processMode === 'supplementary'
                ? 'Finalized'
                : 'Reset';
          return { ...row, processStatus: nextStatus };
        }
        return row;
      })
    );

    const actionText =
      processMode === 'final'
        ? 'finalized'
        : processMode === 'supplementary'
          ? 'run for supplementary pay'
          : 'reset';
    ToastService.success(
      `Salary successfully ${actionText} for this employee.`
    );
  };

  const handleProcessAll = () => {
    setProcessRows(prev =>
      prev.map(row => {
        const nextStatus =
          processMode === 'final'
            ? 'Finalized'
            : processMode === 'supplementary'
              ? 'Finalized'
              : 'Reset';
        return { ...row, processStatus: nextStatus };
      })
    );

    const actionText =
      processMode === 'final'
        ? 'finalized'
        : processMode === 'supplementary'
          ? 'run for supplementary pay'
          : 'reset';
    ToastService.success(`All selected salaries successfully ${actionText}.`);
  };

  return (
    <FormPage
      title="Salary Process Details"
      description="Perform final validation, generate supplementary salary calculations, or reset payroll logs."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        {
          label: 'Salary Process',
          to: '/payroll-management/salary-process/salary-process',
        },
        { label: 'Salary Process' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Final Salary Process /Final salary processing">
          {/* Instructions Callout in standard clean UMS styling */}
          <div className="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-xl text-sm mb-6 leading-relaxed">
            <span className="font-semibold text-slate-800">Instruction:</span>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>
                Generate Final Salary :- Only after complete verification of the
                monthly salary of officers and employees the salary will be
                finalized and once the salary is finalized, the salary reset
                process cannot be done again.
              </li>
              <li>
                Generate Supplementary Salary :- If due to any reason the salary
                of the employee is held, then through this page the salary of
                that employee will be given from supplementary pay.
              </li>
              <li>
                Reset Salary :- If there is an error in the salary of any
                employee, then the salary can be reset through this page so that
                the correct salary of the employees can be calculated and the
                salary can be prepared again.
              </li>
            </ol>
          </div>

          {/* Mode Selector Radio Buttons */}
          <div className="flex flex-wrap gap-6 items-center mb-6 pb-4 border-b border-gray-150">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-gray-700">
              <input
                type="radio"
                name="processMode"
                checked={processMode === 'final'}
                onChange={() => {
                  setProcessMode('final');
                  setHasSearched(false);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span>Generate Final Salary</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-gray-700">
              <input
                type="radio"
                name="processMode"
                checked={processMode === 'supplementary'}
                onChange={() => {
                  setProcessMode('supplementary');
                  setHasSearched(false);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span>Generate Supplementary Salary</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-gray-700 text-green-700">
              <input
                type="radio"
                name="processMode"
                checked={processMode === 'reset'}
                onChange={() => {
                  setProcessMode('reset');
                  setHasSearched(false);
                }}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span>Reset Salary</span>
            </label>
          </div>

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
              label="Select Designation"
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
                onClick={handleQueryProcess}
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
          <FormCard title="Salary Processing Controls Grid">
            <GridPanel
              data={processRows}
              emptyMessage="No salaries found matching search filters."
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
                  cell: (item: EmployeeProcessRow) => (
                    <span>₹{item.basicPay.toLocaleString()}</span>
                  ),
                },
                {
                  header: 'Net Pay',
                  cell: (item: EmployeeProcessRow) => (
                    <span className="font-semibold text-blue-700">
                      ₹{item.netPay.toLocaleString()}
                    </span>
                  ),
                },
                {
                  header: 'Current Status',
                  cell: (item: EmployeeProcessRow) => {
                    let variant:
                      | 'approved'
                      | 'pending'
                      | 'rejected'
                      | 'neutral' = 'neutral';
                    if (item.processStatus === 'Finalized')
                      variant = 'approved';
                    else if (item.processStatus === 'Supplementary')
                      variant = 'pending';
                    else if (item.processStatus === 'Reset')
                      variant = 'rejected';
                    return (
                      <StatusBadge
                        label={item.processStatus}
                        variant={variant}
                      />
                    );
                  },
                },
                {
                  header: 'Action',
                  width: '180px',
                  cell: (item: EmployeeProcessRow) => {
                    let label = 'Finalize';
                    let variant: 'primary' | 'danger' | 'warning' | 'info' =
                      'primary';

                    if (processMode === 'final') {
                      label = 'Finalize Salary';
                      variant = 'danger';
                    } else if (processMode === 'supplementary') {
                      label = 'Run Supplementary';
                      variant = 'info';
                    } else if (processMode === 'reset') {
                      label = 'Reset Salary';
                      variant = 'warning';
                    }

                    return (
                      <Button
                        label={label}
                        variant={variant}
                        size="small"
                        onClick={() => handleProcessIndividual(item.id)}
                      />
                    );
                  },
                },
              ]}
              toolbar={
                <div className="flex justify-end w-full">
                  <Button
                    label={
                      processMode === 'final'
                        ? 'Finalize All Selected'
                        : processMode === 'supplementary'
                          ? 'Run Supplementary for All'
                          : 'Reset All Selected'
                    }
                    variant={
                      processMode === 'final'
                        ? 'danger'
                        : processMode === 'supplementary'
                          ? 'info'
                          : 'warning'
                    }
                    onClick={handleProcessAll}
                  />
                </div>
              }
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
