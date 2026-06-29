import { useState } from 'react';
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
import {
  usePayrollStore,
  type InsurancePolicy as PolicyType,
} from '../store/usePayrollStore';

// Helper to format Date as dd/mm/yyyy
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

const POLICY_TYPES = [
  { text: 'LIC', value: 'LIC' },
  { text: 'GSLI', value: 'GSLI' },
  { text: 'Medical Insurance', value: 'Medical Insurance' },
  { text: 'Group Insurance', value: 'Group Insurance' },
];

const FREQUENCY_OPTIONS = [
  { text: 'Monthly', value: 'Monthly' },
  { text: 'Quarterly', value: 'Quarterly' },
  { text: 'Half-Yearly', value: 'Half-Yearly' },
  { text: 'Yearly', value: 'Yearly' },
];

export default function InsurancePolicy() {
  const {
    employees,
    insurancePolicies,
    addInsurancePolicy,
    deleteInsurancePolicy,
  } = usePayrollStore();

  const [isListView, setIsListView] = useState(false);

  // ENTRY MODE STATE
  const [employeeCodeInput, setEmployeeCodeInput] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [officeType, setOfficeType] = useState('');
  const [officeName, setOfficeName] = useState('');

  const [policyType, setPolicyType] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [policyName, setPolicyName] = useState('');
  const [policyAmount, setPolicyAmount] = useState('');
  const [premiumFrequency, setPremiumFrequency] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // LIST MODE STATE
  const [searchOfficeType, setSearchOfficeType] = useState(
    'University Head Office'
  );
  const [searchOfficeName, setSearchOfficeName] = useState(
    'Main Campus (Admin Block)'
  );
  const [searchPolicyType, setSearchPolicyType] = useState('LIC');
  const [hasSearchedList, setHasSearchedList] = useState(false);

  const handleLookupEmployee = () => {
    if (!employeeCodeInput.trim()) {
      ToastService.error('Please enter an Employee Code to search.');
      return;
    }

    const matchedEmp = employees.find(
      emp => emp.code.toLowerCase() === employeeCodeInput.trim().toLowerCase()
    );

    if (matchedEmp) {
      setSelectedEmployeeId(matchedEmp.id);
      setOfficeType(matchedEmp.officeType);
      setOfficeName(matchedEmp.officeName);
      ToastService.success(`Employee ${matchedEmp.name} found!`);
    } else {
      ToastService.error('No employee found with this code.');
      // Reset dependent fields
      setSelectedEmployeeId('');
      setOfficeType('');
      setOfficeName('');
    }
  };

  const handleSavePolicy = () => {
    if (!selectedEmployeeId) {
      ToastService.error('Lookup and select a valid Employee first.');
      return;
    }
    if (!policyType) {
      ToastService.error('Policy Type is required.');
      return;
    }
    if (!policyNumber.trim()) {
      ToastService.error('Policy Number is required.');
      return;
    }
    if (!policyName.trim()) {
      ToastService.error('Policy Name is required.');
      return;
    }
    if (!policyAmount || Number(policyAmount) <= 0) {
      ToastService.error('Enter a valid Policy Amount.');
      return;
    }
    if (!premiumFrequency) {
      ToastService.error('Premium Frequency is required.');
      return;
    }
    if (!startDate) {
      ToastService.error('Policy Start Date is required.');
      return;
    }

    const emp = employees.find(e => e.id === selectedEmployeeId);
    if (!emp) return;

    addInsurancePolicy({
      employeeId: emp.id,
      employeeCode: emp.code,
      employeeName: emp.name,
      officeType: officeType,
      officeName: officeName,
      policyType,
      policyNumber: policyNumber.trim(),
      policyName: policyName.trim(),
      policyAmount: Number(policyAmount),
      premiumFrequency,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      status: true,
    });

    ToastService.success('Insurance policy saved successfully.');
    handleClearEntryForm();
  };

  const handleClearEntryForm = () => {
    setEmployeeCodeInput('');
    setSelectedEmployeeId('');
    setOfficeType('');
    setOfficeName('');
    setPolicyType('');
    setPolicyNumber('');
    setPolicyName('');
    setPolicyAmount('');
    setPremiumFrequency('');
    setStartDate(null);
    setEndDate(null);
  };

  const handleSearchList = () => {
    setHasSearchedList(true);
    ToastService.success('Fetched insurance policies list.');
  };

  const handleClearSearch = () => {
    setSearchOfficeType('University Head Office');
    setSearchOfficeName('Main Campus (Admin Block)');
    setSearchPolicyType('LIC');
    setHasSearchedList(false);
  };

  // Filter mapped policies based on search parameters
  const displayedPolicies = insurancePolicies.filter(policy => {
    const typeMatch =
      !searchOfficeType || policy.officeType === searchOfficeType;
    const nameMatch =
      !searchOfficeName || policy.officeName === searchOfficeName;
    const policyTypeMatch =
      !searchPolicyType || policy.policyType === searchPolicyType;
    return typeMatch && nameMatch && policyTypeMatch;
  });

  return (
    <FormPage
      title="Insurance Policy Mapping"
      description="Map insurance policies to employees or view and manage mapped insurance policy settings."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        {
          label: 'Set Head Value',
          to: '/payroll-management/set-head-value/salary-head',
        },
        { label: 'Insurance Policy' },
      ]}
      headerAction={
        <Button
          label={isListView ? 'Back To Entry Page' : 'View List'}
          icon={isListView ? 'undo' : 'eye'}
          variant="outlined"
          onClick={() => {
            setIsListView(!isListView);
            handleClearEntryForm();
            handleClearSearch();
          }}
        />
      }
    >
      {!isListView ? (
        // View 1: Entry/Map Insurance Policy View
        <div className="flex flex-col gap-6">
          <FormCard title="Add Insurance Policy">
            <FormGrid
              columns={4}
              className="items-end gap-4 mb-6 border-b pb-6"
            >
              <TextBox
                label="Employee Code"
                placeholder="Enter Employee Code (e.g. EMP001)"
                value={employeeCodeInput}
                onChange={setEmployeeCodeInput}
                required
              />
              <div className="flex items-end mb-4">
                <Button
                  label="Search"
                  variant="primary"
                  onClick={handleLookupEmployee}
                />
              </div>
            </FormGrid>

            <FormGrid columns={4} className="gap-4 mb-4">
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
                label="Employee Name/Code"
                data={employees.map(e => ({
                  text: `${e.name} (${e.code})`,
                  value: e.id,
                }))}
                textField="text"
                valueField="value"
                value={selectedEmployeeId}
                onChange={val => {
                  const empId = val as string;
                  setSelectedEmployeeId(empId);
                  if (empId) {
                    const matchedEmp = employees.find(e => e.id === empId);
                    if (matchedEmp) {
                      setEmployeeCodeInput(matchedEmp.code);
                      setOfficeType(matchedEmp.officeType);
                      setOfficeName(matchedEmp.officeName);
                    }
                  } else {
                    setEmployeeCodeInput('');
                    setOfficeType('');
                    setOfficeName('');
                  }
                }}
                required
                defaultOptionText="Select"
              />

              <DropDownList
                label="Policy Type"
                data={POLICY_TYPES}
                textField="text"
                valueField="value"
                value={policyType}
                onChange={val => setPolicyType(val as string)}
                required
              />
            </FormGrid>

            <FormGrid columns={4} className="gap-4 mb-4">
              <TextBox
                label="Policy Number"
                placeholder="Enter Policy Number"
                value={policyNumber}
                onChange={setPolicyNumber}
                required
              />

              <TextBox
                label="Policy Name"
                placeholder="Enter Policy Name"
                value={policyName}
                onChange={setPolicyName}
                required
              />

              <TextBox
                label="Policy Amount (₹)"
                placeholder="Enter Policy Amount"
                value={policyAmount}
                onChange={setPolicyAmount}
                required
              />

              <DropDownList
                label="Premium Frequency"
                data={FREQUENCY_OPTIONS}
                textField="text"
                valueField="value"
                value={premiumFrequency}
                onChange={val => setPremiumFrequency(val as string)}
                required
              />
            </FormGrid>

            <FormGrid columns={2} className="gap-4 mb-4 max-w-2xl">
              <DatePicker
                label="Policy Start Date  "
                value={startDate || undefined}
                onChange={val => setStartDate(val || null)}
                required
              />

              <DatePicker
                label="Policy End Date"
                value={endDate || undefined}
                onChange={val => setEndDate(val || null)}
              />
            </FormGrid>

            <div className="flex gap-3 justify-start mt-4 pt-3 border-t">
              <Button
                label="Save"
                variant="primary"
                onClick={handleSavePolicy}
              />
              <Button
                label="Clear"
                variant="outlined"
                onClick={handleClearEntryForm}
              />
            </div>
          </FormCard>
        </div>
      ) : (
        // View 2: Search/List Insurance Policy View
        <div className="flex flex-col gap-6">
          <FormCard title="Insurance Policy Details">
            <FormGrid columns={3} className="gap-4 mb-4">
              <DropDownList
                label="Office Type (Code) *"
                data={OFFICE_TYPES}
                textField="text"
                valueField="value"
                value={searchOfficeType}
                onChange={val => setSearchOfficeType(val as string)}
                required
              />

              <DropDownList
                label="Office Name (Code) *"
                data={OFFICE_NAMES}
                textField="text"
                valueField="value"
                value={searchOfficeName}
                onChange={val => setSearchOfficeName(val as string)}
                required
              />

              <DropDownList
                label="Policy Type *"
                data={POLICY_TYPES}
                textField="text"
                valueField="value"
                value={searchPolicyType}
                onChange={val => setSearchPolicyType(val as string)}
                required
              />
            </FormGrid>

            <div className="flex gap-3 justify-start mt-4 pt-3 border-t">
              <Button
                label="Search"
                variant="primary"
                onClick={handleSearchList}
              />
              <Button
                label="Clear"
                variant="outlined"
                onClick={handleClearSearch}
              />
            </div>
          </FormCard>

          {hasSearchedList && (
            <FormCard title="Common Head Values List">
              <GridPanel
                data={displayedPolicies}
                searchBox
                searchPlaceholder="Search policy number, name or employee..."
                columns={[
                  {
                    header: 'Sr.No.',
                    width: '70px',
                    cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                  },
                  {
                    header: 'Employee Code',
                    field: 'employeeCode',
                  },
                  {
                    header: 'Employee Name',
                    field: 'employeeName',
                  },
                  {
                    header: 'Policy Type',
                    field: 'policyType',
                  },
                  {
                    header: 'Policy Number',
                    field: 'policyNumber',
                  },
                  {
                    header: 'Policy Name',
                    field: 'policyName',
                  },
                  {
                    header: 'Policy Amount (₹)',
                    cell: (item: PolicyType) => (
                      <span>₹{item.policyAmount.toLocaleString()}</span>
                    ),
                  },
                  {
                    header: 'Premium Frequency',
                    field: 'premiumFrequency',
                  },
                  {
                    header: 'Start Date',
                    field: 'startDate',
                  },
                  {
                    header: 'End Date',
                    cell: (item: PolicyType) => (
                      <span>{item.endDate || '-'}</span>
                    ),
                  },
                  {
                    header: 'Status',
                    cell: (item: PolicyType) => (
                      <StatusBadge
                        label={item.status ? 'Active' : 'Inactive'}
                        variant={item.status ? 'approved' : 'rejected'}
                      />
                    ),
                  },
                  {
                    header: 'Action',
                    width: '80px',
                    cell: (item: PolicyType) => (
                      <button
                        onClick={() => {
                          deleteInsurancePolicy(item.id);
                          ToastService.success('Insurance policy removed.');
                        }}
                        className="p-1 px-2 border rounded hover:bg-red-50 text-red-500 border-red-100 cursor-pointer transition-all"
                        title="Remove Policy"
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
