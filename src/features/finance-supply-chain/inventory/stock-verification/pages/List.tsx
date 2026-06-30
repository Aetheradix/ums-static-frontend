import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'shared/components/buttons';
import { Loader } from 'shared/components/progress';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
  FormPopup,
} from 'shared/new-components';
import { STOCK_VERIFICATIONS } from 'features/finance-supply-chain/mock-data';
import VerificationForm from '../components/VerificationForm';

type VerificationItem = (typeof STOCK_VERIFICATIONS)[0];
const QK = ['@fsc/stock-verifications'];

function useStockVerificationQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...STOCK_VERIFICATIONS],
  });
  return { data, isLoading };
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'print' }
  | { mode: 'edit'; item: VerificationItem };

export default function List() {
  const { data, isLoading } = useStockVerificationQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Stock Verification"
      description="Annual physical audit support and verification list."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by asset ID, name, department..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'auditYear', header: 'Audit Year' },
            { field: 'department', header: 'Department' },
            {
              field: 'assetId',
              header: 'Asset ID',
              cell: (i: VerificationItem) => (
                <span className="font-bold">{i.assetId}</span>
              ),
            },
            { field: 'assetName', header: 'Asset Name' },
            { field: 'location', header: 'Location' },
            {
              field: 'verifiedDate',
              header: 'Verified Date',
              cell: (i: VerificationItem) => (
                <span>
                  {new Date(i.verifiedDate).toLocaleDateString('en-US')}
                </span>
              ),
            },
            { field: 'remarks', header: 'Remarks' },
            {
              field: 'status',
              header: 'Status',
              cell: (i: VerificationItem) => (
                <StatusBadge
                  label={i.status}
                  variant={
                    i.status === 'Verified'
                      ? 'approved'
                      : i.status === 'Missing'
                        ? 'rejected'
                        : 'pending'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              width: '60px',
              cell: (i: VerificationItem) => (
                <Button
                  icon="file-edit"
                  variant="outlined"
                  tooltip="Edit"
                  onClick={() => setPopup({ mode: 'edit', item: i })}
                />
              ),
            },
          ]}
          toolbar={
            <div className="flex gap-2">
              <Button
                label="Print Audit List"
                icon="print"
                variant="outlined"
                onClick={() => setPopup({ mode: 'print' })}
              />
              <Button label="Audit Report" icon="summarize" variant="primary" />
            </div>
          }
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'print'}
        onHide={closePopup}
        title="Generate Department Audit List"
        size="lg"
      >
        <div className="p-4 text-center text-gray-500">
          Print List Form Placeholder
        </div>
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Verification Details"
        size="lg"
      >
        {popup.mode === 'edit' && (
          <VerificationForm onClose={closePopup} initialData={popup.item} />
        )}
      </FormPopup>
    </FormPage>
  );
}
