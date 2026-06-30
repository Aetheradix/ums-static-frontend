import { PortalSelector } from 'shared/new-components';
import { smsUrls } from '../urls';

export default function EmployeePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Employee Portal — Security Management"
      moduleDescription="Report incidents, track your cases and access university safety resources."
      backPath={smsUrls.portal}
      backLabel="Security Management System"
      portals={[
        {
          title: 'Dashboard',
          description: 'Your incidents, emergency contacts and upcoming awareness programs.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: smsUrls.employee.dashboard,
        },
        {
          title: 'Report Incident',
          description: 'File a new security incident report.',
          icon: 'report',
          colorScheme: 'red',
          path: smsUrls.employee.reportIncident,
        },
        {
          title: 'My Incidents',
          description: 'Track status of your reported incidents with timeline.',
          icon: 'list_alt',
          colorScheme: 'orange',
          path: smsUrls.employee.myIncidents,
        },
        {
          title: 'University Helplines',
          description: 'Emergency and departmental helpline numbers.',
          icon: 'phone_in_talk',
          colorScheme: 'green',
          path: smsUrls.employee.helplines,
        },
        {
          title: 'Safety Guidelines',
          description: 'University safety guidelines and standard operating procedures.',
          icon: 'menu_book',
          colorScheme: 'teal',
          path: smsUrls.employee.guidelines,
        },
        {
          title: 'Awareness Programs',
          description: 'Upcoming and completed safety awareness programs.',
          icon: 'campaign',
          colorScheme: 'purple',
          path: smsUrls.employee.awareness,
        },
      ]}
    />
  );
}
