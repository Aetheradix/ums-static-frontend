import { useEffect, useMemo, useState } from 'react';
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

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
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

const ARREAR_TYPES = [
  { text: 'DA Arrear', value: 'DA Arrear' },
  { text: 'Promotion Arrear', value: 'Promotion Arrear' },
  { text: 'Salary Arrear', value: 'Salary Arrear' },
];

const PAY_COMMISSIONS = [
  { text: '5th Pay Commission', value: '5th' },
  { text: '6th Pay Commission', value: '6th' },
  { text: '7th Pay Commission', value: '7th' },
];

// Helper to retrieve employee salary details
const getEmployeeSalaryDetails = (desig: string): number => {
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

interface ArrearDetailRow {
  id: string;
  code: string;
  name: string;
  designation: string;
  arrearType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  amount: number;
  status: 'Pending' | 'Processed';
}

interface DAArrearRow {
  id: string;
  code: string;
  name: string;
  basicPay: number;
  existingDaPercent: number;
  revisedDaPercent: number;
  arrearAmount: number;
  status: 'Pending' | 'Authorized';
}

interface ProcessedPaymentRow {
  id: string;
  code: string;
  name: string;
  arrearType: string;
  orderNumber: string;
  paymentMonth: string;
  processedDate: string;
  amount: number;
  status: 'Processed';
}

export default function ArrearProcess() {
  const { employees } = usePayrollStore();

  // Shared store of authorized DA calculation orders to connect Tab 2 and Tab 3
  const [authorizedOrders, setAuthorizedOrders] = useState<
    { orderNo: string; amount: number; empName: string; empCode: string }[]
  >([]);

  // ───────────────────────────────────────────────────────────────────────────
  // ─── TAB 1: ARREAR DETAILS STATE & LOGIC ──────────────────────────────────
  // ───────────────────────────────────────────────────────────────────────────
  const [t1ArrearType, setT1ArrearType] = useState<string | null>(null);
  const [t1EmpCode, setT1EmpCode] = useState('');
  const [t1FromDate, setT1FromDate] = useState<Date | null>(null);
  const [t1ToDate, setT1ToDate] = useState<Date | null>(null);
  const [t1TotalDays, setT1TotalDays] = useState<number | null>(null);
  const [t1Results, setT1Results] = useState<ArrearDetailRow[]>([]);
  const [t1HasSearched, setT1HasSearched] = useState(false);

  // Auto-calculate Total Days when From/To dates change
  useEffect(() => {
    if (t1FromDate && t1ToDate) {
      if (t1FromDate > t1ToDate) {
        setT1TotalDays(0);
        return;
      }
      const diffTime = t1ToDate.getTime() - t1FromDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setT1TotalDays(diffDays);
    } else {
      setT1TotalDays(null);
    }
  }, [t1FromDate, t1ToDate]);

  const handleT1Search = () => {
    if (!t1ArrearType || !t1FromDate || !t1ToDate) {
      ToastService.error('Please fill all required search filters.');
      return;
    }
    if (t1FromDate > t1ToDate) {
      ToastService.error('From Date cannot be later than To Date.');
      return;
    }

    const matchedEmps = employees.filter(emp => {
      const codeMatches =
        !t1EmpCode ||
        emp.code.toLowerCase().includes(t1EmpCode.trim().toLowerCase());
      return codeMatches;
    });

    const calculatedRows: ArrearDetailRow[] = matchedEmps.map(emp => {
      const basic = getEmployeeSalaryDetails(emp.designation);
      // Generate some mock daily rate based on basic salary
      const dailyRate = Math.round(basic / 30);
      const amount = (t1TotalDays || 0) * dailyRate;

      return {
        id: emp.id,
        code: emp.code,
        name: emp.name,
        designation: emp.designation,
        arrearType: t1ArrearType,
        fromDate: t1FromDate.toLocaleDateString('en-GB'),
        toDate: t1ToDate.toLocaleDateString('en-GB'),
        totalDays: t1TotalDays || 0,
        amount,
        status: 'Pending',
      };
    });

    setT1Results(calculatedRows);
    setT1HasSearched(true);
    ToastService.success(
      `Found ${calculatedRows.length} matching employee record(s).`
    );
  };

  const handleT1Clear = () => {
    setT1ArrearType(null);
    setT1EmpCode('');
    setT1FromDate(null);
    setT1ToDate(null);
    setT1TotalDays(null);
    setT1Results([]);
    setT1HasSearched(false);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // ─── TAB 2: DEARNESS ALLOWANCE ARREAR STATE & LOGIC ───────────────────────
  // ───────────────────────────────────────────────────────────────────────────
  const [t2OfficeType, setT2OfficeType] = useState<string | null>(null);
  const [t2OfficeName, setT2OfficeName] = useState<string | null>(null);
  const [t2PostType, setT2PostType] = useState<string | null>(null);
  const [t2PayCommission, setT2PayCommission] = useState<string | null>(null);
  const [t2FromMonth, setT2FromMonth] = useState<Date | null>(null);
  const [t2ToMonth, setT2ToMonth] = useState<Date | null>(null);
  const [t2ProcessMonth, setT2ProcessMonth] = useState<Date | null>(null);
  const [t2SelectEmpId, setT2SelectEmpId] = useState<string | null>('All');
  const [t2OrderNo, setT2OrderNo] = useState('');
  const [t2OrderDate, setT2OrderDate] = useState<Date | null>(null);
  const [t2OrderDetail, setT2OrderDetail] = useState('');
  const [t2PaymentDetail, setT2PaymentDetail] = useState('');

  const [t2Results, setT2Results] = useState<DAArrearRow[]>([]);
  const [t2HasCalculated, setT2HasCalculated] = useState(false);

  const t2AvailableOfficeNames = t2OfficeType
    ? OFFICE_NAMES_MAPPING[t2OfficeType] || []
    : [];

  // Dropdown list for employees matching office type/name/post filters
  const filteredEmployeesList = useMemo(() => {
    const list = employees.filter(emp => {
      const officeTypeMatch = !t2OfficeType || emp.officeType === t2OfficeType;
      const officeNameMatch = !t2OfficeName || emp.officeName === t2OfficeName;
      const postMatch = !t2PostType || emp.postType === t2PostType;
      return officeTypeMatch && officeNameMatch && postMatch;
    });

    return [
      { text: 'All Employees', value: 'All' },
      ...list.map(emp => ({
        text: `${emp.code} - ${emp.name}`,
        value: emp.id,
      })),
    ];
  }, [employees, t2OfficeType, t2OfficeName, t2PostType]);

  const handleT2Calculate = () => {
    if (
      !t2OfficeType ||
      !t2OfficeName ||
      !t2PostType ||
      !t2PayCommission ||
      !t2FromMonth ||
      !t2ToMonth ||
      !t2ProcessMonth ||
      !t2SelectEmpId ||
      !t2OrderNo ||
      !t2OrderDate ||
      !t2OrderDetail ||
      !t2PaymentDetail
    ) {
      ToastService.error('Please enter all mandatory fields.');
      return;
    }

    if (t2FromMonth > t2ToMonth) {
      ToastService.error('From Month cannot be later than To Month.');
      return;
    }

    // Calculate number of months between from month and to month
    const monthsCount =
      (t2ToMonth.getFullYear() - t2FromMonth.getFullYear()) * 12 +
      (t2ToMonth.getMonth() - t2FromMonth.getMonth()) +
      1;

    // Filter employees based on selections
    const matchedEmps = employees.filter(emp => {
      const officeTypeMatch = emp.officeType === t2OfficeType;
      const officeNameMatch = emp.officeName === t2OfficeName;
      const postMatch = emp.postType === t2PostType;
      const empMatch = t2SelectEmpId === 'All' || emp.id === t2SelectEmpId;
      return officeTypeMatch && officeNameMatch && postMatch && empMatch;
    });

    if (matchedEmps.length === 0) {
      setT2Results([]);
      return;
    }

    // Mock DA Rates (Revised = 50%, Existing = 46%, Diff = 4%)
    const existingDaPercent = 46;
    const revisedDaPercent = 50;
    const diffRate = (revisedDaPercent - existingDaPercent) / 100;

    const rows: DAArrearRow[] = matchedEmps.map(emp => {
      const basicPay = getEmployeeSalaryDetails(emp.designation);
      const monthlyDiff = basicPay * diffRate;
      const arrearAmount = Math.round(monthlyDiff * monthsCount);

      return {
        id: emp.id,
        code: emp.code,
        name: emp.name,
        basicPay,
        existingDaPercent,
        revisedDaPercent,
        arrearAmount,
        status: 'Pending',
      };
    });

    setT2Results(rows);
    setT2HasCalculated(true);
    ToastService.success(
      `Calculated DA Arrear for ${rows.length} employee(s).`
    );
  };

  const handleT2Authorize = (id: string) => {
    setT2Results(prev =>
      prev.map(row => {
        if (row.id === id) {
          // Add order details to the shared state to sync with Tab 3
          setAuthorizedOrders(prevOrders => [
            ...prevOrders,
            {
              orderNo: t2OrderNo,
              amount: row.arrearAmount,
              empName: row.name,
              empCode: row.code,
            },
          ]);
          return { ...row, status: 'Authorized' };
        }
        return row;
      })
    );
    ToastService.success('Arrear authorized successfully.');
  };

  const handleT2Clear = () => {
    setT2OfficeType(null);
    setT2OfficeName(null);
    setT2PostType(null);
    setT2PayCommission(null);
    setT2FromMonth(null);
    setT2ToMonth(null);
    setT2ProcessMonth(null);
    setT2SelectEmpId('All');
    setT2OrderNo('');
    setT2OrderDate(null);
    setT2OrderDetail('');
    setT2PaymentDetail('');
    setT2Results([]);
    setT2HasCalculated(false);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // ─── TAB 3: ARREAR PAYMENT PROCESS STATE & LOGIC ──────────────────────────
  // ───────────────────────────────────────────────────────────────────────────
  const [t3Mode, setT3Mode] = useState<'process' | 're-process'>('process');
  const [t3OfficeType, setT3OfficeType] = useState<string | null>(null);
  const [t3OfficeName, setT3OfficeName] = useState<string | null>(null);
  const [t3OrderNo, setT3OrderNo] = useState<string | null>(null);
  const [t3SelectEmpId, setT3SelectEmpId] = useState<string | null>('All');
  const [t3ArrearType, setT3ArrearType] = useState<string | null>(null);
  const [t3PaymentMonth, setT3PaymentMonth] = useState<Date | null>(null);

  const [t3ProcessedHistory, setT3ProcessedHistory] = useState<
    ProcessedPaymentRow[]
  >([]);

  const t3AvailableOfficeNames = t3OfficeType
    ? OFFICE_NAMES_MAPPING[t3OfficeType] || []
    : [];

  // Dropdown list for employees matching Tab 3 office filters
  const t3EmployeesList = useMemo(() => {
    const list = employees.filter(emp => {
      const officeTypeMatch = !t3OfficeType || emp.officeType === t3OfficeType;
      const officeNameMatch = !t3OfficeName || emp.officeName === t3OfficeName;
      return officeTypeMatch && officeNameMatch;
    });

    return [
      { text: 'All Employees', value: 'All' },
      ...list.map(emp => ({
        text: `${emp.code} - ${emp.name}`,
        value: emp.id,
      })),
    ];
  }, [employees, t3OfficeType, t3OfficeName]);

  // Order numbers dropdown: combines newly authorized orders from Tab 2 and fallback mock orders
  const t3OrderList = useMemo(() => {
    const activeOrders = authorizedOrders.map(ord => ({
      text: `${ord.orderNo} (Calculated for ${ord.empName})`,
      value: ord.orderNo,
    }));

    return [
      ...activeOrders,
      { text: 'ORD-2026-001 - Annual DA Hike', value: 'ORD-2026-001' },
      { text: 'ORD-2026-002 - Senior Scale Revision', value: 'ORD-2026-002' },
      {
        text: 'ORD-2026-003 - Constituent Arrear Release',
        value: 'ORD-2026-003',
      },
    ];
  }, [authorizedOrders]);

  const handleT3Process = () => {
    if (
      !t3OfficeType ||
      !t3OfficeName ||
      !t3OrderNo ||
      !t3SelectEmpId ||
      !t3ArrearType ||
      !t3PaymentMonth
    ) {
      ToastService.error('Please enter all mandatory fields.');
      return;
    }

    // Retrieve employees to process
    const processTarget = employees.filter(emp => {
      const officeTypeMatch = emp.officeType === t3OfficeType;
      const officeNameMatch = emp.officeName === t3OfficeName;
      const empMatch = t3SelectEmpId === 'All' || emp.id === t3SelectEmpId;
      return officeTypeMatch && officeNameMatch && empMatch;
    });

    if (processTarget.length === 0) {
      return;
    }

    const formattedPaymentMonth = `${String(t3PaymentMonth.getMonth() + 1).padStart(2, '0')}/${t3PaymentMonth.getFullYear()}`;
    const todayStr = new Date().toLocaleDateString('en-GB');

    const newPayments: ProcessedPaymentRow[] = processTarget.map(emp => {
      // Find if we had an authorized amount in Tab 2 for this employee and order
      const authMatch = authorizedOrders.find(
        ord => ord.orderNo === t3OrderNo && ord.empCode === emp.code
      );
      // Fallback base calculations
      const basic = getEmployeeSalaryDetails(emp.designation);
      const amount = authMatch ? authMatch.amount : Math.round(basic * 0.12);

      return {
        id: `process-${Date.now()}-${emp.id}`,
        code: emp.code,
        name: emp.name,
        arrearType: t3ArrearType,
        orderNumber: t3OrderNo,
        paymentMonth: formattedPaymentMonth,
        processedDate: todayStr,
        amount,
        status: 'Processed',
      };
    });

    setT3ProcessedHistory(prev => [...newPayments, ...prev]);
    ToastService.success(
      `${t3Mode === 'process' ? 'Processed' : 'Re-processed'} arrear payments for ${newPayments.length} staff member(s).`
    );
  };

  const handleT3Clear = () => {
    setT3OfficeType(null);
    setT3OfficeName(null);
    setT3OrderNo(null);
    setT3SelectEmpId('All');
    setT3ArrearType(null);
    setT3PaymentMonth(null);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // ─── TABS CONTENT COMPOSITION ──────────────────────────────────────────────
  // ───────────────────────────────────────────────────────────────────────────
  const tabsList = [
    {
      title: 'Arrear Details',
      content: (
        <div className="flex flex-col gap-6 mt-4">
          <FormCard title="Search Criteria">
            <FormGrid columns={4} className="gap-4 items-end mb-4">
              <DropDownList
                label="Arrear Type"
                data={ARREAR_TYPES}
                textField="text"
                valueField="value"
                value={t1ArrearType}
                onChange={val => setT1ArrearType(val as string)}
                required
                defaultOptionText="Select"
              />

              <TextBox
                label="Employee Code"
                placeholder="Enter Employee Code"
                value={t1EmpCode}
                onChange={val => setT1EmpCode(val as string)}
              />

              <DatePicker
                label="From Date"
                value={t1FromDate || undefined}
                onChange={val => setT1FromDate(val || null)}
                placeholder="dd-mm-yyyy"
                required
              />

              <DatePicker
                label="To Date"
                value={t1ToDate || undefined}
                onChange={val => setT1ToDate(val || null)}
                placeholder="dd-mm-yyyy"
                required
              />
            </FormGrid>

            <FormGrid columns={4} className="gap-4 items-end">
              <TextBox
                label="Total Days"
                placeholder="Total Days"
                value={t1TotalDays !== null ? String(t1TotalDays) : ''}
                readOnly
                disabled
              />
              <div className="col-span-3 flex gap-3 justify-end w-full">
                <Button
                  label="Search"
                  variant="primary"
                  onClick={t1SearchHandler}
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

          {t1HasSearched && (
            <FormCard title="Employee Arrear Ledger Register">
              <GridPanel
                data={t1Results}
                emptyMessage="No arrear records match the search filter."
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
                    header: 'Arrear Type',
                    field: 'arrearType',
                  },
                  {
                    header: 'From Date',
                    field: 'fromDate',
                  },
                  {
                    header: 'To Date',
                    field: 'toDate',
                  },
                  {
                    header: 'Total Days',
                    field: 'totalDays',
                  },
                  {
                    header: 'Arrear Amount',
                    cell: (item: ArrearDetailRow) => (
                      <span className="font-semibold text-slate-800">
                        ₹{item.amount.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Status',
                    cell: (item: ArrearDetailRow) => (
                      <StatusBadge
                        label={item.status}
                        variant={
                          item.status === 'Processed' ? 'approved' : 'pending'
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
    {
      title: 'Dearness Allowance Arrear',
      content: (
        <div className="flex flex-col gap-6 mt-4">
          <FormCard title="Arrear Calculation Criteria">
            <FormGrid columns={4} className="gap-4 items-end mb-4">
              <DropDownList
                label="Office Type (Code)"
                data={OFFICE_TYPES}
                textField="text"
                valueField="value"
                value={t2OfficeType}
                onChange={val => {
                  setT2OfficeType(val as string);
                  setT2OfficeName(null);
                  setT2SelectEmpId('All');
                }}
                required
                defaultOptionText="Select"
              />

              <DropDownList
                label="Office Name (Code)"
                data={t2AvailableOfficeNames}
                textField="text"
                valueField="value"
                value={t2OfficeName}
                onChange={val => setT2OfficeName(val as string)}
                required
                defaultOptionText="Select"
                disabled={!t2OfficeType}
              />

              <DropDownList
                label="Post Type"
                data={POST_TYPES}
                textField="text"
                valueField="value"
                value={t2PostType}
                onChange={val => setT2PostType(val as string)}
                required
                defaultOptionText="Select"
              />

              <DropDownList
                label="Pay Commission"
                data={PAY_COMMISSIONS}
                textField="text"
                valueField="value"
                value={t2PayCommission}
                onChange={val => setT2PayCommission(val as string)}
                required
                defaultOptionText="Select"
              />
            </FormGrid>

            <FormGrid columns={4} className="gap-4 items-end mb-4">
              <DatePicker
                label="From Month"
                value={t2FromMonth || undefined}
                onChange={val => setT2FromMonth(val || null)}
                placeholder="mm/yy"
                view="month"
                dateFormat="mm/yy"
                required
              />

              <DatePicker
                label="To Month"
                value={t2ToMonth || undefined}
                onChange={val => setT2ToMonth(val || null)}
                placeholder="mm/yy"
                view="month"
                dateFormat="mm/yy"
                required
              />

              <DatePicker
                label="Process Payment Month"
                value={t2ProcessMonth || undefined}
                onChange={val => setT2ProcessMonth(val || null)}
                placeholder="mm/yy"
                view="month"
                dateFormat="mm/yy"
                required
              />

              <DropDownList
                label="Select Employee"
                data={filteredEmployeesList}
                textField="text"
                valueField="value"
                value={t2SelectEmpId}
                onChange={val => setT2SelectEmpId(val as string)}
                required
                defaultOptionText="Select"
              />
            </FormGrid>

            <FormGrid columns={4} className="gap-4 items-end mb-4">
              <TextBox
                label="Order Number"
                placeholder="Enter Order Number"
                value={t2OrderNo}
                onChange={val => setT2OrderNo(val as string)}
                required
              />

              <DatePicker
                label="Order Date"
                value={t2OrderDate || undefined}
                onChange={val => setT2OrderDate(val || null)}
                placeholder="dd-mm-yyyy"
                required
              />

              <TextBox
                label="Order Detail"
                placeholder="Enter Order Detail"
                value={t2OrderDetail}
                onChange={val => setT2OrderDetail(val as string)}
                required
              />

              <TextBox
                label="Payment Detail"
                placeholder="Enter Payment Detail"
                value={t2PaymentDetail}
                onChange={val => setT2PaymentDetail(val as string)}
                required
              />
            </FormGrid>

            <FormGrid columns={4} className="gap-4 items-end">
              <div className="col-span-2"></div>
              <div className="col-span-2 flex gap-3 justify-end w-full">
                <Button
                  label="Calculate"
                  variant="primary"
                  onClick={handleT2Calculate}
                />
                <Button
                  label="Clear"
                  variant="outlined"
                  onClick={handleT2Clear}
                />
              </div>
            </FormGrid>

            <div className="text-red-500 text-xs mt-3 font-semibold">
              Note: All Asterisk (*) Marked Fields Are Mandatory
            </div>
          </FormCard>

          {t2HasCalculated && (
            <FormCard title="DA Arrear Calculation Grid">
              <GridPanel
                data={t2Results}
                emptyMessage="No calculations matches the search criteria."
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
                    header: 'Basic Pay',
                    cell: (item: DAArrearRow) => (
                      <span>₹{item.basicPay.toLocaleString()}</span>
                    ),
                  },
                  {
                    header: 'Existing DA %',
                    cell: (item: DAArrearRow) => (
                      <span>{item.existingDaPercent}%</span>
                    ),
                  },
                  {
                    header: 'Revised DA %',
                    cell: (item: DAArrearRow) => (
                      <span>{item.revisedDaPercent}%</span>
                    ),
                  },
                  {
                    header: 'Arrear Amount',
                    cell: (item: DAArrearRow) => (
                      <span className="font-bold text-green-700">
                        ₹{item.arrearAmount.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Status',
                    cell: (item: DAArrearRow) => (
                      <StatusBadge
                        label={item.status}
                        variant={
                          item.status === 'Authorized' ? 'approved' : 'pending'
                        }
                      />
                    ),
                  },
                  {
                    header: 'Action',
                    width: '130px',
                    cell: (item: DAArrearRow) => (
                      <Button
                        label="Authorize"
                        variant="primary"
                        size="small"
                        disabled={item.status === 'Authorized'}
                        onClick={() => handleT2Authorize(item.id)}
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
    {
      title: 'Arrear Payment Process',
      content: (
        <div className="flex flex-col gap-6 mt-4">
          <div className="flex gap-2.5 mb-2 bg-slate-50 p-2 rounded-xl border border-slate-100 max-w-max">
            <button
              onClick={() => setT3Mode('process')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                t3Mode === 'process'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className="pi pi-cog text-2xs" />
              Process
            </button>
            <button
              onClick={() => setT3Mode('re-process')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                t3Mode === 're-process'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className="pi pi-refresh text-2xs" />
              Re-Process
            </button>
          </div>

          <FormCard title="Arrear Payment Process Criteria">
            <FormGrid columns={4} className="gap-4 items-end mb-4">
              <DropDownList
                label="Office Type (Code)"
                data={OFFICE_TYPES}
                textField="text"
                valueField="value"
                value={t3OfficeType}
                onChange={val => {
                  setT3OfficeType(val as string);
                  setT3OfficeName(null);
                  setT3SelectEmpId('All');
                }}
                required
                defaultOptionText="Select"
              />

              <DropDownList
                label="Office Name (Code)"
                data={t3AvailableOfficeNames}
                textField="text"
                valueField="value"
                value={t3OfficeName}
                onChange={val => setT3OfficeName(val as string)}
                required
                defaultOptionText="Select"
                disabled={!t3OfficeType}
              />

              <DropDownList
                label="Order Number"
                data={t3OrderList}
                textField="text"
                valueField="value"
                value={t3OrderNo}
                onChange={val => setT3OrderNo(val as string)}
                required
                defaultOptionText="Select"
              />

              <DropDownList
                label="Select Employee"
                data={t3EmployeesList}
                textField="text"
                valueField="value"
                value={t3SelectEmpId}
                onChange={val => setT3SelectEmpId(val as string)}
                required
                defaultOptionText="Select"
              />
            </FormGrid>

            <FormGrid columns={4} className="gap-4 items-end">
              <DropDownList
                label="Arrear Type"
                data={ARREAR_TYPES}
                textField="text"
                valueField="value"
                value={t3ArrearType}
                onChange={val => setT3ArrearType(val as string)}
                required
                defaultOptionText="Select"
              />

              <DatePicker
                label="Payment Month"
                value={t3PaymentMonth || undefined}
                onChange={val => setT3PaymentMonth(val || null)}
                placeholder="mm/yy"
                view="month"
                dateFormat="mm/yy"
                required
              />

              <div className="col-span-2 flex gap-3 justify-end w-full">
                <Button
                  label={t3Mode === 'process' ? 'Process' : 'Re-Process'}
                  variant="success"
                  onClick={handleT3Process}
                />
                <Button
                  label="Clear"
                  variant="outlined"
                  onClick={handleT3Clear}
                />
              </div>
            </FormGrid>

            <div className="text-red-500 text-xs mt-3 font-semibold">
              Note: All Asterisk (*) Marked Fields Are Mandatory
            </div>
          </FormCard>

          {t3ProcessedHistory.length > 0 && (
            <FormCard title="Processed Payments Ledger Summary">
              <GridPanel
                data={t3ProcessedHistory}
                emptyMessage="No processed history found."
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
                    header: 'Arrear Type',
                    field: 'arrearType',
                  },
                  {
                    header: 'Order Number',
                    field: 'orderNumber',
                  },
                  {
                    header: 'Payment Month',
                    field: 'paymentMonth',
                  },
                  {
                    header: 'Processed Date',
                    field: 'processedDate',
                  },
                  {
                    header: 'Paid Amount',
                    cell: (item: ProcessedPaymentRow) => (
                      <span className="font-bold text-slate-800">
                        ₹{item.amount.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Status',
                    cell: (item: ProcessedPaymentRow) => (
                      <StatusBadge label={item.status} variant="approved" />
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

  // Helper alias to handle click search
  function t1SearchHandler() {
    handleT1Search();
  }

  return (
    <FormPage
      title="Arrear Process"
      description="Manage, calculate, and process employee arrear claims and dearness allowance calculations."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        { label: 'Arrear Process' },
      ]}
    >
      <Tabs tabs={tabsList} />
    </FormPage>
  );
}
