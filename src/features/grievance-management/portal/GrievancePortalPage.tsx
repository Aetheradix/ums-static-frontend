import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function GrievancePortalPage() {
  return (
    <PortalSelector
      moduleTitle="University ERP — Grievance Management System"
      moduleDescription="DAVV Indore — UGC & AICTE compliant Grievance Redressal Portal. Select your role to proceed."
      portals={[
        {
          title: 'Student Portal',
          description:
            'Raise grievances, track complaints, file appeals and communicate with the grievance cell.',
          icon: 'school',
          colorScheme: 'blue',
          path: grvUrls.student.portal,
        },
        {
          title: 'Department / Teacher Portal',
          description:
            'Review assigned complaints, create digital notesheets, take action and forward to authority.',
          icon: 'assignment_ind',
          colorScheme: 'green',
          path: grvUrls.department.portal,
        },
        {
          title: 'Grievance Cell Portal',
          description:
            'Manage all complaints, monitor SLA, assign departments and oversee committee operations.',
          icon: 'support_agent',
          colorScheme: 'purple',
          path: grvUrls.cell.portal,
        },
        {
          title: 'Authority Portal (HoD / Registrar)',
          description:
            'Review pending approvals, manage appeals and issue final decisions.',
          icon: 'gavel',
          colorScheme: 'orange',
          path: grvUrls.authority.portal,
        },
        {
          title: 'Admin Portal',
          description:
            'Configure categories, SLA rules, notification templates, integration APIs and view audit logs.',
          icon: 'admin_panel_settings',
          colorScheme: 'red',
          path: grvUrls.admin.portal,
        },
      ]}
    />
  );
}
