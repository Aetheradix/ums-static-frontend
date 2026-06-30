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
import { DISPOSAL_ITEMS } from 'features/finance-supply-chain/mock-data';
import DisposalForm from '../components/DisposalForm';

type DisposalItem = (typeof DISPOSAL_ITEMS)[0];
const QK = ['@fsc/disposal-writeoffs'];

function useDisposalWriteoffQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...DISPOSAL_ITEMS],
  });
  return { data, isLoading };
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; item: DisposalItem };

export default function List() {
  const { data, isLoading } = useDisposalWriteoffQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Disposal & Write-off"
      description="Dead stock register — record condemned/written-off items."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by disposal no, asset name..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            {
              field: 'disposalNo',
              header: 'Disposal No',
              cell: (i: DisposalItem) => (
                <span className="font-bold">{i.disposalNo}</span>
              ),
            },
            {
              field: 'date',
              header: 'Date',
              cell: (i: DisposalItem) => (
                <span>{new Date(i.date).toLocaleDateString('en-US')}</span>
              ),
            },
            { field: 'assetName', header: 'Asset' },
            { field: 'department', header: 'Department' },
            { field: 'reason', header: 'Reason' },
            { field: 'method', header: 'Disposal Method' },
            {
              field: 'writeOffValue',
              header: 'Write-off Value',
              cell: (i: DisposalItem) => (
                <span>{`₹${i.writeOffValue.toLocaleString('en-IN')}`}</span>
              ),
            },
            { field: 'approvedBy', header: 'Approved By' },
            {
              field: 'status',
              header: 'Status',
              cell: (i: DisposalItem) => (
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
              cell: (i: DisposalItem) => (
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
              label="Raise Disposal Request"
              icon="delete_sweep"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Raise Disposal Request"
        size="lg"
      >
        <DisposalForm onClose={closePopup} />
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title="View Disposal Request"
        size="lg"
      >
        {popup.mode === 'view' && (
          <DisposalForm onClose={closePopup} initialData={popup.item} />
        )}
      </FormPopup>
    </FormPage>
  );
}
