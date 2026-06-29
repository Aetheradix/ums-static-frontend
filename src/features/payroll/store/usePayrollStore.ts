import { create } from 'zustand';

export interface EarningDeductionHead {
  id: string;
  type: 'Earning' | 'Deduction';
  code: string;
  name: string;
  calculationMethod: string;
  effectiveDate: string; // dd/mm/yyyy
  status: boolean; // true = Active (Yes), false = InActive (No)

  // Rule checkboxes
  calculateBetweenRange: boolean;
  impactOnLeave: boolean;
  da: boolean;
  nps: boolean;
  tax: boolean;
  contribution: boolean;

  // Show in Page checkboxes
  salaryHead: boolean;
  optional: boolean;
  monthly: boolean;
  policy: boolean;
  loan: boolean;
}

export interface SalaryHeadValue {
  id: string;
  typeOfPost: string;
  earningDeductionType: 'Earning' | 'Deduction';
  headId: string;
  headName: string;
  calculationMethod: string;
  value: number; // Percentage/Amount value
  orderNumber: string;
  orderDocument: string; // Document filename
  orderDate: string; // dd/mm/yyyy
  effectiveDate: string; // dd/mm/yyyy
  status: boolean; // active

  // Grid/UI only mock fields
  payCommission: string;
  minAmount: number;
  maxAmount: number;
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  officeType: string;
  officeName: string;
  postType: string;
  designationType: string;
  designation: string;
}

export interface EmployeeOptionalMap {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  officeName: string;
  designation: string;
  headId: string;
  headName: string;
  calculationMethod: string;
  effectiveDate: string;
  status: boolean;
}

export interface EmployeeMonthlyMap {
  id: string;
  month: string; // MM/YYYY
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  officeName: string;
  designation: string;
  headId: string;
  headName: string;
  calculationMethod: string;
  status: boolean;
}

export interface InsurancePolicy {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  officeType: string;
  officeName: string;
  policyType: string;
  policyNumber: string;
  policyName: string;
  policyAmount: number;
  premiumFrequency: string;
  startDate: string;
  endDate: string;
  status: boolean;
}

export interface EmployeeLoan {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  officeType: string;
  officeName: string;
  loanHead: string;
  loanAmount: number;
  installmentAmount: number;
  interestDeduction: string;
  interestAmount: number;
  deductionYear: string;
  deductionMonth: string;
  status: boolean;
}

interface PayrollState {
  heads: EarningDeductionHead[];
  salaryHeads: SalaryHeadValue[];
  employees: Employee[];
  optionalMaps: EmployeeOptionalMap[];
  monthlyMaps: EmployeeMonthlyMap[];
  insurancePolicies: InsurancePolicy[];
  loans: EmployeeLoan[];

  addHead: (head: Omit<EarningDeductionHead, 'id'>) => void;
  updateHead: (id: string, head: Partial<EarningDeductionHead>) => void;
  toggleStatus: (id: string) => void;
  deleteHead: (id: string) => void;

  // Salary Head actions
  addSalaryHead: (head: Omit<SalaryHeadValue, 'id'>) => void;
  updateSalaryHead: (id: string, head: Partial<SalaryHeadValue>) => void;
  toggleSalaryHeadStatus: (id: string) => void;
  deleteSalaryHead: (id: string) => void;

  // Optional Head Mapping actions
  mapEmployeesToHead: (
    employeeIds: string[],
    headId: string,
    effectiveDate: string
  ) => void;
  unmapHeadFromEmployee: (mapId: string) => void;

  // Monthly Head Mapping actions
  mapEmployeesToMonthlyHead: (
    employeeIds: string[],
    headId: string,
    month: string
  ) => void;
  unmapMonthlyHeadFromEmployee: (mapId: string) => void;

  // Insurance Policy actions
  addInsurancePolicy: (policy: Omit<InsurancePolicy, 'id'>) => void;
  deleteInsurancePolicy: (id: string) => void;

  // Loan actions
  addLoan: (loan: Omit<EmployeeLoan, 'id'>) => void;
  deleteLoan: (id: string) => void;
}

