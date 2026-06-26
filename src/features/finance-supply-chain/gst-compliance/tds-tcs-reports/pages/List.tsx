import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { TDS_TCS_REPORTS } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type TdsItem = (typeof TDS_TCS_REPORTS)[0];
const QK = ['@fsc/tds-tcs'];
function useTdsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...TDS_TCS_REPORTS],
  });
  return { data, isLoading };
}

export default function List() {
  const { data, isLoading } = useTdsQuery();

  return (
    <FormPage
      title="TDS / TCS Reports"
      description="Track TDS and TCS deductions and challan payments."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by section, vendor..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'section', header: 'Section' },
            { field: 'vendor', header: 'Vendor' },
            {
              field: 'amountPaid',
              header: 'Amount Paid',
              cell: (i: TdsItem) => (
                <span>₹{i.amountPaid.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'tdsAmount',
              header: 'TDS (₹)',
              cell: (i: TdsItem) => (
                <span className="font-semibold text-blue-700">
                  ₹{i.tdsAmount.toLocaleString('en-IN')}
                </span>
              ),
            },
            { field: 'challanNo', header: 'Challan No' },
            { field: 'paymentDate', header: 'Payment Date' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: TdsItem) => (
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
