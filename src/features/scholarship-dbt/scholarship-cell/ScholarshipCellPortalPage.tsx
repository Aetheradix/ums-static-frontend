import { PortalSelector } from 'shared/new-components';
import { dbtUrls } from '../urls';

export default function ScholarshipCellPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Scholarship Cell — Scholarship & DBT"
      moduleDescription="Manage all scholarship applications, verify documents, run eligibility engine and sync with government portals."
      backPath={dbtUrls.portal}
      backLabel="Scholarship & DBT"
      portals={[
        {
          title: 'Dashboard',
          description:
            "Applications overview, portal sync status, DBT stats and today's activity.",
          icon: 'dashboard',
          colorScheme: 'blue',
          path: dbtUrls.cell.dashboard,
        },
        {
          title: 'Application Management',
          description: 'View, filter and manage all scholarship applications.',
          icon: 'list_alt',
          colorScheme: 'purple',
          path: dbtUrls.cell.applications,
        },
        {
          title: 'Application Detail',
          description:
            'View complete application details, documents and audit trail.',
          icon: 'description',
          colorScheme: 'indigo',
          path: dbtUrls.cell.applicationDetail,
        },
        {
          title: 'Document Verification',
          description:
            'Verify uploaded documents with green tick / red cross approval.',
          icon: 'fact_check',
          colorScheme: 'green',
          path: dbtUrls.cell.documentVerify,
        },
        {
          title: 'Bonafide Approval',
          description:
            'Digitally approve and generate bonafide certificates for students.',
          icon: 'verified',
          colorScheme: 'teal',
          path: dbtUrls.cell.bonafideApproval,
        },
        {
          title: 'Eligibility Engine',
          description:
            'Run live eligibility checks for category, income, attendance, CGPA and duplicates.',
          icon: 'rule',
          colorScheme: 'amber',
          path: dbtUrls.cell.eligibilityEngine,
        },
        {
          title: 'Government Portal Sync',
          description:
            'Sync data with NSP, State Portal, MAHA DBT — view API status and retry failed.',
          icon: 'cloud_sync',
          colorScheme: 'orange',
          path: dbtUrls.cell.portalSync,
        },
        {
          title: 'Final Approval',
          description:
            'Approve, reject or hold applications with remarks before finance processing.',
          icon: 'gavel',
          colorScheme: 'red',
          path: dbtUrls.cell.finalApproval,
        },
        {
          title: 'Reports',
          description:
            'Generate comprehensive reports by scheme, category, department and status.',
          icon: 'bar_chart',
          colorScheme: 'gray',
          path: dbtUrls.cell.reports,
        },
      ]}
    />
  );
}