const INITIAL_HEADS: EarningDeductionHead[] = [
  {
    id: '1',
    type: 'Earning',
    code: '03',
    name: 'CONVEYANCE ALLOWANCE',
    calculationMethod: 'Amount(Rs)',
    effectiveDate: '01/10/2024',
    status: true,
    calculateBetweenRange: false,
    impactOnLeave: false,
    da: false,
    nps: false,
    tax: false,
    contribution: false,
    salaryHead: true,
    optional: false,
    monthly: true,
    policy: false,
    loan: false,
  },
  {
    id: '2',
    type: 'Earning',
    code: '01',
    name: 'DEARNESS ALLOWANCE',
    calculationMethod: 'Percentage(%) (Basic)',
    effectiveDate: '01/10/2024',
    status: true,
    calculateBetweenRange: false,
    impactOnLeave: false,
    da: true,
    nps: false,
    tax: false,
    contribution: false,
    salaryHead: true,
    optional: false,
    monthly: true,
    policy: false,
    loan: false,
  },
  {
    id: '3',
    type: 'Earning',
    code: '25',
    name: 'Handicap Allowance',
    calculationMethod: 'Amount(Rs)',
    effectiveDate: '09/02/2025',
    status: true,
    calculateBetweenRange: false,
    impactOnLeave: false,
    da: false,
    nps: false,
    tax: false,
    contribution: false,
    salaryHead: true,
    optional: false,
    monthly: true,
    policy: false,
    loan: false,
  },
  {
    id: '4',
    type: 'Earning',
    code: '02',
    name: 'HOUSE RENT ALLOWANCE',
    calculationMethod: 'Percentage(%) (Basic)',
    effectiveDate: '01/10/2024',
    status: true,
    calculateBetweenRange: false,
    impactOnLeave: false,
    da: false,
    nps: false,
    tax: false,
    contribution: false,
    salaryHead: true,
    optional: false,
    monthly: true,
    policy: false,
    loan: false,
  },
  {
    id: '5',
    type: 'Earning',
    code: '05',
    name: 'OTHER ALLOWANCE',
    calculationMethod: 'Amount(Rs)',
    effectiveDate: '01/10/2024',
    status: true,
    calculateBetweenRange: false,
    impactOnLeave: false,
    da: false,
    nps: false,
    tax: false,
    contribution: false,
    salaryHead: true,
    optional: false,
    monthly: true,
    policy: false,
    loan: false,
  },
  {
    id: '6',
    type: 'Earning',
    code: '04',
    name: 'WASHING ALLOWANCE',
    calculationMethod: 'Amount(Rs)',
    effectiveDate: '01/10/2024',
    status: true,
    calculateBetweenRange: false,
    impactOnLeave: false,
    da: false,
    nps: false,
    tax: false,
    contribution: false,
    salaryHead: true,
    optional: false,
    monthly: true,
    policy: false,
    loan: false,
  },
  {
    id: '7',
    type: 'Deduction',
    code: '0100',
    name: 'DPF',
    calculationMethod: 'Amount(Rs)',
    effectiveDate: '03/04/2025',
    status: true,
    calculateBetweenRange: false,
    impactOnLeave: false,
    da: false,
    nps: false,
    tax: false,
    contribution: false,
    salaryHead: true,
    optional: false,
    monthly: true,
    policy: false,
    loan: false,
  },
  {
    id: '8',
    type: 'Deduction',
    code: '14',
    name: 'FESTIVAL ADVANCE',
    calculationMethod: 'Loan',
    effectiveDate: '01/10/2024',
    status: true,
    calculateBetweenRange: false,
    impactOnLeave: false,
    da: false,
    nps: false,
    tax: false,
    contribution: false,
    salaryHead: false,
    optional: false,
    monthly: false,
    policy: false,
    loan: true,
  },
  {
    id: '9',
    type: 'Deduction',
    code: '08',
    name: 'GIS',
    calculationMethod: 'Amount(Rs)',
    effectiveDate: '01/10/2024',
    status: true,
    calculateBetweenRange: false,
    impactOnLeave: false,
    da: false,
    nps: false,
    tax: false,
    contribution: false,
    salaryHead: true,
    optional: false,
    monthly: true,
    policy: false,
    loan: false,
  },
  {
    id: '10',
    type: 'Deduction',
    code: '06',
    name: 'GPF',
    calculationMethod: 'Amount(Rs)',
    effectiveDate: '01/10/2024',
    status: true,
    calculateBetweenRange: false,
    impactOnLeave: false,
    da: false,
    nps: false,
    tax: false,
    contribution: false,
    salaryHead: true,
    optional: false,
    monthly: true,
    policy: false,
    loan: false,
  },
];

