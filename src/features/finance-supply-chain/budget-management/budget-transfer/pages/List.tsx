import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import type { BudgetTransferItem } from '../api';
import { useBudgetTransfersQuery } from '../queries';

const fmt = (v: number) => `₹${v.toLocaleString('en-IN')}`;

export default function List() {
  const { data, isLoading } = useBudgetTransfersQuery();
  return (
    <FormPage
      title="Budget Transfer"
      description="Inter-head budget transfer records."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by transfer no, heads..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'transferNo', header: 'Transfer No' },
            { field: 'fromHead', header: 'From Head' },
            { field: 'toHead', header: 'To Head' },
            {
              field: 'amount',
              header: 'Amount (₹)',
              cell: (i: BudgetTransferItem) => (
                <span className="font-semibold">{fmt(i.amount)}</span>
              ),
            },
            { field: 'reason', header: 'Reason' },
            { field: 'date', header: 'Date' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: BudgetTransferItem) => (
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
