import { create } from 'zustand';

// Types & Interfaces
export interface AcademicSession {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

export interface College {
  id: string;
  name: string;
  code: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
}

export interface Program {
  id: string;
  name: string;
  code: string;
}

export interface Semester {
  id: string;
  name: string;
}

export interface CollegeCourseMapping {
  id: string;
  collegeId: string;
  courseIds: string[];
}

export interface FeeHead {
  id: string;
  name: string;
  category: string;
  frequency: 'Annual' | 'Semester-wise' | 'One-time' | 'Monthly';
}

export interface FeeHeadAmount {
  feeHeadId: string;
  amount: number;
}

export interface FeeStructure {
  id: string;
  academicSessionId: string;
  courseId: string;
  semesterId: string;
  category: string;
  heads: FeeHeadAmount[];
  totalAmount: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Published';
}

export interface Student {
  id: string;
  name: string;
  enrollmentNumber: string;
  collegeId: string;
  courseId: string;
  semesterId: string;
  category: string;
}

export interface StudentDemand {
  id: string;
  studentId: string;
  academicSessionId: string;
  semesterId: string;
  totalFee: number;
  scholarshipAmount: number;
  concessionAmount: number;
  payableAmount: number;
  dueDate: string;
  status: 'Unpaid' | 'Paid';
}

export interface Scholarship {
  id: string;
  studentId: string;
  schemeName: string;
  applicationNo: string;
  amount: number;
  status: 'Pending' | 'Verified' | 'Approved' | 'Adjusted';
  documents: string[];
}

export interface Concession {
  id: string;
  studentId: string;
  category: string;
  reason: string;
  percentage: number; // e.g. 10
  status: 'Pending' | 'Verified' | 'Approved' | 'Adjusted';
  documents: string[];
}

export interface PaymentReceipt {
  id: string;
  demandId: string;
  receiptNumber: string;
  studentId: string;
  academicYear: string;
  courseId: string;
  semesterId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMode: string;
  transactionReference: string;
}

export interface FailedTransaction {
  id: string;
  studentId: string;
  amount: number;
  paymentMode: string;
  gatewayFailureDetails: string;
  status: 'Failed' | 'Pending' | 'Resolved';
  transactionDate: string;
  refNo: string;
}

export interface Refund {
  id: string;
  studentId: string;
  paymentId: string;
  amount: number;
  reason:
    | 'Admission Cancellation'
    | 'Duplicate Payment'
    | 'Excess Payment'
    | 'Course Withdrawal';
  status: 'Requested' | 'Verified' | 'Approved' | 'Processed' | 'Completed';
  requestDate: string;
  documents: string[];
}

export interface BankStatementRow {
  id: string;
  transactionDate: string;
  description: string;
  refNo: string;
  creditAmount: number;
  status: 'Unmatched' | 'Matched' | 'Exception';
}

interface FeeState {
  // Master Collections
  sessions: AcademicSession[];
  colleges: College[];
  courses: Course[];
  programs: Program[];
  semesters: Semester[];
  collegeMappings: CollegeCourseMapping[];
  feeHeads: FeeHead[];

  // Transaction Collections
  feeStructures: FeeStructure[];
  students: Student[];
  demands: StudentDemand[];
  scholarships: Scholarship[];
  concessions: Concession[];
  receipts: PaymentReceipt[];
  failedTransactions: FailedTransaction[];
  refunds: Refund[];
  bankStatements: BankStatementRow[];

  // Master Actions
  addSession: (session: Omit<AcademicSession, 'id'>) => void;
  updateSession: (
    id: string,
    name: string,
    status: 'Active' | 'Inactive'
  ) => void;
  addCollegeMapping: (mapping: Omit<CollegeCourseMapping, 'id'>) => void;
  updateCollegeMapping: (
    id: string,
    mapping: Omit<CollegeCourseMapping, 'id'>
  ) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, name: string, code: string) => void;
  addProgram: (program: Omit<Program, 'id'>) => void;
  updateProgram: (id: string, name: string, code: string) => void;
  addSemester: (semester: Omit<Semester, 'id'>) => void;
  updateSemester: (id: string, name: string) => void;
  addFeeHead: (feeHead: Omit<FeeHead, 'id'>) => void;
  updateFeeHead: (id: string, feeHead: Omit<FeeHead, 'id'>) => void;

