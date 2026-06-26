import { useState, useCallback } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
  FormPopup,
} from 'shared/new-components';
import { ASSET_ALLOCATIONS } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';
import AssetAllocationForm from '../components/AssetAllocationForm';

type AssetAllocationItem = (typeof ASSET_ALLOCATIONS)[0];
const QK = ['@fsc/asset-allocations'];

function useAssetAllocationsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...ASSET_ALLOCATIONS],
  });
  return { data, isLoading };
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; item: AssetAllocationItem }
  | { mode: 'edit'; item: AssetAllocationItem };

export default function List() {
  const { data } = useAssetAllocationsQuery();

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'allocated':
        return 'approved'; // Usually green/success
      case 'returned':
        return 'neutral'; // Usually gray
      default:
        return 'neutral';
    }
  };

  return (
    <FormPage
      title="Asset Allocation"
      description="Manage and track assets allocated to departments and personnel."
    >
      <FormCard>
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by allocation no, asset code, or department..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'allocationNo', header: 'Allocation No' },
            { field: 'assetCode', header: 'Asset Code' },
            { field: 'assetName', header: 'Asset Name' },
            { field: 'allocatedTo', header: 'Allocated To' },
            { field: 'department', header: 'Department' },
            { field: 'allocationDate', header: 'Allocation Date' },
            { field: 'returnDate', header: 'Return Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (i: AssetAllocationItem) => (
                <StatusBadge
                  label={i.status}
                  variant={getStatusVariant(i.status)}
                />
              ),
            },
            {
              header: 'Actions',
              width: '120px',
              cell: (i: AssetAllocationItem) => (
                <div className="flex items-center gap-2">
                  <Button
                    icon="eye"
                    variant="text"
                    size="small"
                    onClick={() => setPopup({ mode: 'view', item: i })}
                  />
                  <Button
                    icon="file-edit"
                    variant="text"
                    size="small"
                    onClick={() => setPopup({ mode: 'edit', item: i })}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              icon="plus"
              label="Allocate Asset"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Allocate Asset"
        size="lg"
      >
        <AssetAllocationForm mode="create" onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'view' || popup.mode === 'edit'}
        onHide={closePopup}
        title={popup.mode === 'edit' ? 'Edit Allocation' : 'View Allocation'}
        size="lg"
      >
        {(popup.mode === 'view' || popup.mode === 'edit') && (
          <AssetAllocationForm
            mode={popup.mode}
            initialData={popup.item}
            onClose={closePopup}
          />
        )}
      </FormPopup>
    </FormPage>
  );
}
