import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox, NumberBox, DropDownList } from 'shared/components/forms';
import StatusButton from 'shared/components/buttons/StatusButton';
import { Loader } from 'shared/components/progress';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import type { TaxGstConfigForm, TaxGstConfigItem } from '../api';
import {
  useCreateTaxGstConfigMutation,
  useToggleTaxGstConfigStatusMutation,
  useTaxGstConfigsQuery,
  useUpdateTaxGstConfigMutation,
} from '../queries';

const TAX_TYPES = [
  { label: 'GST', value: 'GST' },
  { label: 'TDS', value: 'TDS' },
  { label: 'TCS', value: 'TCS' },
];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: TaxGstConfigItem };

export default function List() {
  const { data, isLoading } = useTaxGstConfigsQuery();
  const { mutateAsync: toggleStatus } = useToggleTaxGstConfigStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Tax / GST Configuration"
      description="Configure tax rates and GST codes for financial transactions."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by tax name, type, HSN code..."
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'taxName', header: 'Tax Name' },
            { field: 'type', header: 'Type' },
            { field: 'rate', header: 'Rate (%)' },
            { field: 'hsnCode', header: 'HSN Code' },
            { field: 'description', header: 'Description' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: TaxGstConfigItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() =>
                    toggleStatus({ id: item.id, isActive: !item.isActive })
                  }
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Tax Config"
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
        title="Create Tax Config"
        subtitle="Add a new tax / GST configuration."
        size="lg"
      >
        <TaxConfigFormContent onClose={closePopup} />
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Tax Config"
        subtitle="Update tax configuration."
        size="lg"
      >
        {popup.mode === 'edit' && (
          <TaxConfigFormContent item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function TaxConfigFormContent({
  item,
  onClose,
}: {
  item?: TaxGstConfigItem;
  onClose: () => void;
}) {
  const createMut = useCreateTaxGstConfigMutation();
  const updateMut = useUpdateTaxGstConfigMutation(item?.id ?? 0);
  const mutation = item ? updateMut : createMut;
  const BLANK: TaxGstConfigForm = {
    taxName: '',
    rate: 0,
    type: 'GST',
    hsnCode: '',
    description: '',
    isActive: true,
  };
  const [form, setForm] = useState<TaxGstConfigForm>(
    item
      ? {
          taxName: item.taxName,
          rate: item.rate,
          type: item.type,
          hsnCode: item.hsnCode,
          description: item.description,
          isActive: item.isActive,
        }
      : BLANK
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutation.mutateAsync(form);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Tax Name"
          placeholder="e.g. GST 5%"
          value={form.taxName}
          onChange={v => setForm(p => ({ ...p, taxName: v }))}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Tax Type"
          data={TAX_TYPES}
          value={form.type}
          onChange={v => setForm(p => ({ ...p, type: v as string }))}
          required
        />
        <NumberBox
          label="Rate (%)"
          placeholder="e.g. 18"
          value={form.rate}
          onChange={v => setForm(p => ({ ...p, rate: v ?? 0 }))}
          required
          min={0}
          max={100}
        />
        <TextBox
          label="HSN Code"
          placeholder="e.g. 9992 (leave blank for TDS)"
          value={form.hsnCode}
          onChange={v => setForm(p => ({ ...p, hsnCode: v }))}
        />
        <TextBox
          label="Description"
          placeholder="What this tax applies to"
          value={form.description}
          onChange={v => setForm(p => ({ ...p, description: v }))}
        />
      </FormGrid>
      <FormActions
        isEditMode={!!item}
        isLoading={mutation.isPending}
        onSave={() => handleSubmit}
        onReset={() => setForm(BLANK)}
      />
    </form>
  );
}