  // Transaction Actions
  addFeeStructure: (
    structure: Omit<FeeStructure, 'id' | 'totalAmount'>
  ) => void;
  updateFeeStructure: (id: string, structure: Partial<FeeStructure>) => void;
  approveFeeStructure: (
    id: string,
    nextStatus: 'Submitted' | 'Approved' | 'Published'
  ) => void;

  generateDemand: (
    studentId: string,
    sessionId: string,
    semesterId: string
  ) => void;
  bulkGenerateDemands: (
    courseId: string,
    semesterId: string,
    sessionId: string
  ) => void;
  approveDemand: (demandId: string) => void;

  addScholarship: (scholarship: Omit<Scholarship, 'id' | 'status'>) => void;
  updateScholarshipStatus: (
    id: string,
    status: 'Verified' | 'Approved' | 'Adjusted'
  ) => void;

  addConcession: (concession: Omit<Concession, 'id' | 'status'>) => void;
  updateConcessionStatus: (
    id: string,
    status: 'Verified' | 'Approved' | 'Adjusted'
  ) => void;

  recordCollection: (collection: {
    demandId: string;
    paymentMode: string;
    transactionReference: string;
    amountPaid: number;
  }) => void;

  recordFailedTransaction: (
    failed: Omit<FailedTransaction, 'id' | 'status' | 'transactionDate'>
  ) => void;
  reconcileFailedTransaction: (id: string) => void;

  addRefundRequest: (
    refund: Omit<Refund, 'id' | 'status' | 'requestDate'>
  ) => void;
  updateRefundStatus: (id: string, status: Refund['status']) => void;

  uploadBankStatement: (rows: BankStatementRow[]) => void;
  reconcileTransaction: (statementId: string, receiptId: string) => void;
  autoReconcile: () => void;
}

