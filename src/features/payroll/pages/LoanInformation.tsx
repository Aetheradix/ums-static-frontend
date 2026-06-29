import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { usePayrollStore, type EmployeeLoan } from '../store/usePayrollStore';

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

const LOAN_HEADS = [
  { text: 'Festival Advance', value: 'Festival Advance' },
  { text: 'House Building Advance', value: 'House Building Advance' },
  { text: 'Car Advance', value: 'Car Advance' },
  { text: 'Computer Advance', value: 'Computer Advance' },
];

const DEDUCTION_OPTIONS = [
  { text: 'Monthly', value: 'Monthly' },
  { text: 'Quarterly', value: 'Quarterly' },
  { text: 'Half-Yearly', value: 'Half-Yearly' },
  { text: 'Yearly', value: 'Yearly' },
];

const YEAR_OPTIONS = [
  { text: '2025', value: '2025' },
  { text: '2026', value: '2026' },
  { text: '2027', value: '2027' },
  { text: '2028', value: '2028' },
  { text: '2029', value: '2029' },
  { text: '2030', value: '2030' },
];

const MONTH_OPTIONS = [
  { text: 'January', value: 'January' },
  { text: 'February', value: 'February' },
  { text: 'March', value: 'March' },
  { text: 'April', value: 'April' },
  { text: 'May', value: 'May' },
  { text: 'June', value: 'June' },
  { text: 'July', value: 'July' },
  { text: 'August', value: 'August' },
  { text: 'September', value: 'September' },
  { text: 'October', value: 'October' },
  { text: 'November', value: 'November' },
  { text: 'December', value: 'December' },
];

