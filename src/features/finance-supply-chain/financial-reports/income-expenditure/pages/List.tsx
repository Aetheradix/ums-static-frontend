import { Loader } from 'shared/components/progress';
import { FormCard, FormPage } from 'shared/new-components';
import { INCOME_EXPENDITURE } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

const QK = ['@fsc/income-expenditure'];
function useReportQuery() {
  const { data, isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => INCOME_EXPENDITURE,
  });
  return { data, isLoading };
}

export default function IncomeExpenditure() {
  const { data, isLoading } = useReportQuery();

  return (
    <FormPage
      title="Income & Expenditure Account"
      description={`For the period ending ${new Date().toLocaleDateString('en-IN')}`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormCard title="Expenditure">
            <table className="w-full text-sm">
              <tbody>
                {data?.expenditure.map((item: any, i: number) => (
                  <tr
                    key={i}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2">{item.head}</td>
                    <td className="py-2 text-right font-medium">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                  <td className="py-3 px-2">Total Expenditure</td>
                  <td className="py-3 px-2 text-right">
                    ₹{data?.totalExpenditure.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </FormCard>

          <FormCard title="Income">
            <table className="w-full text-sm">
              <tbody>
                {data?.income.map((item: any, i: number) => (
                  <tr
                    key={i}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2">{item.head}</td>
                    <td className="py-2 text-right font-medium">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                  <td className="py-3 px-2">Total Income</td>
                  <td className="py-3 px-2 text-right">
                    ₹{data?.totalIncome.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </FormCard>
        </div>
      )}

      {!isLoading && data && (
        <div className="mt-6 p-4 rounded-xl border bg-white shadow-sm">
          <div className="flex justify-between items-center px-4">
            <span className="text-lg font-semibold text-gray-700">
              Surplus / (Deficit)
            </span>
            <span
              className={`text-2xl font-bold ${data.totalIncome > data.totalExpenditure ? 'text-green-600' : 'text-red-600'}`}
            >
              ₹
              {(data.totalIncome - data.totalExpenditure).toLocaleString(
                'en-IN'
              )}
            </span>
          </div>
        </div>
      )}
    </FormPage>
  );
}
