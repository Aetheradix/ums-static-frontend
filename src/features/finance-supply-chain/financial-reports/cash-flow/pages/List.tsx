import { Loader } from 'shared/components/progress';
import { FormCard, FormPage } from 'shared/new-components';
import { CASH_FLOW } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

const QK = ['@fsc/cash-flow'];
function useReportQuery() {
  const { data, isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => CASH_FLOW,
  });
  return { data, isLoading };
}

export default function CashFlow() {
  const { data, isLoading } = useReportQuery();

  return (
    <FormPage
      title="Cash Flow Statement"
      description={`For the period ending ${new Date().toLocaleDateString('en-IN')}`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className="max-w-4xl mx-auto">
          <FormCard>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="py-3 px-4 font-semibold text-gray-700 w-3/4">
                    Particulars
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-700 text-right">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-blue-50/50">
                  <td
                    className="py-3 px-4 font-medium text-blue-900"
                    colSpan={2}
                  >
                    Cash flows from Operating Activities
                  </td>
                </tr>
                {data?.operating.map((item: any, i: number) => (
                  <tr
                    key={`op-${i}`}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2 px-8 text-gray-600">
                      {item.description}
                    </td>
                    <td
                      className={`py-2 px-4 text-right font-medium ${item.amount < 0 ? 'text-red-600' : 'text-green-700'}`}
                    >
                      {item.amount < 0
                        ? `(₹${Math.abs(item.amount).toLocaleString('en-IN')})`
                        : `₹${item.amount.toLocaleString('en-IN')}`}
                    </td>
                  </tr>
                ))}

                <tr className="bg-orange-50/50 mt-4">
                  <td
                    className="py-3 px-4 font-medium text-orange-900"
                    colSpan={2}
                  >
                    Cash flows from Investing Activities
                  </td>
                </tr>
                {data?.investing.map((item: any, i: number) => (
                  <tr
                    key={`inv-${i}`}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2 px-8 text-gray-600">
                      {item.description}
                    </td>
                    <td
                      className={`py-2 px-4 text-right font-medium ${item.amount < 0 ? 'text-red-600' : 'text-green-700'}`}
                    >
                      {item.amount < 0
                        ? `(₹${Math.abs(item.amount).toLocaleString('en-IN')})`
                        : `₹${item.amount.toLocaleString('en-IN')}`}
                    </td>
                  </tr>
                ))}

                <tr className="bg-purple-50/50 mt-4">
                  <td
                    className="py-3 px-4 font-medium text-purple-900"
                    colSpan={2}
                  >
                    Cash flows from Financing Activities
                  </td>
                </tr>
                {data?.financing.map((item: any, i: number) => (
                  <tr
                    key={`fin-${i}`}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2 px-8 text-gray-600">
                      {item.description}
                    </td>
                    <td
                      className={`py-2 px-4 text-right font-medium ${item.amount < 0 ? 'text-red-600' : 'text-green-700'}`}
                    >
                      {item.amount < 0
                        ? `(₹${Math.abs(item.amount).toLocaleString('en-IN')})`
                        : `₹${item.amount.toLocaleString('en-IN')}`}
                    </td>
                  </tr>
                ))}

                <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                  <td className="py-4 px-4 text-gray-800">
                    Net Increase / (Decrease) in Cash and Cash Equivalents
                  </td>
                  <td
                    className={`py-4 px-4 text-right ${data!.netChange < 0 ? 'text-red-700' : 'text-green-700'}`}
                  >
                    {data!.netChange < 0
                      ? `(₹${Math.abs(data!.netChange).toLocaleString('en-IN')})`
                      : `₹${data!.netChange.toLocaleString('en-IN')}`}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-gray-700">
                    Cash and Cash Equivalents at Beginning of Period
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-800">
                    ₹{data?.openingBalance.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="bg-gray-800 font-bold text-white border-t-4 border-gray-400">
                  <td className="py-4 px-4">
                    Cash and Cash Equivalents at End of Period
                  </td>
                  <td className="py-4 px-4 text-right text-lg">
                    ₹{data?.closingBalance.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </FormCard>
        </div>
      )}
    </FormPage>
  );
}
