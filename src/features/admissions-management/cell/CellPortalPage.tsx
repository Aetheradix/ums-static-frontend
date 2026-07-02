import { PortalSelector } from 'shared/new-components';
import { admissionsUrls } from '../urls';

export default function CellPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admission Cell Portal"
      moduleDescription="Manage the entire admission process, seat allocation, and merit lists."
      backPath={admissionsUrls.root}
      backLabel="Admissions Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Admissions stats and overview',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: admissionsUrls.cell.dashboard,
        },
        {
          title: 'Document Verification',
          description: 'Verify uploaded applicant documents',
          icon: 'plagiarism',
          colorScheme: 'blue',
          path: admissionsUrls.cell.documents,
        },
        {
          title: 'Merit List Generation',
          description: 'Generate cutoff and merit lists',
          icon: 'format_list_numbered',
          colorScheme: 'orange',
          path: admissionsUrls.cell.meritList,
        },
        {
          title: 'Seat Allocation',
          description: 'Allocate seats to applicants',
          icon: 'event_seat',
          colorScheme: 'purple',
          path: admissionsUrls.cell.seatAllocation,
        },
        {
          title: 'Student Conversion',
          description: 'Convert applicants to students',
          icon: 'swap_horiz',
          colorScheme: 'teal',
          path: admissionsUrls.cell.studentConversion,
        },
      ]}
    />
  );
}
