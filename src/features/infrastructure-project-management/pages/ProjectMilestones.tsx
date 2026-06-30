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
import { type Milestone, milestones as initialData, projects } from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Milestone }
  | { mode: 'view'; item: Milestone };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));
const STATUSES = ['Pending', 'In Progress', 'Completed', 'Delayed'].map(v => ({
  name: v,
  value: v,
}));

const EMPTY: Partial<Milestone> = {
  projectId: '',
  projectName: '',
  milestoneName: '',
  description: '',
  plannedDate: '',
  completionDate: '',
  status: 'Pending',
};

const statusVariant = (s: string) => {
  if (s === 'Completed') return 'approved';
  if (s === 'Delayed') return 'rejected';
  if (s === 'In Progress') return 'pending';
  return 'neutral';
};

export default function ProjectMilestones() {
  const [data, setData] = useState<Milestone[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Milestone>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.milestoneName) {
      ToastService.error('Milestone Name is required.');
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
        } as Milestone,
      ]);
      ToastService.success('Milestone created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Milestone) : d
        )
      );
      ToastService.success('Milestone updated.');
    }
    close();
  };

  const handleDelete = (item: Milestone) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Milestone deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Project Milestones"
      description="Define and track key milestones for each project."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Project Milestones' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'milestoneName', header: 'Milestone' },
            { field: 'projectName', header: 'Project' },
            { field: 'plannedDate', header: 'Planned Date' },
            {
              field: 'completionDate',
              header: 'Actual Date',
              cell: (item: Milestone) => (
                <span>{item.completionDate || '—'}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Milestone) => (
                <StatusBadge
                  label={item.status}
                  variant={statusVariant(item.status)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Milestone) => (
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
              label="Add Milestone"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search milestones..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'New Milestone'
            : popup.mode === 'edit'
              ? 'Edit Milestone'
              : 'View Milestone'
        }
        subtitle="Define milestone details and target date."
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
            label="Milestone Name"
            placeholder="e.g. Foundation Completion"
            value={form.milestoneName ?? ''}
            onChange={v => setForm(f => ({ ...f, milestoneName: v }))}
            required
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Description"
          placeholder="Describe the milestone deliverable"
          value={form.description ?? ''}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        <FormGrid columns={3}>
          <DatePicker
            label="Planned Date"
            value={form.plannedDate ? new Date(form.plannedDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                plannedDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
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
