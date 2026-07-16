import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function GrievancePortalPage() {
  return (
    <PortalSelector
      moduleTitle="University ERP — Grievance Management System"
      moduleDescription="DAVV Indore — UGC & AICTE compliant Grievance Redressal System. Select your login role to proceed."
      portals={[
        {
          title: 'Student Login',
          description:
            'Raise grievances, track complaint timelines, view status, and download resolution letters.',
          icon: 'school',
          colorScheme: 'blue',
          path: grvUrls.student.portal,
        },
        {
          title: 'Employee Login',
          description:
            'File complaints, track status, view notifications, and access resolved letters.',
          icon: 'badge',
          colorScheme: 'indigo',
          path: grvUrls.teacher.portal,
        },
        {
          title: 'Department Login',
          description:
            'Review complaints, draft green digital notesheets, forward or return files.',
          icon: 'assignment_ind',
          colorScheme: 'green',
          path: grvUrls.departmentOfficer.portal,
        },
        {
          title: 'HOD Login',
          description:
            'Access pending complaints inbox, review digital notesheets, write official remarks, forward or return files.',
          icon: 'supervisor_account',
          colorScheme: 'teal',
          path: grvUrls.hod.portal,
        },
        {
          title: 'Grievance Cell',
          description:
            'Manage university complaints, assign departments, conduct committee reviews, and view analytical reports.',
          icon: 'support_agent',
          colorScheme: 'purple',
          path: grvUrls.cell.portal,
        },
        {
          title: 'Registrar Login',
          description:
            'Review recommendations, access full notesheet history, generate final resolution letters, and close files.',
          icon: 'gavel',
          colorScheme: 'orange',
          path: grvUrls.registrar.portal,
        },
        {
          title: 'Admin Login',
          description:
            'Configure masters, categories, committees, mapping, user roles, routing flows, and audit logs.',
          icon: 'admin_panel_settings',
          colorScheme: 'red',
          path: grvUrls.admin.portal,
        },
      ]}
    />
  );
}
