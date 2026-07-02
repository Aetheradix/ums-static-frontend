import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { usePayrollStore } from '../store/usePayrollStore';

// ─── Constants ────────────────────────────────────────────────────────────────
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

const TAX_REGIMES = [
  { text: 'New Tax Regime', value: 'New' },
  { text: 'Old Tax Regime', value: 'Old' },
];

const DECLARATION_TYPES = [
  { text: 'Section 80C - PF/LIC/ELSS', value: '80C' },
  { text: 'Section 80D - Medical Insurance', value: '80D' },
  { text: 'Section 80G - Donations', value: '80G' },
  { text: 'Section 24B - Home Loan Interest', value: '24B' },
  { text: 'HRA Exemption', value: 'HRA' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface TaxRow {
  id: string;
  code: string;
  name: string;
  designation: string;
  financialYear: string;
  taxRegime: string;
  grossAnnualIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  computedTax: number;
  monthlyTDS: number;
  declarationStatus: 'Draft' | 'Submitted' | 'Verified';
}

interface DeclarationEntry {
  id: string;
  declarationType: string;
  amount: number;
  description: string;
}

interface TDSRow {
  id: string;
  code: string;
  name: string;
  designation: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
  challanStatus: 'Filed' | 'Pending';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getBasicPay = (desig: string): number => {
  switch (desig) {
    case 'Professor':
      return 144200;
    case 'Registrar':
      return 131400;
    case 'Associate Professor':
      return 115000;
    case 'Assistant Professor':
      return 57700;
    case 'Lab Technician':
      return 35400;
    default:
      return 30000;
  }
};

const computeIncomeTax = (taxableIncome: number, regime: string): number => {
  if (regime === 'New') {
    if (taxableIncome <= 300000) return 0;
    if (taxableIncome <= 600000)
      return Math.round((taxableIncome - 300000) * 0.05);
    if (taxableIncome <= 900000)
      return Math.round(15000 + (taxableIncome - 600000) * 0.1);
    if (taxableIncome <= 1200000)
      return Math.round(45000 + (taxableIncome - 900000) * 0.15);
    if (taxableIncome <= 1500000)
      return Math.round(90000 + (taxableIncome - 1200000) * 0.2);
    return Math.round(150000 + (taxableIncome - 1500000) * 0.3);
  }
  if (taxableIncome <= 250000) return 0;
  if (taxableIncome <= 500000)
    return Math.round((taxableIncome - 250000) * 0.05);
  if (taxableIncome <= 1000000)
    return Math.round(12500 + (taxableIncome - 500000) * 0.2);
  return Math.round(112500 + (taxableIncome - 1000000) * 0.3);
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function IncomeTaxDeclaration() {
  const { employees } = usePayrollStore();

  // ── Tab 1: Tax Declaration state ─────────────────────────────────────────────
  const [t1OfficeType, setT1OfficeType] = useState<string | null>(null);
  const [t1OfficeName, setT1OfficeName] = useState<string | null>(null);
  const [t1PostType, setT1PostType] = useState<string | null>(null);
  const [t1FinancialYear, setT1FinancialYear] = useState<string | null>(null);
  const [t1TaxRegime, setT1TaxRegime] = useState<string>('New');
  const [t1Rows, setT1Rows] = useState<TaxRow[]>([]);
  const [t1HasCalculated, setT1HasCalculated] = useState(false);

  // Declaration popup state
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupEmpName, setPopupEmpName] = useState('');
  const [declEntries, setDeclEntries] = useState<DeclarationEntry[]>([]);
  const [newDeclType, setNewDeclType] = useState<string | null>(null);
  const [newDeclAmount, setNewDeclAmount] = useState('');
  const [newDeclDesc, setNewDeclDesc] = useState('');

  const t1OfficeNames = t1OfficeType
    ? OFFICE_NAMES_MAPPING[t1OfficeType] || []
    : [];

  const handleT1Calculate = () => {
    if (!t1OfficeType || !t1OfficeName || !t1PostType || !t1FinancialYear) {
      ToastService.error('Please fill all required fields.');
      return;
    }
    const matched = employees.filter(
      e =>
        e.officeType === t1OfficeType &&
        e.officeName === t1OfficeName &&
        e.postType === t1PostType
    );
    if (matched.length === 0) {
      ToastService.error('No employees found for selected criteria.');
      return;
    }
    const result: TaxRow[] = matched.map(emp => {
      const basic = getBasicPay(emp.designation);
      const da = Math.round(basic * 0.5);
      const hra = Math.round(basic * 0.27);
      const grossAnnual = (basic + da + hra + 5000) * 12;
      const stdDeduction = t1TaxRegime === 'Old' ? 50000 : 75000;
      const npsDeduction = Math.min(
        150000,
        Math.round((basic + da) * 0.1) * 12
      );
      const medicalDeduction = 25000;
      const totalDeductions =
        t1TaxRegime === 'Old'
          ? stdDeduction + npsDeduction + medicalDeduction
          : stdDeduction;
      const taxableIncome = Math.max(0, grossAnnual - totalDeductions);
      const computedTax = computeIncomeTax(taxableIncome, t1TaxRegime);
      return {
        id: emp.id,
        code: emp.code,
        name: emp.name,
        designation: emp.designation,
        financialYear: t1FinancialYear,
        taxRegime: t1TaxRegime,
        grossAnnualIncome: grossAnnual,
        totalDeductions,
        taxableIncome,
        computedTax,
        monthlyTDS: Math.round(computedTax / 12),
        declarationStatus: 'Draft',
      };
    });
    setT1Rows(result);
    setT1HasCalculated(true);
    ToastService.success(`Tax computed for ${result.length} employee(s).`);
  };

  const handleT1Submit = (empId: string) => {
    setT1Rows(prev =>
      prev.map(r =>
        r.id === empId ? { ...r, declarationStatus: 'Submitted' } : r
      )
    );
    ToastService.success('Declaration submitted for verification.');
  };

  const handleT1Verify = (empId: string) => {
    setT1Rows(prev =>
      prev.map(r =>
        r.id === empId ? { ...r, declarationStatus: 'Verified' } : r
      )
    );
    ToastService.success('Declaration verified successfully.');
  };

  const handleOpenPopup = (empName: string) => {
    setPopupEmpName(empName);
    setDeclEntries([]);
    setNewDeclType(null);
    setNewDeclAmount('');
    setNewDeclDesc('');
    setPopupVisible(true);
  };

  const handleAddDeclEntry = () => {
    if (!newDeclType || !newDeclAmount) {
      ToastService.error('Select declaration type and enter amount.');
      return;
    }
    setDeclEntries(prev => [
      ...prev,
      {
        id: `decl-${Date.now()}`,
        declarationType: newDeclType,
        amount: Number(newDeclAmount),
        description: newDeclDesc,
      },
    ]);
    setNewDeclType(null);
    setNewDeclAmount('');
    setNewDeclDesc('');
    ToastService.success('Declaration entry added.');
  };

  const handleT1Clear = () => {
    setT1OfficeType(null);
    setT1OfficeName(null);
    setT1PostType(null);
    setT1FinancialYear(null);
    setT1TaxRegime('New');
    setT1Rows([]);
    setT1HasCalculated(false);
  };

  // ── Tab 2: TDS Summary state ─────────────────────────────────────────────────
  const [t2OfficeType, setT2OfficeType] = useState<string | null>(null);
  const [t2OfficeName, setT2OfficeName] = useState<string | null>(null);
  const [t2FinancialYear, setT2FinancialYear] = useState<string | null>(null);
  const [t2Rows, setT2Rows] = useState<TDSRow[]>([]);
  const [t2HasSearched, setT2HasSearched] = useState(false);

  const t2OfficeNames = t2OfficeType
    ? OFFICE_NAMES_MAPPING[t2OfficeType] || []
    : [];

  const handleT2Search = () => {
    if (!t2OfficeType || !t2OfficeName || !t2FinancialYear) {
      ToastService.error('Please fill all required fields.');
      return;
    }
    const matched = employees.filter(
      e => e.officeType === t2OfficeType && e.officeName === t2OfficeName
    );
    const result: TDSRow[] = matched.map(emp => {
      const basic = getBasicPay(emp.designation);
      const da = Math.round(basic * 0.5);
      const hra = Math.round(basic * 0.27);
      const grossAnnual = (basic + da + hra + 5000) * 12;
      const taxableIncome = Math.max(0, grossAnnual - 75000);
      const annualTax = computeIncomeTax(taxableIncome, 'New');
      const qTax = Math.round(annualTax / 4);
      return {
        id: emp.id,
        code: emp.code,
        name: emp.name,
        designation: emp.designation,
        q1: qTax,
        q2: qTax,
        q3: qTax,
        q4: annualTax - qTax * 3,
        total: annualTax,
        challanStatus: 'Filed',
      };
    });
    setT2Rows(result);
    setT2HasSearched(true);
    ToastService.success(
      `TDS summary loaded for ${result.length} employee(s).`
    );
  };

  const handleT2Clear = () => {
    setT2OfficeType(null);
    setT2OfficeName(null);
    setT2FinancialYear(null);
    setT2Rows([]);
    setT2HasSearched(false);
  };

  // ── Tabs composition ─────────────────────────────────────────────────────────
  const tabsList = [
    {
      title: 'Tax Declaration & Computation',
      content: (
        <div className="flex flex-col gap-6 mt-4">
          <FormCard title="Income Tax Computation Criteria">
            <FormGrid columns={4} className="gap-4 items-end mb-4">
              <DropDownList
                label="Office Type"
                data={OFFICE_TYPES}
                textField="text"
                valueField="value"
                value={t1OfficeType}
                onChange={v => {
                  setT1OfficeType(v as string);
                  setT1OfficeName(null);
                }}
                required
                defaultOptionText="Select"
              />
              <DropDownList
                label="Office Name"
                data={t1OfficeNames}
                textField="text"
                valueField="value"
                value={t1OfficeName}
                onChange={v => setT1OfficeName(v as string)}
                required
                defaultOptionText="Select"
                disabled={!t1OfficeType}
              />
              <DropDownList
                label="Post Type"
                data={POST_TYPES}
                textField="text"
                valueField="value"
                value={t1PostType}
                onChange={v => setT1PostType(v as string)}
                required
                defaultOptionText="Select"
              />
              <DropDownList
                label="Financial Year"
                data={FINANCIAL_YEARS}
                textField="text"
                valueField="value"
                value={t1FinancialYear}
                onChange={v => setT1FinancialYear(v as string)}
                required
                defaultOptionText="Select"
              />
            </FormGrid>
            <FormGrid columns={4} className="gap-4 items-end">
              <DropDownList
                label="Tax Regime"
                data={TAX_REGIMES}
                textField="text"
                valueField="value"
                value={t1TaxRegime}
                onChange={v => setT1TaxRegime(v as string)}
                required
              />
              <div className="col-span-3 flex gap-3 justify-end">
                <Button
                  label="Compute Tax"
                  variant="primary"
                  onClick={handleT1Calculate}
                />
                <Button
                  label="Clear"
                  variant="outlined"
                  onClick={handleT1Clear}
                />
              </div>
            </FormGrid>
            <div className="text-red-500 text-xs mt-3 font-semibold">
              Note: All Asterisk (*) Marked Fields Are Mandatory
            </div>
          </FormCard>

          {t1HasCalculated && (
            <FormCard title="Income Tax Computation Grid">
              <GridPanel
                data={t1Rows}
                emptyMessage="No records found."
                columns={[
                  {
                    header: 'Sr.No.',
                    width: '60px',
                    cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                  },
                  { header: 'Employee Code', field: 'code' },
                  { header: 'Employee Name', field: 'name' },
                  { header: 'Regime', field: 'taxRegime' },
                  {
                    header: 'Gross Annual Income',
                    cell: (r: TaxRow) => (
                      <span>₹{r.grossAnnualIncome.toLocaleString()}</span>
                    ),
                  },
                  {
                    header: 'Total Deductions',
                    cell: (r: TaxRow) => (
                      <span className="text-indigo-600">
                        ₹{r.totalDeductions.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Taxable Income',
                    cell: (r: TaxRow) => (
                      <span className="font-semibold">
                        ₹{r.taxableIncome.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Annual Tax',
                    cell: (r: TaxRow) => (
                      <span className="font-bold text-red-600">
                        ₹{r.computedTax.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Monthly TDS',
                    cell: (r: TaxRow) => (
                      <span className="font-bold text-orange-600">
                        ₹{r.monthlyTDS.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Status',
                    cell: (r: TaxRow) => (
                      <StatusBadge
                        label={r.declarationStatus}
                        variant={
                          r.declarationStatus === 'Verified'
                            ? 'approved'
                            : r.declarationStatus === 'Submitted'
                              ? 'neutral'
                              : 'pending'
                        }
                      />
                    ),
                  },
                  {
                    header: 'Actions',
                    width: '210px',
                    cell: (r: TaxRow) => (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenPopup(r.name)}
                          className="p-1.5 border border-indigo-200 text-indigo-600 rounded hover:bg-indigo-50 transition-all"
                          title="Add Declaration"
                        >
                          <i className="pi pi-plus-circle text-xs" />
                        </button>
                        <Button
                          label="Submit"
                          variant="primary"
                          size="small"
                          disabled={r.declarationStatus !== 'Draft'}
                          onClick={() => handleT1Submit(r.id)}
                        />
                        <Button
                          label="Verify"
                          variant="success"
                          size="small"
                          disabled={r.declarationStatus !== 'Submitted'}
                          onClick={() => handleT1Verify(r.id)}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </FormCard>
          )}
        </div>
      ),
    },

    {
      title: 'Quarterly TDS Summary',
      content: (
        <div className="flex flex-col gap-6 mt-4">
          <FormCard title="Quarterly TDS Summary Criteria">
            <FormGrid columns={4} className="gap-4 items-end mb-4">
              <DropDownList
                label="Office Type"
                data={OFFICE_TYPES}
                textField="text"
                valueField="value"
                value={t2OfficeType}
                onChange={v => {
                  setT2OfficeType(v as string);
                  setT2OfficeName(null);
                }}
                required
                defaultOptionText="Select"
              />
              <DropDownList
                label="Office Name"
                data={t2OfficeNames}
                textField="text"
                valueField="value"
                value={t2OfficeName}
                onChange={v => setT2OfficeName(v as string)}
                required
                defaultOptionText="Select"
                disabled={!t2OfficeType}
              />
              <DropDownList
                label="Financial Year"
                data={FINANCIAL_YEARS}
                textField="text"
                valueField="value"
                value={t2FinancialYear}
                onChange={v => setT2FinancialYear(v as string)}
                required
                defaultOptionText="Select"
              />
              <div className="flex gap-3">
                <Button
                  label="Search"
                  variant="primary"
                  onClick={handleT2Search}
                />
                <Button
                  label="Clear"
                  variant="outlined"
                  onClick={handleT2Clear}
                />
              </div>
            </FormGrid>
            <div className="text-red-500 text-xs font-semibold">
              Note: All Asterisk (*) Marked Fields Are Mandatory
            </div>
          </FormCard>

          {t2HasSearched && (
            <FormCard title="Quarterly TDS Deduction Summary">
              <GridPanel
                data={t2Rows}
                emptyMessage="No TDS records found."
                columns={[
                  {
                    header: 'Sr.No.',
                    width: '60px',
                    cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                  },
                  { header: 'Employee Code', field: 'code' },
                  { header: 'Employee Name', field: 'name' },
                  {
                    header: 'Q1 (Apr-Jun)',
                    cell: (r: TDSRow) => <span>₹{r.q1.toLocaleString()}</span>,
                  },
                  {
                    header: 'Q2 (Jul-Sep)',
                    cell: (r: TDSRow) => <span>₹{r.q2.toLocaleString()}</span>,
                  },
                  {
                    header: 'Q3 (Oct-Dec)',
                    cell: (r: TDSRow) => <span>₹{r.q3.toLocaleString()}</span>,
                  },
                  {
                    header: 'Q4 (Jan-Mar)',
                    cell: (r: TDSRow) => <span>₹{r.q4.toLocaleString()}</span>,
                  },
                  {
                    header: 'Total TDS',
                    cell: (r: TDSRow) => (
                      <span className="font-bold text-red-600">
                        ₹{r.total.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Challan Status',
                    cell: (r: TDSRow) => (
                      <StatusBadge
                        label={r.challanStatus}
                        variant={
                          r.challanStatus === 'Filed' ? 'approved' : 'pending'
                        }
                      />
                    ),
                  },
                  {
                    header: 'Form 16',
                    width: '80px',
                    cell: (r: TDSRow) => (
                      <button
                        onClick={() =>
                          ToastService.success(
                            `Generating Form 16 for ${r.name}...`
                          )
                        }
                        className="p-1.5 border border-orange-200 text-orange-600 rounded hover:bg-orange-50 transition-all"
                        title="Form 16"
                      >
                        <i className="pi pi-file-pdf text-xs" />
                      </button>
                    ),
                  },
                ]}
              />
              {t2Rows.length > 0 && (
                <div className="mt-5 p-4 rounded-xl bg-orange-50 border border-orange-200 flex flex-wrap gap-6">
                  <div className="flex flex-col">
                    <span className="text-xs text-orange-500 font-semibold uppercase">
                      Total TDS Collected
                    </span>
                    <span className="text-xl font-bold text-orange-800">
                      ₹
                      {t2Rows.reduce((a, r) => a + r.total, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-orange-500 font-semibold uppercase">
                      Challans Filed
                    </span>
                    <span className="text-xl font-bold text-green-700">
                      {t2Rows.filter(r => r.challanStatus === 'Filed').length} /{' '}
                      {t2Rows.length}
                    </span>
                  </div>
                </div>
              )}
            </FormCard>
          )}
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="Income Tax Declaration"
      description="Employee investment declarations, income tax computation under old/new regime, and quarterly TDS challan summary with Form 16 generation."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        { label: 'Income Tax Declaration' },
      ]}
    >
      <Tabs tabs={tabsList} />

      {/* Investment Declaration Popup */}
      <FormPopup
        visible={popupVisible}
        onHide={() => setPopupVisible(false)}
        title="Investment Declaration Entries"
        subtitle={popupEmpName}
        size="lg"
      >
        <div className="flex flex-col gap-4 py-2">
          <FormGrid columns={3} className="gap-4 items-end">
            <DropDownList
              label="Declaration Type"
              data={DECLARATION_TYPES}
              textField="text"
              valueField="value"
              value={newDeclType}
              onChange={v => setNewDeclType(v as string)}
              required
              defaultOptionText="Select"
            />
            <TextBox
              label="Amount (₹)"
              placeholder="Enter amount"
              value={newDeclAmount}
              onChange={v => setNewDeclAmount(v as string)}
              required
            />
            <TextBox
              label="Description"
              placeholder="Optional details"
              value={newDeclDesc}
              onChange={v => setNewDeclDesc(v as string)}
            />
          </FormGrid>
          <div className="flex justify-end">
            <Button
              label="Add Entry"
              variant="primary"
              icon="plus"
              onClick={handleAddDeclEntry}
            />
          </div>
          {declEntries.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b text-gray-600 font-semibold text-xs">
                  <tr>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {declEntries.map(e => (
                    <tr key={e.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-semibold text-indigo-700">
                        {e.declarationType}
                      </td>
                      <td className="px-4 py-2 text-right font-bold">
                        ₹{e.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">
                        {e.description || '—'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td className="px-4 py-2 text-slate-700">Total</td>
                    <td className="px-4 py-2 text-right text-green-700">
                      ₹
                      {declEntries
                        .reduce((a, e) => a + e.amount, 0)
                        .toLocaleString()}
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-3 border-t mt-2">
            <Button
              label="Close"
              variant="outlined"
              onClick={() => setPopupVisible(false)}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
