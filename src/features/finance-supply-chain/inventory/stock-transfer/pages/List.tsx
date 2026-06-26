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
import { STOCK_TRANSFER_REQUESTS } from 'features/finance-supply-chain/mock-data';
import TransferRequestForm from '../components/TransferRequestForm';

type TransferItem = (typeof STOCK_TRANSFER_REQUESTS)[0];
const QK = ['@fsc/stock-transfers'];

function useStockTransferQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...STOCK_TRANSFER_REQUESTS],
  });
  return { data, isLoading };
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; item: TransferItem };

export default function List() {
  const { data, isLoading } = useStockTransferQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Stock Transfer"
      description="Manage department-wise allocation and transfer of assets."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by transfer no, asset name..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            {
              field: 'transferNo',
              header: 'Transfer No',
              cell: (i: TransferItem) => (
                <span className="font-bold">{i.transferNo}</span>
              ),
            },
            {
              field: 'date',
              header: 'Date',
              cell: (i: TransferItem) => (
                <span>{new Date(i.date).toLocaleDateString('en-US')}</span>
              ),
            },
            { field: 'assetName', header: 'Asset' },
            { field: 'fromDepartment', header: 'From Dept' },
            { field: 'toDepartment', header: 'To Dept' },
            {
              field: 'quantity',
              header: 'Quantity',
              cell: (i: TransferItem) => (
                <span className="font-bold text-center w-full block">
                  {i.quantity}
                </span>
              ),
            },
            { field: 'reason', header: 'Reason' },
            { field: 'approvedBy', header: 'Approved By' },
            {
              field: 'status',
              header: 'Status',
              cell: (i: TransferItem) => (
                <StatusBadge
                  label={i.status}
                  variant={
                    i.status === 'Approved'
                      ? 'approved'
                      : i.status === 'Pending'
                        ? 'pending'
                        : 'rejected'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              width: '60px',
              cell: (i: TransferItem) => (
                <Button
                  icon="eye"
                  variant="outlined"
                  tooltip="View"
                  onClick={() => setPopup({ mode: 'view', item: i })}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Raise Transfer Request"
              icon="move_down"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Raise Stock Transfer Request"
        size="lg"
      >
        <TransferRequestForm onClose={closePopup} />
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title="View Transfer Request"
        size="lg"
      >
        {popup.mode === 'view' && (
          <TransferRequestForm onClose={closePopup} initialData={popup.item} />
        )}
      </FormPopup>
    </FormPage>
  );
}
