import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  Switch,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type IncidentStatus,
  incidentStatuses as initialData,
} from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: IncidentStatus }
  | { mode: 'view'; item: IncidentStatus };
const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];
const EMPTY: Partial<IncidentStatus> = {
  statusName: '',
  description: '',
  isDefault: false,
  status: 'Active',
};

export default function StatusMaster() {
  const [data, setData] = useState<IncidentStatus[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<IncidentStatus>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.statusName) {
      ToastService.error('Status Name is required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as IncidentStatus,
      ]);
      ToastService.success('Status created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as IncidentStatus)
            : d
        )
      );
      ToastService.success('Status updated.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Status Master"
      description="Manage incident workflow statuses and their configurations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Status Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'statusName', header: 'Status Name' },
            { field: 'description', header: 'Description' },
            {
              field: 'isDefault',
              header: 'Default',
              cell: (item: IncidentStatus) => (
                <span>{item.isDefault ? '✓ Yes' : 'No'}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: IncidentStatus) => (
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
              cell: (item: IncidentStatus) => (
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
              label="Add Status"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search statuses..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Status'
            : popup.mode === 'edit'
              ? 'Edit Status'
              : 'View Status'
        }
        subtitle="Configure incident workflow status."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Status Name"
            placeholder="e.g. Under Investigation"
            value={form.statusName ?? ''}
            onChange={v => setForm(f => ({ ...f, statusName: v }))}
            required
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
          <Switch
            label="Set as Default Status"
            checked={form.isDefault ?? false}
            onChange={v => setForm(f => ({ ...f, isDefault: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Description"
          placeholder="Description of this status"
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
