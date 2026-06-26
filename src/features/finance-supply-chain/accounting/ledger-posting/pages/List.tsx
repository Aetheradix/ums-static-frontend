import { Loader } from 'shared/components/progress';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { LEDGER_ENTRIES } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type LedgerItem = (typeof LEDGER_ENTRIES)[0];
const QK = ['@fsc/ledger-entries'];
function useLedgerEntriesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...LEDGER_ENTRIES],
  });
  return { data, isLoading };
}

export default function List() {
  const { data, isLoading } = useLedgerEntriesQuery();

  return (
    <FormPage
      title="Ledger Posting"
      description="View all posted ledger transactions sorted by date."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by account, voucher no, narration..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'date', header: 'Date' },
            { field: 'voucherNo', header: 'Voucher No' },
            { field: 'narration', header: 'Narration' },
            { field: 'account', header: 'Account' },
            {
              field: 'debit',
              header: 'Debit (₹)',
              cell: (i: LedgerItem) => (
                <span
                  className={
                    i.debit > 0 ? 'text-red-700 font-semibold' : 'text-gray-400'
                  }
                >
                  ₹{i.debit.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'credit',
              header: 'Credit (₹)',
              cell: (i: LedgerItem) => (
                <span
                  className={
                    i.credit > 0
                      ? 'text-green-700 font-semibold'
                      : 'text-gray-400'
                  }
                >
                  ₹{i.credit.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'balance',
              header: 'Balance (₹)',
              cell: (i: LedgerItem) => (
                <span className="font-semibold">
                  ₹{i.balance.toLocaleString('en-IN')}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
