import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  NumberBox,
} from 'shared/components/forms';
import { Loader } from 'shared/components/progress';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { ASSETS } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type AssetItem = (typeof ASSETS)[0];
const QK = ['@fsc/assets'];
function useAssetsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...ASSETS],
  });
  return { data, isLoading };
}

type PopupState = { mode: 'closed' } | { mode: 'create' };

export default function List() {
  const { data, isLoading } = useAssetsQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Asset Register"
      description="Maintain a central register of all university assets."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by asset code, name, category..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'assetCode', header: 'Asset Code' },
            { field: 'name', header: 'Asset Name' },
            { field: 'category', header: 'Category' },
            { field: 'purchaseDate', header: 'Purchase Date' },
            {
              field: 'purchaseCost',
              header: 'Cost (₹)',
              cell: (i: AssetItem) => (
                <span className="font-semibold text-blue-700">
                  ₹{i.purchaseCost.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'currentValue',
              header: 'Current (₹)',
              cell: (i: AssetItem) => (
                <span>₹{i.currentValue.toLocaleString('en-IN')}</span>
              ),
            },
            { field: 'location', header: 'Location' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: AssetItem) => (
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
        subtitle="Enter details of the newly acquired asset."
        size="lg"
      >
        <AssetForm onClose={closePopup} />
      </FormPopup>
    </FormPage>
  );
}

function AssetForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    assetCode: '',
    name: '',
    category: 'IT Equipment',
    purchaseDate: '',
    purchaseCost: 0,
    location: '',
    depreciationMethod: 'SLM',
    status: 'Good',
  });
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onClose();
      }}
    >
      <FormGrid columns={2}>
        <TextBox
          label="Asset Name"
          placeholder="E.g. Dell PowerEdge R740"
          value={form.name}
          onChange={v => setForm(p => ({ ...p, name: v }))}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Category"
          data={[
            { label: 'IT Equipment', value: 'IT Equipment' },
            { label: 'Lab Equipment', value: 'Lab Equipment' },
            { label: 'Buildings', value: 'Buildings' },
            { label: 'Vehicles', value: 'Vehicles' },
            { label: 'Furniture', value: 'Furniture' },
          ]}
          value={form.category}
          onChange={v => setForm(p => ({ ...p, category: v as string }))}
          required
        />
        <DatePicker
          label="Purchase Date"
          value={form.purchaseDate ? new Date(form.purchaseDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              purchaseDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <NumberBox
          label="Purchase Cost (₹)"
          value={form.purchaseCost}
          onChange={v => setForm(p => ({ ...p, purchaseCost: v ?? 0 }))}
          required
        />
        <TextBox
          label="Location"
          placeholder="E.g. Server Room 1"
          value={form.location}
          onChange={v => setForm(p => ({ ...p, location: v }))}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Depreciation Method"
          data={[
            { label: 'Straight Line (SLM)', value: 'SLM' },
            { label: 'Written Down (WDV)', value: 'WDV' },
          ]}
          value={form.depreciationMethod}
          onChange={v =>
            setForm(p => ({ ...p, depreciationMethod: v as string }))
          }
        />
      </FormGrid>
      <FormActions
        isEditMode={false}
        isLoading={false}
        onSave={() => {}}
        onReset={() => {}}
      />
    </form>
  );
}
