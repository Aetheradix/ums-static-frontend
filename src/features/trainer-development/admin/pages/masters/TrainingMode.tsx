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
import {
  type TrainingMode,
  trainingModes as initialData,
} from '../../../mocks';
import { tdmUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: TrainingMode }
  | { mode: 'view'; item: TrainingMode };

const EMPTY: Partial<TrainingMode> = {
  code: '',
  name: '',
  description: '',
  attendanceType: 'Online Tracking',
  status: 'Active',
};
const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];
const ATTENDANCE_OPTIONS = [
  { name: 'Online Tracking', value: 'Online Tracking' },
  { name: 'QR Code', value: 'QR Code' },
  { name: 'Manual', value: 'Manual' },
  { name: 'Hybrid', value: 'Hybrid' },
];

export default function TrainingModeMaster() {
  const [data, setData] = useState<TrainingMode[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<TrainingMode>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.code || !form.name) {
      ToastService.error('Code and Name are required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as TrainingMode,
      ]);
      ToastService.success('Training mode created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as TrainingMode)
            : d
        )
      );
      ToastService.success('Training mode updated.');
    }
    close();
  };

  const handleDelete = (item: TrainingMode) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Training mode deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Training Mode Master"
      description="Configure online, offline and hybrid training modes and their attendance rules."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Masters', to: tdmUrls.admin.mastersPortal },
        { label: 'Training Mode' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Mode Name' },
            { field: 'attendanceType', header: 'Attendance Type' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: TrainingMode) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'neutral'}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: TrainingMode) => (
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
                    variant="primary"
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
              label="Add Mode"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Training Mode'
            : popup.mode === 'edit'
              ? 'Edit Mode'
              : 'View Mode'
        }
      >
        <FormGrid columns={2}>
          <TextBox
            label="Mode Code"
            value={form.code ?? ''}
            onChange={v => setForm(f => ({ ...f, code: v }))}
            required
            readOnly={isReadOnly}
          />
          <TextBox
            label="Mode Name"
            value={form.name ?? ''}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
            readOnly={isReadOnly}
          />
          <DropDownList
            label="Attendance Type"
            data={ATTENDANCE_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.attendanceType}
            onChange={v => setForm(f => ({ ...f, attendanceType: v as any }))}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
          />
        </FormGrid>
        <TextArea
          label="Description"
          value={form.description ?? ''}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          rows={3}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Create' : 'Save Changes'}
              variant="primary"
              icon="check"
              onClick={handleSave}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
