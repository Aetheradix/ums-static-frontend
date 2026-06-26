import { Loader } from 'shared/components/progress';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { LEDGER_ENTRIES } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type TrialBalItem = {
  account: string;
  debit: number;
  credit: number;
};

const QK = ['@fsc/trial-balance'];
function useTrialBalanceQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => {
      // Aggregate ledger entries into a trial balance format for demonstration
      const accounts: Record<string, TrialBalItem> = {};
      LEDGER_ENTRIES.forEach(entry => {
        if (!accounts[entry.account])
          accounts[entry.account] = {
            account: entry.account,
            debit: 0,
            credit: 0,
          };
        accounts[entry.account].debit += entry.debit;
        accounts[entry.account].credit += entry.credit;
      });
      // Flatten and calculate net balances
      return Object.values(accounts).map(item => {
        const net = item.debit - item.credit;
        return {
          account: item.account,
          debit: net > 0 ? net : 0,
          credit: net < 0 ? Math.abs(net) : 0,
        };
      });
    },
  });
  return { data, isLoading };
}

export default function List() {
  const { data, isLoading } = useTrialBalanceQuery();

  const totalDebit = data.reduce((s, i) => s + i.debit, 0);
  const totalCredit = data.reduce((s, i) => s + i.credit, 0);

  return (
    <FormPage
      title="Trial Balance"
      description="Statement of all ledger account balances."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by account..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'account', header: 'Account Head' },
            {
              field: 'debit',
              header: 'Debit Balance (₹)',
              cell: (i: TrialBalItem) => (
                <span
                  className={
                    i.debit > 0 ? 'text-red-700 font-semibold' : 'text-gray-400'
                  }
                >
                  {i.debit > 0 ? `₹${i.debit.toLocaleString('en-IN')}` : '-'}
                </span>
              ),
            },
            {
              field: 'credit',
              header: 'Credit Balance (₹)',
              cell: (i: TrialBalItem) => (
                <span
                  className={
                    i.credit > 0
                      ? 'text-green-700 font-semibold'
                      : 'text-gray-400'
                  }
                >
                  {i.credit > 0 ? `₹${i.credit.toLocaleString('en-IN')}` : '-'}
                </span>
              ),
            },
          ]}
        />
        {!isLoading && (
          <div className="mt-4 border-t-2 border-gray-200 pt-4 px-4 flex justify-between bg-gray-50 py-3 rounded-b-xl">
            <span className="font-bold text-gray-700 uppercase tracking-wider text-sm">
              Totals
            </span>
            <div className="flex gap-16 pr-8">
              <span className="font-bold text-lg text-red-800 w-32 text-right">
                ₹{totalDebit.toLocaleString('en-IN')}
              </span>
              <span className="font-bold text-lg text-green-800 w-32 text-right">
                ₹{totalCredit.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </FormCard>
    </FormPage>
  );
}
