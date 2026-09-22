import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  Checkbox,
  DropDownList,
  FileUpload,
  TextBox,
} from 'shared/components/forms';
import 'shared/components/grid/GridActionButtons.css';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  PreviewGrid,
  StatusBadge,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, civilStorage } from '../../civilStorage';
import {
  initialCivilProjects,
  civilWorks as initialData,
  initialFundingSources,
  initialMandateDocuments,
  initialWorkCategories,
  initialWorkDepartments,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const CIVIL_STATUS_VARIANT_MAP: Record<
  string,
  'approved' | 'rejected' | 'pending' | 'neutral'
> = {
  registered: 'neutral',
  'requirement generated': 'pending',
  requirementgenerated: 'pending',
  aaapproved: 'approved',
  'aa approved': 'approved',
  tsgranted: 'approved',
  'ts granted': 'approved',
  budgetlocked: 'approved',
  'budget locked': 'approved',
};

function getCivilStatusVariant(
  status: string
): 'approved' | 'rejected' | 'pending' | 'neutral' {
  return CIVIL_STATUS_VARIANT_MAP[status.toLowerCase()] ?? 'neutral';
}

const ROUTE_OPTIONS = [
  { text: 'Internal Execution', value: 'Internal' },
  { text: 'External Agency / Deposit', value: 'ExternalAgency' },
];

const PRIORITY_OPTIONS = [
  { text: 'Critical', value: 'Critical' },
  { text: 'High', value: 'High' },
  { text: 'Medium', value: 'Medium' },
  { text: 'Low', value: 'Low' },
];

const WORK_BASIS_OPTIONS = [
  { text: 'SOR Based', value: 'SOR' },
  { text: 'Non-SOR', value: 'NonSor' },
  { text: 'BOQ Based', value: 'BoqBased' },
];

type PageMode = 'list' | 'create' | 'edit' | 'view';

const EMPTY_WORK = {
  workRegistrationId: 0,
  code: '',
  name: '',
  projectId: 1,
  projectDescription: '',
  workCategoryId: 1,
  workCategoryName: '',
  subCategoryId: 1,
  subCategoryName: '',
  priorityLevel: 'Medium',
  fundingSourceId: 1,
  fundingSourceName: '',
  workBasis: 'SOR',
  executionRoute: 'Internal',
  isStatuaryCheck: false,
  isStatutoryCheck: false,
  status: 'Registered',
  isActive: true,
  mandateDocs: {} as Record<string, string>,
};

export default function WorkRegistration() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    const list = saved ? JSON.parse(saved) : initialData;
    return list.map((w: any) => {
      const isStat = Boolean(w.isStatuaryCheck ?? w.isStatutoryCheck ?? false);
      return {
        ...w,
        workRegistrationId: w.workRegistrationId || Number(w.id) || 0,
        code: w.code || w.workId || `CW-2025-${String(w.id).padStart(3, '0')}`,
        priorityLevel: w.priorityLevel || w.priority || 'Medium',
        workBasis:
          w.workBasis === 'SOR Based' || w.workBasis === 'SOR'
            ? 'SOR'
            : w.workBasis === 'BOQ Based' ||
                w.workBasis === 'BOQBased' ||
                w.workBasis === 'BoqBased'
              ? 'BoqBased'
              : w.workBasis || 'SOR',
        executionRoute:
          w.executionRoute === 'External Agency' ||
          w.executionRoute === 'External' ||
          w.executionRoute === 'ExternalAgency'
            ? 'ExternalAgency'
            : 'Internal',
        isActive: w.isActive !== false,
        isStatuaryCheck: isStat,
        isStatutoryCheck: isStat,
        mandateDocs: w.mandateDocs || {},
      };
    });
  });

  const [projects] = useState<CivilManagement.CivilProject[]>(() => {
    const saved = localStorage.getItem('civil_projects');
    return saved ? JSON.parse(saved) : initialCivilProjects;
  });

  const [categories] = useState<CivilManagement.WorkCategoryMaster[]>(() => {
    const saved = localStorage.getItem('civil_work_categories');
    return saved ? JSON.parse(saved) : initialWorkCategories;
  });

  const [departments] = useState<CivilManagement.WorkDepartmentMaster[]>(() => {
    const saved = localStorage.getItem('civil_work_departments');
    return saved ? JSON.parse(saved) : initialWorkDepartments;
  });

  const [fundingSources] = useState<CivilManagement.FundingSourceMaster[]>(
    () => {
      const saved = localStorage.getItem('civil_funding_sources');
      return saved ? JSON.parse(saved) : initialFundingSources;
    }
  );

  const [mandateDocs] = useState<CivilManagement.MandateDocument[]>(() => {
    const saved = localStorage.getItem('civil_mandate_documents');
    return saved ? JSON.parse(saved) : initialMandateDocuments;
  });

  const [mode, setMode] = useState<PageMode>('list');
  const [viewItem, setViewItem] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY_WORK);

  useEffect(() => {
    civilStorage.set(CIVIL_STORAGE_KEYS.WORKS, data);
  }, [data]);

  const handleBackToList = useCallback(() => {
    setMode('list');
    setEditingItem(null);
    setViewItem(null);
    setForm(EMPTY_WORK);
  }, []);

  const nextWorkCode = () => {
    const counter = data.length + 1;
    return `CW-${new Date().getFullYear()}-${String(counter).padStart(3, '0')}`;
  };

  const openCreate = () => {
    const firstProj = projects[0];
    const firstCat = categories[0];
    const firstSub =
      departments.find(d => d.parentCategoryId === firstCat?.id) ||
      departments[0];
    const firstFund = fundingSources[0];
    setForm({
      ...EMPTY_WORK,
      projectId: 1,
      projectDescription: firstProj
        ? `${firstProj.name} (${firstProj.campus})`
        : '',
      workCategoryId: 1,
      workCategoryName: firstCat?.name || '',
      subCategoryId: 1,
      subCategoryName: firstSub?.name || '',
      fundingSourceId: 1,
      fundingSourceName: firstFund?.name || '',
      isStatuaryCheck: false,
      isStatutoryCheck: false,
      mandateDocs: {},
    });
    setEditingItem(null);
    setMode('create');
  };

  const openEdit = (item: any) => {
    const isStat = Boolean(
      item.isStatuaryCheck ?? item.isStatutoryCheck ?? false
    );
    setForm({
      ...item,
      isStatuaryCheck: isStat,
      isStatutoryCheck: isStat,
      mandateDocs: item.mandateDocs || {},
    });
    setEditingItem(item);
    setMode('edit');
  };

  const openView = (item: any) => {
    setViewItem(item);
    setMode('view');
  };

  const filteredSubCategories = useMemo(() => {
    const catCode = categories.find(
      (_, i) => i + 1 === Number(form.workCategoryId)
    )?.id;
    if (!catCode) return departments;
    const direct = departments.filter(d => d.parentCategoryId === catCode);
    return direct.length > 0 ? direct : departments;
  }, [departments, categories, form.workCategoryId]);

  const handleProjectChange = (val: unknown) => {
    const id = Number(val);
    const proj =
      projects[id - 1] ||
      projects.find(p => p.id === String(val)) ||
      projects[0];
    if (proj) {
      setForm((f: any) => ({
        ...f,
        projectId: id,
        projectDescription: `${proj.name} (${proj.campus})`,
      }));
    }
  };

  const handleCategoryChange = (val: unknown) => {
    const id = Number(val);
    const cat =
      categories[id - 1] ||
      categories.find(c => c.id === String(val)) ||
      categories[0];
    const sub =
      departments.find(d => d.parentCategoryId === cat?.id) || departments[0];
    setForm((f: any) => ({
      ...f,
      workCategoryId: id,
      workCategoryName: cat?.name || '',
      subCategoryId: 1,
      subCategoryName: sub?.name || '',
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name?.trim()) {
      ToastService.error('Work Name is required.');
      return;
    }

    const workRegId = form.workRegistrationId || Date.now();
    const workCode = form.code || nextWorkCode();
    const isStat = Boolean(
      form.isStatuaryCheck ?? form.isStatutoryCheck ?? false
    );

    const payload = {
      workRegistrationId: workRegId,
      code: workCode,
      workId: workCode,
      name: form.name.trim(),
      projectId: Number(form.projectId),
      projectDescription: form.projectDescription,
      workCategoryId: Number(form.workCategoryId),
      workCategoryName: form.workCategoryName,
      subCategoryId: Number(form.subCategoryId),
      subCategoryName: form.subCategoryName,
      priorityLevel: form.priorityLevel || 'Medium',
      fundingSourceId: Number(form.fundingSourceId),
      fundingSourceName: form.fundingSourceName,
      workBasis: form.workBasis || 'SOR',
      executionRoute: form.executionRoute || 'Internal',
      status: form.status || 'Registered',
      isStatuaryCheck: isStat,
      isStatutoryCheck: isStat,
      isActive: form.isActive !== false,
      mandateDocs: form.mandateDocs || {},
    };

    if (mode === 'create') {
      const newWork = {
        ...payload,
        id: String(payload.workRegistrationId),
        status: 'Registered',
        isActive: true,
      };
      setData(prev => [newWork, ...prev]);
      ToastService.success('Work registered successfully.');
    } else if (mode === 'edit' && editingItem) {
      const updatedWork = { ...editingItem, ...payload };
      setData(prev =>
        prev.map(d =>
          d.workRegistrationId === editingItem.workRegistrationId ||
          d.id === editingItem.id
            ? updatedWork
            : d
        )
      );
      ToastService.success('Work updated successfully.');
    }
    handleBackToList();
  };

  const handleToggleStatus = (item: any) => {
    setData(prev =>
      prev.map(d => {
        if (
          d.workRegistrationId === item.workRegistrationId ||
          d.id === item.id
        ) {
          const next = d.isActive === false ? true : false;
          ToastService.info(`Work ${next ? 'Activated' : 'Suspended'}.`);
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  // ─── CREATE / EDIT ──────────────────────────────────────────────────────────

  if (mode === 'create' || mode === 'edit') {
    return (
      <FormPage
        title={
          mode === 'create'
            ? 'Register New Work'
            : `Edit Work — ${form.code || form.workId}`
        }
        description="Fill in the details to register a new civil engineering work, project allocation, and mandate documents."
        breadcrumbs={[
          { label: 'Home', to: '/home/menu' },
          { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
          { label: 'Admin Login', to: civilUrls.adminMenu },
          { label: 'Work Registration', to: civilUrls.workRegistration },
          {
            label:
              mode === 'create'
                ? 'Register New Work'
                : `Edit ${form.code || form.workId}`,
          },
        ]}
      >
        <FormCard title="Work Specifications & Documents">
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <FormGrid columns={3}>
              <DropDownList
                label="Project"
                data={projects.map((p, idx) => ({
                  text: `${p.name} (${p.campus})`,
                  value: idx + 1,
                }))}
                value={form.projectId}
                onChange={handleProjectChange}
                required
              />
              <TextBox
                label="Work Name"
                placeholder="Enter Work Name"
                value={form.name}
                onChange={val => setForm((f: any) => ({ ...f, name: val }))}
                maxLength={250}
                required
              />
              <DropDownList
                label="Work Category"
                data={categories.map((c, idx) => ({
                  text: `${c.code} — ${c.name}`,
                  value: idx + 1,
                }))}
                value={form.workCategoryId}
                onChange={handleCategoryChange}
                required
              />
              <DropDownList
                label="Sub Category"
                data={filteredSubCategories.map((d, idx) => ({
                  text: `${d.code} — ${d.name}`,
                  value: idx + 1,
                }))}
                value={form.subCategoryId}
                onChange={val => {
                  const id = Number(val);
                  const sub =
                    filteredSubCategories[id - 1] || filteredSubCategories[0];
                  setForm((f: any) => ({
                    ...f,
                    subCategoryId: id,
                    subCategoryName: sub?.name || '',
                  }));
                }}
                required
              />
              <DropDownList
                label="Priority Level"
                data={PRIORITY_OPTIONS}
                value={form.priorityLevel}
                onChange={val =>
                  setForm((f: any) => ({ ...f, priorityLevel: val as string }))
                }
                required
              />
              <DropDownList
                label="Funding Source"
                data={fundingSources.map((s, idx) => ({
                  text: s.name,
                  value: idx + 1,
                }))}
                value={form.fundingSourceId}
                onChange={val => {
                  const id = Number(val);
                  const fs = fundingSources[id - 1] || fundingSources[0];
                  setForm((f: any) => ({
                    ...f,
                    fundingSourceId: id,
                    fundingSourceName: fs?.name || '',
                  }));
                }}
                required
              />
              <DropDownList
                label="Work Basis"
                data={WORK_BASIS_OPTIONS}
                value={form.workBasis}
                onChange={val =>
                  setForm((f: any) => ({ ...f, workBasis: val as string }))
                }
                required
              />
              <DropDownList
                label="Execution Route"
                data={ROUTE_OPTIONS}
                value={form.executionRoute}
                onChange={val =>
                  setForm((f: any) => ({
                    ...f,
                    executionRoute: val as string,
                  }))
                }
                required
              />
            </FormGrid>

            <Checkbox
              label="Statutory Compliance Verified"
              checked={Boolean(
                form.isStatuaryCheck ?? form.isStatutoryCheck ?? false
              )}
              onChange={val =>
                setForm((f: any) => ({
                  ...f,
                  isStatuaryCheck: val,
                  isStatutoryCheck: val,
                }))
              }
            />

            {/* Documents Section */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-800">Documents</h4>
                <span className="text-xs text-gray-500">
                  Max file size: 10MB (.pdf, .jpg, .png)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mandateDocs.map(doc => (
                  <FileUpload
                    key={doc.id}
                    label={doc.name}
                    required={doc.isMandatory}
                    accept=".pdf,.png,.jpg,.jpeg"
                    mode="file"
                    uploadNote={doc.description || 'Upload mandate document'}
                    onChange={(file: File | null) =>
                      setForm((f: any) => ({
                        ...f,
                        mandateDocs: {
                          ...(f.mandateDocs || {}),
                          [doc.name]: file?.name || '',
                        },
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <FormActions
              isEditMode={mode === 'edit'}
              onSave={handleSave}
              onReset={handleBackToList}
            />
          </form>
        </FormCard>
      </FormPage>
    );
  }

  // ─── VIEW ───────────────────────────────────────────────────────────────────

  if (mode === 'view' && viewItem) {
    const workCode =
      viewItem.code || viewItem.workId || `#${viewItem.workRegistrationId}`;
    const isStat = Boolean(
      viewItem.isStatuaryCheck ?? viewItem.isStatutoryCheck ?? false
    );
    return (
      <FormPage
        title={`Work Details — ${workCode}`}
        description="Complete specifications, administrative approval, and progressive civil workflow record."
        breadcrumbs={[
          { label: 'Home', to: '/home/menu' },
          { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
          { label: 'Admin Login', to: civilUrls.adminMenu },
          { label: 'Work Registration', to: civilUrls.workRegistration },
          { label: `Details — ${workCode}` },
        ]}
      >
        <FormCard title="Civil Work Registration Details">
          <PreviewGrid
            columns={3}
            fields={[
              { label: 'Work Code', value: viewItem.code || viewItem.workId },
              { label: 'Work Name', value: viewItem.name },
              {
                label: 'Project',
                value: viewItem.projectDescription || '—',
              },
              {
                label: 'Work Category',
                value: viewItem.workCategoryName || '—',
              },
              {
                label: 'Sub Category',
                value: viewItem.subCategoryName || '—',
              },
              {
                label: 'Priority Level',
                value: viewItem.priorityLevel || 'Medium',
              },
              {
                label: 'Funding Source',
                value: viewItem.fundingSourceName || '—',
              },
              { label: 'Work Basis', value: viewItem.workBasis || 'SOR' },
              {
                label: 'Execution Route',
                value: viewItem.executionRoute || 'Internal',
              },
              {
                label: 'Statutory Check',
                value: (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isStat
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {isStat ? '✓ Yes' : '✗ No'}
                  </span>
                ),
              },
              {
                label: 'Work Status',
                value: (
                  <StatusBadge
                    label={viewItem.status || 'Registered'}
                    variant={getCivilStatusVariant(
                      viewItem.status || 'Registered'
                    )}
                  />
                ),
              },
            ]}
          />

          {viewItem.mandateDocs &&
            Object.entries(viewItem.mandateDocs).filter(([_, file]) =>
              Boolean(file)
            ).length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">
                  Attached Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(viewItem.mandateDocs)
                    .filter(([_, file]) => Boolean(file))
                    .map(([name, file]) => (
                      <div
                        key={name}
                        className="p-2.5 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-xs"
                      >
                        <span className="text-green-700 font-bold">✓</span>
                        <div>
                          <div className="font-semibold text-green-900">
                            {name}
                          </div>
                          <div className="text-gray-500">{String(file)}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </FormCard>

        <div className="flex justify-between items-center pt-2">
          <Button
            label="Back to Work Registrations"
            icon="arrow-left"
            variant="outlined"
            onClick={handleBackToList}
            type="button"
          />
          <div className="flex items-center gap-2">
            {isStat && (
              <Button
                label="Statutory Compliance"
                icon="shield"
                variant="outlined"
                onClick={() =>
                  navigate(
                    `${civilUrls.statutoryCompliance}?workId=${String(
                      viewItem.workRegistrationId ||
                        viewItem.id ||
                        viewItem.workId ||
                        ''
                    )}`
                  )
                }
                type="button"
              />
            )}
            <Button
              label="Edit Work"
              icon="pencil"
              variant="primary"
              onClick={() => openEdit(viewItem)}
              type="button"
            />
          </div>
        </div>
      </FormPage>
    );
  }

  // ─── LIST ───────────────────────────────────────────────────────────────────

  return (
    <FormPage
      title="Work Registration"
      description="Manage and register civil works, category allocations, priority levels, and execution routes."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Work Registration' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            {
              field: 'workRegistrationId',
              header: '#',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
              width: '50px',
            },
            {
              field: 'code',
              header: 'Work Code',
              cell: (item: any) => <span>{item.code || item.workId}</span>,
            },
            {
              field: 'name',
              header: 'Work Name',
            },
            {
              field: 'projectDescription',
              header: 'Project Description',
              cell: (item: any) => (
                <span>{item.projectDescription || '-'}</span>
              ),
            },
            {
              field: 'workCategoryName',
              header: 'Category',
              cell: (item: any) => <span>{item.workCategoryName || '-'}</span>,
            },
            {
              field: 'priorityLevel',
              header: 'Priority',
              cell: (w: any) => {
                const p = w.priorityLevel || w.priority || 'Medium';
                const variant =
                  p === 'Critical' || p === 'High'
                    ? 'rejected'
                    : p === 'Medium'
                      ? 'pending'
                      : 'neutral';
                return <StatusBadge label={p} variant={variant} />;
              },
            },
            {
              field: 'isStatuaryCheck',
              header: 'Statutory Check',
              cell: (w: any) => {
                const isStat = Boolean(
                  w.isStatuaryCheck ?? w.isStatutoryCheck ?? false
                );
                return (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isStat
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {isStat ? '✓ Yes' : '✗ No'}
                  </span>
                );
              },
            },
            {
              field: 'status',
              header: 'Work Status',
              cell: (item: any) => (
                <StatusBadge
                  label={item.status || 'N/A'}
                  variant={getCivilStatusVariant(item.status || '')}
                />
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: any) => (
                <StatusButton
                  value={item.isActive !== false}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
            {
              field: 'workRegistrationId',
              header: 'Actions',
              sortable: false,
              cell: (item: any) => {
                const workId = String(
                  item.workRegistrationId || item.id || item.workId || ''
                );
                const hasStatutory = Boolean(
                  item.isStatuaryCheck ?? item.isStatutoryCheck ?? false
                );
                return (
                  <div className="grid-action-buttons">
                    <Button
                      icon="eye"
                      variant="outlined"
                      size="small"
                      className="grid-action-button grid-action-button-view"
                      onClick={() => openView(item)}
                      tooltip="View Details"
                      ariaLabel="View Details"
                    />
                    <Button
                      icon="pencil"
                      variant="outlined"
                      size="small"
                      className="grid-action-button grid-action-button-edit"
                      onClick={() => openEdit(item)}
                      tooltip="Edit Work"
                      ariaLabel="Edit Work"
                    />
                    {hasStatutory && (
                      <Button
                        icon="shield"
                        variant="outlined"
                        size="small"
                        className="grid-action-button hover:!border-black hover:!bg-black/[0.04] hover:!text-black"
                        tooltip="Statutory Compliance & NOC"
                        ariaLabel="Statutory Compliance"
                        onClick={() =>
                          navigate(
                            `${civilUrls.statutoryCompliance}?workId=${workId}`
                          )
                        }
                      />
                    )}
                  </div>
                );
              },
            },
          ]}
          toolbar={
            <Button
              label="Register Work"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
          searchPlaceholder="Search civil works..."
        />
      </FormCard>
    </FormPage>
  );
}
