import { PortalSelector } from 'shared/new-components';
import { studentLifecycleUrls, studentServicesUrl } from '../urls';

export default function StudentPortalPage() {
  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.root },
    { label: 'Student Portal' },
  ];

  return (
    <PortalSelector
      moduleTitle="Student Portal — Student Lifecycle"
      moduleDescription="Access your academic progress, course registration, continuous assessment marks, examinations, results, and student services."
      breadcrumbs={breadcrumbs}
      portals={[
        {
          title: 'Dashboard',
          description: 'Academic standing, GPA, and attendance gauges',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: studentLifecycleUrls.student.dashboard,
        },
        {
          title: 'Admission Details',
          description: 'Check counselling records and documents',
          icon: 'badge',
          colorScheme: 'teal',
          path: studentLifecycleUrls.student.admission,
        },
        {
          title: 'My Enrolled Courses',
          description: 'View registered courses and syllabi',
          icon: 'menu_book',
          colorScheme: 'indigo',
          path: studentLifecycleUrls.student.courses,
        },
        {
          title: 'Semester Registration',
          description: 'Choice selection for CBCS courses',
          icon: 'how_to_reg',
          colorScheme: 'purple',
          path: studentLifecycleUrls.student.registration,
        },
        {
          title: 'Internal Assessment',
          description: 'MST test marks and assignment scores',
          icon: 'fact_check',
          colorScheme: 'orange',
          path: studentLifecycleUrls.student.assessment,
        },
        {
          title: 'Examinations',
          description: 'Exam form registration and Hall Ticket PDF',
          icon: 'assignment',
          colorScheme: 'red',
          path: studentLifecycleUrls.student.examinations,
        },
        {
          title: 'Results & CGPA',
          description: 'View semester grade cards and GPA trend',
          icon: 'grade',
          colorScheme: 'green',
          path: studentLifecycleUrls.student.results,
        },
        {
          title: 'Degree Audit',
          description: 'Check credit requirements for graduation',
          icon: 'verified_user',
          colorScheme: 'pink',
          path: studentLifecycleUrls.student.degreeAudit,
        },
        {
          title: 'Services & Certificates',
          description: 'Apply for Bonafide, Migration, and other certificates',
          icon: 'card_membership',
          colorScheme: 'teal',
          path: studentLifecycleUrls.student.services,
        },
        {
          title: 'Fees & Payments',
          description: 'Pay tuition fees and download receipts',
          icon: 'payments',
          colorScheme: 'amber',
          path: studentLifecycleUrls.student.fees,
        },
        {
          title: 'Profile & Contact',
          description: 'Manage personal and guardians contact info',
          icon: 'person',
          colorScheme: 'gray',
          path: studentLifecycleUrls.student.profile,
        },
        {
          title: 'Notifications',
          description: 'View notifications and deadline broadcasts',
          icon: 'notifications',
          colorScheme: 'blue',
          path: studentLifecycleUrls.student.notifications,
        },
      ]}
    />
  );
}
