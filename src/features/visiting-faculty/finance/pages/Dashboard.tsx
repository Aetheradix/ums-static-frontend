import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import { UniqueIdChip } from '../../components/ui';
import { useVisitingFacultyStore } from '../../store';
import type { Bill } from '../../types';
import { billVariant, inr, limitCheck, periodLabel } from '../../utils';
import { vfUrls } from '../../urls';

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const bills = useVisitingFacultyStore(s => s.bills);
  const rates = useVisitingFacultyStore(s => s.rates);

  const pending = bills.filter(b =>
    ['Sent to Finance', 'Under Verification'].includes(b.status)
  );
  const paid = bills.filter(b => b.paidOn);
  const totalPaid = paid.reduce((s, b) => s + (b.payable ?? 0), 0);
  const stopped = paid.reduce((s, b) => s + (b.notPayable ?? 0), 0);
  const pendingPayable = pending.reduce(
    (s, b) => s + limitCheck(b, bills, rates).payable,
    0
  );

  return (
    <FormPage
      title="Finance Department — Visiting Faculty"
      description="Bills received from every University Teaching Department and payments released against Unique IDs."
      breadcrumbs={crumbs('finance', 'Dashboard')}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Bills Pending"
          value={pending.length}
          icon="inbox"
          colorScheme="amber"
          subtitle={`${inr(pendingPayable)} payable`}
        />
        <StatCard
          title="Bills Settled"
          value={paid.length}
          icon="check-circle"
          colorScheme="green"
        />
        <StatCard
          title="Paid to Date"
          value={inr(totalPaid)}
          icon="wallet"
          colorScheme="blue"
        />
        <StatCard
          title="Stopped by Limit"
          value={inr(stopped)}
          icon="shield"
          colorScheme="red"
          subtitle={`Cap ${inr(rates.limit)} / month`}
        />
      </div>
      <FormCard
        title="Bills Awaiting Verification"
        icon="inbox"
        headerAction={
          <Button
            label="Open Bills"
            variant="outlined"
            size="small"
            onClick={() => navigate(vfUrls.finance.bills)}
          />
        }
      >
        <GridPanel
          data={pending}
          columns={[
            { field: 'billNo', header: 'Bill No.' },
            { field: 'department', header: 'UTD' },
            {
              header: 'Unique ID',
              cell: (b: Bill) => <UniqueIdChip value={b.uniqueId} />,
            },
            { field: 'facultyName', header: 'Faculty' },
            {
              header: 'Period',
              cell: (b: Bill) => <span>{periodLabel(b.period)}</span>,
            },
            {
              header: 'Bill',
              cell: (b: Bill) => <span>{inr(b.billAmount)}</span>,
            },
            {
              header: 'Payable',
              cell: (b: Bill) => (
                <span className="font-semibold text-green-700 dark:text-green-400">
                  {inr(limitCheck(b, bills, rates).payable)}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (b: Bill) => (
                <StatusBadge label={b.status} variant={billVariant(b.status)} />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
