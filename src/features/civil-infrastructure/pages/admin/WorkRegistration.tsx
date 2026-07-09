import { useCallback, useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type CivilWork, civilWorks as initialData } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: CivilWork }
  | { mode: 'view'; item: CivilWork };

const CATEGORIES = [
  'New Capital Construction',
  'Maintenance/Overhaul',
  'Renewal',
  'Strengthening',
  'Deposit Work',
  'Emergency Work',
].map(v => ({ name: v, value: v }));

const DEPT_OPTIONS = [
  'Civil Work',
  'Electrical Work',
  'Painting Work',
  'Furniture Work',
  'Sanitary & Plumbing Work',
  'Horticulture Work',
].map(v => ({ name: v, value: v }));

const CAMPUS_OPTIONS = [
  'Main Campus',
  'North Campus',
  'South Campus',
  'Off-Campus Centre',
].map(v => ({ name: v, value: v }));

const FUNDING_SOURCES = [
  'University Fund',
  'UGC Grant',
  'UGC Special Grant',
  'Central Govt',
  'State Govt',
  'External',
].map(v => ({ name: v, value: v }));

const ROUTE_OPTIONS = [
  { name: 'Internal Execution', value: 'Internal' },
  { name: 'External Agency / Deposit', value: 'External Agency' },
];

const PRIORITY_OPTIONS = [
  { name: 'High', value: 'High' },
  { name: 'Medium', value: 'Medium' },
  { name: 'Low', value: 'Low' },
];

const SITE_ENGINEERS = [
  'Er. Rajesh Verma',
  'Er. Amit Sharma',
  'Er. Priya Patel',
  'Er. Sandeep Singh',
  'Er. Vikram Malhotra',
  'Er. Suresh Kumar',
  'Er. Kavitha Menon',
].map(v => ({ name: v, value: v }));

const WORK_BASIS_OPTIONS = [
  { name: 'SOR Based', value: 'SOR Based' },
  { name: 'BOQ Based', value: 'BOQ Based' },
];

const EMPTY: Partial<CivilWork> = {
  workId: '',
  name: '',
  category: 'New Capital Construction',
  department: 'Civil Work',
  campus: 'Main Campus',
  location: '',
  executionRoute: 'Internal',
  estimatedCost: 0,
  fundingSource: 'University Fund',
  startDate: new Date().toISOString().split('T')[0],
  expectedEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0], // default 1 year
  siteEngineer: 'Er. Rajesh Verma',
  priority: 'High',
  status: 'Registered',
  workBasis: 'SOR Based',
};

const statusVariant = (s: string) => {
  if (s === 'Completed' || s === 'DLP Active') return 'approved';
  if (s === 'In Progress') return 'pending';
  if (s === 'Registered' || s === 'Requirement Generated') return 'neutral';
  return 'neutral';
};

