import { Loader } from 'shared/components/progress';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import type { BudgetAllocationItem } from '../api';
import { useBudgetAllocationsQuery } from '../queries';

function formatINR(v: number) {
  return `₹${v.toLocaleString('en-IN')}`;
}

export default function List() {
  const { data, isLoading } = useBudgetAllocationsQuery();

  return (
    <FormPage
      title="Budget Allocation"
      description="View budget allocations across heads and cost centres for FY 2024-25."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by budget code, head, cost centre..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'budgetCode', header: 'Budget Code' },
            { field: 'budgetHead', header: 'Budget Head' },
            { field: 'costCentre', header: 'Cost Centre' },
            {
              field: 'allocatedAmount',
              header: 'Allocated (₹)',
              cell: (i: BudgetAllocationItem) => (
                <span>{formatINR(i.allocatedAmount)}</span>
              ),
            },
            {
              field: 'utilizedAmount',
              header: 'Utilized (₹)',
              cell: (i: BudgetAllocationItem) => (
                <span>{formatINR(i.utilizedAmount)}</span>
              ),
            },
            {
              field: 'balance',
              header: 'Balance (₹)',
              cell: (i: BudgetAllocationItem) => (
                <span
                  className={
                    i.balance < 100000
                      ? 'text-red-600 font-semibold'
                      : 'text-green-700 font-semibold'
                  }
                >
                  {formatINR(i.balance)}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: BudgetAllocationItem) => (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {i.status}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
