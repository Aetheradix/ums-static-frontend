import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
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
import { VENDORS } from '../../../mock-data';

type VendorItem = (typeof VENDORS)[0];
const QK = ['@fsc/vendors'];
function useVendorsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...VENDORS],
  });
  return { data, isLoading };
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: VendorItem };

export default function List() {
  const { data, isLoading } = useVendorsQuery();
  const qc = useQueryClient();
  const toggleStatus = useMutation({
    mutationFn: async (_variables: { id: number; isActive: boolean }) => true,
    onSuccess(_, variables) {
      const prev = qc.getQueryData<VendorItem[]>(QK) ?? [];
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

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Vendor Master"
      description="Manage suppliers, contractors, and service providers."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search vendors..."
          columns={[
            { field: 'id', header: 'Vendor ID' },
            { field: 'name', header: 'Name' },
            { field: 'contactPerson', header: 'Contact' },
            { field: 'email', header: 'Email' },
            { field: 'category', header: 'Category' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (i: VendorItem) => (
                <StatusBadge
                  label={i.isActive ? 'Active' : 'Inactive'}
                  variant={i.isActive ? 'approved' : 'rejected'}
                />
              ),
            },
            {
              field: 'vendorCode',
              header: 'Actions',
              sortable: false,
              width: '150px',
              cell: (i: VendorItem) => (
                <div className="flex gap-2">
                  <Button
                    icon="pencil"
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
              label="Add Vendor"
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
        title={popup.mode === 'create' ? 'Add Vendor' : 'Edit Vendor'}
        subtitle="Enter vendor details below."
        size="lg"
      >
        <VendorForm
          onClose={closePopup}
          initialData={popup.mode === 'edit' ? popup.item : undefined}
        />
      </FormPopup>
    </FormPage>
  );
}

function VendorForm({
  onClose,
  initialData,
}: {
  onClose: () => void;
  initialData?: VendorItem;
}) {
  const [form, setForm] = useState(
    initialData || {
      id: 0,
      name: '',
      contactPerson: '',
      phone: '',
      vendorCode: '',
      gstin: '',
      pan: '',
      city: '',
      email: '',
      category: '',
      isActive: true,
    }
  );
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onClose();
      }}
    >
      <FormGrid columns={2}>
        <TextBox
          label="Vendor Name"
          placeholder="Full name of vendor"
          value={form.name}
          onChange={v => setForm(p => ({ ...p, name: v }))}
          required
        />
        <TextBox
          label="Contact Person"
          placeholder="Name"
          value={form.contactPerson}
          onChange={v => setForm(p => ({ ...p, contactPerson: v }))}
          required
        />
        <TextBox
          label="Phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={v => setForm(p => ({ ...p, phone: v }))}
          required
        />
        <TextBox
          label="Email"
          placeholder="Email address"
          value={form.email}
          onChange={v => setForm(p => ({ ...p, email: v }))}
          required
        />
        <TextBox
          label="Category"
          placeholder="e.g. Hardware, Services"
          value={form.category}
          onChange={v => setForm(p => ({ ...p, category: v }))}
          required
        />
        <TextBox
          label="City"
          placeholder="City"
          value={form.city}
          onChange={v => setForm(p => ({ ...p, city: v }))}
        />
      </FormGrid>
      <FormActions
        isEditMode={!!initialData}
        isLoading={false}
        onSave={() => {}}
        onReset={() => {}}
      />
    </form>
  );
}
