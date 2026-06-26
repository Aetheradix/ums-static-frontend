import { Loader } from 'shared/components/progress';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { QUOTATION_COMPARISONS } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type QuoteItem = (typeof QUOTATION_COMPARISONS)[0];
const QK = ['@fsc/quotes'];
function useQuotesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...QUOTATION_COMPARISONS],
  });
  return { data, isLoading };
}

export default function List() {
  const { data, isLoading } = useQuotesQuery();

  return (
    <FormPage
      title="Quotation Comparison"
      description="Compare and evaluate vendor quotations against RFQs."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by RFQ no, vendor, item..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'rfqNo', header: 'RFQ No' },
            { field: 'itemName', header: 'Item' },
            { field: 'vendor', header: 'Vendor Name' },
            {
              field: 'unitPrice',
              header: 'Unit Price (₹)',
              cell: (i: QuoteItem) => (
                <span>₹{i.unitPrice.toLocaleString('en-IN')}</span>
              ),
            },
            { field: 'quantity', header: 'Qty' },
            {
              field: 'totalAmount',
              header: 'Total (₹)',
              cell: (i: QuoteItem) => (
                <span className="font-semibold text-blue-700">
                  ₹{i.totalAmount.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'deliveryDays',
              header: 'Delivery Time',
              cell: (i: QuoteItem) => <span>{i.deliveryDays} Days</span>,
            },
            { field: 'warranty', header: 'Warranty' },
            {
              field: 'recommended',
              header: 'Recommendation',
              sortable: false,
              cell: (i: QuoteItem) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${i.recommended ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500'}`}
                >
                  {i.recommended ? 'Recommended L1' : 'Not Recommended'}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
