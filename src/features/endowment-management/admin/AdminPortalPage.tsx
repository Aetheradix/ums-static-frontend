import { PortalSelector } from 'shared/new-components';
import { endowmentUrls } from '../urls';
export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Endowment Admin Portal"
      moduleDescription="Manage master configurations, donors, funds, and disbursements."
      backPath={endowmentUrls.portal()}
      backLabel="Back to Endowment Portal"
      portals={[
        {
          title: 'Dashboard',
          description: 'View endowment statistics and overall fund health.',
          icon: 'dashboard',
          colorScheme: 'purple',
          path: endowmentUrls.admin.dashboard(),
        },
        {
          title: 'Donors',
          description: 'Manage individual and institutional donors.',
          icon: 'people',
          colorScheme: 'purple',
          path: endowmentUrls.admin.donors(),
        },
        {
          title: 'Donations',
          description:
            'Record contributions and auto-generate 80G certificates.',
          icon: 'payments',
          colorScheme: 'purple',
          path: endowmentUrls.admin.donations(),
        },
        {
          title: 'Endowment Funds',
          description: 'Create and track funds, corpus, and accruals.',
          icon: 'account_balance',
          colorScheme: 'purple',
          path: endowmentUrls.admin.funds(),
        },
        {
          title: 'Schemes',
          description: 'Set up schemes (scholarships/prizes) linked to funds.',
          icon: 'emoji_events',
          colorScheme: 'purple',
          path: endowmentUrls.admin.schemes(),
        },
        {
          title: 'Beneficiary Selection',
          description: 'Shortlist applicants and process committee approvals.',
          icon: 'how_to_reg',
          colorScheme: 'purple',
          path: endowmentUrls.admin.selection(),
        },
        {
          title: 'Disbursement',
          description: 'Record payouts to selected beneficiaries.',
          icon: 'currency_rupee',
          colorScheme: 'purple',
          path: endowmentUrls.admin.disbursement(),
        },
        {
          title: 'Fund Utilization Report',
          description: 'Track opening corpus, yields, and balances.',
          icon: 'account_balance_wallet',
          colorScheme: 'purple',
          path: endowmentUrls.admin.reports.fundUtilization(),
        },
        {
          title: 'Donor Acknowledgement',
          description: 'Track donor contributions and 80G status.',
          icon: 'receipt_long',
          colorScheme: 'purple',
          path: endowmentUrls.admin.reports.donorAcknowledgement(),
        },
        {
          title: 'Scheme Performance',
          description: 'Monitor disbursements and schemes performance.',
          icon: 'trending_up',
          colorScheme: 'purple',
          path: endowmentUrls.admin.reports.schemePerformance(),
        },
      ]}
    />
  );
}
