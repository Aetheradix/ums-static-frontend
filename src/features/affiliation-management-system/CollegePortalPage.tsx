import { PortalSelector } from 'shared/new-components';

export default function CollegePortalPage() {
  return (
    <PortalSelector
      moduleTitle="College Login"
      moduleDescription="Manage college profile and inspections."
      backPath="/home/sub-menu/affiliation-management-system"
      portals={[
        {
          title: 'College Profile Details',
          description: 'Manage college profile details.',
          icon: 'corporate_fare',
          colorScheme: 'purple',
          path: '/affiliation-management-system/profile-details',
        },
        {
          title: 'Inspection Details',
          description: 'Fill the detailed inspection report.',
          icon: 'assignment_turned_in',
          colorScheme: 'blue',
          path: '/affiliation-management-system/inspection-report',
        },
        {
          title: 'Department Registration',
          description: 'Register and manage college departments.',
          icon: 'domain_add',
          colorScheme: 'orange',
          path: '/affiliation-management-system/department-registration/list',
        },
        {
          title: 'Renewal Application',
          description: 'Apply for annual affiliation renewal.',
          icon: 'autorenew',
          colorScheme: 'green',
          path: '/affiliation-management-system/college-renewal/application',
        },
      ]}
    />
  );
}
