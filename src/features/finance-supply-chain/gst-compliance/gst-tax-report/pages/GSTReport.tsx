import { useState, useEffect } from 'react';
import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  GST_REPORT_SUMMARY,
  TDS_SUMMARY,
  GST_TRANSACTIONS,
  GSTR_REPORTS,
  GST_RETURNS,
  TAX_REPORTS,
} from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';
import { Chart } from 'primereact/chart';

type GstTransactionItem = (typeof GST_TRANSACTIONS)[0];
type GstReturnItem = (typeof GST_RETURNS)[0];
type TaxReportItem = (typeof TAX_REPORTS)[0];

const QK = ['@fsc/gst-tax-report'];

function useGstReportQuery() {
  const { data, isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => {
      return {
        summary: GST_REPORT_SUMMARY,
        tdsSummary: TDS_SUMMARY,
        transactions: [...GST_TRANSACTIONS],
        gstr3b: GSTR_REPORTS.gstr3b,
        returns: [...GST_RETURNS],
        taxes: [...TAX_REPORTS],
      };
    },
  });
  return { data, isLoading };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function GSTReport() {
  const { data, isLoading } = useGstReportQuery();

  const [chartData, setChartData] = useState<any>({});
  const [chartOptions, setChartOptions] = useState<any>({});

  useEffect(() => {
    if (!data) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#333';

    setChartData({
      labels: ['CGST', 'SGST', 'IGST'],
      datasets: [
        {
          data: [
            data.summary.totalCgst,
            data.summary.totalSgst,
            data.summary.totalIgst,
          ],
          backgroundColor: ['#60a5fa', '#34d399', '#f472b6'],
          hoverBackgroundColor: ['#3b82f6', '#10b981', '#ec4899'],
        },
      ],
    });

    setChartOptions({
      plugins: {
        legend: { labels: { color: textColor } },
      },
      cutout: '60%',
    });
  }, [data]);

  if (isLoading || !data) {
    return (
      <FormPage
        title="GST & Tax Report"
        description="Comprehensive overview of GST compliance and TDS."
      >
        <FormCard>
          <Loader />
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="GST & Tax Report"
      description="Comprehensive overview of GST compliance and TDS."
    >
      {/* Section A: KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-indigo-500">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
            Total Taxable Amt
          </p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(data.summary.totalTaxableAmount)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-pink-500">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
            Total GST Paid
          </p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(data.summary.totalGstPaid)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
            ITC Available
          </p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(data.summary.itcAvailable)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-red-500">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
            Net Tax Payable
          </p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(data.summary.netTaxPayable)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
            TDS Deducted
          </p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(data.tdsSummary.tdsDeducted)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-teal-500">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
            TDS Deposited
          </p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(data.tdsSummary.tdsDeposited)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Section C: GSTR-3B Summary Panel */}
        <FormCard className="xl:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            GSTR-3B Summary ({data.gstr3b.month})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">
                Outward Supplies
              </h4>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Taxable:</span>
                <span className="font-medium">
                  {formatCurrency(data.gstr3b.outwardSupplies.taxableAmount)}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">CGST:</span>
                <span className="font-medium">
                  {formatCurrency(data.gstr3b.outwardSupplies.cgst)}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">SGST:</span>
                <span className="font-medium">
                  {formatCurrency(data.gstr3b.outwardSupplies.sgst)}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">IGST:</span>
                <span className="font-medium">
                  {formatCurrency(data.gstr3b.outwardSupplies.igst)}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">
                Inward Supplies (Eligible ITC)
              </h4>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Taxable:</span>
                <span className="font-medium">
                  {formatCurrency(data.gstr3b.inwardSupplies.taxableAmount)}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">CGST:</span>
                <span className="font-medium text-emerald-600">
                  {formatCurrency(data.gstr3b.inwardSupplies.cgst)}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">SGST:</span>
                <span className="font-medium text-emerald-600">
                  {formatCurrency(data.gstr3b.inwardSupplies.sgst)}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">IGST:</span>
                <span className="font-medium text-emerald-600">
                  {formatCurrency(data.gstr3b.inwardSupplies.igst)}
                </span>
              </div>
            </div>
          </div>
        </FormCard>

        {/* Section F: Doughnut Chart */}
        <FormCard className="xl:col-span-1">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            GST Composition
          </h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            {chartData.datasets && (
              <Chart
                type="doughnut"
                data={chartData}
                options={chartOptions}
                className="w-full h-full"
              />
            )}
          </div>
        </FormCard>
      </div>

      {/* Section B: GST Transactions Table */}
      <FormCard className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Recent GST Transactions
        </h3>
        <GridPanel
          data={data.transactions}
          searchBox
          searchPlaceholder="Search invoice or vendor..."
          columns={[
            { field: 'date', header: 'Date' },
            { field: 'invoiceNo', header: 'Invoice No' },
            { field: 'vendorName', header: 'Vendor Name' },
            {
              field: 'taxableAmount',
              header: 'Taxable (₹)',
              cell: (i: GstTransactionItem) => (
                <span>{formatCurrency(i.taxableAmount)}</span>
              ),
            },
            {
              field: 'cgst',
              header: 'CGST (₹)',
              cell: (i: GstTransactionItem) => (
                <span>{formatCurrency(i.cgst)}</span>
              ),
            },
            {
              field: 'sgst',
              header: 'SGST (₹)',
              cell: (i: GstTransactionItem) => (
                <span>{formatCurrency(i.sgst)}</span>
              ),
            },
            {
              field: 'igst',
              header: 'IGST (₹)',
              cell: (i: GstTransactionItem) => (
                <span>{formatCurrency(i.igst)}</span>
              ),
            },
            {
              field: 'totalAmount',
              header: 'Total (₹)',
              cell: (i: GstTransactionItem) => (
                <span className="font-bold">
                  {formatCurrency(i.totalAmount)}
                </span>
              ),
            },
            {
              field: 'gstType',
              header: 'Type',
              cell: (i: GstTransactionItem) => (
                <span className="px-2 py-1 rounded bg-gray-100 text-xs font-semibold">
                  {i.gstType}
                </span>
              ),
            },
          ]}
        />
      </FormCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section D: GST Returns Filing Status Table */}
        <FormCard>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Returns Filing Status
          </h3>
          <GridPanel
            data={data.returns}
            columns={[
              { field: 'returnType', header: 'Return' },
              { field: 'month', header: 'Month' },
              { field: 'dueDate', header: 'Due Date' },
              { field: 'filingDate', header: 'Filing Date' },
              {
                field: 'status',
                header: 'Status',
                cell: (i: GstReturnItem) => (
                  <StatusBadge
                    label={i.status}
                    variant={i.status === 'Filed' ? 'approved' : 'pending'}
                  />
                ),
              },
            ]}
          />
        </FormCard>

        {/* Section E: TDS / Tax Report Table */}
        <FormCard>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            TDS Monthly Status
          </h3>
          <GridPanel
            data={data.taxes}
            columns={[
              { field: 'month', header: 'Month' },
              {
                field: 'tdsDeducted',
                header: 'Deducted (₹)',
                cell: (i: TaxReportItem) => (
                  <span>{formatCurrency(i.tdsDeducted)}</span>
                ),
              },
              {
                field: 'tdsDeposited',
                header: 'Deposited (₹)',
                cell: (i: TaxReportItem) => (
                  <span>{formatCurrency(i.tdsDeposited)}</span>
                ),
              },
              {
                field: 'tdsBalance',
                header: 'Balance (₹)',
                cell: (i: TaxReportItem) => (
                  <span
                    className={
                      i.tdsBalance > 0
                        ? 'text-red-600 font-bold'
                        : 'text-gray-500'
                    }
                  >
                    {formatCurrency(i.tdsBalance)}
                  </span>
                ),
              },
              {
                field: 'deposited',
                header: 'Status',
                cell: (i: TaxReportItem) => (
                  <StatusBadge
                    label={i.deposited ? 'Deposited' : 'Pending'}
                    variant={i.deposited ? 'approved' : 'pending'}
                  />
                ),
              },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
