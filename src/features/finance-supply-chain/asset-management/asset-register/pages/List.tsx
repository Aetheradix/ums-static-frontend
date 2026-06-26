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

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; item: AssetItem }
  | { mode: 'edit'; item: AssetItem };

function getStatusVariant(
  status: string
): 'approved' | 'pending' | 'neutral' | 'rejected' {
  switch (status) {
    case 'In Use':
    case 'Active':
    case 'Good':
      return 'approved';
    case 'Under Repair':
    case 'Repair':
      return 'pending';
    case 'Retired':
    case 'Disposed':
      return 'neutral';
    default:
      return 'rejected';
  }
}

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
            {
              field: 'assetCode',
              header: 'Asset Code',
              cell: (i: AssetItem) => (
                <span className="font-bold text-blue-700">{i.assetCode}</span>
              ),
            },
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
                  variant={getStatusVariant(i.status)}
                />
              ),
            },
            {
              header: 'Actions',
              sortable: false,
              width: '100px',
              cell: (i: AssetItem) => (
                <div className="flex items-center gap-2">
                  <Button
                    icon="eye"
                    variant="text"
                    size="small"
                    tooltip="View"
                    onClick={() => setPopup({ mode: 'view', item: i })}
                  />
                  <Button
                    icon="file-edit"
                    variant="text"
                    size="small"
                    tooltip="Edit"
                    onClick={() => setPopup({ mode: 'edit', item: i })}
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

      {/* Create Popup */}
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Register New Asset"
        subtitle="Enter details of the newly acquired asset."
        size="lg"
      >
        <AssetForm mode="create" onClose={closePopup} />
      </FormPopup>

      {/* View / Edit Popup */}
      <FormPopup
        visible={popup.mode === 'view' || popup.mode === 'edit'}
        onHide={closePopup}
        title={popup.mode === 'edit' ? 'Edit Asset' : 'View Asset'}
        size="lg"
      >
        {(popup.mode === 'view' || popup.mode === 'edit') && (
          <AssetForm
            mode={popup.mode}
            initialData={popup.item}
            onClose={closePopup}
          />
        )}
      </FormPopup>
    </FormPage>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface AssetFormProps {
  mode: 'create' | 'view' | 'edit';
  initialData?: AssetItem;
  onClose: () => void;
}

function AssetForm({ mode, initialData, onClose }: AssetFormProps) {
  const isView = mode === 'view';

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    category: initialData?.category ?? 'IT Equipment',
    purchaseDate: initialData?.purchaseDate ?? '',
    purchaseCost: initialData?.purchaseCost ?? 0,
    location: initialData?.location ?? '',
    depreciationMethod: initialData?.depreciationMethod ?? 'SLM',
    status: initialData?.status ?? 'In Use',
  });

  const handleSubmit = () => {
    console.log('Submitted', form);
    onClose();
  };

  return (
    <div className="flex flex-col gap-6">
      <FormGrid columns={2}>
        <TextBox
          label="Asset Name"
          placeholder="E.g. Dell PowerEdge R740"
          value={form.name}
          onChange={v => setForm(p => ({ ...p, name: v }))}
          disabled={isView}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Category"
          data={[
            { label: 'IT Equipment', value: 'IT Equipment' },
            { label: 'AV Equipment', value: 'AV Equipment' },
            { label: 'Lab Equipment', value: 'Lab Equipment' },
            { label: 'Office Equipment', value: 'Office Equipment' },
            { label: 'HVAC', value: 'HVAC' },
            { label: 'Building', value: 'Building' },
            { label: 'Vehicles', value: 'Vehicles' },
            { label: 'Furniture', value: 'Furniture' },
          ]}
          value={form.category}
          onChange={v => setForm(p => ({ ...p, category: v as string }))}
          disabled={isView}
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
          disabled={isView}
          required
        />
        <NumberBox
          label="Purchase Cost (₹)"
          value={form.purchaseCost}
          onChange={v => setForm(p => ({ ...p, purchaseCost: v ?? 0 }))}
          disabled={isView}
          required
        />
        <TextBox
          label="Location"
          placeholder="E.g. Server Room 1"
          value={form.location}
          onChange={v => setForm(p => ({ ...p, location: v }))}
          disabled={isView}
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
          disabled={isView}
        />
        {mode !== 'create' && (
          <DropDownList
            textField="label"
            valueField="value"
            label="Status"
            data={[
              { label: 'In Use', value: 'In Use' },
              { label: 'Under Repair', value: 'Under Repair' },
              { label: 'Retired', value: 'Retired' },
              { label: 'Disposed', value: 'Disposed' },
            ]}
            value={form.status}
            onChange={v => setForm(p => ({ ...p, status: v as string }))}
            disabled={isView}
          />
        )}
      </FormGrid>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          label={isView ? 'Close' : 'Cancel'}
          variant="outlined"
          onClick={onClose}
        />
        {!isView && (
          <Button
            label={mode === 'create' ? 'Register Asset' : 'Save Changes'}
            variant="primary"
            icon={mode === 'create' ? 'save' : 'file-edit'}
            onClick={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
