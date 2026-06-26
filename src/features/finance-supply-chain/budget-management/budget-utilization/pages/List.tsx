import { Loader } from 'shared/components/progress';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { BUDGET_ALLOCATIONS } from '../../../mock-data';
import { useBudgetUtilizationQuery } from '../queries';

type Item = (typeof BUDGET_ALLOCATIONS)[0];
const fmt = (v: number) => `₹${v.toLocaleString('en-IN')}`;

export default function List() {
  const { data, isLoading } = useBudgetUtilizationQuery();

  const totalAllocated = data.reduce((s, i) => s + i.allocatedAmount, 0);
  const totalUtilized = data.reduce((s, i) => s + i.utilizedAmount, 0);
  const totalBalance = data.reduce((s, i) => s + i.balance, 0);
  const overallPct =
    totalAllocated > 0
      ? ((totalUtilized / totalAllocated) * 100).toFixed(1)
      : '0';

  return (
    <FormPage
      title="Budget Utilization"
      description="Overall budget utilization view across all heads for FY 2024-25."
    >
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {[
          {
            label: 'Total Allocated',
            value: fmt(totalAllocated),
            color: 'bg-blue-50 border-blue-200',
          },
          {
            label: 'Total Utilized',
            value: fmt(totalUtilized),
            color: 'bg-orange-50 border-orange-200',
          },
          {
            label: 'Total Balance',
            value: fmt(totalBalance),
            color: 'bg-green-50 border-green-200',
          },
        ].map(card => (
          <div
            key={card.label}
            className={`p-4 rounded-xl border ${card.color}`}
          >
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            <p className="text-xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by budget head, cost centre..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'budgetHead', header: 'Budget Head' },
            { field: 'costCentre', header: 'Cost Centre' },
            {
              field: 'allocatedAmount',
              header: 'Allocated (₹)',
              cell: (i: Item) => <span>{fmt(i.allocatedAmount)}</span>,
            },
            {
              field: 'utilizedAmount',
              header: 'Utilized (₹)',
              cell: (i: Item) => <span>{fmt(i.utilizedAmount)}</span>,
            },
            {
              field: 'balance',
              header: 'Balance (₹)',
              cell: (i: Item) => (
                <span
                  className={
                    i.balance < 100000
                      ? 'text-red-600 font-semibold'
                      : 'text-green-700 font-semibold'
                  }
                >
                  {fmt(i.balance)}
                </span>
              ),
            },
            {
              header: 'Utilization %',
              sortable: false,
              cell: (i: Item) => {
                const pct = Math.min(
                  (i.utilizedAmount / i.allocatedAmount) * 100,
                  100
                );
                const color =
                  pct >= 100
                    ? 'bg-red-500'
                    : pct >= 80
                      ? 'bg-orange-400'
                      : 'bg-teal-500';
                return (
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                );
              },
            },
          ]}
        />
        <p className="text-xs text-gray-400 mt-3 text-right">
          Overall Utilization:{' '}
          <span className="font-semibold text-gray-600">{overallPct}%</span>
        </p>
      </FormCard>
    </FormPage>
  );
}
