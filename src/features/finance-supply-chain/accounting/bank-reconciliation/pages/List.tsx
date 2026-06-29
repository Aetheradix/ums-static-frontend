import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { BANK_RECONCILIATION } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type ReconItem = (typeof BANK_RECONCILIATION)[0];
const QK = ['@fsc/bank-reconciliation'];
function useBankReconciliationQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...BANK_RECONCILIATION],
  });
  return { data, isLoading };
}

export default function List() {
  const { data, isLoading } = useBankReconciliationQuery();

  return (
    <FormPage
      title="Bank Reconciliation"
      description="Match bank statement entries with ledger transactions."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by description, reference no..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'date', header: 'Date' },
            { field: 'description', header: 'Description' },
            { field: 'referenceNo', header: 'Reference No' },
            {
              field: 'bankAmount',
              header: 'Bank Amount (₹)',
              cell: (i: ReconItem) => (
                <span className="font-semibold text-blue-700">
                  ₹{i.bankAmount.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'ledgerAmount',
              header: 'Ledger Amount (₹)',
              cell: (i: ReconItem) => (
                <span className="font-semibold text-indigo-700">
                  ₹{i.ledgerAmount.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: ReconItem) => (
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
