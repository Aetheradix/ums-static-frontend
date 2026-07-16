import { useCallback, useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  MultiSelectList,
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

const initialProjects = [
  {
    id: 'P1',
    area: 'Academic Block-3 Construction',
    campus: 'Main Campus',
    location: 'Behind Central Library, adjacent to block-2',
  },
  {
    id: 'P2',
    area: 'Hostel Ground leveling',
    campus: 'South Campus',
    location: 'Sports complex parking annex',
  },
  {
    id: 'P3',
    area: 'Electrical substation wiring',
    campus: 'North Campus',
    location: 'Utility zone near north gate',
  },
];

const LAND_OWNERSHIP_OPTIONS = [
  'Govt',
  'University',
  'Private',
  'Lease',
  'Donation',
].map(v => ({ name: v, value: v }));

const OWNERSHIP_VERIFIED_OPTIONS = [
  { name: 'Yes', value: 'Yes' },
  { name: 'No', value: 'No' },
];

const WORK_BASIS_OPTIONS = [
  { name: 'SOR', value: 'SOR' },
  { name: 'Non-SOR', value: 'Non-SOR' },
];

// ── Document Master ────────────────────────────────────────────────────────────
// Add new document types here — they will automatically appear in the dropdown.
const MANDATE_DOC_MASTER = [
  { id: 'construction_agreement', name: 'Construction Agreement Document', accept: '.pdf,.doc,.docx' },
  { id: 'scope_of_work',         name: 'Scope of Work (SOW) Document',    accept: '.pdf,.doc,.docx' },
  { id: 'layout_drawing',        name: 'Layout / Drawing Document',        accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg,.dwg' },
  { id: 'land_ownership_proof',  name: 'Land Ownership Proof',             accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' },
  { id: 'env_clearance',         name: 'Environmental Clearance Certificate', accept: '.pdf,.doc,.docx' },
  { id: 'admin_approval',        name: 'Administrative Approval Order',    accept: '.pdf,.doc,.docx' },
  { id: 'technical_sanction',    name: 'Technical Sanction Order',         accept: '.pdf,.doc,.docx' },
  { id: 'budget_allocation',     name: 'Budget Allocation Letter',         accept: '.pdf,.doc,.docx' },
];

const EMPTY: Partial<CivilWork> = {
  workId: '',
  name: '',
  category: '' as any,
  department: '',
  campus: 'Main Campus',
  location: '',
  executionRoute: '' as any,
  estimatedCost: 0,
  fundingSource: '',
  startDate: new Date().toISOString().split('T')[0],
  expectedEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0], // default 1 year
  siteEngineer: '',
  priority: '' as any,
  status: 'Registered',
  workBasis: '' as any,
  projectArea: '',
  landOwnershipType: '',
  ownershipVerified: '',
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
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
  const [projects] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });
  const projectAreaOptions = projects.map(p => ({
    name: p.area,
    value: p.area,
  }));

  useEffect(() => {
    localStorage.setItem('civil_works', JSON.stringify(data));
  }, [data]);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
    setSelectedDocTypes([]);
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
    const deptValue = Array.isArray(form.department)
      ? form.department.join(', ')
      : form.department || '';
    if (!deptValue) {
      ToastService.error('Category is required.');
      return;
    }

    const savedForm = {
      ...form,
      department: deptValue,
    };

    // Determine initial status — Deposit Work skips BOQ and goes directly to Milestone stage
    const isDepositWork = form.category === 'Deposit Work';

    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        {
          ...savedForm,
          id: String(Date.now()),
          workId: nextWorkId(),
          aaAmount: 0,
          tsAmount: 0,
          contractAmount: 0,
          physicalProgress: 0,
          financialProgress: 0,
          // Deposit Works skip BOQ/AA/TS/Tender flow — they go directly to Milestone
          status: isDepositWork ? 'Tender Awarded' : 'Registered',
        } as CivilWork,
      ]);
      ToastService.success(
        isDepositWork
          ? 'Deposit Work registered. Proceeding directly to Milestone Definition (BOQ/Tender stages skipped).'
          : 'Work registered successfully. Unique Work ID generated.'
      );
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...savedForm } as CivilWork)
            : d
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
              field: 'projectArea',
              header: 'Project Area',
              cell: (w: any) => (
                <span style={{ fontSize: '0.8125rem', color: '#4b5563' }}>
                  {w.projectArea ?? '—'}
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
                  className={`civil-pill ${w.workBasis === 'BOQ Based' || w.workBasis === 'Non-SOR' ? 'purple' : 'blue'}`}
                >
                  {w.workBasis ?? 'SOR'}
                </span>
              ),
            },
            {
              field: 'estimatedCost',
              header: 'Est. Cost',
              cell: (w: any) => (
                <span>
                  {w.estimatedCost
                    ? `₹${(w.estimatedCost / 100000).toFixed(1)}L`
                    : '—'}
                </span>
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
                  {w.mandateDocs && Object.keys(w.mandateDocs).length > 0
                    ? Object.entries(w.mandateDocs).map(([docName, fileName]) => (
                        <span key={docName} style={{ color: '#16a34a', fontWeight: 500 }}>
                          📄 {docName}: {fileName as string}
                        </span>
                      ))
                    : <span style={{ color: '#9ca3af' }}>No Docs</span>
                  }
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
                      setForm({
                        ...item,
                        department: item.department
                          ? item.department
                              .split(', ')
                              .map((x: string) => x.trim())
                          : [],
                      });
                      // Restore selected doc types from saved mandateDocs
                      if (item.mandateDocs) {
                        setSelectedDocTypes(Object.keys(item.mandateDocs));
                      } else {
                        setSelectedDocTypes([]);
                      }
                      setPopup({ mode: 'view', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setForm({
                        ...item,
                        department: item.department
                          ? item.department
                              .split(', ')
                              .map((x: string) => x.trim())
                          : [],
                      });
                      // Restore selected doc types from saved mandateDocs
                      if (item.mandateDocs) {
                        setSelectedDocTypes(Object.keys(item.mandateDocs));
                      } else {
                        setSelectedDocTypes([]);
                      }
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
                setForm({
                  ...EMPTY,
                  department: [] as any,
                });
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
        size="xl"
      >
        {popup.mode !== 'create' && (
          <div
            style={{
              marginBottom: '1rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <span
              style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}
            >
              Work ID:
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#1d4ed8',
                background: '#eff6ff',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.85rem',
              }}
            >
              {form.workId}
            </span>
          </div>
        )}

        <FormGrid columns={2}>
          {/* 1. Project Area Name */}
          <DropDownList
            label="Project Area Name"
            placeholder="Select Project Area"
            data={projectAreaOptions}
            textField="name"
            optionValue="value"
            value={form.projectArea}
            onChange={v => setForm(f => ({ ...f, projectArea: v as string }))}
            disabled={isReadOnly}
          />

          {/* 2. Work Name / Title */}
          <TextBox
            label="Work Name / Title"
            placeholder="e.g. New Academic Block – Science Wing"
            value={form.name ?? ''}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
            disabled={isReadOnly}
          />

          {/* 3. Work Type */}
          <DropDownList
            label="Work Type"
            placeholder="Select Work Type"
            data={CATEGORIES}
            textField={'name' as any}
            optionValue="value"
            value={form.category}
            onChange={v => {
              setForm(f => ({
                ...f,
                category: v as any,
                landOwnershipType:
                  v === 'New Capital Construction' ? f.landOwnershipType : '',
                ownershipVerified:
                  v === 'New Capital Construction' ? f.ownershipVerified : '',
              }));
            }}
            disabled={isReadOnly}
          />

          {/* 4. Land Ownership Type */}
          {form.category === 'New Capital Construction' && (
            <DropDownList
              label="Land Ownership Type"
              placeholder="Select Land Ownership"
              data={LAND_OWNERSHIP_OPTIONS}
              textField="name"
              optionValue="value"
              value={form.landOwnershipType}
              onChange={v =>
                setForm(f => ({ ...f, landOwnershipType: v as string }))
              }
              disabled={isReadOnly}
            />
          )}
          {/* 6. Ownership Verified */}
          {form.category === 'New Capital Construction' && (
            <DropDownList
              label="Ownership Verified"
              placeholder="Select Option"
              data={OWNERSHIP_VERIFIED_OPTIONS}
              textField="name"
              optionValue="value"
              value={form.ownershipVerified}
              onChange={v =>
                setForm(f => ({ ...f, ownershipVerified: v as string }))
              }
              disabled={isReadOnly}
            />
          )}

          {/* 5. Category */}
          <MultiSelectList
            label="Category"
            placeholder="Select Categories"
            data={DEPT_OPTIONS}
            textField="name"
            valueField="value"
            value={
              (Array.isArray(form.department)
                ? form.department
                : form.department
                  ? form.department.split(', ').map(x => x.trim())
                  : []) as any
            }
            onChange={(v: any) => setForm(f => ({ ...f, department: v }))}
            disabled={isReadOnly}
          />

          {/* 7. Priority */}
          <DropDownList
            label="Priority"
            placeholder="Select Priority"
            data={PRIORITY_OPTIONS}
            textField={'name' as any}
            optionValue="value"
            value={form.priority}
            onChange={v => setForm(f => ({ ...f, priority: v as any }))}
            disabled={isReadOnly}
          />

          {/* 8. Funding Source */}
          <DropDownList
            label="Funding Source"
            placeholder="Select Funding Source"
            data={FUNDING_SOURCES}
            textField={'name' as any}
            optionValue="value"
            value={form.fundingSource}
            onChange={v => setForm(f => ({ ...f, fundingSource: v as string }))}
            disabled={isReadOnly}
          />

          {/* 9. Site Engineer In-Charge */}
          <MultiSelectList
            label="Site Engineer In-Charge"
            placeholder="Select Site Engineers"
            data={SITE_ENGINEERS}
            textField="name"
            valueField="value"
            value={
              (Array.isArray(form.siteEngineer)
                ? form.siteEngineer
                : form.siteEngineer
                  ? [form.siteEngineer]
                  : []) as any
            }
            onChange={(v: any) => setForm(f => ({ ...f, siteEngineer: v }))}
            disabled={isReadOnly}
          />

          {/* 10. Work Basis (SOR or BOQ Based) */}
          <DropDownList
            label="Work Basis (SOR or Non-SOR Based)"
            placeholder="Select Work Basis"
            data={WORK_BASIS_OPTIONS}
            textField={'name' as any}
            optionValue="value"
            value={form.workBasis}
            onChange={v => setForm(f => ({ ...f, workBasis: v as any }))}
            disabled={isReadOnly}
          />

          {/* 11. Execution Route (for issuing tender) */}
          <DropDownList
            label="Execution Route (for issuing tender)"
            placeholder="Select Execution Route"
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

        {/* Step 1: Select which document types to upload from master */}
        <FormGrid columns={2}>
          <MultiSelectList
            label="Select Documents to Upload"
            placeholder="Choose document types from master..."
            data={MANDATE_DOC_MASTER.map(d => ({ name: d.name, value: d.id }))}
            textField="name"
            valueField="value"
            value={selectedDocTypes as any}
            onChange={(v: any) => {
              const ids: string[] = Array.isArray(v) ? v : [];
              setSelectedDocTypes(ids);
              // Remove deselected doc types from mandateDocs
              setForm(f => {
                const existing = { ...(f.mandateDocs ?? {}) };
                const activeNames = new Set(
                  ids.map(id => MANDATE_DOC_MASTER.find(d => d.id === id)?.name ?? id)
                );
                Object.keys(existing).forEach(k => {
                  if (!activeNames.has(k)) delete existing[k];
                });
                return { ...f, mandateDocs: existing };
              });
            }}
            disabled={isReadOnly}
          />
          <div /> {/* Spacer to align with 2-column layout */}
        </FormGrid>

        {/* Step 2: One file input per selected document type */}
        {selectedDocTypes.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              marginTop: '0.75rem',
            }}
          >
            {selectedDocTypes.map(docId => {
              const docDef = MANDATE_DOC_MASTER.find(d => d.id === docId);
              if (!docDef) return null;
              const uploadedName = (form.mandateDocs ?? {})[docDef.name];
              return (
                <div key={docId}>
                  <label
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#374151',
                      display: 'block',
                      marginBottom: '0.375rem',
                    }}
                  >
                    {docDef.name}
                  </label>
                  <input
                    type="file"
                    accept={docDef.accept}
                    disabled={isReadOnly}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setForm(f => ({
                          ...f,
                          mandateDocs: {
                            ...(f.mandateDocs ?? {}),
                            [docDef.name]: file.name,
                          },
                        }));
                        ToastService.success(
                          `Uploaded "${docDef.name}": ${file.name}`
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
                  {uploadedName && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#16a34a',
                        display: 'block',
                        marginTop: '0.25rem',
                        fontWeight: 600,
                      }}
                    >
                      ✓ Selected: {uploadedName}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

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
