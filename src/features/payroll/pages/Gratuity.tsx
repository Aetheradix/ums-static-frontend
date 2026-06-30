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

interface GratuityCalculationRow extends Employee {
  dateOfJoining: string;
  dateOfRetirement: string;
  yearsOfService: number;
  lastDrawnBasic: number;
  daAmount: number;
  calculatedGratuity: number;
  status: 'Pending' | 'Authorized';
}

export default function Gratuity() {
  const { employees } = usePayrollStore();

  const [isListView, setIsListView] = useState(false);

  // SEARCH FILTERS STATE
  const [officeType, setOfficeType] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState<string | null>(null);
  const [postType, setPostType] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [gratuityRows, setGratuityRows] = useState<GratuityCalculationRow[]>(
    []
  );
  const [hasSearched, setHasSearched] = useState(false);

  // Dynamic office names mapping
  const availableOfficeNames = officeType
    ? OFFICE_NAMES_MAPPING[officeType] || []
    : [];

  // Mock employee joining dates & basic salaries to calculate realistic gratuity
  const getEmployeePayrollDetails = (
    desig: string
  ): { basic: number; joinDate: string; years: number } => {
    let basic = 35000;
    let joinDate = '01/07/2015';
    let years = 11;

    switch (desig) {
      case 'Professor':
        basic = 144200;
        joinDate = '15/09/2004';
        years = 22;
        break;
      case 'Registrar':
        basic = 131400;
        joinDate = '10/05/2006';
        years = 20;
        break;
      case 'Associate Professor':
        basic = 115000;
        joinDate = '01/08/2009';
        years = 17;
        break;
      case 'Assistant Professor':
        basic = 57700;
        joinDate = '20/07/2018';
        years = 8;
        break;
      case 'Lab Technician':
        basic = 35400;
        joinDate = '12/03/2016';
        years = 10;
        break;
    }
    return { basic, joinDate, years };
  };

  const handleQueryGratuity = () => {
    if (!officeType || !officeName || !postType || !fromDate || !toDate) {
      ToastService.error('Please select all mandatory fields.');
      return;
    }

    // Filter matching employees
    const matches = employees.filter(emp => {
      const officeTypeMatch = emp.officeType === officeType;
      const officeNameMatch = emp.officeName === officeName;
      const postMatch = emp.postType === postType;
      return officeTypeMatch && officeNameMatch && postMatch;
    });

    const rows: GratuityCalculationRow[] = matches.map(emp => {
      const { basic, joinDate, years } = getEmployeePayrollDetails(
        emp.designation
      );
      const da = Math.round(basic * 0.5); // Dearness Allowance 50%

      // Gratuity formula = (Basic + DA) * 15/26 * years of service
      const calculatedGratuity = Math.round((basic + da) * (15 / 26) * years);

      return {
        ...emp,
        dateOfJoining: joinDate,
        dateOfRetirement: '30/06/2026',
        yearsOfService: years,
        lastDrawnBasic: basic,
        daAmount: da,
        calculatedGratuity,
        status: 'Pending',
      };
    });

    setGratuityRows(rows);
    setHasSearched(true);
    ToastService.success(
      `Calculated gratuity prospects for ${matches.length} staff members.`
    );
  };

  const handleClearFilters = () => {
    setOfficeType(null);
    setOfficeName(null);
    setPostType(null);
    setFromDate(null);
    setToDate(null);
    setGratuityRows([]);
    setHasSearched(false);
  };

  const handleAuthorizeGratuity = (empId: string) => {
    setGratuityRows(prev =>
      prev.map(row => {
        if (row.id === empId) {
          return { ...row, status: 'Authorized' };
        }
        return row;
      })
    );
    ToastService.success('Gratuity calculation authorized successfully.');
  };

  return (
    <FormPage
      title="Gratuity Calculations"
      description="Record qualifying service parameters, process retirement parameters, and authorize staff gratuity disbursements."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        { label: 'Gratuity' },
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
          // VIEW 1: Calculate Gratuity Form & Results
          <>
            <FormCard title="Gratuity">
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
                    onClick={handleQueryGratuity}
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
              <FormCard title="Gratuity Calculations Summary">
                <GridPanel
                  data={gratuityRows}
                  emptyMessage="No employees found matching filter criteria."
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
                      header: 'Qualifying Years',
                      field: 'yearsOfService',
                      width: '100px',
                    },
                    {
                      header: 'Last Drawn Basic',
                      cell: (item: GratuityCalculationRow) => (
                        <span>₹{item.lastDrawnBasic.toLocaleString()}</span>
                      ),
                    },
                    {
                      header: 'DA Amount (50%)',
                      cell: (item: GratuityCalculationRow) => (
                        <span>₹{item.daAmount.toLocaleString()}</span>
                      ),
                    },
                    {
                      header: 'Accrued Gratuity',
                      cell: (item: GratuityCalculationRow) => (
                        <span className="font-bold text-green-700">
                          ₹{item.calculatedGratuity.toLocaleString()}
                        </span>
                      ),
                    },
                    {
                      header: 'Status',
                      cell: (item: GratuityCalculationRow) => (
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
                      cell: (item: GratuityCalculationRow) => (
                        <Button
                          label="Authorize"
                          variant="primary"
                          size="small"
                          disabled={item.status === 'Authorized'}
                          onClick={() => handleAuthorizeGratuity(item.id)}
                        />
                      ),
                    },
                  ]}
                />

                {gratuityRows.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-semibold uppercase">
                        Pending Claims
                      </span>
                      <span className="text-lg font-bold text-slate-800">
                        {
                          gratuityRows.filter(r => r.status === 'Pending')
                            .length
                        }{' '}
                        records
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-semibold uppercase">
                        Total Authorized Amount
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ₹
                        {gratuityRows
                          .filter(r => r.status === 'Authorized')
                          .reduce((acc, r) => acc + r.calculatedGratuity, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </FormCard>
            )}
          </>
        ) : (
          // VIEW 2: List Authorized Claims Archive
          <FormCard title="Authorized Gratuity Register">
            <GridPanel
              data={gratuityRows.filter(r => r.status === 'Authorized')}
              emptyMessage="No authorized claims found in the current session. Please search and authorize calculations first."
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
                  header: 'Service (Years)',
                  field: 'yearsOfService',
                },
                {
                  header: 'Gratuity Paid',
                  cell: (item: GratuityCalculationRow) => (
                    <span className="font-semibold text-blue-800">
                      ₹{item.calculatedGratuity.toLocaleString()}
                    </span>
                  ),
                },
                {
                  header: 'Disbursement Log',
                  cell: () => (
                    <span className="text-xs font-semibold text-green-700">
                      Disbursed to Bank
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