const INITIAL_SALARY_HEADS: SalaryHeadValue[] = [
  {
    id: 'sh-1',
    typeOfPost: 'Regular/Permanent',
    earningDeductionType: 'Earning',
    headId: '2',
    headName: 'DEARNESS ALLOWANCE',
    calculationMethod: 'Percentage(%) (Basic)',
    value: 50.0,
    orderNumber: '1',
    orderDocument: 'order_dearness_2025.pdf',
    orderDate: '27/09/2025',
    effectiveDate: '27/09/2025',
    status: true,
    payCommission: 'Sixth Pay Commission',
    minAmount: 0.0,
    maxAmount: 0.0,
  },
  {
    id: 'sh-2',
    typeOfPost: 'Regular/Permanent',
    earningDeductionType: 'Earning',
    headId: '2',
    headName: 'DEARNESS ALLOWANCE',
    calculationMethod: 'Percentage(%) (Basic)',
    value: 55.0,
    orderNumber: '1236456',
    orderDocument: 'order_da_7th_commission.pdf',
    orderDate: '01/07/2025',
    effectiveDate: '01/07/2025',
    status: true,
    payCommission: 'Seventh Pay Commission',
    minAmount: 0.0,
    maxAmount: 0.0,
  },
  {
    id: 'sh-3',
    typeOfPost: 'Regular/Permanent',
    earningDeductionType: 'Earning',
    headId: '2',
    headName: 'DEARNESS ALLOWANCE',
    calculationMethod: 'Percentage(%) (Basic)',
    value: 11.0,
    orderNumber: '13213',
    orderDocument: 'order_da_5th.pdf',
    orderDate: '24/04/2025',
    effectiveDate: '01/05/2025',
    status: true,
    payCommission: 'Fifth Pay Commission',
    minAmount: 0.0,
    maxAmount: 0.0,
  },
];

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    code: 'EMP001',
    name: 'Rajesh Sharma',
    officeType: 'University Head Office',
    officeName: 'Main Campus (Admin Block)',
    postType: 'Regular/Permanent',
    designationType: 'Teaching',
    designation: 'Professor',
  },
  {
    id: 'emp-2',
    code: 'EMP002',
    name: 'Sunita Verma',
    officeType: 'University Head Office',
    officeName: 'Main Campus (Admin Block)',
    postType: 'Regular/Permanent',
    designationType: 'Non-Teaching',
    designation: 'Registrar',
  },
  {
    id: 'emp-3',
    code: 'EMP003',
    name: 'Vijay Patel',
    officeType: 'Constituent College',
    officeName: 'School of Engineering & Technology',
    postType: 'Regular/Permanent',
    designationType: 'Teaching',
    designation: 'Assistant Professor',
  },
  {
    id: 'emp-4',
    code: 'EMP004',
    name: 'Anil Gupta',
    officeType: 'Regional Centre',
    officeName: 'School of Sciences',
    postType: 'Contractual',
    designationType: 'Teaching',
    designation: 'Associate Professor',
  },
];