export default function LoanInformation() {
  const { employees, loans, addLoan, deleteLoan } = usePayrollStore();

  const [isListView, setIsListView] = useState(false);

  // MAPPING FORM STATE
  const [employeeCodeInput, setEmployeeCodeInput] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [officeType, setOfficeType] = useState('');
  const [officeName, setOfficeName] = useState('');
  const [loanHead, setLoanHead] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [interestDeduction, setInterestDeduction] = useState('Monthly');
  const [interestAmount, setInterestAmount] = useState('0');
  const [deductionYear, setDeductionYear] = useState('');
  const [deductionMonth, setDeductionMonth] = useState('');

  // LIST STATE
  const [searchOfficeType, setSearchOfficeType] = useState(
    'University Head Office'
  );
  const [searchOfficeName, setSearchOfficeName] = useState(
    'Main Campus (Admin Block)'
  );
  const [searchEmployeeId, setSearchEmployeeId] = useState('');
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
      setSelectedEmployeeId('');
      setOfficeType('');
      setOfficeName('');
    }
  };

  const handleCalculateInterest = () => {
    if (!loanAmount || Number(loanAmount) <= 0) {
      ToastService.error('Please enter a valid Loan Amount first.');
      return;
    }
    // Simple mock calculation logic (e.g. 5% of Loan Amount for interest if applicable)
    const computedInterest = Math.round(Number(loanAmount) * 0.05);
    setInterestAmount(String(computedInterest));
    ToastService.success('Interest calculation complete.');
  };

  const handleSaveLoan = () => {
    if (!selectedEmployeeId) {
      ToastService.error('Lookup and select a valid Employee first.');
      return;
    }
    if (!loanHead) {
      ToastService.error('Loan Head is required.');
      return;
    }
    if (!loanAmount || Number(loanAmount) <= 0) {
      ToastService.error('Enter a valid Loan Amount.');
      return;
    }
    if (!installmentAmount || Number(installmentAmount) <= 0) {
      ToastService.error('Enter a valid Installment Amount.');
      return;
    }
    if (Number(installmentAmount) > Number(loanAmount)) {
      ToastService.error('Installment amount cannot exceed total loan amount.');
      return;
    }
    if (!interestDeduction) {
      ToastService.error('Interest Deduction is required.');
      return;
    }
    if (!deductionYear) {
      ToastService.error('Loan Deduction Year is required.');
      return;
    }
    if (!deductionMonth) {
      ToastService.error('Loan Deduction Month is required.');
      return;
    }

    const emp = employees.find(e => e.id === selectedEmployeeId);
    if (!emp) return;

    addLoan({
      employeeId: emp.id,
      employeeCode: emp.code,
      employeeName: emp.name,
      officeType,
      officeName,
      loanHead,
      loanAmount: Number(loanAmount),
      installmentAmount: Number(installmentAmount),
      interestDeduction,
      interestAmount: Number(interestAmount),
      deductionYear,
      deductionMonth,
      status: true,
    });

    ToastService.success('Loan Information saved successfully.');
    handleClearEntryForm();
  };

  const handleClearEntryForm = () => {
    setEmployeeCodeInput('');
    setSelectedEmployeeId('');
    setOfficeType('');
    setOfficeName('');
    setLoanHead('');
    setLoanAmount('');
    setInstallmentAmount('');
    setInterestDeduction('Monthly');
    setInterestAmount('0');
    setDeductionYear('');
    setDeductionMonth('');
  };

  const handleSearchList = () => {
    setHasSearchedList(true);
    ToastService.success('Fetched loan details list.');
  };

  const handleClearSearch = () => {
    setSearchOfficeType('University Head Office');
    setSearchOfficeName('Main Campus (Admin Block)');
    setSearchEmployeeId('');
    setHasSearchedList(false);
  };

  // Filter mapped loans based on search criteria
  const displayedLoans = loans.filter(loan => {
    const officeTypeMatch =
      !searchOfficeType || loan.officeType === searchOfficeType;
    const officeNameMatch =
      !searchOfficeName || loan.officeName === searchOfficeName;
    const empMatch = !searchEmployeeId || loan.employeeId === searchEmployeeId;
    return officeTypeMatch && officeNameMatch && empMatch;
  });

  return (
    <FormPage
      title="Loan Information Mapping"
      description="Map loan configurations to employees, or lookup and manage active loans."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        {
          label: 'Set Head Value',
          to: '/payroll-management/set-head-value/salary-head',
        },
        { label: 'Loan Information' },
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
        // View 1: Entry Mode
        <div className="flex flex-col gap-6">
          <FormCard title="Add Loan Information">
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
                label="Employee Name (Code)"
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
                label="Loan Head"
                data={LOAN_HEADS}
                textField="text"
                valueField="value"
                value={loanHead}
                onChange={val => setLoanHead(val as string)}
                required
              />
            </FormGrid>

            <FormGrid columns={4} className="gap-4 mb-4">
              <TextBox
                label="Loan Amount(₹)"
                placeholder="Enter Loan Amount"
                value={loanAmount}
                onChange={setLoanAmount}
                required
              />

              <TextBox
                label="Installment Amount(₹)"
                placeholder="Enter Installment Amount"
                value={installmentAmount}
                onChange={setInstallmentAmount}
                required
              />

              <DropDownList
                label="Interest Deduction"
                data={DEDUCTION_OPTIONS}
                textField="text"
                valueField="value"
                value={interestDeduction}
                onChange={val => setInterestDeduction(val as string)}
                required
              />

              <TextBox
                label="Interest Amount(₹)"
                placeholder="Enter Interest Amount"
                value={interestAmount}
                onChange={setInterestAmount}
              />
            </FormGrid>

            <FormGrid columns={4} className="items-end gap-4 mb-4">
              <DropDownList
                label="Loan Deduction Year"
                data={YEAR_OPTIONS}
                textField="text"
                valueField="value"
                value={deductionYear}
                onChange={val => setDeductionYear(val as string)}
                required
              />

              <DropDownList
                label="Loan Deduction Month"
                data={MONTH_OPTIONS}
                textField="text"
                valueField="value"
                value={deductionMonth}
                onChange={val => setDeductionMonth(val as string)}
                required
              />

              <div className="flex items-end pb-[2px]">
                <Button
                  label="Calculate"
                  variant="outlined"
                  onClick={handleCalculateInterest}
                />
              </div>
            </FormGrid>

            <div className="flex gap-3 justify-start mt-4 pt-3 border-t">
              <Button label="Save" variant="primary" onClick={handleSaveLoan} />
              <Button
                label="Clear"
                variant="outlined"
                onClick={handleClearEntryForm}
              />
            </div>
          </FormCard>
        </div>
      ) : (
        // View 2: List/Search Mode
        <div className="flex flex-col gap-6">
          <FormCard title="Loan Details">
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
                label="Employee Name (Code) *"
                data={employees.map(e => ({
                  text: `${e.name} (${e.code})`,
                  value: e.id,
                }))}
                textField="text"
                valueField="value"
                value={searchEmployeeId}
                onChange={val => setSearchEmployeeId(val as string)}
                required
                defaultOptionText="Select"
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
                data={displayedLoans}
                searchBox
                searchPlaceholder="Search employee, head..."
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
                    header: 'Loan Head',
                    field: 'loanHead',
                  },
                  {
                    header: 'Loan Amount',
                    cell: (item: EmployeeLoan) => (
                      <span>₹{item.loanAmount.toLocaleString()}</span>
                    ),
                  },
                  {
                    header: 'Installment Amount',
                    cell: (item: EmployeeLoan) => (
                      <span>₹{item.installmentAmount.toLocaleString()}</span>
                    ),
                  },
                  {
                    header: 'Interest Deduction',
                    field: 'interestDeduction',
                  },
                  {
                    header: 'Interest Amount',
                    cell: (item: EmployeeLoan) => (
                      <span>₹{item.interestAmount.toLocaleString()}</span>
                    ),
                  },
                  {
                    header: 'Deduction Start',
                    cell: (item: EmployeeLoan) => (
                      <span>
                        {item.deductionMonth} {item.deductionYear}
                      </span>
                    ),
                  },
                  {
                    header: 'Status',
                    cell: (item: EmployeeLoan) => (
                      <StatusBadge
                        label={item.status ? 'Active' : 'Inactive'}
                        variant={item.status ? 'approved' : 'rejected'}
                      />
                    ),
                  },
                  {
                    header: 'Action',
                    width: '80px',
                    cell: (item: EmployeeLoan) => (
                      <button
                        onClick={() => {
                          deleteLoan(item.id);
                          ToastService.success('Loan mapping removed.');
                        }}
                        className="p-1 px-2 border rounded hover:bg-red-50 text-red-500 border-red-100 cursor-pointer transition-all"
                        title="Remove Loan"
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
