import { useState } from 'react';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
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

const ATTENDANCE_PERIODS = [
  { text: '16-15', value: '16-15' },
  { text: '21-20', value: '21-20' },
  { text: 'Calendar Month', value: 'Calendar Month' },
];

interface EmployeeAttendanceRow extends Employee {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
}

export default function SetAttendance() {
  const { employees } = usePayrollStore();

  // FILTER STATE
  const [attendancePeriod, setAttendancePeriod] = useState('16-15');
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date | null>(
    new Date()
  );
  const [officeType, setOfficeType] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState<string | null>(null);
  const [postType, setPostType] = useState<string | null>(null);

  const [attendanceRows, setAttendanceRows] = useState<EmployeeAttendanceRow[]>(
    []
  );
  const [hasSearched, setHasSearched] = useState(false);

  // Dynamic office names list based on selected office type
  const availableOfficeNames = officeType
    ? OFFICE_NAMES_MAPPING[officeType] || []
    : [];

  // Calculate days in the selected month
  const getDaysInMonth = (date: Date | null): number => {
    if (!date) return 30;
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const handleQueryEmployees = () => {
    if (
      !attendancePeriod ||
      !selectedMonthDate ||
      !officeType ||
      !officeName ||
      !postType
    ) {
      ToastService.error('Please select all mandatory fields.');
      return;
    }

    const days = getDaysInMonth(selectedMonthDate);

    // Filter employees from state matching selection
    const matches = employees.filter(emp => {
      const officeTypeMatch = emp.officeType === officeType;
      const officeNameMatch = emp.officeName === officeName;
      const postMatch = emp.postType === postType;
      return officeTypeMatch && officeNameMatch && postMatch;
    });

    const rows: EmployeeAttendanceRow[] = matches.map(emp => ({
      ...emp,
      totalDays: days,
      presentDays: days,
      absentDays: 0,
      leaveDays: 0,
    }));

    setAttendanceRows(rows);
    setHasSearched(true);
    ToastService.success(
      `Fetched ${matches.length} employee records for attendance.`
    );
  };

  const handleClearFilters = () => {
    setAttendancePeriod('16-15');
    setSelectedMonthDate(new Date());
    setOfficeType(null);
    setOfficeName(null);
    setPostType(null);
    setAttendanceRows([]);
    setHasSearched(false);
  };

  const handleSaveIndividual = (empId: string) => {
    const row = attendanceRows.find(r => r.id === empId);
    if (!row) return;

    if (row.presentDays + row.absentDays + row.leaveDays !== row.totalDays) {
      ToastService.error(
        `Sum of present, absent, and leave days must equal total days (${row.totalDays}).`
      );
      return;
    }

    ToastService.success(`Attendance saved for ${row.name}.`);
  };

  const handleSaveAll = () => {
    // Validate all rows
    const invalidRow = attendanceRows.find(
      row => row.presentDays + row.absentDays + row.leaveDays !== row.totalDays
    );

    if (invalidRow) {
      ToastService.error(
        `Validation failed for ${invalidRow.name}. Days count must equal ${invalidRow.totalDays}.`
      );
      return;
    }

    ToastService.success('Bulk attendance records saved successfully.');
  };

  const updateRowField = (
    empId: string,
    field: 'presentDays' | 'absentDays' | 'leaveDays',
    value: string
  ) => {
    const num = Number(value) || 0;
    setAttendanceRows(prev =>
      prev.map(row => {
        if (row.id !== empId) return row;

        const updated = { ...row, [field]: num };

        // Auto adjust absent days if present days are entered to fit total days
        if (field === 'presentDays') {
          const rem = row.totalDays - num - row.leaveDays;
          updated.absentDays = rem >= 0 ? rem : 0;
        } else if (field === 'leaveDays') {
          const rem = row.totalDays - row.presentDays - num;
          updated.absentDays = rem >= 0 ? rem : 0;
        }

        return updated;
      })
    );
  };

  return (
    <FormPage
      title="Set Attendance"
      description="Record and verify employee monthly attendance days prior to salary generation."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        {
          label: 'Salary Process',
          to: '/payroll-management/salary-process/salary-process',
        },
        { label: 'Set Attendance' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Attendance Details">
          {/* Instructions Callout Box in standard clean UMS styling */}
          <div className="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-xl text-sm mb-6 leading-relaxed">
            <span className="font-semibold text-slate-800">Instructions:</span>{' '}
            As per the attendance and absence format of your office employees
            and officers, select the attendance period from the options given
            below 16 to 15, 21 to 20 and calendar month.
            <br />
            For example: Period from 16 March 15 of last month to current April,
            period from 21 March 20 of last month to current April or calendar
            month.
          </div>

          <FormGrid columns={4} className="gap-4 mb-4">
            <DropDownList
              label="Attendance Period"
              data={ATTENDANCE_PERIODS}
              textField="text"
              valueField="value"
              value={attendancePeriod}
              onChange={val => setAttendancePeriod(val as string)}
              required
            />

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
          </FormGrid>

          <FormGrid columns={4} className="gap-4 mb-4 items-end">
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
            <div className="flex gap-3 mb-4">
              <Button
                label="Search"
                variant="primary"
                onClick={handleQueryEmployees}
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
          <FormCard title="Attendance Register Grid">
            <GridPanel
              data={attendanceRows}
              emptyMessage="No employee records found matching the criteria."
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
                  header: 'Total Days',
                  field: 'totalDays',
                  width: '90px',
                },
                {
                  header: 'Present Days',
                  width: '110px',
                  cell: (item: EmployeeAttendanceRow) => (
                    <input
                      type="number"
                      min="0"
                      max={item.totalDays}
                      value={item.presentDays}
                      onChange={e =>
                        updateRowField(item.id, 'presentDays', e.target.value)
                      }
                      className="w-20 px-2.5 py-1 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                    />
                  ),
                },
                {
                  header: 'Absent Days',
                  width: '110px',
                  cell: (item: EmployeeAttendanceRow) => (
                    <input
                      type="number"
                      min="0"
                      max={item.totalDays}
                      value={item.absentDays}
                      onChange={e =>
                        updateRowField(item.id, 'absentDays', e.target.value)
                      }
                      className="w-20 px-2.5 py-1 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                    />
                  ),
                },
                {
                  header: 'Leave Days',
                  width: '110px',
                  cell: (item: EmployeeAttendanceRow) => (
                    <input
                      type="number"
                      min="0"
                      max={item.totalDays}
                      value={item.leaveDays}
                      onChange={e =>
                        updateRowField(item.id, 'leaveDays', e.target.value)
                      }
                      className="w-20 px-2.5 py-1 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                    />
                  ),
                },
                {
                  header: 'Action',
                  width: '100px',
                  cell: (item: EmployeeAttendanceRow) => (
                    <Button
                      label="Save"
                      variant="primary"
                      size="small"
                      onClick={() => handleSaveIndividual(item.id)}
                    />
                  ),
                },
              ]}
              toolbar={
                <div className="flex justify-end w-full">
                  <Button
                    label="Save All Attendance"
                    variant="success"
                    onClick={handleSaveAll}
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
