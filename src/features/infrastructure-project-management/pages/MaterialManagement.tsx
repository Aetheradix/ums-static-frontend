import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { type Material, materials as initialData, projects } from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Material }
  | { mode: 'view'; item: Material };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));
const UNITS = ['Bags', 'MT', 'Sq ft', 'Nos', 'Cu.m', 'Ltrs', 'Kg', 'Rmt'].map(
  v => ({ name: v, value: v })
);

const EMPTY: Partial<Material> = {
  projectId: '',
  projectName: '',
  materialName: '',
  unit: 'Bags',
  quantity: 0,
  supplier: '',
  deliveryDate: '',
  cost: 0,
};

export default function MaterialManagement() {
  const [data, setData] = useState<Material[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Material>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.materialName) {
      ToastService.error('Material name is required.');
      return;
    }
    if (popup.mode === 'create') {
      const proj = projects.find(p => p.id === form.projectId);
      setData(prev => [
        ...prev,
        {
          ...form,
          id: String(Date.now()),
          projectName: proj?.name ?? '',
        } as Material,
      ]);
      ToastService.success('Material added.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Material) : d
        )
      );
      ToastService.success('Material updated.');
    }
    close();
  };

  const handleDelete = (item: Material) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Material record deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Material Management"
      description="Track construction materials, quantities, suppliers and delivery."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Material Management' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'materialName', header: 'Material' },
            { field: 'projectName', header: 'Project' },
            {
              field: 'quantity',
              header: 'Quantity',
              cell: (item: Material) => (
                <span>
                  {item.quantity.toLocaleString('en-IN')} {item.unit}
                </span>
              ),
            },
            { field: 'supplier', header: 'Supplier' },
            { field: 'deliveryDate', header: 'Received Date' },
            {
              field: 'cost',
              header: 'Cost',
              cell: (item: Material) => (
                <span>₹{item.cost.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Material) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'view', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'edit', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="trash"
                    variant="danger"
                    onClick={() => handleDelete(item)}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Material"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search materials..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Material'
            : popup.mode === 'edit'
              ? 'Edit Material'
              : 'View Material'
        }
        subtitle="Material receipt and supplier details."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Project"
            data={PROJECT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.projectId}
            onChange={v => setForm(f => ({ ...f, projectId: v as string }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Material Name"
            placeholder="e.g. OPC 53 Cement"
            value={form.materialName ?? ''}
            onChange={v => setForm(f => ({ ...f, materialName: v }))}
            required
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={3}>
          <DropDownList
            label="Unit"
            data={UNITS}
            textField="name"
            optionValue="value"
            value={form.unit}
            onChange={v => setForm(f => ({ ...f, unit: v as string }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Quantity"
            placeholder="e.g. 500"
            value={String(form.quantity ?? '')}
            onChange={v => setForm(f => ({ ...f, quantity: Number(v) }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Cost (₹)"
            placeholder="Total cost"
            value={String(form.cost ?? '')}
            onChange={v => setForm(f => ({ ...f, cost: Number(v) }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <TextBox
            label="Supplier"
            placeholder="Supplier name"
            value={form.supplier ?? ''}
            onChange={v => setForm(f => ({ ...f, supplier: v }))}
            disabled={isReadOnly}
          />
          <DatePicker
            label="Delivery Date"
            value={form.deliveryDate ? new Date(form.deliveryDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                deliveryDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
        </FormGrid>
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Add' : 'Update'}
              variant="primary"
              icon="save"
              onClick={handleSave}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
