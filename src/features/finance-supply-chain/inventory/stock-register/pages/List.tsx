import { useQuery } from '@tanstack/react-query';
import { STOCK_REGISTER } from 'features/finance-supply-chain/mock-data';
import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import StockRegisterForm from '../components/StockRegisterForm';
import TransferRequestForm from '../../stock-transfer/components/TransferRequestForm';

type StockItem = (typeof STOCK_REGISTER)[0];
const QK = ['@fsc/stock-register'];

function useStockRegisterQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...STOCK_REGISTER],
  });
  return { data, isLoading };
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: StockItem }
  | { mode: 'transfer'; item: StockItem };

export default function List() {
  const { data, isLoading } = useStockRegisterQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Stock Register"
      description="Comprehensive digital stock register for all assets."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by asset ID, name, custodian..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            {
              field: 'assetId',
              header: 'Asset ID',
              cell: (i: StockItem) => (
                <span className="font-bold">{i.assetId}</span>
              ),
            },
            { field: 'name', header: 'Asset Name' },
            { field: 'category', header: 'Category' },
            { field: 'department', header: 'Department' },
            { field: 'location', header: 'Location' },
            {
              field: 'condition',
              header: 'Condition',
              cell: (i: StockItem) => (
                <StatusBadge
                  label={i.condition}
                  variant={
                    i.condition === 'Good'
                      ? 'approved'
                      : i.condition === 'Condemned'
                        ? 'rejected'
                        : 'pending'
                  }
                />
              ),
            },
            { field: 'custodian', header: 'Custodian' },
            {
              field: 'unitValue',
              header: 'Value',
              cell: (i: StockItem) => (
                <span>{`₹${i.unitValue.toLocaleString('en-IN')}`}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (i: StockItem) => (
                <StatusBadge
                  label={i.status}
                  variant={i.status === 'Active' ? 'approved' : 'neutral'}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              width: '100px',
              cell: (i: StockItem) => (
                <div className="flex gap-2">
                  <Button
                    icon="file-edit"
                    variant="outlined"
                    tooltip="Edit"
                    onClick={() => setPopup({ mode: 'edit', item: i })}
                  />
                  <Button
                    icon="send"
                    variant="outlined"
                    tooltip="Transfer Asset"
                    onClick={() => setPopup({ mode: 'transfer', item: i })}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Register Asset"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Register New Asset"
        size="lg"
      >
        <StockRegisterForm onClose={closePopup} />
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Asset"
        size="lg"
      >
        {popup.mode === 'edit' && (
          <StockRegisterForm onClose={closePopup} initialData={popup.item} />
        )}
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'transfer'}
        onHide={closePopup}
        title="Transfer Asset"
        size="lg"
      >
        {popup.mode === 'transfer' && (
          <TransferRequestForm
            onClose={closePopup}
            initialData={{
              assetName: popup.item.name,
              fromDepartment: popup.item.department,
              quantity: 1,
            }}
          />
        )}
      </FormPopup>
    </FormPage>
  );
}
