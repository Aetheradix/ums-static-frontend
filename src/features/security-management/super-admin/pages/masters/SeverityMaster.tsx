import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type Severity, severities as initialData } from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Severity }
  | { mode: 'view'; item: Severity };
const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];
const EMPTY: Partial<Severity> = {
  severityName: '',
  level: 1,
  color: '#22c55e',
  description: '',
  status: 'Active',
};

export default function SeverityMaster() {
  const [data, setData] = useState<Severity[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Severity>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.severityName) {
      ToastService.error('Severity Name is required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as Severity,
      ]);
      ToastService.success('Severity created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Severity) : d
        )
      );
      ToastService.success('Severity updated.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Severity Master"
      description="Configure incident severity levels for accurate impact assessment."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Masters', to: smsUrls.superAdmin.mastersPortal },
        { label: 'Severity Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'severityName', header: 'Severity Name' },
            { field: 'level', header: 'Level' },
            {
              field: 'color',
              header: 'Color',
              cell: (item: Severity) => (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: item.color,
                      display: 'inline-block',
                    }}
                  />
                  {item.severityName}
                </span>
              ),
            },
            { field: 'description', header: 'Description' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Severity) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'rejected'}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Severity) => (
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
                    onClick={() => {
                      setData(prev => prev.filter(d => d.id !== item.id));
                      ToastService.success('Deleted.');
                    }}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Severity"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search severity levels..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Severity'
            : popup.mode === 'edit'
              ? 'Edit Severity'
              : 'View Severity'
        }
        subtitle="Configure severity level details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Severity Name"
            placeholder="e.g. Major"
            value={form.severityName ?? ''}
            onChange={v => setForm(f => ({ ...f, severityName: v }))}
            required
            disabled={isReadOnly}
          />
          <TextBox
            label="Level (1=Minor, 4=Critical)"
            placeholder="1-4"
            value={String(form.level ?? '')}
            onChange={v => setForm(f => ({ ...f, level: Number(v) }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Description"
          placeholder="Severity description"
          value={form.description ?? ''}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Create' : 'Update'}
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
