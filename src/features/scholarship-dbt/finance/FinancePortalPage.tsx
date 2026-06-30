import { PortalSelector } from 'shared/new-components';
import { dbtUrls } from '../urls';

export default function FinancePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Finance Office — Scholarship & DBT"
      moduleDescription="Manage scholarship receipts, fee adjustments, DBT reconciliation and financial reports."
      backPath={dbtUrls.portal}
      backLabel="Scholarship & DBT"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Scholarship receipts, pending adjustments, outstanding amounts and DBT stats.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: dbtUrls.finance.dashboard,
        },
        {
          title: 'Scholarship Receipts',
          description:
            'View and manage all scholarship amount receipts received from government.',
          icon: 'receipt_long',
          colorScheme: 'green',
          path: dbtUrls.finance.receipts,
        },
        {
          title: 'Fee Adjustment',
          description:
            'Calculate fee offset against scholarship, outstanding and excess amounts.',
          icon: 'calculate',
          colorScheme: 'purple',
          path: dbtUrls.finance.feeAdjustment,
        },
        {
          title: 'Ledger',
          description:
            'View detailed scholarship fund ledger entries and transaction history.',
          icon: 'menu_book',
          colorScheme: 'teal',
          path: dbtUrls.finance.ledger,
        },
        {
          title: 'DBT Reconciliation',
          description:
            'Reconcile government disbursed amounts vs received amounts for each student.',
          icon: 'balance',
          colorScheme: 'orange',
          path: dbtUrls.finance.dbtReconciliation,
        },
        {
          title: 'Finance Reports',
          description:
            'Generate scholarship fund utilization and DBT payment reports.',
          icon: 'bar_chart',
          colorScheme: 'gray',
          path: dbtUrls.finance.reports,
        },
      ]}
    />
  );
}
