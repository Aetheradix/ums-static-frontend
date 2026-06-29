import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { usePayrollStore, type Employee } from '../store/usePayrollStore';

// Date Helpers
const formatDate = (date?: Date | null): string => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const OFFICE_TYPES = [
  { text: 'University Head Office', value: 'University Head Office' },
  { text: 'Constituent College', value: 'Constituent College' },
  { text: 'Regional Centre', value: 'Regional Centre' },
];

const OFFICE_NAMES = [
  { text: 'Main Campus (Admin Block)', value: 'Main Campus (Admin Block)' },
  {
    text: 'School of Engineering & Technology',
    value: 'School of Engineering & Technology',
  },
  { text: 'School of Sciences', value: 'School of Sciences' },
  {
    text: 'University Library & Information Centre',
    value: 'University Library & Information Centre',
  },
];

const POST_TYPES = [
  { text: 'Regular/Permanent', value: 'Regular/Permanent' },
  { text: 'Contractual', value: 'Contractual' },
  { text: 'Guest Faculty', value: 'Guest Faculty' },
];

const DESIGNATION_TYPES = [
  { text: 'All', value: 'All' },
  { text: 'Teaching', value: 'Teaching' },
  { text: 'Non-Teaching', value: 'Non-Teaching' },
];

const DESIGNATIONS = [
  { text: 'All', value: 'All' },
  { text: 'Professor', value: 'Professor' },
  { text: 'Associate Professor', value: 'Associate Professor' },
  { text: 'Assistant Professor', value: 'Assistant Professor' },
  { text: 'Registrar', value: 'Registrar' },
  { text: 'Lab Technician', value: 'Lab Technician' },
];

