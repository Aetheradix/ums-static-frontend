import { PortalSelector } from 'shared/new-components';
import { smsUrls } from '../urls';

export default function SuperAdminMastersPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Super Admin Masters — Security Management"
      moduleDescription="Manage all institutional master data including incident categories, classifications, locations, mappings, and emergency contact details."
      backPath={smsUrls.superAdmin.portal}
      backLabel="Super Admin Portal"
      portals={[
        {
          title: 'Incident Category',
          description: 'Create and manage incident category masters.',
          icon: 'category',
          colorScheme: 'purple',
          path: smsUrls.superAdmin.incidentCategory,
        },
        {
          title: 'Incident Type',
          description: 'Manage incident types linked to categories.',
          icon: 'label',
          colorScheme: 'indigo',
          path: smsUrls.superAdmin.incidentType,
        },
        {
          title: 'Priority Master',
          description: 'Configure incident priority levels.',
          icon: 'priority_high',
          colorScheme: 'red',
          path: smsUrls.superAdmin.priority,
        },
        {
          title: 'Severity Master',
          description: 'Configure severity levels for incidents.',
          icon: 'warning',
          colorScheme: 'orange',
          path: smsUrls.superAdmin.severity,
        },
        {
          title: 'Status Master',
          description: 'Manage incident workflow statuses.',
          icon: 'toggle_on',
          colorScheme: 'teal',
          path: smsUrls.superAdmin.status,
        },
        {
          title: 'Building Master',
          description: 'Add and manage campus buildings.',
          icon: 'business',
          colorScheme: 'amber',
          path: smsUrls.superAdmin.building,
        },
        {
          title: 'Location Master',
          description: 'Manage specific locations within buildings.',
          icon: 'location_on',
          colorScheme: 'pink',
          path: smsUrls.superAdmin.location,
        },
        {
          title: 'Department Mapping',
          description: 'Map departments to security officers.',
          icon: 'account_tree',
          colorScheme: 'green',
          path: smsUrls.superAdmin.departmentMapping,
        },
        {
          title: 'Emergency Contact Types',
          description: 'Manage types of emergency contacts.',
          icon: 'contact_phone',
          colorScheme: 'red',
          path: smsUrls.superAdmin.emergencyContactType,
        },
      ]}
    />
  );
}