const INITIAL_OPTIONAL_MAPS: EmployeeOptionalMap[] = [
  {
    id: 'map-1',
    employeeId: 'emp-1',
    employeeCode: 'EMP001',
    employeeName: 'Rajesh Sharma',
    officeName: 'Main Campus (Admin Block)',
    designation: 'Professor',
    headId: '1',
    headName: 'CONVEYANCE ALLOWANCE',
    calculationMethod: 'Amount(Rs)',
    effectiveDate: '26/06/2026',
    status: true,
  },
  {
    id: 'map-2',
    employeeId: 'emp-3',
    employeeCode: 'EMP003',
    employeeName: 'Vijay Patel',
    officeName: 'School of Engineering & Technology',
    designation: 'Assistant Professor',
    headId: '3',
    headName: 'Handicap Allowance',
    calculationMethod: 'Amount(Rs)',
    effectiveDate: '09/02/2025',
    status: true,
  },
];

const INITIAL_MONTHLY_MAPS: EmployeeMonthlyMap[] = [
  {
    id: 'mmap-1',
    month: '06/2026',
    employeeId: 'emp-1',
    employeeCode: 'EMP001',
    employeeName: 'Rajesh Sharma',
    officeName: 'Main Campus (Admin Block)',
    designation: 'Professor',
    headId: '2',
    headName: 'DEARNESS ALLOWANCE',
    calculationMethod: 'Percentage(%) (Basic)',
    status: true,
  },
  {
    id: 'mmap-2',
    month: '06/2026',
    employeeId: 'emp-2',
    employeeCode: 'EMP002',
    employeeName: 'Sunita Verma',
    officeName: 'Main Campus (Admin Block)',
    designation: 'Registrar',
    headId: '5',
    headName: 'OTHER ALLOWANCE',
    calculationMethod: 'Amount(Rs)',
    status: true,
  },
];

const INITIAL_INSURANCE_POLICIES: InsurancePolicy[] = [
  {
    id: 'policy-1',
    employeeId: 'emp-1',
    employeeCode: 'EMP001',
    employeeName: 'Rajesh Sharma',
    officeType: 'University Head Office',
    officeName: 'Main Campus (Admin Block)',
    policyType: 'LIC',
    policyNumber: 'LIC1234567',
    policyName: 'Jeevan Anand',
    policyAmount: 500000,
    premiumFrequency: 'Monthly',
    startDate: '01/01/2025',
    endDate: '01/01/2035',
    status: true,
  },
  {
    id: 'policy-2',
    employeeId: 'emp-2',
    employeeCode: 'EMP002',
    employeeName: 'Sunita Verma',
    officeType: 'University Head Office',
    officeName: 'Main Campus (Admin Block)',
    policyType: 'GSLI',
    policyNumber: 'GSLI987654',
    policyName: 'Group Savings',
    policyAmount: 200000,
    premiumFrequency: 'Quarterly',
    startDate: '15/03/2025',
    endDate: '15/03/2045',
    status: true,
  },
];

const INITIAL_LOANS: EmployeeLoan[] = [
  {
    id: 'loan-1',
    employeeId: 'emp-1',
    employeeCode: 'EMP001',
    employeeName: 'Rajesh Sharma',
    officeType: 'University Head Office',
    officeName: 'Main Campus (Admin Block)',
    loanHead: 'Festival Advance',
    loanAmount: 10000,
    installmentAmount: 1000,
    interestDeduction: 'Monthly',
    interestAmount: 0,
    deductionYear: '2026',
    deductionMonth: 'January',
    status: true,
  },
];

