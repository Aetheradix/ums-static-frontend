import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button, ButtonPanel, StatusButton } from 'shared/components/buttons';
import {
  DropDownList,
  FileUpload,
  NumberBox,
  TextBox,
} from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewGrid,
  StatusBadge,
} from 'shared/new-components';
import { formatCurrency } from 'shared/utils/currency';
import { CIVIL_STORAGE_KEYS, civilStorage } from '../../civilStorage';
import {
  civilWorks as initialData,
  initialCivilProjects,
  initialFundingSources,
  initialMandateDocuments,
  initialWorkCategories,
  initialWorkDepartments,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: any }
  | { mode: 'view'; item: any };

const ROUTE_OPTIONS = [
  { text: 'Internal', value: 'Internal' },
  { text: 'External', value: 'External' },
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
  { text: 'BOQ Based', value: 'BOQBased' },
];

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
  estimatedCost: 0,
  status: 'Registered',
  isActive: true,
  mandateDocs: {} as Record<string, string>,
};

export default function WorkRegistration() {
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    const list = saved ? JSON.parse(saved) : initialData;
    return list.map((w: any) => ({
      ...w,
      workRegistrationId: w.workRegistrationId || Number(w.id) || 0,
      code: w.code || w.workId || `CW-2025-${String(w.id).padStart(3, '0')}`,
      priorityLevel: w.priorityLevel || w.priority || 'Medium',
      workBasis:
        w.workBasis === 'SOR Based'
          ? 'SOR'
          : w.workBasis === 'BOQ Based'
            ? 'BOQBased'
            : w.workBasis || 'SOR',
      executionRoute:
        w.executionRoute === 'External Agency'
          ? 'External'
          : w.executionRoute || 'Internal',
      siteEngineerSource: w.siteEngineerSource || 'Internal',
      employeeIds: w.employeeIds || [101],
      externalEngineers: w.externalEngineers || [],
      isActive: w.isActive !== false,
    }));
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

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<any>(EMPTY_WORK);

  useEffect(() => {
    civilStorage.set(CIVIL_STORAGE_KEYS.WORKS, data);
  }, [data]);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_WORK);
  }, []);

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
      mandateDocs: {},
    });
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: any) => {
    setForm({
      ...item,
      mandateDocs: item.mandateDocs || {},
    });
    setPopup({ mode: 'edit', item });
  };

  const openView = (item: any) => {
    setForm(item);
    setPopup({ mode: 'view', item });
  };

  const nextWorkId = () => {
    const workCounter = data.length + 1;
    return `CW-${new Date().getFullYear()}-${String(workCounter).padStart(3, '0')}`;
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
        campus: proj.campus,
        location: proj.location,
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
    if (!form.name.trim()) {
      ToastService.error('Work Name is required.');
      return;
    }

    const payload = {
      ...form,
      workRegistrationId: form.workRegistrationId || Date.now(),
      code: form.code || nextWorkId(),
      workId: form.code || nextWorkId(),
    };

    if (popup.mode === 'create') {
      const newWork = {
        ...payload,
        id: String(payload.workRegistrationId),
        status: 'Registered',
        isActive: true,
      };
      setData(prev => [newWork, ...prev]);
      ToastService.success(`Work registered successfully as ${newWork.code}.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.workRegistrationId === popup.item.workRegistrationId ||
          d.id === popup.item.id
            ? { ...d, ...payload }
            : d
        )
      );
      ToastService.success('Work registration updated successfully.');
    }
    close();
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

  return (
    <FormPage
      title="Work Registration"
      description="Manage and register civil engineering works, project allocations, site engineers, and mandate documents."
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
              cell: (w: any) => (
                <span className="font-mono text-blue-600 font-semibold">
                  {w.code || w.workId}
                </span>
              ),
              width: '130px',
            },
            {
              field: 'name',
              header: 'Work Name',
              cell: (w: any) => (
                <div>
                  <div className="font-semibold text-gray-900">{w.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {w.projectDescription || w.campus}
                  </div>
                </div>
              ),
            },
            {
              field: 'workCategoryName',
              header: 'Category',
              cell: (w: any) => (
                <span>{w.workCategoryName || w.category || '—'}</span>
              ),
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
              field: 'estimatedCost',
              header: 'Estimated Cost (₹)',
              cell: (w: any) => <span>{formatCurrency(w.estimatedCost)}</span>,
            },
            {
              field: 'status',
              header: 'Work Status',
              cell: (w: any) => {
                const s = String(w.status || '')
                  .toLowerCase()
                  .replace(/\s+/g, '');
                const variant =
                  s === 'completed' ||
                  s === 'dlpactive' ||
                  s === 'aaapproved' ||
                  s === 'tsgranted' ||
                  s === 'budgetlocked'
                    ? 'approved'
                    : s === 'inprogress' ||
                        s === 'tenderawarded' ||
                        s === 'tenderissued'
                      ? 'pending'
                      : 'neutral';
                return (
                  <StatusBadge
                    label={w.status || 'Registered'}
                    variant={variant}
                  />
                );
              },
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (w: any) => (
                <StatusButton
                  value={w.isActive !== false}
                  onClick={() => handleToggleStatus(w)}
                />
              ),
              width: '90px',
            },
            {
              field: 'workRegistrationId',
              header: 'Actions',
              sortable: false,
              cell: (item: any) => (
                <GridActionButtons
                  onView={() => openView(item)}
                  onEdit={() => openEdit(item)}
                  viewTooltip="View Details"
                  editTooltip="Edit Work"
                />
              ),
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
          searchPlaceholder="Search civil works by code, name, category, or project..."
        />
      </FormCard>

      {/* POPUP MODALS */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Register New Civil Work'
            : popup.mode === 'edit'
              ? `Edit Work — ${form.code || form.workId}`
              : `Work Details — ${form.code || form.workId}`
        }
        subtitle={
          popup.mode === 'view'
            ? 'Complete specifications, supervision allocation, and compliance record.'
            : 'Fill in the specifications, project linkage, site engineers, and mandate documents.'
        }
        size="lg"
      >
        {popup.mode === 'view' ? (
          <div className="flex flex-col gap-4">
            <FormCard title="Work Specifications">
              <PreviewGrid
                columns={3}
                fields={[
                  { label: 'Work Code', value: form.code || form.workId },
                  { label: 'Work Name', value: form.name },
                  {
                    label: 'Project Scheme',
                    value: form.projectDescription || '—',
                  },
                  {
                    label: 'Category',
                    value: form.workCategoryName || form.category || '—',
                  },
                  {
                    label: 'Department / Sub-Division',
                    value: form.subCategoryName || form.department || '—',
                  },
                  {
                    label: 'Priority Level',
                    value: form.priorityLevel || form.priority || 'Medium',
                  },
                  {
                    label: 'Funding Source',
                    value: form.fundingSourceName || form.fundingSource || '—',
                  },
                  {
                    label: 'Estimated Cost',
                    value: formatCurrency(form.estimatedCost),
                  },
                  { label: 'Work Basis', value: form.workBasis || 'SOR' },
                  {
                    label: 'Execution Route',
                    value: form.executionRoute || 'Internal',
                  },
                  { label: 'Status', value: form.status || 'Registered' },
                ]}
              />
            </FormCard>

            {form.mandateDocs && Object.keys(form.mandateDocs).length > 0 && (
              <FormCard title="Attached Mandate Documents">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(form.mandateDocs).map(([name, file]) => (
                    <div
                      key={name}
                      className="p-2.5 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-xs"
                    >
                      <span className="text-green-700 font-bold">✓</span>
                      <div>
                        <div className="font-semibold text-green-900">
                          {name}
                        </div>
                        <div className="text-gray-600">{String(file)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </FormCard>
            )}

            <ButtonPanel>
              <Button label="Close" variant="outlined" onClick={close} />
            </ButtonPanel>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <TextBox
              label="Work Name / Scheme Title *"
              placeholder="e.g. New Academic Block – Science Wing Phase II"
              value={form.name}
              onChange={val => setForm((f: any) => ({ ...f, name: val }))}
              required
            />

            <FormGrid columns={2}>
              <DropDownList
                label="Project Scheme *"
                data={projects.map((p, idx) => ({
                  text: `${p.name} (${p.campus})`,
                  value: idx + 1,
                }))}
                value={form.projectId}
                onChange={handleProjectChange}
                required
              />
              <DropDownList
                label="Work Category *"
                data={categories.map((c, idx) => ({
                  text: `${c.code} — ${c.name}`,
                  value: idx + 1,
                }))}
                value={form.workCategoryId}
                onChange={handleCategoryChange}
                required
              />
            </FormGrid>

            <FormGrid columns={2}>
              <DropDownList
                label="Executing Sub-Division / Dept *"
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
                label="Funding Source *"
                data={fundingSources.map((s, idx) => ({
                  text: `${s.code} — ${s.name}`,
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
            </FormGrid>

            <FormGrid columns={3}>
              <DropDownList
                label="Priority Level *"
                data={PRIORITY_OPTIONS}
                value={form.priorityLevel}
                onChange={val =>
                  setForm((f: any) => ({ ...f, priorityLevel: val as string }))
                }
              />
              <DropDownList
                label="Work Basis *"
                data={WORK_BASIS_OPTIONS}
                value={form.workBasis}
                onChange={val =>
                  setForm((f: any) => ({ ...f, workBasis: val as string }))
                }
              />
              <DropDownList
                label="Execution Route *"
                data={ROUTE_OPTIONS}
                value={form.executionRoute}
                onChange={val =>
                  setForm((f: any) => ({ ...f, executionRoute: val as string }))
                }
              />
            </FormGrid>

            <NumberBox
              label="Estimated Cost (₹) *"
              value={form.estimatedCost}
              onChange={val =>
                setForm((f: any) => ({
                  ...f,
                  estimatedCost: val ? Number(val) : 0,
                }))
              }
              mode="decimal"
              required
            />

            {/* Mandate Document Upload Section */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-800">
                📄 Mandatory Pre-Requisite Documents
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mandateDocs.slice(0, 4).map(doc => (
                  <FileUpload
                    key={doc.id}
                    label={`${doc.name} ${doc.isMandatory ? '*' : ''}`}
                    accept=".pdf,.png,.jpg,.jpeg"
                    mode="file"
                    uploadNote="Max size 10MB (.pdf, .jpg, .png)"
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

            <ButtonPanel>
              <Button
                label="Cancel"
                variant="outlined"
                onClick={close}
                type="button"
              />
              <Button
                label={
                  popup.mode === 'create' ? 'Register Work' : 'Update Work'
                }
                variant="primary"
                icon="check"
                type="submit"
              />
            </ButtonPanel>
          </form>
        )}
      </FormPopup>
    </FormPage>
  );
}