export default function WorkRegistration() {
  const [data, setData] = useState<CivilWork[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<CivilWork>>(EMPTY);

  useEffect(() => {
    localStorage.setItem('civil_works', JSON.stringify(data));
  }, [data]);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  // Auto-generate Work ID
  const nextWorkId = () => {
    const workCounter = data.length + 1;
    return `CW-${new Date().getFullYear()}-${String(workCounter).padStart(3, '0')}`;
  };

  const handleSave = () => {
    if (!form.name) {
      ToastService.error('Work Name is required.');
      return;
    }
    if (!form.department) {
      ToastService.error('Category is required.');
      return;
    }
    if (!form.estimatedCost || form.estimatedCost <= 0) {
      ToastService.error('Estimated Cost must be > 0.');
      return;
    }

    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        {
          ...form,
          id: String(Date.now()),
          workId: nextWorkId(),
          aaAmount: 0,
          tsAmount: 0,
          contractAmount: 0,
          physicalProgress: 0,
          financialProgress: 0,
          status: 'Registered',
        } as CivilWork,
      ]);
      ToastService.success(
        'Work registered successfully. Unique Work ID generated.'
      );
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as CivilWork) : d
        )
      );
      ToastService.success('Work record updated.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Work Registration"
      description="Log infrastructure requirements and register with a unique Work ID. All civil works begin here."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Work Registration' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'workId',
              header: 'Work ID',
              cell: (w: any) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                >
                  {w.workId}
                </span>
              ),
            },
            {
              field: 'name',
              header: 'Work Name',
              cell: (w: any) => (
                <span style={{ fontWeight: 600 }}>{w.name}</span>
              ),
            },
            {
              field: 'category',
              header: 'Work Type',
              cell: (w: any) => (
                <span style={{ fontSize: '0.75rem' }}>{w.category}</span>
              ),
            },
            { field: 'department', header: 'Category' },
            {
              field: 'workBasis',
              header: 'Work Basis',
              cell: (w: any) => (
                <span
                  className={`civil-pill ${w.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                >
                  {w.workBasis ?? 'SOR Based'}
                </span>
              ),
            },
            {
              field: 'estimatedCost',
              header: 'Est. Cost',
              cell: (w: any) => (
                <span>₹{(w.estimatedCost / 100000).toFixed(1)}L</span>
              ),
            },
            {
              field: 'docs' as any,
              header: 'Uploaded Documents',
              cell: (w: any) => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    fontSize: '0.72rem',
                  }}
                >
                  {w.constructionAgreementDoc ? (
                    <span style={{ color: '#16a34a', fontWeight: 500 }}>
                      📄 Agreement: {w.constructionAgreementDoc}
                    </span>
                  ) : null}
                  {w.scopeOfWorkDoc ? (
                    <span style={{ color: '#2563eb', fontWeight: 500 }}>
                      📄 SOW: {w.scopeOfWorkDoc}
                    </span>
                  ) : null}
                  {!w.constructionAgreementDoc && !w.scopeOfWorkDoc ? (
                    <span style={{ color: '#9ca3af' }}>No Docs</span>
                  ) : null}
                </div>
              ),
            },
            {
              field: 'priority',
              header: 'Priority',
              cell: (w: any) => (
                <span
                  className={`civil-pill ${w.priority === 'High' ? 'red' : w.priority === 'Medium' ? 'amber' : 'gray'}`}
                >
                  {w.priority}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (w: any) => (
                <StatusBadge
                  label={w.status}
                  variant={statusVariant(w.status)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: any) => (
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
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Register New Work"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search civil works..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Register New Civil Work'
            : popup.mode === 'edit'
              ? 'Edit Work Registration'
              : 'View Work Registration'
        }
        subtitle="Fill all metadata attributes for official work registration."
        size="lg"
      >
        <FormGrid columns={2}>
          {popup.mode !== 'create' && (
            <TextBox
              label="Work ID"
              value={form.workId ?? ''}
              onChange={() => {}}
              disabled
            />
          )}
          <DropDownList
            label="Work Type"
            data={CATEGORIES}
            textField={'name' as any}
            optionValue="value"
            value={form.category}
            onChange={v => setForm(f => ({ ...f, category: v as any }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Category"
            data={DEPT_OPTIONS}
            textField={'name' as any}
            optionValue="value"
            value={form.department}
            onChange={v => setForm(f => ({ ...f, department: v as string }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Work Name / Title"
            placeholder="e.g. New Academic Block – Science Wing"
            value={form.name ?? ''}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
            disabled={isReadOnly}
          />
          <DropDownList
            label="Priority"
            data={PRIORITY_OPTIONS}
            textField={'name' as any}
            optionValue="value"
            value={form.priority}
            onChange={v => setForm(f => ({ ...f, priority: v as any }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Campus"
            data={CAMPUS_OPTIONS}
            textField={'name' as any}
            optionValue="value"
            value={form.campus}
            onChange={v => setForm(f => ({ ...f, campus: v as string }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Location / Site Description"
            placeholder="e.g. Zone A – Plot 12"
            value={form.location ?? ''}
            onChange={v => setForm(f => ({ ...f, location: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <TextBox
            label="Estimated Cost (₹)"
            placeholder="e.g. 28500000"
            value={String(form.estimatedCost ?? '')}
            onChange={v => setForm(f => ({ ...f, estimatedCost: Number(v) }))}
            required
            disabled={isReadOnly}
          />
          <DropDownList
            label="Funding Source"
            data={FUNDING_SOURCES}
            textField={'name' as any}
            optionValue="value"
            value={form.fundingSource}
            onChange={v => setForm(f => ({ ...f, fundingSource: v as string }))}
            disabled={isReadOnly}
          />
        </FormGrid>

        <FormGrid columns={2}>
          <DropDownList
            label="Site Engineer In-Charge"
            data={SITE_ENGINEERS}
            textField={'name' as any}
            optionValue="value"
            value={form.siteEngineer}
            onChange={v => setForm(f => ({ ...f, siteEngineer: v as string }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Work Basis (SOR or BOQ Based)"
            data={WORK_BASIS_OPTIONS}
            textField={'name' as any}
            optionValue="value"
            value={form.workBasis}
            onChange={v => setForm(f => ({ ...f, workBasis: v as any }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Execution Route (for issuing tender)"
            data={ROUTE_OPTIONS}
            textField={'name' as any}
            optionValue="value"
            value={form.executionRoute}
            onChange={v => setForm(f => ({ ...f, executionRoute: v as any }))}
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
        <FormGrid columns={2}>
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
              Construction Agreement Document
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              disabled={isReadOnly}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm(f => ({ ...f, constructionAgreementDoc: file.name }));
                  ToastService.success(
                    `Uploaded construction agreement: ${file.name}`
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
            {form.constructionAgreementDoc && (
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#16a34a',
                  display: 'block',
                  marginTop: '0.25rem',
                  fontWeight: 600,
                }}
              >
                ✓ Selected: {form.constructionAgreementDoc}
              </span>
            )}
          </div>
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
              Scope of Work (SOW) Document
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              disabled={isReadOnly}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm(f => ({ ...f, scopeOfWorkDoc: file.name }));
                  ToastService.success(`Uploaded SOW document: ${file.name}`);
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
            {form.scopeOfWorkDoc && (
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#16a34a',
                  display: 'block',
                  marginTop: '0.25rem',
                  fontWeight: 600,
                }}
              >
                ✓ Selected: {form.scopeOfWorkDoc}
              </span>
            )}
          </div>
        </FormGrid>

        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={
                popup.mode === 'create'
                  ? 'Register Work & Generate ID'
                  : 'Update'
              }
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
