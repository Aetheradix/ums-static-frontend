import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, DatePicker, TextBox } from 'shared/components/forms';
import { ToastService } from 'services';
import { usePayrollStore, type Employee } from '../store/usePayrollStore';

// ─── Constants ───────────────────────────────────────────────────────────────
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
const FINANCIAL_YEARS = [
  { text: '2026-2027', value: '2026-2027' },
  { text: '2025-2026', value: '2025-2026' },
  { text: '2024-2025', value: '2024-2025' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface SalarySlipRow extends Employee {
  month: string;
  basicPay: number;
  da: number;
  hra: number;
  conveyance: number;
  grossPay: number;
  nps: number;
  incomeTax: number;
  totalDeductions: number;
  netPay: number;
}

interface BankStatementRow extends Employee {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  month: string;
  netPay: number;
  transferStatus: 'Pending' | 'Transferred';
}

interface PFStatementRow extends Employee {
  financialYear: string;
  basicPay: number;
  da: number;
  employeeContrib: number;
  employerContrib: number;
  totalContrib: number;
  openingBalance: number;
  closingBalance: number;
}

interface TDSStatementRow extends Employee {
  financialYear: string;
  grossIncome: number;
  exemptions: number;
  taxableIncome: number;
  tdsDeducted: number;
  form16Status: 'Ready' | 'Pending';
}

// ─── Salary helpers ───────────────────────────────────────────────────────────
const getSalaryMetrics = (desig: string) => {
  let basicPay = 30000;
  switch (desig) {
    case 'Professor':
      basicPay = 144200;
      break;
    case 'Registrar':
      basicPay = 131400;
      break;
    case 'Associate Professor':
      basicPay = 115000;
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
  const conveyance = 5000;
  const grossPay = basicPay + da + hra + conveyance;
  const nps = Math.round((basicPay + da) * 0.1);
  const incomeTax = Math.round(basicPay * 0.05);
  const totalDeductions = nps + incomeTax;
  const netPay = grossPay - totalDeductions;
  return {
    basicPay,
    da,
    hra,
    conveyance,
    grossPay,
    nps,
    incomeTax,
    totalDeductions,
    netPay,
  };
};

const MOCK_BANK_DETAILS: Record<
  string,
  { accountNumber: string; bankName: string; ifscCode: string }
> = {
  EMP001: {
    accountNumber: 'SBI0099887766',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0012345',
  },
  EMP002: {
    accountNumber: 'PNB0011223344',
    bankName: 'Punjab National Bank',
    ifscCode: 'PUNB0056789',
  },
  EMP003: {
    accountNumber: 'BOB0055443322',
    bankName: 'Bank of Baroda',
    ifscCode: 'BARB0078901',
  },
  EMP004: {
    accountNumber: 'UCO0087654321',
    bankName: 'UCO Bank',
    ifscCode: 'UCBA0034567',
  },
};

// ─── Salary Slip Tab ──────────────────────────────────────────────────────────
function SalarySlipTab({ employees }: { employees: Employee[] }) {
  const [officeType, setOfficeType] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState<string | null>(null);
  const [postType, setPostType] = useState<string | null>(null);
  const [month, setMonth] = useState<Date | null>(null);
  const [empCode, setEmpCode] = useState('');
  const [rows, setRows] = useState<SalarySlipRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const officeNames = officeType ? OFFICE_NAMES_MAPPING[officeType] || [] : [];

  const handleSearch = () => {
    if (!officeType || !officeName || !postType || !month) {
      ToastService.error('Please fill all required fields.');
      return;
    }
    const monthLabel = `${String(month.getMonth() + 1).padStart(2, '0')}/${month.getFullYear()}`;
    const matched = employees.filter(emp => {
      const offMatch = emp.officeType === officeType;
      const nameMatch = emp.officeName === officeName;
      const postMatch = emp.postType === postType;
      const codeMatch =
        !empCode ||
        emp.code.toLowerCase().includes(empCode.trim().toLowerCase());
      return offMatch && nameMatch && postMatch && codeMatch;
    });
    const result: SalarySlipRow[] = matched.map(emp => ({
      ...emp,
      month: monthLabel,
      ...getSalaryMetrics(emp.designation),
    }));
    setRows(result);
    setHasSearched(true);
    ToastService.success(`Found ${result.length} salary slip record(s).`);
  };

  const handleClear = () => {
    setOfficeType(null);
    setOfficeName(null);
    setPostType(null);
    setMonth(null);
    setEmpCode('');
    setRows([]);
    setHasSearched(false);
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      <FormCard title="Salary Slip Search Criteria">
        <FormGrid columns={4} className="gap-4 items-end mb-4">
          <DropDownList
            label="Office Type"
            data={OFFICE_TYPES}
            textField="text"
            valueField="value"
            value={officeType}
            onChange={v => {
              setOfficeType(v as string);
              setOfficeName(null);
            }}
            required
            defaultOptionText="Select"
          />
          <DropDownList
            label="Office Name"
            data={officeNames}
            textField="text"
            valueField="value"
            value={officeName}
            onChange={v => setOfficeName(v as string)}
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
            onChange={v => setPostType(v as string)}
            required
            defaultOptionText="Select"
          />
          <DatePicker
            label="Month"
            value={month || undefined}
            onChange={v => setMonth(v || null)}
            view="month"
            dateFormat="mm/yy"
            placeholder="MM/YYYY"
            required
          />
        </FormGrid>
        <FormGrid columns={4} className="gap-4 items-end">
          <TextBox
            label="Employee Code (Optional)"
            placeholder="Enter Employee Code"
            value={empCode}
            onChange={v => setEmpCode(v as string)}
          />
          <div className="col-span-3 flex gap-3 justify-end">
            <Button label="Search" variant="primary" onClick={handleSearch} />
            <Button label="Clear" variant="outlined" onClick={handleClear} />
          </div>
        </FormGrid>
        <p className="text-red-500 text-xs mt-3 font-semibold">
          Note: All Asterisk (*) Marked Fields Are Mandatory
        </p>
      </FormCard>

      {hasSearched && (
        <FormCard title="Salary Slip Register">
          <GridPanel
            data={rows}
            emptyMessage="No salary records found."
            columns={[
              {
                header: 'Sr.No.',
                width: '60px',
                cell: (_, o) => <span>{o.rowIndex + 1}</span>,
              },
              { header: 'Employee Code', field: 'code' },
              { header: 'Employee Name', field: 'name' },
              { header: 'Month', field: 'month' },
              {
                header: 'Basic Pay',
                cell: (r: SalarySlipRow) => (
                  <span>₹{r.basicPay.toLocaleString()}</span>
                ),
              },
              {
                header: 'DA',
                cell: (r: SalarySlipRow) => (
                  <span>₹{r.da.toLocaleString()}</span>
                ),
              },
              {
                header: 'HRA',
                cell: (r: SalarySlipRow) => (
                  <span>₹{r.hra.toLocaleString()}</span>
                ),
              },
              {
                header: 'Gross Pay',
                cell: (r: SalarySlipRow) => (
                  <span className="font-semibold text-green-700">
                    ₹{r.grossPay.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Deductions',
                cell: (r: SalarySlipRow) => (
                  <span className="text-red-600">
                    ₹{r.totalDeductions.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Net Pay',
                cell: (r: SalarySlipRow) => (
                  <span className="font-bold text-blue-700">
                    ₹{r.netPay.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Print',
                width: '80px',
                cell: (r: SalarySlipRow) => (
                  <button
                    onClick={() =>
                      ToastService.success(
                        `Printing salary slip for ${r.name}...`
                      )
                    }
                    className="p-1.5 border border-indigo-200 text-indigo-600 rounded hover:bg-indigo-50 transition-all"
                    title="Print Salary Slip"
                  >
                    <i className="pi pi-print text-xs" />
                  </button>
                ),
              },
            ]}
          />
        </FormCard>
      )}
    </div>
  );
}

// ─── Bank Statement Tab ───────────────────────────────────────────────────────
function BankStatementTab({ employees }: { employees: Employee[] }) {
  const [officeType, setOfficeType] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState<string | null>(null);
  const [month, setMonth] = useState<Date | null>(null);
  const [rows, setRows] = useState<BankStatementRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const officeNames = officeType ? OFFICE_NAMES_MAPPING[officeType] || [] : [];

  const handleSearch = () => {
    if (!officeType || !officeName || !month) {
      ToastService.error('Please fill all required fields.');
      return;
    }
    const monthLabel = `${String(month.getMonth() + 1).padStart(2, '0')}/${month.getFullYear()}`;
    const matched = employees.filter(
      e => e.officeType === officeType && e.officeName === officeName
    );
    const result: BankStatementRow[] = matched.map(emp => {
      const bank = MOCK_BANK_DETAILS[emp.code] || {
        accountNumber: 'N/A',
        bankName: 'Unknown Bank',
        ifscCode: 'N/A',
      };
      const { netPay } = getSalaryMetrics(emp.designation);
      return {
        ...emp,
        ...bank,
        month: monthLabel,
        netPay,
        transferStatus: 'Transferred',
      };
    });
    setRows(result);
    setHasSearched(true);
    ToastService.success(`Loaded ${result.length} bank statement record(s).`);
  };

  const handleClear = () => {
    setOfficeType(null);
    setOfficeName(null);
    setMonth(null);
    setRows([]);
    setHasSearched(false);
  };

  const totalTransferred = rows
    .filter(r => r.transferStatus === 'Transferred')
    .reduce((a, r) => a + r.netPay, 0);

  return (
    <div className="flex flex-col gap-6 mt-4">
      <FormCard title="Bank Statement Search Criteria">
        <FormGrid columns={4} className="gap-4 items-end mb-4">
          <DropDownList
            label="Office Type"
            data={OFFICE_TYPES}
            textField="text"
            valueField="value"
            value={officeType}
            onChange={v => {
              setOfficeType(v as string);
              setOfficeName(null);
            }}
            required
            defaultOptionText="Select"
          />
          <DropDownList
            label="Office Name"
            data={officeNames}
            textField="text"
            valueField="value"
            value={officeName}
            onChange={v => setOfficeName(v as string)}
            required
            defaultOptionText="Select"
            disabled={!officeType}
          />
          <DatePicker
            label="Month"
            value={month || undefined}
            onChange={v => setMonth(v || null)}
            view="month"
            dateFormat="mm/yy"
            placeholder="MM/YYYY"
            required
          />
          <div className="flex gap-3">
            <Button label="Search" variant="primary" onClick={handleSearch} />
            <Button label="Clear" variant="outlined" onClick={handleClear} />
          </div>
        </FormGrid>
        <p className="text-red-500 text-xs font-semibold">
          Note: All Asterisk (*) Marked Fields Are Mandatory
        </p>
      </FormCard>

      {hasSearched && (
        <FormCard title="Bank Transfer Statement">
          <GridPanel
            data={rows}
            emptyMessage="No bank records found."
            columns={[
              {
                header: 'Sr.No.',
                width: '60px',
                cell: (_, o) => <span>{o.rowIndex + 1}</span>,
              },
              { header: 'Employee Code', field: 'code' },
              { header: 'Employee Name', field: 'name' },
              { header: 'Bank Name', field: 'bankName' },
              { header: 'Account No.', field: 'accountNumber' },
              { header: 'IFSC Code', field: 'ifscCode' },
              { header: 'Transfer Month', field: 'month' },
              {
                header: 'Net Pay',
                cell: (r: BankStatementRow) => (
                  <span className="font-bold text-blue-700">
                    ₹{r.netPay.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Status',
                cell: (r: BankStatementRow) => (
                  <StatusBadge
                    label={r.transferStatus}
                    variant={
                      r.transferStatus === 'Transferred'
                        ? 'approved'
                        : 'pending'
                    }
                  />
                ),
              },
              {
                header: 'Download',
                width: '90px',
                cell: (r: BankStatementRow) => (
                  <button
                    onClick={() =>
                      ToastService.success(
                        `Downloading bank advice for ${r.name}...`
                      )
                    }
                    className="p-1.5 border border-teal-200 text-teal-600 rounded hover:bg-teal-50 transition-all"
                    title="Download"
                  >
                    <i className="pi pi-download text-xs" />
                  </button>
                ),
              },
            ]}
          />
          {rows.length > 0 && (
            <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-wrap gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-blue-500 font-semibold uppercase">
                  Total Employees
                </span>
                <span className="text-xl font-bold text-blue-800">
                  {rows.length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-blue-500 font-semibold uppercase">
                  Total Amount Transferred
                </span>
                <span className="text-xl font-bold text-blue-800">
                  ₹{totalTransferred.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </FormCard>
      )}
    </div>
  );
}

// ─── PF Statement Tab ─────────────────────────────────────────────────────────
function PFStatementTab({ employees }: { employees: Employee[] }) {
  const [officeType, setOfficeType] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState<string | null>(null);
  const [financialYear, setFinancialYear] = useState<string | null>(null);
  const [empCode, setEmpCode] = useState('');
  const [rows, setRows] = useState<PFStatementRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const officeNames = officeType ? OFFICE_NAMES_MAPPING[officeType] || [] : [];

  const handleSearch = () => {
    if (!officeType || !officeName || !financialYear) {
      ToastService.error('Please fill all required fields.');
      return;
    }
    const matched = employees.filter(e => {
      const offMatch =
        e.officeType === officeType && e.officeName === officeName;
      const codeMatch =
        !empCode || e.code.toLowerCase().includes(empCode.trim().toLowerCase());
      return offMatch && codeMatch;
    });
    const result: PFStatementRow[] = matched.map((emp, i) => {
      const { basic, da } = (() => {
        const m = getSalaryMetrics(emp.designation);
        return { basic: m.basicPay, da: m.da };
      })();
      const monthlyContrib = Math.round((basic + da) * 0.12);
      const annualEmpContrib = monthlyContrib * 12;
      const annualEmplerContrib = Math.round((basic + da) * 0.0833) * 12;
      const openingBal = (i + 1) * 85000;
      return {
        ...emp,
        financialYear,
        basicPay: basic,
        da,
        employeeContrib: annualEmpContrib,
        employerContrib: annualEmplerContrib,
        totalContrib: annualEmpContrib + annualEmplerContrib,
        openingBalance: openingBal,
        closingBalance: openingBal + annualEmpContrib + annualEmplerContrib,
      };
    });
    setRows(result);
    setHasSearched(true);
    ToastService.success(`Loaded ${result.length} PF statement record(s).`);
  };

  const handleClear = () => {
    setOfficeType(null);
    setOfficeName(null);
    setFinancialYear(null);
    setEmpCode('');
    setRows([]);
    setHasSearched(false);
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      <FormCard title="PF Statement Search Criteria">
        <FormGrid columns={4} className="gap-4 items-end mb-4">
          <DropDownList
            label="Office Type"
            data={OFFICE_TYPES}
            textField="text"
            valueField="value"
            value={officeType}
            onChange={v => {
              setOfficeType(v as string);
              setOfficeName(null);
            }}
            required
            defaultOptionText="Select"
          />
          <DropDownList
            label="Office Name"
            data={officeNames}
            textField="text"
            valueField="value"
            value={officeName}
            onChange={v => setOfficeName(v as string)}
            required
            defaultOptionText="Select"
            disabled={!officeType}
          />
          <DropDownList
            label="Financial Year"
            data={FINANCIAL_YEARS}
            textField="text"
            valueField="value"
            value={financialYear}
            onChange={v => setFinancialYear(v as string)}
            required
            defaultOptionText="Select"
          />
          <TextBox
            label="Employee Code (Optional)"
            placeholder="Enter Code"
            value={empCode}
            onChange={v => setEmpCode(v as string)}
          />
        </FormGrid>
        <div className="flex gap-3 justify-end mb-4">
          <Button label="Search" variant="primary" onClick={handleSearch} />
          <Button label="Clear" variant="outlined" onClick={handleClear} />
        </div>
        <p className="text-red-500 text-xs font-semibold">
          Note: All Asterisk (*) Marked Fields Are Mandatory
        </p>
      </FormCard>

      {hasSearched && (
        <FormCard title="Provident Fund Annual Statement">
          <GridPanel
            data={rows}
            emptyMessage="No PF records found."
            columns={[
              {
                header: 'Sr.No.',
                width: '60px',
                cell: (_, o) => <span>{o.rowIndex + 1}</span>,
              },
              { header: 'Employee Code', field: 'code' },
              { header: 'Employee Name', field: 'name' },
              { header: 'F.Y.', field: 'financialYear' },
              {
                header: 'Emp. Contribution',
                cell: (r: PFStatementRow) => (
                  <span className="text-blue-700">
                    ₹{r.employeeContrib.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Empr. Contribution',
                cell: (r: PFStatementRow) => (
                  <span className="text-indigo-700">
                    ₹{r.employerContrib.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Total Contribution',
                cell: (r: PFStatementRow) => (
                  <span className="font-semibold">
                    ₹{r.totalContrib.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Opening Balance',
                cell: (r: PFStatementRow) => (
                  <span>₹{r.openingBalance.toLocaleString()}</span>
                ),
              },
              {
                header: 'Closing Balance',
                cell: (r: PFStatementRow) => (
                  <span className="font-bold text-green-700">
                    ₹{r.closingBalance.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Download',
                width: '90px',
                cell: (r: PFStatementRow) => (
                  <button
                    onClick={() =>
                      ToastService.success(
                        `Downloading PF passbook for ${r.name}...`
                      )
                    }
                    className="p-1.5 border border-green-200 text-green-600 rounded hover:bg-green-50 transition-all"
                  >
                    <i className="pi pi-download text-xs" />
                  </button>
                ),
              },
            ]}
          />
        </FormCard>
      )}
    </div>
  );
}

// ─── TDS Statement Tab ────────────────────────────────────────────────────────
function TDSStatementTab({ employees }: { employees: Employee[] }) {
  const [officeType, setOfficeType] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState<string | null>(null);
  const [financialYear, setFinancialYear] = useState<string | null>(null);
  const [rows, setRows] = useState<TDSStatementRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const officeNames = officeType ? OFFICE_NAMES_MAPPING[officeType] || [] : [];

  const handleSearch = () => {
    if (!officeType || !officeName || !financialYear) {
      ToastService.error('Please fill all required fields.');
      return;
    }
    const matched = employees.filter(
      e => e.officeType === officeType && e.officeName === officeName
    );
    const result: TDSStatementRow[] = matched.map(emp => {
      const m = getSalaryMetrics(emp.designation);
      const annualGross = m.grossPay * 12;
      const standardDeduction = 50000;
      const npsExemption = m.nps * 12;
      const totalExemptions = standardDeduction + npsExemption;
      const taxableIncome = Math.max(0, annualGross - totalExemptions);
      const tdsDeducted = m.incomeTax * 12;
      return {
        ...emp,
        financialYear,
        grossIncome: annualGross,
        exemptions: totalExemptions,
        taxableIncome,
        tdsDeducted,
        form16Status: 'Ready' as const,
      };
    });
    setRows(result);
    setHasSearched(true);
    ToastService.success(`Loaded ${result.length} TDS statement record(s).`);
  };

  const handleClear = () => {
    setOfficeType(null);
    setOfficeName(null);
    setFinancialYear(null);
    setRows([]);
    setHasSearched(false);
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      <FormCard title="TDS / Income Tax Statement Criteria">
        <FormGrid columns={4} className="gap-4 items-end mb-4">
          <DropDownList
            label="Office Type"
            data={OFFICE_TYPES}
            textField="text"
            valueField="value"
            value={officeType}
            onChange={v => {
              setOfficeType(v as string);
              setOfficeName(null);
            }}
            required
            defaultOptionText="Select"
          />
          <DropDownList
            label="Office Name"
            data={officeNames}
            textField="text"
            valueField="value"
            value={officeName}
            onChange={v => setOfficeName(v as string)}
            required
            defaultOptionText="Select"
            disabled={!officeType}
          />
          <DropDownList
            label="Financial Year"
            data={FINANCIAL_YEARS}
            textField="text"
            valueField="value"
            value={financialYear}
            onChange={v => setFinancialYear(v as string)}
            required
            defaultOptionText="Select"
          />
          <div className="flex gap-3">
            <Button label="Search" variant="primary" onClick={handleSearch} />
            <Button label="Clear" variant="outlined" onClick={handleClear} />
          </div>
        </FormGrid>
        <p className="text-red-500 text-xs font-semibold">
          Note: All Asterisk (*) Marked Fields Are Mandatory
        </p>
      </FormCard>

      {hasSearched && (
        <FormCard title="Annual TDS / Form 16 Statement">
          <GridPanel
            data={rows}
            emptyMessage="No TDS records found."
            columns={[
              {
                header: 'Sr.No.',
                width: '60px',
                cell: (_, o) => <span>{o.rowIndex + 1}</span>,
              },
              { header: 'Employee Code', field: 'code' },
              { header: 'Employee Name', field: 'name' },
              { header: 'F.Y.', field: 'financialYear' },
              {
                header: 'Gross Income',
                cell: (r: TDSStatementRow) => (
                  <span>₹{r.grossIncome.toLocaleString()}</span>
                ),
              },
              {
                header: 'Exemptions',
                cell: (r: TDSStatementRow) => (
                  <span className="text-indigo-600">
                    ₹{r.exemptions.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Taxable Income',
                cell: (r: TDSStatementRow) => (
                  <span className="font-semibold">
                    ₹{r.taxableIncome.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'TDS Deducted',
                cell: (r: TDSStatementRow) => (
                  <span className="font-bold text-red-600">
                    ₹{r.tdsDeducted.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Form 16',
                cell: (r: TDSStatementRow) => (
                  <StatusBadge
                    label={r.form16Status}
                    variant={
                      r.form16Status === 'Ready' ? 'approved' : 'pending'
                    }
                  />
                ),
              },
              {
                header: 'Download',
                width: '90px',
                cell: (r: TDSStatementRow) => (
                  <button
                    onClick={() =>
                      ToastService.success(
                        `Generating Form 16 for ${r.name}...`
                      )
                    }
                    className="p-1.5 border border-orange-200 text-orange-600 rounded hover:bg-orange-50 transition-all"
                  >
                    <i className="pi pi-file-pdf text-xs" />
                  </button>
                ),
              },
            ]}
          />
        </FormCard>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function PayrollReports() {
  const { employees } = usePayrollStore();

  const tabsList = [
    {
      title: 'Salary Slip',
      content: <SalarySlipTab employees={employees} />,
    },
    {
      title: 'Bank Statement',
      content: <BankStatementTab employees={employees} />,
    },
    {
      title: 'PF Statement',
      content: <PFStatementTab employees={employees} />,
    },
    {
      title: 'TDS Statement',
      content: <TDSStatementTab employees={employees} />,
    },
  ];

  return (
    <FormPage
      title="Payroll Reports"
      description="Access salary slips, bank transfer statements, PF passbooks, and annual TDS (Form 16) statements for all staff."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        { label: 'Payroll Reports' },
      ]}
    >
      <Tabs tabs={tabsList} />
    </FormPage>
  );
}
