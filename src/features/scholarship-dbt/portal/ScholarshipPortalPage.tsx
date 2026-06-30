import { PortalSelector } from 'shared/new-components';
import { dbtUrls } from '../urls';

export default function ScholarshipPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Scholarship & Direct Benefit Transfer (DBT)"
      moduleDescription="DAVV University Scholarship Management — Integrated with NSP, MP Scholarship Portal, PFMS, NPCI, UIDAI, DigiLocker & ABC."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Student Portal',
          description:
            'Apply for scholarships, upload documents, track applications, view DBT payment history.',
          icon: 'school',
          colorScheme: 'blue',
          path: dbtUrls.student.portal,
        },
        {
          title: 'Teacher Portal',
          description:
            'Verify student scholarship applications, check attendance eligibility and academic records.',
          icon: 'groups',
          colorScheme: 'green',
          path: dbtUrls.teacher.portal,
        },
        {
          title: 'Scholarship Cell',
          description:
            'Manage applications, verify documents, run eligibility engine, sync with govt portals.',
          icon: 'account_balance',
          colorScheme: 'purple',
          path: dbtUrls.cell.portal,
        },
        {
          title: 'Finance Office',
          description:
            'Manage scholarship receipts, fee adjustments, ledger entries and DBT reconciliation.',
          icon: 'payments',
          colorScheme: 'teal',
          path: dbtUrls.finance.portal,
        },
        {
          title: 'Admin Portal',
          description:
            'Configure scholarship masters, eligibility rules, govt API integration, audit logs and reports.',
          icon: 'admin_panel_settings',
          colorScheme: 'orange',
          path: dbtUrls.admin.portal,
        },
      ]}
    />
  );
}
