const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const generateComponentContent = (componentName, description) => `import { FormCard, FormPage } from 'shared/new-components';

export default function ${componentName}() {
  return (
    <FormPage
      title="${componentName.replace(/([A-Z])/g, ' $1').trim()}"
      description="${description}"
    >
      <FormCard>
        <div className="p-12 text-center text-gray-500">
          This is a stub for the ${componentName} page.
        </div>
      </FormCard>
    </FormPage>
  );
}
`;

const ensureDirectoryExists = (filePath) => {
  const dirName = path.dirname(filePath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
};

const pagesToCreate = [
  // Admissions Management - Student Portal
  { path: 'features/admissions-management/student/pages/AdmissionEnquiry.tsx', component: 'AdmissionEnquiry', desc: 'Pre-registration enquiry form' },
  { path: 'features/admissions-management/student/pages/Registration.tsx', component: 'Registration', desc: 'OTP, email, password setup' },
  { path: 'features/admissions-management/student/pages/CoursePreference.tsx', component: 'CoursePreference', desc: 'Course/branch/campus priority' },
  { path: 'features/admissions-management/student/pages/DocumentUpload.tsx', component: 'DocumentUpload', desc: 'Upload all required documents' },
  { path: 'features/admissions-management/student/pages/ApplicationPreview.tsx', component: 'ApplicationPreview', desc: 'Review before submit' },
  { path: 'features/admissions-management/student/pages/ApplicationTracking.tsx', component: 'ApplicationTracking', desc: 'Timeline tracker' },
  { path: 'features/admissions-management/student/pages/MeritList.tsx', component: 'MeritList', desc: 'View merit list position' },
  { path: 'features/admissions-management/student/pages/AdmissionOffer.tsx', component: 'AdmissionOffer', desc: 'Accept/Reject offer' },
  { path: 'features/admissions-management/student/pages/AdmissionLetter.tsx', component: 'AdmissionLetter', desc: 'Download letter + roll number' },

  // Admissions Management - Department Portal
  { path: 'features/admissions-management/department/DepartmentPortalPage.tsx', component: 'DepartmentPortalPage', desc: 'Department Portal' },
  { path: 'features/admissions-management/department/pages/Dashboard.tsx', component: 'DepartmentDashboard', desc: 'Overview of pending/approved/rejected' },
  { path: 'features/admissions-management/department/pages/ApplicationsList.tsx', component: 'ApplicationsList', desc: 'List with filters' },
  { path: 'features/admissions-management/department/pages/ApplicantProfile.tsx', component: 'ApplicantProfile', desc: 'Detailed profile view' },
  { path: 'features/admissions-management/department/pages/AcademicEligibility.tsx', component: 'AcademicEligibility', desc: 'Check qualification, %, subjects, entrance' },
  { path: 'features/admissions-management/department/pages/DocumentVerification.tsx', component: 'DocumentVerification', desc: 'Approve/reject documents' },
  { path: 'features/admissions-management/department/pages/Remarks.tsx', component: 'Remarks', desc: 'Add verification remarks' },
  { path: 'features/admissions-management/department/pages/Reports.tsx', component: 'DepartmentReports', desc: 'Department-wise reports' },

  // Admissions Management - Cell Portal
  { path: 'features/admissions-management/cell/CellPortalPage.tsx', component: 'CellPortalPage', desc: 'Admission Cell Portal' },
  { path: 'features/admissions-management/cell/pages/Dashboard.tsx', component: 'CellDashboard', desc: 'Stats: apps, pending, merit, confirmed' },
  { path: 'features/admissions-management/cell/pages/ApplicationManagement.tsx', component: 'ApplicationManagement', desc: 'Full application list' },
  { path: 'features/admissions-management/cell/pages/DocumentVerification.tsx', component: 'CellDocumentVerification', desc: 'Doc verification hub' },
  { path: 'features/admissions-management/cell/pages/EligibilityVerification.tsx', component: 'EligibilityVerification', desc: 'Cross-check rules' },
  { path: 'features/admissions-management/cell/pages/MeritListGeneration.tsx', component: 'MeritListGeneration', desc: 'Generate with cutoff/reservation rules' },
  { path: 'features/admissions-management/cell/pages/SeatMatrix.tsx', component: 'SeatMatrix', desc: 'Total/available/reserved/filled seats' },
  { path: 'features/admissions-management/cell/pages/SeatAllocation.tsx', component: 'SeatAllocation', desc: 'Allocate seats to applicants' },
  { path: 'features/admissions-management/cell/pages/AdmissionOffer.tsx', component: 'CellAdmissionOffer', desc: 'Issue offer letters' },
  { path: 'features/admissions-management/cell/pages/WaitingList.tsx', component: 'WaitingList', desc: 'Manage waiting list' },
  { path: 'features/admissions-management/cell/pages/AdmissionConfirmation.tsx', component: 'AdmissionConfirmation', desc: 'Confirm admissions' },
  { path: 'features/admissions-management/cell/pages/StudentConversion.tsx', component: 'StudentConversion', desc: 'Applicant to Student (generate student ID/enrollment/roll)' },
  { path: 'features/admissions-management/cell/pages/Reports.tsx', component: 'CellReports', desc: 'Cell reports' },
  { path: 'features/admissions-management/cell/pages/AuditLogs.tsx', component: 'CellAuditLogs', desc: 'System audit trail' },

  // Admissions Management - Finance Portal
  { path: 'features/admissions-management/finance/FinancePortalPage.tsx', component: 'FinancePortalPage', desc: 'Finance Portal' },
  { path: 'features/admissions-management/finance/pages/Dashboard.tsx', component: 'FinanceDashboard', desc: 'App fees, admission fees, pending, refunds' },
  { path: 'features/admissions-management/finance/pages/PaymentVerification.tsx', component: 'PaymentVerification', desc: 'Verify payments' },
  { path: 'features/admissions-management/finance/pages/FeeStructure.tsx', component: 'FeeStructure', desc: 'View fee breakdown' },
  { path: 'features/admissions-management/finance/pages/PaymentReconciliation.tsx', component: 'PaymentReconciliation', desc: 'Reconcile payments' },
  { path: 'features/admissions-management/finance/pages/RefundManagement.tsx', component: 'RefundManagement', desc: 'Process refunds' },
  { path: 'features/admissions-management/finance/pages/Receipts.tsx', component: 'Receipts', desc: 'View/download receipts' },
  { path: 'features/admissions-management/finance/pages/Reports.tsx', component: 'FinanceReports', desc: 'Financial reports' },

  // Admissions Management - Admin Portal
  { path: 'features/admissions-management/admin/pages/AdmissionCycleMaster.tsx', component: 'AdmissionCycleMaster', desc: 'Session/year config' },
  { path: 'features/admissions-management/admin/pages/CourseMaster.tsx', component: 'CourseMaster', desc: 'Course definitions' },
  { path: 'features/admissions-management/admin/pages/ProgramMaster.tsx', component: 'ProgramMaster', desc: 'Program definitions' },
  { path: 'features/admissions-management/admin/pages/EligibilityRuleEngine.tsx', component: 'EligibilityRuleEngine', desc: 'Eligibility criteria rules' },
  { path: 'features/admissions-management/admin/pages/ReservationMaster.tsx', component: 'ReservationMaster', desc: 'Category/quota config' },
  { path: 'features/admissions-management/admin/pages/SeatMatrixConfig.tsx', component: 'SeatMatrixConfig', desc: 'Seat allocation matrix' },
  { path: 'features/admissions-management/admin/pages/MeritRuleConfig.tsx', component: 'MeritRuleConfig', desc: 'Merit calculation rules' },
  { path: 'features/admissions-management/admin/pages/AdmissionWorkflow.tsx', component: 'AdmissionWorkflow', desc: 'Workflow stage config' },
  { path: 'features/admissions-management/admin/pages/DocumentMaster.tsx', component: 'DocumentMaster', desc: 'Required documents list' },
  { path: 'features/admissions-management/admin/pages/NotificationTemplates.tsx', component: 'NotificationTemplates', desc: 'Email/SMS templates' },
  { path: 'features/admissions-management/admin/pages/ReportsDashboard.tsx', component: 'ReportsDashboard', desc: 'Admin reports hub' },
  { path: 'features/admissions-management/admin/pages/RolePermission.tsx', component: 'RolePermission', desc: 'Access control' },
  { path: 'features/admissions-management/admin/pages/SystemSettings.tsx', component: 'SystemSettings', desc: 'Global settings' },

  // Student Management - Student Portal
  { path: 'features/student-management/student/pages/AcademicProfile.tsx', component: 'AcademicProfile', desc: 'Academic details view' },
  { path: 'features/student-management/student/pages/SemesterRegistration.tsx', component: 'SemesterRegistration', desc: 'Register for semester' },
  { path: 'features/student-management/student/pages/SubjectRegistration.tsx', component: 'SubjectRegistration', desc: 'CBCS subject selection' },
  { path: 'features/student-management/student/pages/Attendance.tsx', component: 'Attendance', desc: 'View attendance records' },
  { path: 'features/student-management/student/pages/Timetable.tsx', component: 'Timetable', desc: 'Class schedule' },
  { path: 'features/student-management/student/pages/FeeDetails.tsx', component: 'FeeDetails', desc: 'Pending/paid fees' },
  { path: 'features/student-management/student/pages/FeePayment.tsx', component: 'FeePayment', desc: 'Pay fees online' },
  { path: 'features/student-management/student/pages/Scholarship.tsx', component: 'Scholarship', desc: 'Scholarship applications' },
  { path: 'features/student-management/student/pages/LMS.tsx', component: 'LMS', desc: 'Learning management' },
  { path: 'features/student-management/student/pages/AssignmentSubmission.tsx', component: 'AssignmentSubmission', desc: 'Submit assignments' },
  { path: 'features/student-management/student/pages/ExamRegistration.tsx', component: 'ExamRegistration', desc: 'Register for exams' },
  { path: 'features/student-management/student/pages/HallTicket.tsx', component: 'HallTicket', desc: 'Download hall ticket' },
  { path: 'features/student-management/student/pages/Results.tsx', component: 'Results', desc: 'View results' },
  { path: 'features/student-management/student/pages/GradeCard.tsx', component: 'GradeCard', desc: 'Download grade card' },
  { path: 'features/student-management/student/pages/AcademicHistory.tsx', component: 'AcademicHistory', desc: 'Complete academic record' },
  { path: 'features/student-management/student/pages/Certificates.tsx', component: 'Certificates', desc: 'Download certificates' },
  { path: 'features/student-management/student/pages/Notifications.tsx', component: 'Notifications', desc: 'View notifications' },
  { path: 'features/student-management/student/pages/Grievance.tsx', component: 'Grievance', desc: 'Submit grievances' },

  // Student Management - Faculty Portal
  { path: 'features/student-management/faculty/FacultyPortalPage.tsx', component: 'FacultyPortalPage', desc: 'Faculty Portal' },
  { path: 'features/student-management/faculty/pages/Dashboard.tsx', component: 'FacultyDashboard', desc: 'Assigned students overview' },
  { path: 'features/student-management/faculty/pages/StudentList.tsx', component: 'FacultyStudentList', desc: 'List assigned students' },
  { path: 'features/student-management/faculty/pages/Attendance.tsx', component: 'FacultyAttendance', desc: 'Mark/view attendance' },
  { path: 'features/student-management/faculty/pages/InternalAssessment.tsx', component: 'InternalAssessment', desc: 'Enter internal marks' },
  { path: 'features/student-management/faculty/pages/AssignmentEvaluation.tsx', component: 'AssignmentEvaluation', desc: 'Evaluate submissions' },
  { path: 'features/student-management/faculty/pages/StudentProgress.tsx', component: 'StudentProgress', desc: 'Individual progress tracking' },
  { path: 'features/student-management/faculty/pages/Reports.tsx', component: 'FacultyReports', desc: 'Faculty reports' },

  // Student Management - Department Portal
  { path: 'features/student-management/department/DepartmentPortalPage.tsx', component: 'DepartmentPortalPage', desc: 'Department Portal' },
  { path: 'features/student-management/department/pages/Dashboard.tsx', component: 'DepartmentDashboard', desc: 'Department overview' },
  { path: 'features/student-management/department/pages/StudentMaster.tsx', component: 'StudentMaster', desc: 'All department students' },
  { path: 'features/student-management/department/pages/BatchAllocation.tsx', component: 'BatchAllocation', desc: 'Assign students to batches' },
  { path: 'features/student-management/department/pages/SectionAllocation.tsx', component: 'SectionAllocation', desc: 'Assign sections' },
  { path: 'features/student-management/department/pages/SubjectMapping.tsx', component: 'SubjectMapping', desc: 'Map subjects to programs' },
  { path: 'features/student-management/department/pages/SemesterPromotion.tsx', component: 'SemesterPromotion', desc: 'Promote students' },
  { path: 'features/student-management/department/pages/Reports.tsx', component: 'DepartmentReports', desc: 'Department reports' },

  // Student Management - Exam Cell Portal
  { path: 'features/student-management/exam-cell/ExamCellPortalPage.tsx', component: 'ExamCellPortalPage', desc: 'Exam Cell Portal' },
  { path: 'features/student-management/exam-cell/pages/Dashboard.tsx', component: 'ExamCellDashboard', desc: 'Exam management overview' },
  { path: 'features/student-management/exam-cell/pages/ExamRegistration.tsx', component: 'ExamRegistrationMgmt', desc: 'Manage exam registrations' },
  { path: 'features/student-management/exam-cell/pages/HallTicket.tsx', component: 'HallTicketMgmt', desc: 'Generate/issue hall tickets' },
  { path: 'features/student-management/exam-cell/pages/InternalMarksVerification.tsx', component: 'InternalMarksVerification', desc: 'Verify internal marks' },
  { path: 'features/student-management/exam-cell/pages/ExternalMarks.tsx', component: 'ExternalMarks', desc: 'Enter external marks' },
  { path: 'features/student-management/exam-cell/pages/ResultProcessing.tsx', component: 'ResultProcessing', desc: 'Process and publish results' },
  { path: 'features/student-management/exam-cell/pages/GradeCard.tsx', component: 'GradeCardMgmt', desc: 'Generate grade cards' },
  { path: 'features/student-management/exam-cell/pages/Revaluation.tsx', component: 'Revaluation', desc: 'Manage revaluation requests' },
  { path: 'features/student-management/exam-cell/pages/Reports.tsx', component: 'ExamReports', desc: 'Exam reports' },

  // Student Management - Finance Portal
  { path: 'features/student-management/finance/FinancePortalPage.tsx', component: 'FinancePortalPage', desc: 'Finance Portal' },
  { path: 'features/student-management/finance/pages/Dashboard.tsx', component: 'FinanceDashboard', desc: 'Fee collection overview' },
  { path: 'features/student-management/finance/pages/StudentFeeLedger.tsx', component: 'StudentFeeLedger', desc: 'Per-student fee ledger' },
  { path: 'features/student-management/finance/pages/FeeCollection.tsx', component: 'FeeCollection', desc: 'Collect fees' },
  { path: 'features/student-management/finance/pages/OnlinePayments.tsx', component: 'OnlinePayments', desc: 'Online payment records' },
  { path: 'features/student-management/finance/pages/Refunds.tsx', component: 'Refunds', desc: 'Process refunds' },
  { path: 'features/student-management/finance/pages/ScholarshipAdjustment.tsx', component: 'ScholarshipAdjustment', desc: 'Adjust scholarship disbursements' },
  { path: 'features/student-management/finance/pages/Reports.tsx', component: 'FinanceReports', desc: 'Financial reports' },

  // Student Management - Admin Portal
  { path: 'features/student-management/admin/pages/ProgramMaster.tsx', component: 'ProgramMaster', desc: 'Program definitions' },
  { path: 'features/student-management/admin/pages/DepartmentMaster.tsx', component: 'DepartmentMaster', desc: 'Department definitions' },
  { path: 'features/student-management/admin/pages/CourseMaster.tsx', component: 'CourseMaster', desc: 'Course definitions' },
  { path: 'features/student-management/admin/pages/SemesterMaster.tsx', component: 'SemesterMaster', desc: 'Semester config' },
  { path: 'features/student-management/admin/pages/BatchMaster.tsx', component: 'BatchMaster', desc: 'Batch management' },
  { path: 'features/student-management/admin/pages/SectionMaster.tsx', component: 'SectionMaster', desc: 'Section management' },
  { path: 'features/student-management/admin/pages/AcademicSession.tsx', component: 'AcademicSession', desc: 'Academic year management' },
  { path: 'features/student-management/admin/pages/SubjectMaster.tsx', component: 'SubjectMaster', desc: 'Subject definitions' },
  { path: 'features/student-management/admin/pages/CBCSConfiguration.tsx', component: 'CBCSConfiguration', desc: 'CBCS rules and credits' },
  { path: 'features/student-management/admin/pages/PromotionRules.tsx', component: 'PromotionRules', desc: 'Semester promotion criteria' },
  { path: 'features/student-management/admin/pages/UserRoleMgmt.tsx', component: 'UserRoleMgmt', desc: 'User access control' },
  { path: 'features/student-management/admin/pages/ReportsDashboard.tsx', component: 'ReportsDashboard', desc: 'Admin reports hub' },
  { path: 'features/student-management/admin/pages/AuditLogs.tsx', component: 'AuditLogs', desc: 'System audit trail' }
];

let createdCount = 0;

pagesToCreate.forEach(page => {
  const fullPath = path.join(srcDir, page.path);
  if (!fs.existsSync(fullPath)) {
    ensureDirectoryExists(fullPath);
    let content = generateComponentContent(page.component, page.desc);
    
    // Custom handling for Portal Pages to use PortalSelector
    if (page.component.endsWith('PortalPage')) {
      content = `import { PortalSelector } from 'shared/new-components';

export default function ${page.component}() {
  return (
    <PortalSelector
      moduleTitle="${page.component.replace('PortalPage', '')} Portal"
      moduleDescription="${page.desc}"
      backPath="/home"
      backLabel="Home"
      portals={[]}
    />
  );
}
`;
    }
    
    fs.writeFileSync(fullPath, content);
    createdCount++;
    console.log('Created: ' + page.path);
  } else {
    console.log('Skipped (exists): ' + page.path);
  }
});

console.log('Total pages created: ' + createdCount);
