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

// Formatting helper
const formatAmount = (amount: number, isCurrency = true) => {
  const absVal = Math.abs(amount).toLocaleString('en-IN');
  const prefix = isCurrency ? '₹' : '';
  return amount < 0 ? `(${prefix}${absVal})` : `${prefix}${absVal}`;
};

const AmountCell = ({
  amount,
  className = '',
}: {
  amount: number;
  className?: string;
}) => {
  const isNegative = amount < 0;
  return (
    <td
      className={`py-3 px-6 text-right whitespace-nowrap align-middle ${className}`}
    >
      <span
        className={`inline-block px-3 py-1 rounded-md text-sm font-semibold tracking-wide shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md ${
          isNegative
            ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-500/20'
            : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20'
        }`}
      >
        {formatAmount(amount)}
      </span>
    </td>
  );
};

export default function CashFlow() {
  const { data, isLoading } = useReportQuery();

  return (
    <FormPage
      title="Cash Flow Statement"
      description={`For the period ending ${new Date().toLocaleDateString(
        'en-IN',
        {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }
      )}`}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <FormCard>
            <div className="overflow-hidden rounded-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
                    <th className="py-4 px-6 text-xs font-bold tracking-widest text-slate-500 uppercase w-3/4">
                      Particulars
                    </th>
                    <th className="py-4 px-6 text-xs font-bold tracking-widest text-slate-500 uppercase text-right">
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {/* Operating Activities */}
                  <tr className="bg-gradient-to-r from-blue-50/70 to-transparent group">
                    <td className="p-0 border-l-4 border-blue-500" colSpan={2}>
                      <div className="flex items-center gap-3 py-4 px-6 font-semibold text-blue-900">
                        <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center text-blue-600 shadow-sm ring-1 ring-blue-500/10 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                        </div>
                        Cash flows from Operating Activities
                      </div>
                    </td>
                  </tr>
                  {data?.operating.map((item: any, i: number) => (
                    <tr
                      key={`op-${i}`}
                      className="group hover:bg-slate-50/80 transition-colors duration-200 cursor-default"
                    >
                      <td className="py-3.5 px-8 text-sm text-slate-600 font-medium group-hover:text-slate-900 pl-16">
                        {item.description}
                      </td>
                      <AmountCell amount={item.amount} />
                    </tr>
                  ))}

                  {/* Investing Activities */}
                  <tr className="bg-gradient-to-r from-amber-50/70 to-transparent mt-2 group">
                    <td className="p-0 border-l-4 border-amber-500" colSpan={2}>
                      <div className="flex items-center gap-3 py-4 px-6 font-semibold text-amber-900">
                        <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center text-amber-600 shadow-sm ring-1 ring-amber-500/10 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        Cash flows from Investing Activities
                      </div>
                    </td>
                  </tr>
                  {data?.investing.map((item: any, i: number) => (
                    <tr
                      key={`inv-${i}`}
                      className="group hover:bg-slate-50/80 transition-colors duration-200 cursor-default"
                    >
                      <td className="py-3.5 px-8 text-sm text-slate-600 font-medium group-hover:text-slate-900 pl-16">
                        {item.description}
                      </td>
                      <AmountCell amount={item.amount} />
                    </tr>
                  ))}

                  {/* Financing Activities */}
                  <tr className="bg-gradient-to-r from-purple-50/70 to-transparent mt-2 group">
                    <td
                      className="p-0 border-l-4 border-purple-500"
                      colSpan={2}
                    >
                      <div className="flex items-center gap-3 py-4 px-6 font-semibold text-purple-900">
                        <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center text-purple-600 shadow-sm ring-1 ring-purple-500/10 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        Cash flows from Financing Activities
                      </div>
                    </td>
                  </tr>
                  {data?.financing.map((item: any, i: number) => (
                    <tr
                      key={`fin-${i}`}
                      className="group hover:bg-slate-50/80 transition-colors duration-200 cursor-default"
                    >
                      <td className="py-3.5 px-8 text-sm text-slate-600 font-medium group-hover:text-slate-900 pl-16">
                        {item.description}
                      </td>
                      <AmountCell amount={item.amount} />
                    </tr>
                  ))}

                  {/* Summary Section */}
                  <tr className="bg-slate-50/50 shadow-[inset_0_1px_0_rgba(226,232,240,1)]">
                    <td className="p-0">
                      <div className="py-5 px-6 font-semibold text-slate-800 flex items-center gap-4 pl-12">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400/80 ring-4 ring-slate-400/20"></div>
                        Net Increase / (Decrease) in Cash and Cash Equivalents
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right align-middle">
                      <span
                        className={`text-base font-bold ${data!.netChange < 0 ? 'text-rose-600' : 'text-emerald-600'}`}
                      >
                        {formatAmount(data!.netChange)}
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td className="p-0">
                      <div className="py-4 px-6 text-slate-500 font-medium flex items-center gap-4 pl-12">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-slate-300/20"></div>
                        Cash and Cash Equivalents at Beginning of Period
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right align-middle text-slate-600 font-semibold">
                      ₹{data?.openingBalance.toLocaleString('en-IN')}
                    </td>
                  </tr>

                  <tr className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
                    <td className="p-0 relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="py-7 px-6 font-bold flex items-center gap-4 pl-10 relative z-10">
                        <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.9)] ring-4 ring-blue-400/30"></div>
                        <span className="text-lg tracking-wide text-slate-50">
                          Cash and Cash Equivalents at End of Period
                        </span>
                      </div>
                    </td>
                    <td className="py-7 px-6 text-right relative align-middle">
                      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
                      <span className="relative z-10 text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-emerald-200 drop-shadow-sm">
                        ₹{data?.closingBalance.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>
      )}
    </FormPage>
  );
}
