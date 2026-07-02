const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const files = [
  {
    path: 'features/admissions-management/department/DepartmentPortalPage.tsx',
    content: `import { PortalSelector } from 'shared/new-components';
import { admissionsUrls } from '../urls';

export default function DepartmentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Department Portal — Admissions"
      moduleDescription="Verify applicant eligibility and approve documents."
      backPath={admissionsUrls.root}
      backLabel="Admissions Management"
      portals={[
        { title: 'Dashboard', description: 'Overview of pending and verified applications', icon: 'dashboard', colorScheme: 'teal', path: admissionsUrls.department.dashboard },
        { title: 'Applications List', description: 'View and filter all applications', icon: 'list', colorScheme: 'blue', path: admissionsUrls.department.applications },
        { title: 'Academic Eligibility', description: 'Check qualification and marks', icon: 'fact_check', colorScheme: 'green', path: admissionsUrls.department.eligibility },
        { title: 'Document Verification', description: 'Verify uploaded documents', icon: 'plagiarism', colorScheme: 'indigo', path: admissionsUrls.department.documents },
        { title: 'Remarks', description: 'Add verification remarks', icon: 'comment', colorScheme: 'orange', path: admissionsUrls.department.remarks },
        { title: 'Reports', description: 'Department-wise reports', icon: 'analytics', colorScheme: 'purple', path: admissionsUrls.department.reports },
      ]}
    />
  );
}
`
  },
  {
    path: 'features/admissions-management/cell/CellPortalPage.tsx',
    content: `import { PortalSelector } from 'shared/new-components';
import { admissionsUrls } from '../urls';

export default function CellPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admission Cell Portal"
      moduleDescription="Manage the entire admission process, seat allocation, and merit lists."
      backPath={admissionsUrls.root}
      backLabel="Admissions Management"
      portals={[
        { title: 'Dashboard', description: 'Admissions stats and overview', icon: 'dashboard', colorScheme: 'teal', path: admissionsUrls.cell.dashboard },
        { title: 'Application Management', description: 'Manage all applications', icon: 'folder_open', colorScheme: 'blue', path: admissionsUrls.cell.applications },
        { title: 'Eligibility Verification', description: 'Cross-check rules', icon: 'rule', colorScheme: 'green', path: admissionsUrls.cell.eligibility },
        { title: 'Merit List Generation', description: 'Generate cutoff and merit lists', icon: 'format_list_numbered', colorScheme: 'orange', path: admissionsUrls.cell.meritList },
        { title: 'Seat Allocation', description: 'Allocate seats to applicants', icon: 'event_seat', colorScheme: 'purple', path: admissionsUrls.cell.seatAllocation },
        { title: 'Admission Offer', description: 'Issue offer letters', icon: 'mail', colorScheme: 'indigo', path: admissionsUrls.cell.offer },
        { title: 'Student Conversion', description: 'Convert applicants to students', icon: 'swap_horiz', colorScheme: 'teal', path: admissionsUrls.cell.studentConversion },
        { title: 'Reports', description: 'Admission cell reports', icon: 'analytics', colorScheme: 'red', path: admissionsUrls.cell.reports },
      ]}
    />
  );
}
`
  },
  {
    path: 'features/admissions-management/finance/FinancePortalPage.tsx',
    content: `import { PortalSelector } from 'shared/new-components';
import { admissionsUrls } from '../urls';

export default function FinancePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Finance Portal — Admissions"
      moduleDescription="Manage application fees, admission fees, and refunds."
      backPath={admissionsUrls.root}
      backLabel="Admissions Management"
      portals={[
        { title: 'Dashboard', description: 'Fee collection overview', icon: 'dashboard', colorScheme: 'teal', path: admissionsUrls.finance.dashboard },
        { title: 'Payment Verification', description: 'Verify online and offline payments', icon: 'verified', colorScheme: 'green', path: admissionsUrls.finance.paymentVerification },
        { title: 'Fee Structure', description: 'View fee configurations', icon: 'account_balance', colorScheme: 'blue', path: admissionsUrls.finance.feeStructure },
        { title: 'Refund Management', description: 'Process admission refunds', icon: 'currency_exchange', colorScheme: 'orange', path: admissionsUrls.finance.refunds },
        { title: 'Receipts', description: 'Generate and download receipts', icon: 'receipt', colorScheme: 'indigo', path: admissionsUrls.finance.receipts },
        { title: 'Reports', description: 'Financial reports', icon: 'analytics', colorScheme: 'purple', path: admissionsUrls.finance.reports },
      ]}
    />
  );
}
`
  },
  {
    path: 'features/student-management/faculty/FacultyPortalPage.tsx',
    content: `import { PortalSelector } from 'shared/new-components';
import { studentManagementUrls } from '../urls';

export default function FacultyPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Faculty Portal — Academics"
      moduleDescription="Manage attendance, internal marks, and student progress."
      backPath={studentManagementUrls.admin.root}
      backLabel="Student Management"
      portals={[
        { title: 'Dashboard', description: 'Assigned students overview', icon: 'dashboard', colorScheme: 'teal', path: studentManagementUrls.faculty.dashboard },
        { title: 'Student List', description: 'View assigned students', icon: 'groups', colorScheme: 'blue', path: studentManagementUrls.faculty.students },
        { title: 'Attendance', description: 'Mark and view attendance', icon: 'event_available', colorScheme: 'green', path: studentManagementUrls.faculty.attendance },
        { title: 'Internal Assessment', description: 'Enter internal marks', icon: 'border_color', colorScheme: 'orange', path: studentManagementUrls.faculty.internalAssessment },
        { title: 'Assignment Evaluation', description: 'Evaluate student submissions', icon: 'assignment_turned_in', colorScheme: 'indigo', path: studentManagementUrls.faculty.assignments },
        { title: 'Reports', description: 'Faculty reports', icon: 'analytics', colorScheme: 'purple', path: studentManagementUrls.faculty.reports },
      ]}
    />
  );
}
`
  },
  {
    path: 'features/student-management/department/DepartmentPortalPage.tsx',
    content: `import { PortalSelector } from 'shared/new-components';
import { studentManagementUrls } from '../urls';

export default function DepartmentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Department Portal — Academics"
      moduleDescription="Manage department students, batches, sections, and promotions."
      backPath={studentManagementUrls.admin.root}
      backLabel="Student Management"
      portals={[
        { title: 'Dashboard', description: 'Department overview', icon: 'dashboard', colorScheme: 'teal', path: studentManagementUrls.department.dashboard },
        { title: 'Student Master', description: 'All department students', icon: 'people', colorScheme: 'blue', path: studentManagementUrls.department.students },
        { title: 'Batch Allocation', description: 'Assign students to batches', icon: 'group_add', colorScheme: 'indigo', path: studentManagementUrls.department.batchAllocation },
        { title: 'Section Allocation', description: 'Assign students to sections', icon: 'view_list', colorScheme: 'purple', path: studentManagementUrls.department.sectionAllocation },
        { title: 'Semester Promotion', description: 'Promote students to next semester', icon: 'upgrade', colorScheme: 'green', path: studentManagementUrls.department.promotion },
        { title: 'Reports', description: 'Department reports', icon: 'analytics', colorScheme: 'orange', path: studentManagementUrls.department.reports },
      ]}
    />
  );
}
`
  },
  {
    path: 'features/student-management/exam-cell/ExamCellPortalPage.tsx',
    content: `import { PortalSelector } from 'shared/new-components';
import { studentManagementUrls } from '../urls';

export default function ExamCellPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Exam Cell Portal"
      moduleDescription="Manage exam registrations, hall tickets, and results."
      backPath={studentManagementUrls.admin.root}
      backLabel="Student Management"
      portals={[
        { title: 'Dashboard', description: 'Exam management overview', icon: 'dashboard', colorScheme: 'teal', path: studentManagementUrls.examCell.dashboard },
        { title: 'Exam Registration', description: 'Manage exam registrations', icon: 'app_registration', colorScheme: 'blue', path: studentManagementUrls.examCell.registration },
        { title: 'Hall Ticket', description: 'Generate and issue hall tickets', icon: 'badge', colorScheme: 'indigo', path: studentManagementUrls.examCell.hallTicket },
        { title: 'External Marks', description: 'Enter external marks', icon: 'edit_document', colorScheme: 'orange', path: studentManagementUrls.examCell.externalMarks },
        { title: 'Result Processing', description: 'Process and publish results', icon: 'published_with_changes', colorScheme: 'green', path: studentManagementUrls.examCell.results },
        { title: 'Reports', description: 'Exam reports', icon: 'analytics', colorScheme: 'purple', path: studentManagementUrls.examCell.reports },
      ]}
    />
  );
}
`
  },
  {
    path: 'features/student-management/finance/FinancePortalPage.tsx',
    content: `import { PortalSelector } from 'shared/new-components';
import { studentManagementUrls } from '../urls';

export default function FinancePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Finance Portal — Academics"
      moduleDescription="Manage fee collection, refunds, and scholarship adjustments."
      backPath={studentManagementUrls.admin.root}
      backLabel="Student Management"
      portals={[
        { title: 'Dashboard', description: 'Fee collection overview', icon: 'dashboard', colorScheme: 'teal', path: studentManagementUrls.finance.dashboard },
        { title: 'Student Fee Ledger', description: 'Per-student fee ledger', icon: 'account_balance_wallet', colorScheme: 'blue', path: studentManagementUrls.finance.ledger },
        { title: 'Fee Collection', description: 'Collect academic fees', icon: 'payments', colorScheme: 'green', path: studentManagementUrls.finance.collection },
        { title: 'Refunds', description: 'Process refunds', icon: 'currency_exchange', colorScheme: 'orange', path: studentManagementUrls.finance.refunds },
        { title: 'Scholarship Adjustment', description: 'Adjust scholarship disbursements', icon: 'card_giftcard', colorScheme: 'indigo', path: studentManagementUrls.finance.scholarship },
        { title: 'Reports', description: 'Financial reports', icon: 'analytics', colorScheme: 'purple', path: studentManagementUrls.finance.reports },
      ]}
    />
  );
}
`
  }
];

files.forEach(file => {
  fs.writeFileSync(path.join(srcDir, file.path), file.content);
  console.log('Updated ' + file.path);
});
