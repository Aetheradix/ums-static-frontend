import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import type { BudgetRevisionItem } from '../api';
import { useBudgetRevisionsQuery } from '../queries';

const fmt = (v: number) => `₹${v.toLocaleString('en-IN')}`;

export default function List() {
  const { data, isLoading } = useBudgetRevisionsQuery();
  return (
    <FormPage
      title="Budget Revision"
      description="Track budget revision requests and their approval status."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by revision no, budget code, head..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'revisionNo', header: 'Revision No' },
            { field: 'budgetCode', header: 'Budget Code' },
            { field: 'budgetHead', header: 'Budget Head' },
            {
              field: 'originalAmount',
              header: 'Original (₹)',
              cell: (i: BudgetRevisionItem) => (
                <span>{fmt(i.originalAmount)}</span>
              ),
            },
            {
              field: 'revisedAmount',
              header: 'Revised (₹)',
              cell: (i: BudgetRevisionItem) => (
                <span className="font-semibold text-blue-700">
                  {fmt(i.revisedAmount)}
                </span>
              ),
            },
            { field: 'reason', header: 'Reason' },
            { field: 'date', header: 'Date' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: BudgetRevisionItem) => (
                <StatusBadge
                  label={i.status}
                  variant={
                    i.status === 'Approved' ||
                    i.status === 'Delivered' ||
                    i.status === 'Good' ||
                    i.status === 'Paid' ||
                    i.status === 'Active' ||
                    i.status === 'Completed' ||
                    i.status === 'Filed' ||
                    i.status === 'Deposited' ||
                    i.status === 'Issued' ||
                    i.status === 'Matched' ||
                    i.status === 'Open'
                      ? 'approved'
                      : i.status === 'Pending' ||
                          i.status === 'Draft' ||
                          i.status === 'Defective' ||
                          i.status === 'Repair' ||
                          i.status === 'Medium'
                        ? 'pending'
                        : i.status === 'Closed' ||
                            i.status === 'Retired' ||
                            i.status === 'Low' ||
                            i.status === 'Cancelled'
                          ? 'neutral'
                          : 'rejected'
                  }
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