export const useFeeStore = create<FeeState>(set => ({
  // 1. Initial Masters
  sessions: [
    { id: 'sess-1', name: '2024-25', status: 'Active' },
    { id: 'sess-2', name: '2023-24', status: 'Inactive' },
  ],
  colleges: [
    { id: 'coll-1', name: 'School of Engineering', code: 'SOE' },
    { id: 'coll-2', name: 'School of Business', code: 'SOB' },
    { id: 'coll-3', name: 'School of Medicine', code: 'SOM' },
  ],
  courses: [
    { id: 'cour-1', name: 'B.Tech Computer Science', code: 'BT-CSE' },
    { id: 'cour-2', name: 'Master of Business Administration', code: 'MBA' },
    { id: 'cour-3', name: 'Bachelor of Medicine & Surgery', code: 'MBBS' },
  ],
  programs: [
    { id: 'prog-1', name: 'Undergraduate Program', code: 'UG' },
    { id: 'prog-2', name: 'Postgraduate Program', code: 'PG' },
  ],
  semesters: [
    { id: 'sem-1', name: 'Semester I' },
    { id: 'sem-2', name: 'Semester II' },
    { id: 'sem-3', name: 'Semester III' },
    { id: 'sem-4', name: 'Semester IV' },
  ],
  collegeMappings: [
    { id: 'map-1', collegeId: 'coll-1', courseIds: ['cour-1'] },
    { id: 'map-2', collegeId: 'coll-2', courseIds: ['cour-2'] },
    { id: 'map-3', collegeId: 'coll-3', courseIds: ['cour-3'] },
  ],
  feeHeads: [
    {
      id: 'head-1',
      name: 'Tuition Fee',
      category: 'Academic',
      frequency: 'Semester-wise',
    },
    {
      id: 'head-2',
      name: 'Admission Fee',
      category: 'One-time',
      frequency: 'One-time',
    },
    {
      id: 'head-3',
      name: 'Examination Fee',
      category: 'Academic',
      frequency: 'Semester-wise',
    },
    {
      id: 'head-4',
      name: 'Library Fee',
      category: 'Facility',
      frequency: 'Annual',
    },
    {
      id: 'head-5',
      name: 'Laboratory Fee',
      category: 'Facility',
      frequency: 'Semester-wise',
    },
    {
      id: 'head-6',
      name: 'Hostel Fee',
      category: 'Hostel',
      frequency: 'Semester-wise',
    },
    {
      id: 'head-7',
      name: 'Transport Fee',
      category: 'Transport',
      frequency: 'Monthly',
    },
  ],

  // 2. Initial Transactions
  feeStructures: [
    {
      id: 'struct-1',
      academicSessionId: 'sess-1',
      courseId: 'cour-1',
      semesterId: 'sem-1',
      category: 'General',
      heads: [
        { feeHeadId: 'head-1', amount: 60000 },
        { feeHeadId: 'head-2', amount: 15000 },
        { feeHeadId: 'head-3', amount: 5000 },
        { feeHeadId: 'head-4', amount: 4000 },
      ],
      totalAmount: 84000,
      status: 'Published',
    },
    {
      id: 'struct-2',
      academicSessionId: 'sess-1',
      courseId: 'cour-2',
      semesterId: 'sem-1',
      category: 'General',
      heads: [
        { feeHeadId: 'head-1', amount: 95000 },
        { feeHeadId: 'head-2', amount: 20000 },
        { feeHeadId: 'head-3', amount: 6000 },
      ],
      totalAmount: 121000,
      status: 'Submitted',
    },
  ],
  students: [
    {
      id: 'stud-1',
      name: 'Aarav Sharma',
      enrollmentNumber: 'EN241001',
      collegeId: 'coll-1',
      courseId: 'cour-1',
      semesterId: 'sem-1',
      category: 'General',
    },
    {
      id: 'stud-2',
      name: 'Ishan Patel',
      enrollmentNumber: 'EN241002',
      collegeId: 'coll-2',
      courseId: 'cour-2',
      semesterId: 'sem-1',
      category: 'General',
    },
    {
      id: 'stud-3',
      name: 'Priya Verma',
      enrollmentNumber: 'EN241003',
      collegeId: 'coll-1',
      courseId: 'cour-1',
      semesterId: 'sem-1',
      category: 'General',
    },
    {
      id: 'stud-4',
      name: 'Ananya Roy',
      enrollmentNumber: 'EN241004',
      collegeId: 'coll-3',
      courseId: 'cour-3',
      semesterId: 'sem-1',
      category: 'General',
    },
  ],
  demands: [
    {
      id: 'dem-1',
      studentId: 'stud-1',
      academicSessionId: 'sess-1',
      semesterId: 'sem-1',
      totalFee: 84000,
      scholarshipAmount: 15000,
      concessionAmount: 5000,
      payableAmount: 64000,
      dueDate: '2026-09-15',
      status: 'Unpaid',
    },
    {
      id: 'dem-2',
      studentId: 'stud-2',
      academicSessionId: 'sess-1',
      semesterId: 'sem-1',
      totalFee: 121000,
      scholarshipAmount: 0,
      concessionAmount: 10000,
      payableAmount: 111000,
      dueDate: '2026-09-20',
      status: 'Paid',
    },
  ],
  scholarships: [
    {
      id: 'schol-1',
      studentId: 'stud-1',
      schemeName: 'Merit-Cum-Means Scholarship',
      applicationNo: 'SCH-2026-9092',
      amount: 15000,
      status: 'Adjusted',
      documents: ['merit_scores.pdf', 'income_certificate.pdf'],
    },
    {
      id: 'schol-2',
      studentId: 'stud-3',
      schemeName: 'State Post-Matric Scholarship',
      applicationNo: 'SCH-2026-1182',
      amount: 25000,
      status: 'Pending',
      documents: ['caste_certificate.pdf', 'college_bonafide.pdf'],
    },
  ],
  concessions: [
    {
      id: 'conc-1',
      studentId: 'stud-1',
      category: 'Sports Quota Concession',
      reason: 'National level gold medalist in Swimming',
      percentage: 10,
      status: 'Adjusted',
      documents: ['sports_certificate.pdf'],
    },
    {
      id: 'conc-2',
      studentId: 'stud-2',
      category: 'Sibling discount',
      reason: 'Elder brother studying in B.Tech CSE',
      percentage: 8,
      status: 'Approved',
      documents: ['sibling_fee_receipt.pdf'],
    },
  ],
  receipts: [
    {
      id: 'rec-1',
      demandId: 'dem-2',
      receiptNumber: 'REC-2026-00912',
      studentId: 'stud-2',
      academicYear: '2024-25',
      courseId: 'cour-2',
      semesterId: 'sem-1',
      amountPaid: 111000,
      paymentDate: '2026-06-20',
      paymentMode: 'Net Banking',
      transactionReference: 'TXN8829102910',
    },
  ],
  failedTransactions: [
    {
      id: 'fail-1',
      studentId: 'stud-3',
      amount: 84000,
      paymentMode: 'UPI',
      gatewayFailureDetails: 'PAYMENT_GATEWAY_TIMEOUT (NPCI Response delayed)',
      status: 'Failed',
      transactionDate: '2026-06-24',
      refNo: 'TXN8820001827',
    },
  ],
  refunds: [
    {
      id: 'refu-1',
      studentId: 'stud-2',
      paymentId: 'rec-1',
      amount: 10000,
      reason: 'Excess Payment',
      status: 'Requested',
      requestDate: '2026-06-22',
      documents: ['revised_fee_concession.pdf'],
    },
  ],
  bankStatements: [
    {
      id: 'stmt-1',
      transactionDate: '2026-06-20',
      description: 'ONLINE SETTLEMENT CC PG - REC-2026-00912',
      refNo: 'TXN8829102910',
      creditAmount: 111000,
      status: 'Matched',
    },
    {
      id: 'stmt-2',
      transactionDate: '2026-06-24',
      description: 'IMPS/UPI-AARAV SHARMA-DEMAND-1',
      refNo: 'TXN9928182718',
      creditAmount: 64000,
      status: 'Unmatched',
    },
  ],

  // 3. Actions Implementations
  // Sessions
  addSession: session =>
    set(state => ({
      sessions: [...state.sessions, { id: `sess-${Date.now()}`, ...session }],
    })),
  updateSession: (id, name, status) =>
    set(state => ({
      sessions: state.sessions.map(s =>
        s.id === id ? { ...s, name, status } : s
      ),
    })),

  // College Course Mappings
  addCollegeMapping: mapping =>
    set(state => ({
      collegeMappings: [
        ...state.collegeMappings,
        { id: `map-${Date.now()}`, ...mapping },
      ],
    })),
  updateCollegeMapping: (id, mapping) =>
    set(state => ({
      collegeMappings: state.collegeMappings.map(m =>
        m.id === id ? { ...m, ...mapping } : m
      ),
    })),

  // Courses
  addCourse: course =>
    set(state => ({
      courses: [...state.courses, { id: `cour-${Date.now()}`, ...course }],
    })),
  updateCourse: (id, name, code) =>
    set(state => ({
      courses: state.courses.map(c => (c.id === id ? { ...c, name, code } : c)),
    })),

  // Programs
  addProgram: program =>
    set(state => ({
      programs: [...state.programs, { id: `prog-${Date.now()}`, ...program }],
    })),
  updateProgram: (id, name, code) =>
    set(state => ({
      programs: state.programs.map(p =>
        p.id === id ? { ...p, name, code } : p
      ),
    })),

  // Semesters
  addSemester: semester =>
    set(state => ({
      semesters: [...state.semesters, { id: `sem-${Date.now()}`, ...semester }],
    })),
  updateSemester: (id, name) =>
    set(state => ({
      semesters: state.semesters.map(s => (s.id === id ? { ...s, name } : s)),
    })),

  // Fee Heads
  addFeeHead: feeHead =>
    set(state => ({
      feeHeads: [...state.feeHeads, { id: `head-${Date.now()}`, ...feeHead }],
    })),
  updateFeeHead: (id, feeHead) =>
    set(state => ({
      feeHeads: state.feeHeads.map(f =>
        f.id === id ? { ...f, ...feeHead } : f
      ),
    })),

  // Fee Structures
  addFeeStructure: structure =>
    set(state => {
      const totalAmount = structure.heads.reduce(
        (sum, h) => sum + Number(h.amount),
        0
      );
      return {
        feeStructures: [
          ...state.feeStructures,
          { id: `struct-${Date.now()}`, ...structure, totalAmount },
        ],
      };
    }),
  updateFeeStructure: (id, updatedFields) =>
    set(state => ({
      feeStructures: state.feeStructures.map(s => {
        if (s.id === id) {
          const merged = { ...s, ...updatedFields };
          if (updatedFields.heads) {
            merged.totalAmount = updatedFields.heads.reduce(
              (sum, h) => sum + Number(h.amount),
              0
            );
          }
          return merged;
        }
        return s;
      }),
    })),
  approveFeeStructure: (id, nextStatus) =>
    set(state => ({
      feeStructures: state.feeStructures.map(s =>
        s.id === id ? { ...s, status: nextStatus } : s
      ),
    })),

  // Student Fee Demands
  generateDemand: (studentId, sessionId, semesterId) =>
    set(state => {
      const student = state.students.find(st => st.id === studentId);
      if (!student) return {};

      // Find matching Fee Structure
      const structure = state.feeStructures.find(
        s =>
          s.academicSessionId === sessionId &&
          s.courseId === student.courseId &&
          s.semesterId === semesterId
      );
      const totalFee = structure ? structure.totalAmount : 60000; // fallback default

      // Check if scholarship and concession exist for this student and update demand
      const matchingScholarship = state.scholarships.find(
        sc =>
          sc.studentId === studentId &&
          (sc.status === 'Approved' || sc.status === 'Adjusted')
      );
      const matchingConcession = state.concessions.find(
        c =>
          c.studentId === studentId &&
          (c.status === 'Approved' || c.status === 'Adjusted')
      );

      const scholarshipAmount = matchingScholarship
        ? matchingScholarship.amount
        : 0;

      let concessionAmount = 0;
      if (matchingConcession) {
        concessionAmount = Math.round(
          (totalFee * matchingConcession.percentage) / 100
        );
      }

      const payableAmount = totalFee - scholarshipAmount - concessionAmount;

      // Check if demand already exists
      const existingDemand = state.demands.find(
        d => d.studentId === studentId && d.semesterId === semesterId
      );
      if (existingDemand) {
        return {
          demands: state.demands.map(d =>
            d.id === existingDemand.id
              ? {
                  ...d,
                  totalFee,
                  scholarshipAmount,
                  concessionAmount,
                  payableAmount,
                }
              : d
          ),
        };
      }

      const newDemand: StudentDemand = {
        id: `dem-${Date.now()}`,
        studentId,
        academicSessionId: sessionId,
        semesterId,
        totalFee,
        scholarshipAmount,
        concessionAmount,
        payableAmount,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 30 days out
        status: 'Unpaid',
      };

      return {
        demands: [...state.demands, newDemand],
      };
    }),

  bulkGenerateDemands: (courseId, semesterId, sessionId) =>
    set(state => {
      const relevantStudents = state.students.filter(
        st => st.courseId === courseId && st.semesterId === semesterId
      );
      const currentDemands = [...state.demands];

      const structure = state.feeStructures.find(
        s =>
          s.academicSessionId === sessionId &&
          s.courseId === courseId &&
          s.semesterId === semesterId
      );
      const totalFee = structure ? structure.totalAmount : 75000;

      relevantStudents.forEach(student => {
        // check duplicates
        const exists = currentDemands.some(
          d => d.studentId === student.id && d.semesterId === semesterId
        );
        if (!exists) {
          const matchingScholarship = state.scholarships.find(
            sc =>
              sc.studentId === student.id &&
              (sc.status === 'Approved' || sc.status === 'Adjusted')
          );
          const matchingConcession = state.concessions.find(
            c =>
              c.studentId === student.id &&
              (c.status === 'Approved' || c.status === 'Adjusted')
          );

          const scholarshipAmount = matchingScholarship
            ? matchingScholarship.amount
            : 0;
          let concessionAmount = 0;
          if (matchingConcession) {
            concessionAmount = Math.round(
              (totalFee * matchingConcession.percentage) / 100
            );
          }

          const payableAmount = Math.max(
            0,
            totalFee - scholarshipAmount - concessionAmount
          );

          currentDemands.push({
            id: `dem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            studentId: student.id,
            academicSessionId: sessionId,
            semesterId,
            totalFee,
            scholarshipAmount,
            concessionAmount,
            payableAmount,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
            status: 'Unpaid',
          });
        }
      });

      return { demands: currentDemands };
    }),

  approveDemand: demandId =>
    set(state => ({
      demands: state.demands.map(d =>
        d.id === demandId ? { ...d, status: 'Paid' } : d
      ),
    })),

  // Scholarships
  addScholarship: schol =>
    set(state => ({
      scholarships: [
        ...state.scholarships,
        { id: `schol-${Date.now()}`, status: 'Pending', ...schol },
      ],
    })),

  updateScholarshipStatus: (id, status) =>
    set(state => {
      const updatedScholarships = state.scholarships.map(s =>
        s.id === id ? { ...s, status } : s
      );
      let updatedDemands = [...state.demands];

      // If approved or adjusted, recalculate student's demand
      if (status === 'Approved' || status === 'Adjusted') {
        const schol = state.scholarships.find(s => s.id === id);
        if (schol) {
          updatedDemands = state.demands.map(demand => {
            if (
              demand.studentId === schol.studentId &&
              demand.status === 'Unpaid'
            ) {
              const payableAmount = Math.max(
                0,
                demand.totalFee - schol.amount - demand.concessionAmount
              );
              return {
                ...demand,
                scholarshipAmount: schol.amount,
                payableAmount,
              };
            }
            return demand;
          });
        }
      }

      return {
        scholarships: updatedScholarships,
        demands: updatedDemands,
      };
    }),

  // Concessions
  addConcession: conc =>
    set(state => ({
      concessions: [
        ...state.concessions,
        { id: `conc-${Date.now()}`, status: 'Pending', ...conc },
      ],
    })),

  updateConcessionStatus: (id, status) =>
    set(state => {
      const updatedConcessions = state.concessions.map(c =>
        c.id === id ? { ...c, status } : c
      );
      let updatedDemands = [...state.demands];

      if (status === 'Approved' || status === 'Adjusted') {
        const concession = state.concessions.find(c => c.id === id);
        if (concession) {
          updatedDemands = state.demands.map(demand => {
            if (
              demand.studentId === concession.studentId &&
              demand.status === 'Unpaid'
            ) {
              const concessionAmount = Math.round(
                (demand.totalFee * concession.percentage) / 100
              );
              const payableAmount = Math.max(
                0,
                demand.totalFee - demand.scholarshipAmount - concessionAmount
              );
              return {
                ...demand,
                concessionAmount,
                payableAmount,
              };
            }
            return demand;
          });
        }
      }

      return {
        concessions: updatedConcessions,
        demands: updatedDemands,
      };
    }),

  // Manual & Online Collection
  recordCollection: col =>
    set(state => {
      const demand = state.demands.find(d => d.id === col.demandId);
      if (!demand) return {};

      const student = state.students.find(s => s.id === demand.studentId);

      const newReceipt: PaymentReceipt = {
        id: `rec-${Date.now()}`,
        demandId: col.demandId,
        receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
        studentId: demand.studentId,
        academicYear: '2024-25',
        courseId: student ? student.courseId : 'cour-1',
        semesterId: demand.semesterId,
        amountPaid: col.amountPaid,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMode: col.paymentMode,
        transactionReference: col.transactionReference,
      };

      // Update demand status to paid
      const updatedDemands = state.demands.map(d =>
        d.id === col.demandId ? { ...d, status: 'Paid' as const } : d
      );

      // Also update any scholarship/concessions for this student to "Adjusted"
      const updatedScholarships = state.scholarships.map(s =>
        s.studentId === demand.studentId && s.status === 'Approved'
          ? { ...s, status: 'Adjusted' as const }
          : s
      );
      const updatedConcessions = state.concessions.map(c =>
        c.studentId === demand.studentId && c.status === 'Approved'
          ? { ...c, status: 'Adjusted' as const }
          : c
      );

      return {
        receipts: [...state.receipts, newReceipt],
        demands: updatedDemands,
        scholarships: updatedScholarships,
        concessions: updatedConcessions,
      };
    }),

  // Failed transactions
  recordFailedTransaction: failed =>
    set(state => ({
      failedTransactions: [
        ...state.failedTransactions,
        {
          id: `fail-${Date.now()}`,
          status: 'Failed',
          transactionDate: new Date().toISOString().split('T')[0],
          ...failed,
        },
      ],
    })),

  reconcileFailedTransaction: id =>
    set(state => {
      const transaction = state.failedTransactions.find(t => t.id === id);
      if (!transaction) return {};

      // Generate receipt and mark resolved
      const student = state.students.find(s => s.id === transaction.studentId);
      // Find demand for this student that is unpaid
      const demand = state.demands.find(
        d => d.studentId === transaction.studentId && d.status === 'Unpaid'
      );
      const demandId = demand ? demand.id : `dem-${Date.now()}`;

      const newReceipt: PaymentReceipt = {
        id: `rec-${Date.now()}`,
        demandId: demandId,
        receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
        studentId: transaction.studentId,
        academicYear: '2024-25',
        courseId: student ? student.courseId : 'cour-1',
        semesterId: student ? student.semesterId : 'sem-1',
        amountPaid: transaction.amount,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMode: transaction.paymentMode,
        transactionReference: transaction.refNo,
      };

      const updatedFailed = state.failedTransactions.map(t =>
        t.id === id ? { ...t, status: 'Resolved' as const } : t
      );
      const updatedDemands = demand
        ? state.demands.map(d =>
            d.id === demandId ? { ...d, status: 'Paid' as const } : d
          )
        : state.demands;

      return {
        receipts: [...state.receipts, newReceipt],
        failedTransactions: updatedFailed,
        demands: updatedDemands,
      };
    }),

  // Refund Management
  addRefundRequest: refund =>
    set(state => ({
      refunds: [
        ...state.refunds,
        {
          id: `refu-${Date.now()}`,
          status: 'Requested',
          requestDate: new Date().toISOString().split('T')[0],
          ...refund,
        },
      ],
    })),

  updateRefundStatus: (id, status) =>
    set(state => ({
      refunds: state.refunds.map(r => (r.id === id ? { ...r, status } : r)),
    })),

  // Bank Statement Upload & Matching
  uploadBankStatement: rows =>
    set(state => ({
      bankStatements: [...state.bankStatements, ...rows],
    })),

  reconcileTransaction: (statementId, receiptId) =>
    set(state => {
      const statement = state.bankStatements.find(s => s.id === statementId);
      const receipt = state.receipts.find(r => r.id === receiptId);

      if (!statement || !receipt) return {};

      return {
        bankStatements: state.bankStatements.map(s =>
          s.id === statementId ? { ...s, status: 'Matched' as const } : s
        ),
        // Set payment reference matched if needed
      };
    }),

  autoReconcile: () =>
    set(state => {
      // Attempt to match unmatched bank statement rows with receipts based on amount & reference matching
      const updatedStatements = state.bankStatements.map(stmt => {
        if (stmt.status === 'Unmatched') {
          // Look for matching receipt
          const matchingReceipt = state.receipts.find(
            r =>
              r.amountPaid === stmt.creditAmount &&
              (stmt.refNo === r.transactionReference ||
                stmt.description.includes(r.receiptNumber))
          );
          if (matchingReceipt) {
            return { ...stmt, status: 'Matched' as const };
          }
        }
        return stmt;
      });

      return { bankStatements: updatedStatements };
    }),
}));