export const usePayrollStore = create<PayrollState>(set => ({
  heads: INITIAL_HEADS,
  salaryHeads: INITIAL_SALARY_HEADS,
  employees: MOCK_EMPLOYEES,
  optionalMaps: INITIAL_OPTIONAL_MAPS,
  monthlyMaps: INITIAL_MONTHLY_MAPS,
  insurancePolicies: INITIAL_INSURANCE_POLICIES,
  loans: INITIAL_LOANS,

  addHead: head =>
    set(state => ({
      heads: [
        ...state.heads,
        {
          ...head,
          id: `head-${Date.now()}`,
        },
      ],
    })),
  updateHead: (id, updatedFields) =>
    set(state => ({
      heads: state.heads.map(h =>
        h.id === id ? { ...h, ...updatedFields } : h
      ),
    })),
  toggleStatus: id =>
    set(state => ({
      heads: state.heads.map(h =>
        h.id === id ? { ...h, status: !h.status } : h
      ),
    })),
  deleteHead: id =>
    set(state => ({
      heads: state.heads.filter(h => h.id !== id),
    })),

  addSalaryHead: head =>
    set(state => ({
      salaryHeads: [
        ...state.salaryHeads,
        {
          ...head,
          id: `sh-${Date.now()}`,
        },
      ],
    })),
  updateSalaryHead: (id, updatedFields) =>
    set(state => ({
      salaryHeads: state.salaryHeads.map(sh =>
        sh.id === id ? { ...sh, ...updatedFields } : sh
      ),
    })),
  toggleSalaryHeadStatus: id =>
    set(state => ({
      salaryHeads: state.salaryHeads.map(sh =>
        sh.id === id ? { ...sh, status: !sh.status } : sh
      ),
    })),
  deleteSalaryHead: id =>
    set(state => ({
      salaryHeads: state.salaryHeads.filter(sh => sh.id !== id),
    })),

  mapEmployeesToHead: (employeeIds, headId, effectiveDate) =>
    set(state => {
      const head = state.heads.find(h => h.id === headId);
      if (!head) return {};

      const newMaps: EmployeeOptionalMap[] = [];
      employeeIds.forEach(empId => {
        const emp = state.employees.find(e => e.id === empId);
        if (!emp) return;

        // Avoid duplication
        const exists = state.optionalMaps.some(
          m => m.employeeId === empId && m.headId === headId
        );
        if (exists) return;

        newMaps.push({
          id: `map-${Date.now()}-${empId}`,
          employeeId: emp.id,
          employeeCode: emp.code,
          employeeName: emp.name,
          officeName: emp.officeName,
          designation: emp.designation,
          headId: head.id,
          headName: head.name,
          calculationMethod: head.calculationMethod,
          effectiveDate,
          status: true,
        });
      });

      return {
        optionalMaps: [...state.optionalMaps, ...newMaps],
      };
    }),

  unmapHeadFromEmployee: mapId =>
    set(state => ({
      optionalMaps: state.optionalMaps.filter(m => m.id !== mapId),
    })),

  mapEmployeesToMonthlyHead: (employeeIds, headId, month) =>
    set(state => {
      const head = state.heads.find(h => h.id === headId);
      if (!head) return {};

      const newMaps: EmployeeMonthlyMap[] = [];
      employeeIds.forEach(empId => {
        const emp = state.employees.find(e => e.id === empId);
        if (!emp) return;

        // Avoid duplication
        const exists = state.monthlyMaps.some(
          m =>
            m.employeeId === empId && m.headId === headId && m.month === month
        );
        if (exists) return;

        newMaps.push({
          id: `mmap-${Date.now()}-${empId}`,
          month,
          employeeId: emp.id,
          employeeCode: emp.code,
          employeeName: emp.name,
          officeName: emp.officeName,
          designation: emp.designation,
          headId: head.id,
          headName: head.name,
          calculationMethod: head.calculationMethod,
          status: true,
        });
      });

      return {
        monthlyMaps: [...state.monthlyMaps, ...newMaps],
      };
    }),

  unmapMonthlyHeadFromEmployee: mapId =>
    set(state => ({
      monthlyMaps: state.monthlyMaps.filter(m => m.id !== mapId),
    })),

  addInsurancePolicy: policy =>
    set(state => ({
      insurancePolicies: [
        ...state.insurancePolicies,
        {
          ...policy,
          id: `policy-${Date.now()}`,
        },
      ],
    })),
  deleteInsurancePolicy: id =>
    set(state => ({
      insurancePolicies: state.insurancePolicies.filter(p => p.id !== id),
    })),

  addLoan: loan =>
    set(state => ({
      loans: [
        ...state.loans,
        {
          ...loan,
          id: `loan-${Date.now()}`,
        },
      ],
    })),
  deleteLoan: id =>
    set(state => ({
      loans: state.loans.filter(l => l.id !== id),
    })),
}));
