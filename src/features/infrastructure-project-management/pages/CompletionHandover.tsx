import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
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
  type Completion,
  completions as initialData,
  projects,
} from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Completion }
  | { mode: 'view'; item: Completion };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));
const DEPARTMENTS = [
  'Civil Engineering',
  'Electrical',
  'Library',
  'Student Affairs',
  'Physical Education',
  'Administration',
].map(v => ({ name: v, value: v }));
const STATUSES = ['Pending', 'Completed'].map(v => ({ name: v, value: v }));

const EMPTY: Partial<Completion> = {
  projectId: '',
  projectName: '',
  completionDate: '',
  completionCertificate: '',
  handoverDepartment: '',
  handoverTo: '',
  remarks: '',
  status: 'Pending',
};

export default function CompletionHandover() {
  const [data, setData] = useState<Completion[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Completion>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.projectId) {
      ToastService.error('Project is required.');
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
        } as Completion,
      ]);
      ToastService.success('Completion record created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as Completion)
            : d
        )
      );
      ToastService.success('Record updated.');
    }
    close();
  };

  const handleDelete = (item: Completion) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Record deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Completion & Handover"
      description="Record project completion certificates and formal handovers."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Completion & Handover' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'projectName', header: 'Project' },
            { field: 'completionDate', header: 'Completion Date' },
            { field: 'handoverTo', header: 'Handover To' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Completion) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Completed' ? 'approved' : 'pending'}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Completion) => (
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
              label="Record Completion"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search completion records..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Record Completion'
            : popup.mode === 'edit'
              ? 'Edit Record'
              : 'View Record'
        }
        subtitle="Project completion and handover details."
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
          <DatePicker
            label="Completion Date"
            value={
              form.completionDate ? new Date(form.completionDate) : undefined
            }
            onChange={v =>
              setForm(f => ({
                ...f,
                completionDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <TextBox
            label="Completion Certificate No"
            placeholder="e.g. CC-2025-001"
            value={form.completionCertificate ?? ''}
            onChange={v => setForm(f => ({ ...f, completionCertificate: v }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={STATUSES}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <DropDownList
            label="Handover Department"
            data={DEPARTMENTS}
            textField="name"
            optionValue="value"
            value={form.handoverDepartment}
            onChange={v =>
              setForm(f => ({ ...f, handoverDepartment: v as string }))
            }
            disabled={isReadOnly}
          />
          <TextBox
            label="Handover To (Person)"
            placeholder="Name and designation"
            value={form.handoverTo ?? ''}
            onChange={v => setForm(f => ({ ...f, handoverTo: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Remarks"
          placeholder="Handover notes, O&M details, warranties etc."
          value={form.remarks ?? ''}
          onChange={v => setForm(f => ({ ...f, remarks: v }))}
          disabled={isReadOnly}
          rows={3}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Record' : 'Update'}
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