export default function SalaryOptionalHead() {
  const {
    heads,
    employees,
    optionalMaps,
    mapEmployeesToHead,
    unmapHeadFromEmployee,
  } = usePayrollStore();

  const [isListView, setIsListView] = useState(false);

  // MAPPING FORM STATE
  const [officeType, setOfficeType] = useState('University Head Office');
  const [officeName, setOfficeName] = useState('Main Campus (Admin Block)');
  const [postType, setPostType] = useState('Regular/Permanent');
  const [desigType, setDesigType] = useState('All');
  const [designation, setDesignation] = useState('All');
  const [earningDeductionType, setEarningDeductionType] = useState<
    'Earning' | 'Deduction'
  >('Earning');
  const [headId, setHeadId] = useState('');
  const [calculationMethod, setCalculationMethod] = useState('');
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(new Date());

  // Employees queried for mapping
  const [queriedEmployees, setQueriedEmployees] = useState<Employee[]>([]);
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);
  const [hasQueried, setHasQueried] = useState(false);

  // SEARCH BY EMPLOYEE STATE
  const [searchEmployeeCode, setSearchEmployeeCode] = useState('');
  const [searchedMapsCode, setSearchedMapsCode] = useState('');
  const [hasSearchedEmployee, setHasSearchedEmployee] = useState(false);

  // Dynamic filter for heads list inside mapping form
  const activeAvailableHeads = heads.filter(
    h => h.type === earningDeductionType && h.status
  );

  // Prefill calculation method on head selection change
  useEffect(() => {
    if (headId) {
      const match = heads.find(h => h.id === headId);
      if (match) {
        setCalculationMethod(match.calculationMethod);
      }
    } else {
      setCalculationMethod('');
    }
  }, [headId, heads]);

  // Sync default head when type changes
  useEffect(() => {
    const firstAvailable = activeAvailableHeads[0];
    if (firstAvailable) {
      setHeadId(firstAvailable.id);
    } else {
      setHeadId('');
    }
  }, [earningDeductionType]);

  const handleClearMappingFilters = () => {
    setOfficeType('University Head Office');
    setOfficeName('Main Campus (Admin Block)');
    setPostType('Regular/Permanent');
    setDesigType('All');
    setDesignation('All');
    setEarningDeductionType('Earning');
    setEffectiveDate(new Date());
    setQueriedEmployees([]);
    setSelectedEmpIds([]);
    setHasQueried(false);
  };

  const handleQueryEmployees = () => {
    // Filter employees from state matching selection
    const matches = employees.filter(emp => {
      const officeTypeMatch = !officeType || emp.officeType === officeType;
      const officeNameMatch = !officeName || emp.officeName === officeName;
      const postMatch = !postType || emp.postType === postType;
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

    setQueriedEmployees(matches);
    setSelectedEmpIds([]);
    setHasQueried(true);
    ToastService.success(`Found ${matches.length} matching employee(s).`);
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmpIds(queriedEmployees.map(emp => emp.id));
    } else {
      setSelectedEmpIds([]);
    }
  };

  const handleToggleSelectEmp = (empId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmpIds(prev => [...prev, empId]);
    } else {
      setSelectedEmpIds(prev => prev.filter(id => id !== empId));
    }
  };

  const handleMapHead = () => {
    if (selectedEmpIds.length === 0) {
      ToastService.error('Select at least one employee to map.');
      return;
    }
    if (!headId) {
      ToastService.error('Earning & Deduction Head is required.');
      return;
    }
    if (!effectiveDate) {
      ToastService.error('Effective Date is required.');
      return;
    }

    mapEmployeesToHead(selectedEmpIds, headId, formatDate(effectiveDate));
    ToastService.success(
      `Head successfully mapped to ${selectedEmpIds.length} employee(s).`
    );

    // Reset mapping grid
    setSelectedEmpIds([]);
    setQueriedEmployees([]);
    setHasQueried(false);
  };

  // Search maps by employee code
  const handleSearchEmployee = () => {
    if (!searchEmployeeCode.trim()) {
      ToastService.error('Employee Code is required.');
      return;
    }
    setSearchedMapsCode(searchEmployeeCode.trim());
    setHasSearchedEmployee(true);
    ToastService.success('Fetched mapped optional heads for employee.');
  };

  const handleClearSearchEmployee = () => {
    setSearchEmployeeCode('');
    setSearchedMapsCode('');
    setHasSearchedEmployee(false);
  };

  // Filter mapped heads by active search criteria
  const displayedEmployeeMaps = optionalMaps.filter(
    m => m.employeeCode.toLowerCase() === searchedMapsCode.toLowerCase()
  );

  return (
    <FormPage
      title="Salary Optional Head Mapping"
      description="Map optional earnings and deductions to employees, or lookup and manage mapped heads for specific employee codes."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        {
          label: 'Set Head Value',
          to: '/payroll-management/set-head-value/salary-head',
        },
        { label: 'Salary Optional Head' },
      ]}
      headerAction={
        <Button
          label={isListView ? 'Back To Entry Page' : 'View List'}
          icon={isListView ? 'undo' : 'eye'}
          variant="outlined"
          onClick={() => {
            setIsListView(!isListView);
            handleClearMappingFilters();
            handleClearSearchEmployee();
          }}
        />
      }
    >
      {!isListView ? (
        // View 1: Map Optional Head view
        <div className="flex flex-col gap-6">
          <FormCard title="Fill Salary Optional Head Details">
            <FormGrid columns={3} className="gap-4 mb-4">
              <DropDownList
                label="Office Type (Code)"
                data={OFFICE_TYPES}
                textField="text"
                valueField="value"
                value={officeType}
                onChange={val => setOfficeType(val as string)}
                required
              />

              <DropDownList
                label="Office Name (Code)"
                data={OFFICE_NAMES}
                textField="text"
                valueField="value"
                value={officeName}
                onChange={val => setOfficeName(val as string)}
                required
              />

              <DropDownList
                label="Type Of Post"
                data={POST_TYPES}
                textField="text"
                valueField="value"
                value={postType}
                onChange={val => setPostType(val as string)}
                required
              />
            </FormGrid>

            <FormGrid columns={2} className="gap-4 mb-4">
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
                label="Designation "
                data={DESIGNATIONS}
                textField="text"
                valueField="value"
                value={designation}
                onChange={val => setDesignation(val as string)}
                required
              />
            </FormGrid>

            <FormGrid columns={3} className="gap-4 mb-4">
              <DropDownList
                label="Earning & Deduction Type "
                data={[
                  { text: 'Earning', value: 'Earning' },
                  { text: 'Deduction', value: 'Deduction' },
                ]}
                textField="text"
                valueField="value"
                value={earningDeductionType}
                onChange={val => setEarningDeductionType(val as any)}
                required
              />

              <DropDownList
                label="Earning & Deduction Head "
                data={activeAvailableHeads.map(h => ({
                  text: h.name,
                  value: h.id,
                }))}
                textField="text"
                valueField="value"
                value={headId}
                onChange={val => setHeadId(val as string)}
                required
                defaultOptionText="-- Select Head --"
              />

              <TextBox
                label="Calculation Method"
                value={calculationMethod}
                placeholder="Prefilled calculation method"
                disabled
              />
            </FormGrid>

            <FormGrid columns={1} className="max-w-xs mb-4">
              <DatePicker
                label="Effective Date "
                value={effectiveDate || undefined}
                onChange={val => setEffectiveDate(val || null)}
                required
              />
            </FormGrid>

            <div className="flex gap-3 justify-start mt-4 pt-3 border-t">
              <Button
                label="Search"
                variant="primary"
                onClick={handleQueryEmployees}
              />
              <Button
                label="Clear"
                variant="outlined"
                onClick={handleClearMappingFilters}
              />
            </div>
          </FormCard>

          {/* Queried employees for mapping */}
          {hasQueried && (
            <FormCard title="Employees Selection Grid">
              <GridPanel
                data={queriedEmployees}
                emptyMessage="No employees found matching the filters. Check office or post settings."
                columns={[
                  {
                    header: '',
                    width: '50px',
                    cell: (item: Employee) => (
                      <PrimeCheckbox
                        checked={selectedEmpIds.includes(item.id)}
                        onChange={e =>
                          handleToggleSelectEmp(item.id, e.checked ?? false)
                        }
                      />
                    ),
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
                    header: 'Office Name',
                    field: 'officeName',
                  },
                  {
                    header: 'Designation',
                    field: 'designation',
                  },
                ]}
                toolbar={
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700 font-semibold cursor-pointer">
                      <PrimeCheckbox
                        checked={
                          queriedEmployees.length > 0 &&
                          selectedEmpIds.length === queriedEmployees.length
                        }
                        onChange={e =>
                          handleToggleSelectAll(e.checked ?? false)
                        }
                      />
                      <span>Select All</span>
                    </label>

                    <Button
                      label={`Map Selected (${selectedEmpIds.length})`}
                      variant="primary"
                      onClick={handleMapHead}
                      disabled={selectedEmpIds.length === 0}
                    />
                  </div>
                }
              />
            </FormCard>
          )}
        </div>
      ) : (
        // View 2: Search Mapped Optional Head by Employee Code
        <div className="flex flex-col gap-6">
          <FormCard title="Salary Optional Head Details">
            <FormGrid columns={1} className="max-w-md mb-4">
              <TextBox
                label="Employee Code *"
                placeholder="Enter Employee Code (e.g. EMP001)"
                value={searchEmployeeCode}
                onChange={setSearchEmployeeCode}
                required
              />
            </FormGrid>

            <div className="flex gap-3 justify-start mt-4 pt-3 border-t">
              <Button
                label="Search"
                variant="primary"
                onClick={handleSearchEmployee}
              />
              <Button
                label="Clear"
                variant="outlined"
                onClick={handleClearSearchEmployee}
              />
            </div>
          </FormCard>

          {hasSearchedEmployee && (
            <FormCard title="Common Head Values List">
              <GridPanel
                data={displayedEmployeeMaps}
                searchBox
                searchPlaceholder="Search head name..."
                columns={[
                  {
                    header: 'Sr.No.',
                    width: '70px',
                    cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                  },
                  {
                    header: 'Earning & Deduction Head',
                    field: 'headName',
                  },
                  {
                    header: 'Calculation Method',
                    field: 'calculationMethod',
                  },
                  {
                    header: 'Effective Date',
                    field: 'effectiveDate',
                  },
                  {
                    header: 'Status',
                    cell: item => (
                      <StatusBadge
                        label={item.status ? 'Active' : 'Inactive'}
                        variant={item.status ? 'approved' : 'rejected'}
                      />
                    ),
                  },
                  {
                    header: 'Action',
                    width: '80px',
                    cell: item => (
                      <button
                        onClick={() => {
                          unmapHeadFromEmployee(item.id);
                          ToastService.success(
                            'Optional head mapping removed.'
                          );
                        }}
                        className="p-1 px-2 border rounded hover:bg-red-50 text-red-500 border-red-100 cursor-pointer transition-all"
                        title="Remove Mapping"
                      >
                        <i className="pi pi-trash text-xs" />
                      </button>
                    ),
                  },
                ]}
              />
            </FormCard>
          )}
        </div>
      )}
    </FormPage>
  );
}
