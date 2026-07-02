import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
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

const INCREMENT_TYPES = [
  { text: 'Annual Increment', value: 'Annual Increment' },
  { text: 'Promotion Increment', value: 'Promotion Increment' },
  { text: 'Special Increment', value: 'Special Increment' },
  { text: 'Stagnation Increment', value: 'Stagnation Increment' },
];

const PAY_COMMISSIONS = [
  { text: '5th Pay Commission', value: '5th' },
  { text: '6th Pay Commission', value: '6th' },
  { text: '7th Pay Commission', value: '7th' },
];

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

const getAnnualIncrementAmount = (desig: string): number => {
  switch (desig) {
    case 'Professor':
      return 5700;
    case 'Registrar':
      return 5200;
    case 'Associate Professor':
      return 4600;
    case 'Assistant Professor':
      return 2300;
    case 'Lab Technician':
      return 1400;
    default:
      return 1200;
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface IncrementRow {
  id: string;
  code: string;
  name: string;
  designation: string;
  officeType: string;
  officeName: string;
  postType: string;
  incrementType: string;
  currentBasic: number;
  incrementAmount: number;
  revisedBasic: number;
  effectiveDate: string;
  orderNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface IncrementHistoryRow {
  id: string;
  empCode: string;
  empName: string;
  incrementType: string;
  previousBasic: number;
  incrementAmount: number;
  revisedBasic: number;
  effectiveDate: string;
  orderNumber: string;
  approvedDate: string;
  status: 'Approved' | 'Rejected';
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SalaryIncrement() {
  const { employees } = usePayrollStore();

  // ── Tab 1 state ─────────────────────────────────────────────────────────────
  const [t1OfficeType, setT1OfficeType] = useState<string | null>(null);
  const [t1OfficeName, setT1OfficeName] = useState<string | null>(null);
  const [t1PostType, setT1PostType] = useState<string | null>(null);
  const [t1IncrementType, setT1IncrementType] = useState<string | null>(null);
  const [t1PayCommission, setT1PayCommission] = useState<string | null>(null);
  const [t1EffectiveDate, setT1EffectiveDate] = useState<Date | null>(null);
  const [t1OrderNumber, setT1OrderNumber] = useState('');
  const [t1OrderDate, setT1OrderDate] = useState<Date | null>(null);
  const [t1CustomPct, setT1CustomPct] = useState('');
  const [t1Rows, setT1Rows] = useState<IncrementRow[]>([]);
  const [t1HasCalculated, setT1HasCalculated] = useState(false);

  const t1OfficeNames = t1OfficeType
    ? OFFICE_NAMES_MAPPING[t1OfficeType] || []
    : [];

  const handleT1Calculate = () => {
    if (
      !t1OfficeType ||
      !t1OfficeName ||
      !t1PostType ||
      !t1IncrementType ||
      !t1PayCommission ||
      !t1EffectiveDate ||
      !t1OrderNumber ||
      !t1OrderDate
    ) {
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
      ToastService.error('No employees found for the selected criteria.');
      return;
    }
    const effDateStr = `${String(t1EffectiveDate.getDate()).padStart(2, '0')}/${String(t1EffectiveDate.getMonth() + 1).padStart(2, '0')}/${t1EffectiveDate.getFullYear()}`;
    const result: IncrementRow[] = matched.map(emp => {
      const currentBasic = getBasicPay(emp.designation);
      let incrementAmount = getAnnualIncrementAmount(emp.designation);
      if (t1IncrementType === 'Special Increment' && t1CustomPct) {
        incrementAmount = Math.round(
          currentBasic * (Number(t1CustomPct) / 100)
        );
      } else if (t1IncrementType === 'Promotion Increment') {
        incrementAmount = Math.round(
          getAnnualIncrementAmount(emp.designation) * 1.5
        );
      } else if (t1IncrementType === 'Stagnation Increment') {
        incrementAmount = Math.round(
          getAnnualIncrementAmount(emp.designation) * 0.5
        );
      }
      return {
        id: emp.id,
        code: emp.code,
        name: emp.name,
        designation: emp.designation,
        officeType: emp.officeType,
        officeName: emp.officeName,
        postType: emp.postType,
        incrementType: t1IncrementType,
        currentBasic,
        incrementAmount,
        revisedBasic: currentBasic + incrementAmount,
        effectiveDate: effDateStr,
        orderNumber: t1OrderNumber,
        status: 'Pending',
      };
    });
    setT1Rows(result);
    setT1HasCalculated(true);
    ToastService.success(
      `Calculated increment for ${result.length} employee(s).`
    );
  };

  const handleT1Approve = (empId: string) => {
    setT1Rows(prev =>
      prev.map(r => (r.id === empId ? { ...r, status: 'Approved' } : r))
    );
    ToastService.success('Increment approved successfully.');
  };

  const handleT1Reject = (empId: string) => {
    setT1Rows(prev =>
      prev.map(r => (r.id === empId ? { ...r, status: 'Rejected' } : r))
    );
    ToastService.success('Increment rejected.');
  };

  const handleT1ApproveAll = () => {
    setT1Rows(prev =>
      prev.map(r => (r.status === 'Pending' ? { ...r, status: 'Approved' } : r))
    );
    ToastService.success('All pending increments approved.');
  };

  const handleT1Clear = () => {
    setT1OfficeType(null);
    setT1OfficeName(null);
    setT1PostType(null);
    setT1IncrementType(null);
    setT1PayCommission(null);
    setT1EffectiveDate(null);
    setT1OrderNumber('');
    setT1OrderDate(null);
    setT1CustomPct('');
    setT1Rows([]);
    setT1HasCalculated(false);
  };

  // ── Tab 2 state ─────────────────────────────────────────────────────────────
  const [t2EmpCode, setT2EmpCode] = useState('');
  const [t2OfficeType, setT2OfficeType] = useState<string | null>(null);
  const [t2IncrementType, setT2IncrementType] = useState<string | null>(null);
  const [t2FromDate, setT2FromDate] = useState<Date | null>(null);
  const [t2ToDate, setT2ToDate] = useState<Date | null>(null);
  const [t2Rows, setT2Rows] = useState<IncrementHistoryRow[]>([]);
  const [t2HasSearched, setT2HasSearched] = useState(false);

  const mockHistory = useMemo(
    (): IncrementHistoryRow[] => [
      ...employees.map((emp, i) => ({
        id: `hist-${emp.id}-1`,
        empCode: emp.code,
        empName: emp.name,
        incrementType: i % 2 === 0 ? 'Annual Increment' : 'Promotion Increment',
        previousBasic:
          getBasicPay(emp.designation) -
          getAnnualIncrementAmount(emp.designation),
        incrementAmount: getAnnualIncrementAmount(emp.designation),
        revisedBasic: getBasicPay(emp.designation),
        effectiveDate: '01/01/2026',
        orderNumber: `ORD-INC-2026-00${i + 1}`,
        approvedDate: '28/12/2025',
        status: 'Approved' as const,
      })),
      ...employees.slice(0, 2).map((emp, i) => ({
        id: `hist-${emp.id}-2`,
        empCode: emp.code,
        empName: emp.name,
        incrementType: 'Annual Increment',
        previousBasic:
          getBasicPay(emp.designation) -
          getAnnualIncrementAmount(emp.designation) * 2,
        incrementAmount: getAnnualIncrementAmount(emp.designation),
        revisedBasic:
          getBasicPay(emp.designation) -
          getAnnualIncrementAmount(emp.designation),
        effectiveDate: '01/01/2025',
        orderNumber: `ORD-INC-2025-00${i + 1}`,
        approvedDate: '27/12/2024',
        status: 'Approved' as const,
      })),
    ],
    [employees]
  );

  const handleT2Search = () => {
    let filtered = [...mockHistory];
    if (t2EmpCode.trim()) {
      filtered = filtered.filter(
        r =>
          r.empCode.toLowerCase().includes(t2EmpCode.trim().toLowerCase()) ||
          r.empName.toLowerCase().includes(t2EmpCode.trim().toLowerCase())
      );
    }
    if (t2OfficeType) {
      const matchedCodes = employees
        .filter(e => e.officeType === t2OfficeType)
        .map(e => e.code);
      filtered = filtered.filter(r => matchedCodes.includes(r.empCode));
    }
    if (t2IncrementType) {
      filtered = filtered.filter(r => r.incrementType === t2IncrementType);
    }
    setT2Rows(filtered);
    setT2HasSearched(true);
    ToastService.success(
      `Found ${filtered.length} increment history record(s).`
    );
  };

  const handleT2Clear = () => {
    setT2EmpCode('');
    setT2OfficeType(null);
    setT2IncrementType(null);
    setT2FromDate(null);
    setT2ToDate(null);
    setT2Rows([]);
    setT2HasSearched(false);
  };

  // ── Tabs composition ─────────────────────────────────────────────────────────
  const tabsList = [
    {
      title: 'Process Increment',
      content: (
        <div className="flex flex-col gap-6 mt-4">
          <FormCard title="Increment Criteria">
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
                label="Increment Type"
                data={INCREMENT_TYPES}
                textField="text"
                valueField="value"
                value={t1IncrementType}
                onChange={v => setT1IncrementType(v as string)}
                required
                defaultOptionText="Select"
              />
            </FormGrid>
            <FormGrid columns={4} className="gap-4 items-end mb-4">
              <DropDownList
                label="Pay Commission"
                data={PAY_COMMISSIONS}
                textField="text"
                valueField="value"
                value={t1PayCommission}
                onChange={v => setT1PayCommission(v as string)}
                required
                defaultOptionText="Select"
              />
              <DatePicker
                label="Effective Date"
                value={t1EffectiveDate || undefined}
                onChange={v => setT1EffectiveDate(v || null)}
                placeholder="dd-mm-yyyy"
                required
              />
              <TextBox
                label="Order Number"
                placeholder="Enter Order No."
                value={t1OrderNumber}
                onChange={v => setT1OrderNumber(v as string)}
                required
              />
              <DatePicker
                label="Order Date"
                value={t1OrderDate || undefined}
                onChange={v => setT1OrderDate(v || null)}
                placeholder="dd-mm-yyyy"
                required
              />
            </FormGrid>
            <FormGrid columns={4} className="gap-4 items-end">
              {t1IncrementType === 'Special Increment' && (
                <TextBox
                  label="Increment Percentage (%)"
                  placeholder="e.g. 5"
                  value={t1CustomPct}
                  onChange={v => setT1CustomPct(v as string)}
                  required
                />
              )}
              <div className="col-span-4 flex gap-3 justify-end">
                <Button
                  label="Calculate Increment"
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
            <FormCard title="Increment Calculation Grid">
              <GridPanel
                data={t1Rows}
                emptyMessage="No records found."
                toolbar={
                  <div className="flex gap-3 justify-end w-full">
                    <Button
                      label="Approve All"
                      variant="success"
                      onClick={handleT1ApproveAll}
                    />
                  </div>
                }
                columns={[
                  {
                    header: 'Sr.No.',
                    width: '60px',
                    cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                  },
                  { header: 'Employee Code', field: 'code' },
                  { header: 'Employee Name', field: 'name' },
                  { header: 'Designation', field: 'designation' },
                  { header: 'Increment Type', field: 'incrementType' },
                  {
                    header: 'Current Basic',
                    cell: (r: IncrementRow) => (
                      <span>₹{r.currentBasic.toLocaleString()}</span>
                    ),
                  },
                  {
                    header: 'Increment Amount',
                    cell: (r: IncrementRow) => (
                      <span className="text-green-700 font-semibold">
                        +₹{r.incrementAmount.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Revised Basic',
                    cell: (r: IncrementRow) => (
                      <span className="font-bold text-blue-700">
                        ₹{r.revisedBasic.toLocaleString()}
                      </span>
                    ),
                  },
                  { header: 'Effective Date', field: 'effectiveDate' },
                  {
                    header: 'Status',
                    cell: (r: IncrementRow) => (
                      <StatusBadge
                        label={r.status}
                        variant={
                          r.status === 'Approved'
                            ? 'approved'
                            : r.status === 'Rejected'
                              ? 'rejected'
                              : 'pending'
                        }
                      />
                    ),
                  },
                  {
                    header: 'Action',
                    width: '170px',
                    cell: (r: IncrementRow) => (
                      <div className="flex gap-1.5">
                        <Button
                          label="Approve"
                          variant="success"
                          size="small"
                          disabled={r.status !== 'Pending'}
                          onClick={() => handleT1Approve(r.id)}
                        />
                        <Button
                          label="Reject"
                          variant="danger"
                          size="small"
                          disabled={r.status !== 'Pending'}
                          onClick={() => handleT1Reject(r.id)}
                        />
                      </div>
                    ),
                  },
                ]}
              />
              {t1Rows.length > 0 && (
                <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-6">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-semibold uppercase">
                      Total Employees
                    </span>
                    <span className="text-xl font-bold text-slate-800">
                      {t1Rows.length}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-semibold uppercase">
                      Approved
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {t1Rows.filter(r => r.status === 'Approved').length}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-semibold uppercase">
                      Total Increment Outgo
                    </span>
                    <span className="text-xl font-bold text-indigo-700">
                      ₹
                      {t1Rows
                        .filter(r => r.status === 'Approved')
                        .reduce((a, r) => a + r.incrementAmount, 0)
                        .toLocaleString()}
                      /mo
                    </span>
                  </div>
                </div>
              )}
            </FormCard>
          )}
        </div>
      ),
    },

    {
      title: 'Increment History',
      content: (
        <div className="flex flex-col gap-6 mt-4">
          <FormCard title="Increment History Search">
            <FormGrid columns={4} className="gap-4 items-end mb-4">
              <TextBox
                label="Employee Code / Name"
                placeholder="Search employee..."
                value={t2EmpCode}
                onChange={v => setT2EmpCode(v as string)}
              />
              <DropDownList
                label="Office Type"
                data={OFFICE_TYPES}
                textField="text"
                valueField="value"
                value={t2OfficeType}
                onChange={v => setT2OfficeType(v as string)}
                defaultOptionText="All"
              />
              <DropDownList
                label="Increment Type"
                data={INCREMENT_TYPES}
                textField="text"
                valueField="value"
                value={t2IncrementType}
                onChange={v => setT2IncrementType(v as string)}
                defaultOptionText="All"
              />
              <DatePicker
                label="From Date"
                value={t2FromDate || undefined}
                onChange={v => setT2FromDate(v || null)}
                placeholder="dd-mm-yyyy"
              />
            </FormGrid>
            <FormGrid columns={4} className="gap-4 items-end">
              <DatePicker
                label="To Date"
                value={t2ToDate || undefined}
                onChange={v => setT2ToDate(v || null)}
                placeholder="dd-mm-yyyy"
              />
              <div className="col-span-3 flex gap-3 justify-end">
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
          </FormCard>

          {t2HasSearched && (
            <FormCard title="Increment History Register">
              <GridPanel
                data={t2Rows}
                emptyMessage="No increment history records found."
                columns={[
                  {
                    header: 'Sr.No.',
                    width: '60px',
                    cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                  },
                  { header: 'Employee Code', field: 'empCode' },
                  { header: 'Employee Name', field: 'empName' },
                  { header: 'Increment Type', field: 'incrementType' },
                  {
                    header: 'Previous Basic',
                    cell: (r: IncrementHistoryRow) => (
                      <span>₹{r.previousBasic.toLocaleString()}</span>
                    ),
                  },
                  {
                    header: 'Increment',
                    cell: (r: IncrementHistoryRow) => (
                      <span className="text-green-700 font-semibold">
                        +₹{r.incrementAmount.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Revised Basic',
                    cell: (r: IncrementHistoryRow) => (
                      <span className="font-bold text-blue-700">
                        ₹{r.revisedBasic.toLocaleString()}
                      </span>
                    ),
                  },
                  { header: 'Effective Date', field: 'effectiveDate' },
                  { header: 'Order No.', field: 'orderNumber' },
                  { header: 'Approved On', field: 'approvedDate' },
                  {
                    header: 'Status',
                    cell: (r: IncrementHistoryRow) => (
                      <StatusBadge
                        label={r.status}
                        variant={
                          r.status === 'Approved' ? 'approved' : 'rejected'
                        }
                      />
                    ),
                  },
                ]}
              />
            </FormCard>
          )}
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="Salary Increment"
      description="Process annual, promotion, special, and stagnation increments with order document tracking and authorization workflow."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        { label: 'Salary Increment' },
      ]}
    >
      <Tabs tabs={tabsList} />
    </FormPage>
  );
}
