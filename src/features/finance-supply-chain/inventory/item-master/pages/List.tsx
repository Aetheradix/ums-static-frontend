import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, NumberBox } from 'shared/components/forms';
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
import { ITEMS } from '../../../mock-data';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type ItemMasterItem = (typeof ITEMS)[0];
const QK = ['@fsc/items'];
function useItemsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...ITEMS],
  });
  return { data, isLoading };
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ItemMasterItem };

export default function List() {
  const { data, isLoading } = useItemsQuery();
  const qc = useQueryClient();
  const toggleStatus = useMutation({
    mutationFn: async (_variables: { id: number; isActive: boolean }) => true,
    onSuccess(_, variables) {
      const prev = qc.getQueryData<ItemMasterItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        prev.map(item =>
          item.id === variables.id
            ? { ...item, isActive: variables.isActive }
            : item
        )
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: any) => {
      // Mock API call
      return item.id === 0
        ? {
            ...item,
            id: Date.now(),
            itemCode: item.itemCode || `ITM-${Date.now().toString().slice(-4)}`,
          }
        : item;
    },
    onSuccess(savedItem) {
      const prev = qc.getQueryData<ItemMasterItem[]>(QK) ?? [];
      if (prev.find(i => i.id === savedItem.id)) {
        qc.setQueryData(
          QK,
          prev.map(i => (i.id === savedItem.id ? savedItem : i))
        );
      } else {
        qc.setQueryData(QK, [savedItem, ...prev]);
      }
      closePopup();
    },
  });

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Item Master"
      description="Manage all inventory items and their properties."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by item code, name..."
          columns={[
            { field: 'itemCode', header: 'Item Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'uom', header: 'UOM' },
            { field: 'reorderLevel', header: 'Reorder' },
            { field: 'currentStock', header: 'Stock' },
            { field: 'location', header: 'Location' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (i: ItemMasterItem) => (
                <StatusBadge
                  label={i.isActive ? 'Active' : 'Inactive'}
                  variant={i.isActive ? 'approved' : 'rejected'}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              width: '120px',
              cell: (i: ItemMasterItem) => (
                <div className="flex gap-2">
                  <Button
                    icon="file-edit"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'edit', item: i })}
                  />
                  <Button
                    icon={i.isActive ? 'times' : 'check'}
                    variant="outlined"
                    onClick={() =>
                      toggleStatus.mutate({ id: i.id, isActive: !i.isActive })
                    }
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Item"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={popup.mode === 'create' ? 'Add Item' : 'Edit Item'}
        subtitle="Enter item details below."
        size="lg"
      >
        <ItemForm
          onClose={closePopup}
          initialData={popup.mode === 'edit' ? popup.item : undefined}
          onSave={data => saveMutation.mutate(data)}
        />
      </FormPopup>
    </FormPage>
  );
}

function ItemForm({
  onClose,
  initialData,
  onSave,
}: {
  onClose: () => void;
  initialData?: ItemMasterItem;
  onSave: (data: any) => void;
}) {
  const [form, setForm] = useState(
    initialData || {
      id: 0,
      itemCode: '',
      name: '',
      category: 'Stationery',
      uom: 'Nos',
      reorderLevel: 0,
      currentStock: 0,
      location: '',
      isActive: true,
    }
  );
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <FormGrid columns={2}>
        <TextBox
          label="Item Code"
          placeholder="Auto-generated if empty"
          value={form.itemCode}
          onChange={v => setForm(p => ({ ...p, itemCode: v }))}
          disabled={!!initialData}
        />
        <TextBox
          label="Item Name"
          placeholder="E.g. A4 Paper Rim"
          value={form.name}
          onChange={v => setForm(p => ({ ...p, name: v }))}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Category"
          data={[
            { label: 'Stationery', value: 'Stationery' },
            { label: 'IT Consumables', value: 'IT Consumables' },
            { label: 'Lab Chemicals', value: 'Lab Chemicals' },
            { label: 'Cleaning Supplies', value: 'Cleaning Supplies' },
          ]}
          value={form.category}
          onChange={v => setForm(p => ({ ...p, category: v as string }))}
          required
        />
        <TextBox
          label="UOM (Unit of Measure)"
          placeholder="E.g. Nos, Kgs, Ltrs"
          value={form.uom}
          onChange={v => setForm(p => ({ ...p, uom: v }))}
          required
        />
        <NumberBox
          label="Current Stock"
          value={form.currentStock}
          onChange={v => setForm(p => ({ ...p, currentStock: v ?? 0 }))}
        />
        <NumberBox
          label="Reorder Level"
          value={form.reorderLevel}
          onChange={v => setForm(p => ({ ...p, reorderLevel: v ?? 0 }))}
        />
        <TextBox
          label="Location"
          placeholder="E.g. Main Store"
          value={form.location}
          onChange={v => setForm(p => ({ ...p, location: v }))}
        />
      </FormGrid>
      <FormActions
        isEditMode={!!initialData}
        isLoading={false}
        onReset={onClose}
      />
    </form>
  );
}
