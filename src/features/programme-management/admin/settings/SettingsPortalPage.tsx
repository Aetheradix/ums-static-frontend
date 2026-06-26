import { PortalSelector } from 'shared/new-components';
import { programmeUrls } from '../../urls';

export default function SettingsPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Settings — Programme Management"
      moduleDescription="Configure master data for academic programme management."
      backPath={programmeUrls.admin.portal}
      backLabel="Admin Portal"
      portals={[
        {
          title: 'Disciplines',
          description: 'Manage academic disciplines and subject areas.',
          icon: 'category',
          colorScheme: 'blue',
          path: programmeUrls.admin.settings.disciplines,
        },
        {
          title: 'UGC Degrees',
          description: 'Manage UGC recognized degree types and levels.',
          icon: 'school',
          colorScheme: 'purple',
          path: programmeUrls.admin.settings.ugcDegrees,
        },
        {
          title: 'Admission Quotas',
          description: 'Configure admission quota categories and percentages.',
          icon: 'pie_chart',
          colorScheme: 'green',
          path: programmeUrls.admin.settings.admissionQuotas,
        },
        {
          title: 'Enrolment Types',
          description: 'Manage student enrolment type masters.',
          icon: 'assignment',
          colorScheme: 'teal',
          path: programmeUrls.admin.settings.enrolmentTypes,
        },
        {
          title: 'Enrolment Status',
          description: 'Manage enrolment status options for students.',
          icon: 'toggle_on',
          colorScheme: 'orange',
          path: programmeUrls.admin.settings.enrolmentStatus,
        },
        {
          title: 'Exam Schemes',
          description: 'Configure examination scheme patterns.',
          icon: 'description',
          colorScheme: 'red',
          path: programmeUrls.admin.settings.examSchemes,
        },
        {
          title: 'Academic Distinction',
          description: 'Define academic distinction criteria and boundaries.',
          icon: 'workspace_premium',
          colorScheme: 'amber',
          path: programmeUrls.admin.settings.academicDistinction,
        },
      ]}
    />
  );
}
