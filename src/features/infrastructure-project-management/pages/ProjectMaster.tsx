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
import { type Project, projects as initialData } from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Project }
  | { mode: 'view'; item: Project };

const PROJECT_TYPES = [
  'New Construction',
  'Renovation',
  'Maintenance',
  'Installation',
  'Repair',
].map(v => ({ name: v, value: v }));
const DEPARTMENTS = [
  'Civil Engineering',
  'Electrical',
  'Library',
  'Student Affairs',
  'Physical Education',
  'IT',
  'Administration',
].map(v => ({ name: v, value: v }));
const CAMPUSES = [
  'Main Campus',
  'North Campus',
  'South Campus',
  'East Campus',
].map(v => ({ name: v, value: v }));
const FUNDING_SOURCES = [
  'Central Govt',
  'State Govt',
  'University Fund',
  'UGC Grant',
  'External',
].map(v => ({ name: v, value: v }));
const PRIORITIES = ['High', 'Medium', 'Low'].map(v => ({ name: v, value: v }));
const STATUSES = ['Planning', 'Ongoing', 'Completed', 'Delayed', 'On Hold'].map(
  v => ({ name: v, value: v })
);

const EMPTY: Partial<Project> = {
  code: '',
  name: '',
  type: 'New Construction',
  department: '',
  campus: 'Main Campus',
  description: '',
  estimatedCost: 0,
  fundingSource: 'University Fund',
  startDate: '',
  endDate: '',
  manager: '',
  priority: 'High',
  status: 'Planning',
  constructionPermissionDoc: '',
};

const statusVariant = (s: string) => {
  if (s === 'Completed') return 'approved';
  if (s === 'Delayed') return 'rejected';
  if (s === 'Ongoing') return 'pending';
  return 'neutral';
};

export default function ProjectMaster() {
  const [data, setData] = useState<Project[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Project>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.code || !form.name) {
      ToastService.error('Project Code and Name are required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as Project,
      ]);
      ToastService.success('Project created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Project) : d
        )
      );
      ToastService.success('Project updated successfully.');
    }
    close();
  };

  const handleDelete = (item: Project) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Project deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Active Projects"
      description="Create and maintain infrastructure project records."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Active Projects' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'code', header: 'Project Code' },
            { field: 'name', header: 'Project Name' },
            { field: 'type', header: 'Type' },
            { field: 'department', header: 'Department' },
            { field: 'campus', header: 'Campus' },
            { field: 'startDate', header: 'Start Date' },
            { field: 'endDate', header: 'End Date' },
            {
              field: 'estimatedCost',
              header: 'Est. Cost',
              cell: (item: Project) => (
                <span>₹{item.estimatedCost.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'priority',
              header: 'Priority',
              cell: (item: Project) => (
                <StatusBadge
                  label={item.priority}
                  variant={
                    item.priority === 'High'
                      ? 'rejected'
                      : item.priority === 'Medium'
                        ? 'pending'
                        : 'neutral'
                  }
                />
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Project) => (
                <StatusBadge
                  label={item.status}
                  variant={statusVariant(item.status)}
                />
              ),
            },
            {
              field: 'constructionPermissionDoc',
              header: 'Construction Permission',
              cell: (item: Project) => (
                item.constructionPermissionDoc ? (
                  <span style={{ color: '#16a34a', fontWeight: 500, fontSize: '0.75rem' }}>
                    📄 {item.constructionPermissionDoc}
                  </span>
                ) : (
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>No Doc</span>
                )
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Project) => (
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
              label="Add Project"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search projects..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'New Project'
            : popup.mode === 'edit'
              ? 'Edit Project'
              : 'View Project'
        }
        subtitle="Infrastructure project details and configuration."
        size="lg"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Project Code"
            placeholder="e.g. INFRA-007"
            value={form.code ?? ''}
            onChange={v => setForm(f => ({ ...f, code: v }))}
            required
            disabled={isReadOnly}
          />
          <TextBox
            label="Project Name"
            placeholder="Project name"
            value={form.name ?? ''}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
            disabled={isReadOnly}
          />
          <DropDownList
            label="Project Type"
            data={PROJECT_TYPES}
            textField="name"
            optionValue="value"
            value={form.type}
            onChange={v => setForm(f => ({ ...f, type: v as any }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <DropDownList
            label="Department"
            data={DEPARTMENTS}
            textField="name"
            optionValue="value"
            value={form.department}
            onChange={v => setForm(f => ({ ...f, department: v as any }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Campus"
            data={CAMPUSES}
            textField="name"
            optionValue="value"
            value={form.campus}
            onChange={v => setForm(f => ({ ...f, campus: v as any }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Description"
          placeholder="Project description and scope"
          value={form.description ?? ''}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        <FormGrid columns={3}>
          <TextBox
            label="Estimated Cost (₹)"
            placeholder="e.g. 4500000"
            value={String(form.estimatedCost ?? '')}
            onChange={v => setForm(f => ({ ...f, estimatedCost: Number(v) }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Funding Source"
            data={FUNDING_SOURCES}
            textField="name"
            optionValue="value"
            value={form.fundingSource}
            onChange={v => setForm(f => ({ ...f, fundingSource: v as any }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Project Manager"
            placeholder="Name of project manager"
            value={form.manager ?? ''}
            onChange={v => setForm(f => ({ ...f, manager: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={4}>
          <DatePicker
            label="Planned Start Date"
            value={form.startDate ? new Date(form.startDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                startDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
          <DatePicker
            label="Planned End Date"
            value={form.endDate ? new Date(form.endDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                endDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
          <DropDownList
            label="Priority"
            data={PRIORITIES}
            textField="name"
            optionValue="value"
            value={form.priority}
            onChange={v => setForm(f => ({ ...f, priority: v as any }))}
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
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.5rem',
            borderTop: '1px solid #f3f4f6',
            paddingTop: '0.75rem',
          }}
        >
          📄 Upload Mandate Documents
        </h4>
        <FormGrid columns={1}>
          <div>
            <label
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#374151',
                display: 'block',
                marginBottom: '0.375rem',
              }}
            >
              Construction Permission
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              disabled={isReadOnly}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm(f => ({ ...f, constructionPermissionDoc: file.name }));
                  ToastService.success(
                    `Uploaded construction permission: ${file.name}`
                  );
                }
              }}
              style={{
                width: '100%',
                padding: '0.375rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.8125rem',
                background: '#ffffff',
              }}
            />
            {form.constructionPermissionDoc && (
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#16a34a',
                  display: 'block',
                  marginTop: '0.25rem',
                  fontWeight: 600,
                }}
              >
                ✓ Selected: {form.constructionPermissionDoc}
              </span>
            )}
          </div>
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
