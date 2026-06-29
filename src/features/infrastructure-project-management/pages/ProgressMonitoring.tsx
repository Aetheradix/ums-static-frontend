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
} from 'shared/new-components';
import {
  type Progress,
  progressRecords as initialData,
  projects,
} from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Progress }
  | { mode: 'view'; item: Progress };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));

const EMPTY: Partial<Progress> = {
  projectId: '',
  projectName: '',
  progressPct: 0,
  currentStage: '',
  currentActivity: '',
  issues: '',
  nextMilestone: '',
  remarks: '',
  updatedBy: '',
  updatedDate: '',
};

export default function ProgressMonitoring() {
  const [data, setData] = useState<Progress[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Progress>>(EMPTY);

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
        } as Progress,
      ]);
      ToastService.success('Progress updated.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Progress) : d
        )
      );
      ToastService.success('Progress record updated.');
    }
    close();
  };

  const handleDelete = (item: Progress) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Record deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  const ProgressBar = ({ value }: { value: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
      <div
        style={{
          flex: 1,
          height: 8,
          background: '#f3f4f6',
          borderRadius: 99,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${value}%`,
            background:
              value === 100 ? '#22c55e' : value >= 60 ? '#3b82f6' : '#f59e0b',
            borderRadius: 99,
          }}
        />
      </div>
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#374151',
          width: 32,
        }}
      >
        {value}%
      </span>
    </div>
  );

  return (
    <FormPage
      title="Progress Monitoring"
      description="Track project execution progress, current activities and issues."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Progress Monitoring' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'projectName', header: 'Project' },
            {
              field: 'progressPct',
              header: 'Progress %',
              cell: (item: Progress) => (
                <ProgressBar value={item.progressPct} />
              ),
            },
            { field: 'currentStage', header: 'Current Stage' },
            { field: 'updatedBy', header: 'Updated By' },
            { field: 'updatedDate', header: 'Updated Date' },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Progress) => (
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
              label="Update Progress"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search progress records..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Update Progress'
            : popup.mode === 'edit'
              ? 'Edit Progress'
              : 'View Progress'
        }
        subtitle="Record current project progress and field activities."
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
            label="Progress %"
            placeholder="0 to 100"
            value={String(form.progressPct ?? '')}
            onChange={v =>
              setForm(f => ({
                ...f,
                progressPct: Math.min(100, Math.max(0, Number(v))),
              }))
            }
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <TextBox
            label="Current Stage"
            placeholder="e.g. Electrical Works"
            value={form.currentStage ?? ''}
            onChange={v => setForm(f => ({ ...f, currentStage: v }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Next Milestone"
            placeholder="Upcoming milestone"
            value={form.nextMilestone ?? ''}
            onChange={v => setForm(f => ({ ...f, nextMilestone: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Current Activity"
          placeholder="What is currently being worked on"
          value={form.currentActivity ?? ''}
          onChange={v => setForm(f => ({ ...f, currentActivity: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        <TextArea
          label="Issues / Challenges"
          placeholder="Any problems or blockers"
          value={form.issues ?? ''}
          onChange={v => setForm(f => ({ ...f, issues: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        <FormGrid columns={2}>
          <TextBox
            label="Updated By"
            placeholder="Your name"
            value={form.updatedBy ?? ''}
            onChange={v => setForm(f => ({ ...f, updatedBy: v }))}
            disabled={isReadOnly}
          />
          <DatePicker
            label="Updated Date"
            value={form.updatedDate ? new Date(form.updatedDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                updatedDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Remarks"
          placeholder="Any additional observations"
          value={form.remarks ?? ''}
          onChange={v => setForm(f => ({ ...f, remarks: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Save' : 'Update'}
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
