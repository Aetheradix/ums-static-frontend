import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { GST_RETURNS } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type GstReturnItem = (typeof GST_RETURNS)[0];
const QK = ['@fsc/gst-returns'];
function useGstReturnsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...GST_RETURNS],
  });
  return { data, isLoading };
}

export default function List() {
  const { data, isLoading } = useGstReturnsQuery();

  return (
    <FormPage
      title="GST Returns"
      description="Manage and track monthly/quarterly GST return filings."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by return type, month, ARN..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'returnType', header: 'Return Type' },
            { field: 'month', header: 'Month' },
            { field: 'year', header: 'Year' },
            { field: 'dueDate', header: 'Due Date' },
            { field: 'filingDate', header: 'Filing Date' },
            { field: 'arn', header: 'ARN' },
            {
              field: 'taxPaid',
              header: 'Tax Paid (₹)',
              cell: (i: GstReturnItem) => (
                <span>₹{i.taxPaid.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: GstReturnItem) => (
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
