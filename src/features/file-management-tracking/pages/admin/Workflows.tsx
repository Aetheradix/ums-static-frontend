import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  Switch,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import { FormGrid, FormPage, FormPopup, StatCard } from 'shared/new-components';
import {
  mockDepartments,
  mockEscalationRules,
  mockRoles,
  mockSLAs,
  mockUsers,
  mockWorkflows,
  mockWorkflowSteps,
  type Workflow,
  type WorkflowStep as WS,
} from '../../data';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'danger';
}

export default function Workflows() {
  const [data, setData] = useState(mockWorkflows);
  const [allSteps, setAllSteps] = useState(mockWorkflowSteps);
  const [popup, setPopup] = useState<{ open: boolean; item?: Workflow }>({
    open: false,
  });
  const [stepPopup, setStepPopup] = useState<{
    open: boolean;
    workflowId?: number;
    item?: WS;
  }>({ open: false });
  const [form, setForm] = useState<Partial<Workflow>>({});
  const [stepForm, setStepForm] = useState<
    Partial<WS> & {
      slaHours?: number;
      escalationHours?: number;
      escalationRoleId?: number;
    }
  >({});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: 'success' | 'danger' = 'success') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    },
    []
  );

  const activeCount = data.filter(w => w.isActive).length;
  const totalSteps = allSteps.length;
  const deptCount = [...new Set(data.map(w => w.departmentName || 'All'))]
    .length;

  const filtered = data.filter(w => {
    if (
      search &&
      !w.name.toLowerCase().includes(search.toLowerCase()) &&
      !w.description?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (deptFilter !== 'all' && (w.departmentName || 'All') !== deptFilter)
      return false;
    if (statusFilter === 'active' && !w.isActive) return false;
    if (statusFilter === 'inactive' && w.isActive) return false;
    return true;
  });

  const workflowSteps = (wfId: number) =>
    allSteps
      .filter(s => s.workflowId === wfId)
      .sort((a, b) => a.stepSequence - b.stepSequence);

  const openCreate = () => {
    setForm({ name: '', description: '', isActive: true });
    setPopup({ open: true });
  };
  const openEdit = (item: Workflow) => {
    setForm({ ...item });
    setPopup({ open: true, item });
  };

  const save = () => {
    if (popup.item) {
      const idx = data.findIndex(d => d.id === popup.item!.id);
      if (idx !== -1) {
        data[idx] = { ...data[idx], ...form } as Workflow;
        addToast(`Workflow "${form.name}" updated`);
      }
    } else {
      data.push({
        ...form,
        id: Math.max(...data.map(d => d.id)) + 1,
        createdBy: mockUsers[0].id,
        createdByName: mockUsers[0].name,
        createdAt: new Date().toISOString().slice(0, 10),
      } as Workflow);
      addToast(`Workflow "${form.name}" created`);
    }
    setData([...data]);
    setPopup({ open: false });
  };

  const remove = (id: number) => {
    const wf = data.find(d => d.id === id);
    setData(data.filter(d => d.id !== id));
    setAllSteps(allSteps.filter(s => s.workflowId !== id));
    addToast(`Workflow "${wf?.name}" deleted`, 'danger');
  };

  const duplicate = (wf: Workflow) => {
    const newId = Math.max(...data.map(d => d.id)) + 1;
    const wfSteps = workflowSteps(wf.id);
    data.push({
      ...wf,
      id: newId,
      name: `${wf.name} (Copy)`,
      createdAt: new Date().toISOString().slice(0, 10),
    } as Workflow);
    wfSteps.forEach(s => {
      allSteps.push({
        ...s,
        id: Math.max(...allSteps.map(x => x.id)) + 1,
        workflowId: newId,
      });
    });
    setData([...data]);
    setAllSteps([...allSteps]);
    addToast(`Workflow duplicated as "${wf.name} (Copy)"`);
  };

  const openAddStep = (wfId: number) => {
    const seq = workflowSteps(wfId).length + 1;
    setStepForm({
      workflowId: wfId,
      stepSequence: seq,
      stepName: '',
      isMandatory: true,
      slaHours: 48,
      escalationHours: 72,
    });
    setStepPopup({ open: true, workflowId: wfId });
  };
  const openEditStep = (item: WS) => {
    const sla = mockSLAs.find(s => s.workflowStepId === item.id);
    const esc = mockEscalationRules.find(e => e.workflowStepId === item.id);
    setStepForm({
      ...item,
      slaHours: sla?.expectedCompletionHours || 48,
      escalationHours: esc?.delayHours || 72,
      escalationRoleId: esc?.targetRoleId,
    });
    setStepPopup({ open: true, item });
  };

  const saveStep = () => {
    if (stepPopup.item) {
      const idx = allSteps.findIndex(s => s.id === stepPopup.item!.id);
      if (idx !== -1) {
        allSteps[idx] = { ...allSteps[idx], ...stepForm } as WS;
        addToast('Step updated');
      }
      const stepId = stepPopup.item.id;
      const existingSla = mockSLAs.find(s => s.workflowStepId === stepId);
      if (stepForm.slaHours) {
        if (existingSla) {
          existingSla.expectedCompletionHours = stepForm.slaHours;
        } else {
          mockSLAs.push({
            id: Math.max(...mockSLAs.map(s => s.id)) + 1,
            workflowStepId: stepId,
            stepName: stepForm.stepName || '',
            expectedCompletionHours: stepForm.slaHours,
            warningThresholdHours: Math.round(stepForm.slaHours * 0.5),
          });
        }
      }
      const existingEsc = mockEscalationRules.find(
        e => e.workflowStepId === stepId
      );
      if (stepForm.escalationHours) {
        if (existingEsc) {
          existingEsc.delayHours = stepForm.escalationHours;
          existingEsc.targetRoleId = stepForm.escalationRoleId;
          existingEsc.targetRoleName = stepForm.escalationRoleId
            ? mockRoles.find(r => r.id === stepForm.escalationRoleId)?.name
            : undefined;
        } else {
          mockEscalationRules.push({
            id: Math.max(...mockEscalationRules.map(e => e.id)) + 1,
            workflowStepId: stepId,
            stepName: stepForm.stepName || '',
            delayHours: stepForm.escalationHours,
            actionType: 'EscalateToRole',
            targetRoleId: stepForm.escalationRoleId,
            targetRoleName: stepForm.escalationRoleId
              ? mockRoles.find(r => r.id === stepForm.escalationRoleId)?.name
              : undefined,
            notificationTemplate: 'Pending beyond SLA',
          });
        }
      }
    } else {
      const wf = data.find(w => w.id === stepForm.workflowId);
      const newId = Math.max(...allSteps.map(s => s.id)) + 1;
      allSteps.push({
        ...stepForm,
        id: newId,
        workflowName: wf?.name || '',
      } as WS);
      if (stepForm.slaHours) {
        mockSLAs.push({
          id: Math.max(...mockSLAs.map(s => s.id)) + 1,
          workflowStepId: newId,
          stepName: stepForm.stepName || '',
          expectedCompletionHours: stepForm.slaHours,
          warningThresholdHours: Math.round(stepForm.slaHours * 0.5),
        });
      }
      if (stepForm.escalationHours) {
        mockEscalationRules.push({
          id: Math.max(...mockEscalationRules.map(e => e.id)) + 1,
          workflowStepId: newId,
          stepName: stepForm.stepName || '',
          delayHours: stepForm.escalationHours,
          actionType: 'EscalateToRole',
          targetRoleId: stepForm.escalationRoleId,
          targetRoleName: stepForm.escalationRoleId
            ? mockRoles.find(r => r.id === stepForm.escalationRoleId)?.name
            : undefined,
          notificationTemplate: 'Pending beyond SLA',
        });
      }
      addToast('Step added');
    }
    setAllSteps([...allSteps]);
    setStepPopup({ open: false });
  };

  const removeStep = (id: number) => {
    setAllSteps(allSteps.filter(s => s.id !== id));
    addToast('Step removed', 'danger');
  };

  return (
    <FormPage
      title="Workflow Management"
      description="Design and manage approval chains for file processing"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Workflows"
          value={data.length}
          icon="alt_route"
          colorScheme="blue"
          subtitle="All workflows"
        />
        <StatCard
          title="Active"
          value={activeCount}
          icon="check_circle"
          colorScheme="green"
          subtitle={`${Math.round((activeCount / data.length) * 100)}% of total`}
        />
        <StatCard
          title="Total Steps"
          value={totalSteps}
          icon="stairs"
          colorScheme="purple"
          subtitle={`Avg ${(totalSteps / data.length).toFixed(1)} per workflow`}
        />
        <StatCard
          title="Departments"
          value={deptCount}
          icon="business"
          colorScheme="amber"
          subtitle="Departments using workflows"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <TextBox
            placeholder="Search workflows..."
            value={search}
            onChange={v => setSearch(v)}
          />
        </div>
        <DropDownList
          value={deptFilter}
          onChange={v => setDeptFilter(v as string)}
          data={[
            { value: 'all', label: 'All Departments' },
            ...[...new Set(data.map(w => w.departmentName || 'All'))].map(
              d => ({
                value: d,
                label: d,
              })
            ),
          ]}
          textField="label"
          valueField="value"
        />
        <DropDownList
          value={statusFilter}
          onChange={v => setStatusFilter(v as string)}
          data={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          textField="label"
          valueField="value"
        />
        <Button label="Add Workflow" icon="add" onClick={openCreate} />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-10 px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Steps
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  No workflows match your filters.
                </td>
              </tr>
            ) : (
              filtered.map(wf => {
                const isExpanded = expandedId === wf.id;
                const wfSteps = workflowSteps(wf.id);
                return (
                  <tbody
                    key={wf.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <tr
                      className={`cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'}`}
                      onClick={() => setExpandedId(isExpanded ? null : wf.id)}
                    >
                      <td className="px-4 py-3">
                        <Icon
                          name="chevron_right"
                          className={`block p-1 rounded transition-transform duration-200 cursor-pointer ${isExpanded ? 'rotate-90 text-blue-600' : 'text-gray-300 hover:text-gray-500'}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm border ${wf.isActive ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                          >
                            <Icon
                              name={
                                wf.name.includes('Purchase')
                                  ? 'shopping_cart'
                                  : wf.name.includes('Leave')
                                    ? 'logout'
                                    : wf.name.includes('Student')
                                      ? 'school'
                                      : 'admin_panel_settings'
                              }
                              className="text-lg"
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {wf.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {wf.description}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                            wf.departmentName === 'Finance'
                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                              : 'bg-gray-50 text-gray-600 border border-gray-200'
                          }`}
                        >
                          <Icon name="business" className="text-[14px]" />
                          {wf.departmentName || 'All'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            wf.isActive
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${wf.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                          ></span>
                          {wf.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                          <Icon
                            name="alt_route"
                            className="text-lg text-blue-500"
                          />
                          {wfSteps.length} step{wfSteps.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <Button
                            icon="visibility"
                            variant="text"
                            size="small"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : wf.id)
                            }
                          />
                          <Button
                            icon="edit"
                            variant="text"
                            size="small"
                            onClick={() => openEdit(wf)}
                          />
                          <Button
                            icon="file_copy"
                            variant="text"
                            size="small"
                            onClick={() => duplicate(wf)}
                          />
                          <Button
                            icon="delete"
                            variant="text"
                            size="small"
                            onClick={() => remove(wf.id)}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Expanded steps panel */}
                    <tr>
                      <td colSpan={7} className="p-0">
                        <div
                          className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-5">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                <Icon
                                  name="alt_route"
                                  className="text-sm text-blue-500"
                                />
                                Approval Chain — {wfSteps.length} Step
                                {wfSteps.length !== 1 ? 's' : ''}
                              </h4>
                              <Button
                                label="Add Step"
                                icon="add"
                                variant="text"
                                size="small"
                                onClick={() => openAddStep(wf.id)}
                                className="text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 px-3 py-1.5"
                              />
                            </div>

                            {wfSteps.length === 0 ? (
                              <div className="text-center py-8 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                <Icon
                                  name="alt_route"
                                  className="text-3xl text-gray-300 mb-2 block"
                                />
                                No steps defined yet.
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {wfSteps.map((s, idx) => {
                                  const sla = mockSLAs.find(
                                    sla => sla.workflowStepId === s.id
                                  );
                                  const escalations =
                                    mockEscalationRules.filter(
                                      e => e.workflowStepId === s.id
                                    );
                                  return (
                                    <div
                                      key={s.id}
                                      className={`relative bg-white border rounded-lg p-4 transition-shadow hover:shadow-md ${s.isMandatory ? 'border-l-4 border-l-blue-500 border-gray-200' : 'border-gray-200 border-l-4 border-l-gray-300'}`}
                                    >
                                      <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.isMandatory ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                          >
                                            {s.stepSequence}
                                          </span>
                                          <span className="text-sm font-semibold text-gray-900">
                                            {s.stepName}
                                          </span>
                                        </div>
                                        <div className="flex gap-0.5 shrink-0">
                                          <Button
                                            icon="edit"
                                            variant="text"
                                            size="small"
                                            onClick={() => openEditStep(s)}
                                          />
                                          <Button
                                            icon="delete"
                                            variant="text"
                                            size="small"
                                            onClick={() => removeStep(s.id)}
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-1.5 text-xs text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                          <Icon
                                            name="badge"
                                            className="text-sm text-gray-400"
                                          />
                                          <span>
                                            {s.approverRoleName || 'Any Role'}
                                          </span>
                                        </div>
                                        {s.approverUserName && (
                                          <div className="flex items-center gap-1.5">
                                            <Icon
                                              name="person"
                                              className="text-sm text-gray-400"
                                            />
                                            <span>{s.approverUserName}</span>
                                          </div>
                                        )}
                                        {sla && (
                                          <div className="flex items-center gap-1.5">
                                            <Icon
                                              name="timer"
                                              className="text-sm text-gray-400"
                                            />
                                            <span>
                                              SLA: {sla.expectedCompletionHours}
                                              h
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                        <span
                                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${s.isMandatory ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}
                                        >
                                          {s.isMandatory
                                            ? 'Required'
                                            : 'Optional'}
                                        </span>
                                        {idx === 0 && (
                                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-600 border border-green-100">
                                            First Step
                                          </span>
                                        )}
                                        {idx === wfSteps.length - 1 && (
                                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-600 border border-purple-100">
                                            Final Step
                                          </span>
                                        )}
                                      </div>

                                      {escalations.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-gray-50 space-y-1">
                                          {escalations.map(e => (
                                            <div
                                              key={e.id}
                                              className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded"
                                            >
                                              <Icon
                                                name="arrow_upward"
                                                className="text-[12px]"
                                              />
                                              Escalate in {e.delayHours}h →{' '}
                                              {e.targetRoleName ||
                                                e.targetUserName ||
                                                'Overdue'}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {wfSteps.length > 1 && (
                              <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                                <div className="flex items-center gap-2 text-xs text-blue-700">
                                  <Icon name="timeline" className="text-sm" />
                                  <span className="font-medium">Flow:</span>
                                  {wfSteps.map((s, idx) => (
                                    <span
                                      key={s.id}
                                      className="flex items-center gap-1"
                                    >
                                      <span className="font-semibold">
                                        {s.stepName}
                                      </span>
                                      {idx < wfSteps.length - 1 && (
                                        <span className="text-blue-300">→</span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/50">
          <div className="text-xs text-gray-400">
            Showing {filtered.length} of {data.length} workflows
          </div>
          <div className="flex items-center gap-1">
            <Button
              icon="chevron_left"
              variant="text"
              size="small"
              disabled
              onClick={() => {}}
            />
            <span className="w-7 h-7 flex items-center justify-center text-xs font-medium bg-blue-600 text-white rounded">
              1
            </span>
            <Button
              icon="chevron_right"
              variant="text"
              size="small"
              disabled
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-slide-in ${
              t.type === 'success'
                ? 'bg-white border-green-200 text-green-700'
                : 'bg-white border-red-200 text-red-700'
            }`}
          >
            <Icon
              name={t.type === 'success' ? 'check_circle' : 'error'}
              className={`text-lg ${t.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
            />
            {t.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.25s ease; }
      `}</style>

      {/* Workflow modal */}
      {popup.open && (
        <FormPopup
          visible
          onHide={() => setPopup({ open: false })}
          title={popup.item ? 'Edit Workflow' : 'Add Workflow'}
          size="default"
        >
          <FormGrid>
            <TextBox
              label="Workflow name"
              value={form.name || ''}
              onChange={v => setForm({ ...form, name: v })}
              required
            />
            <TextArea
              label="Description"
              value={form.description || ''}
              onChange={v => setForm({ ...form, description: v })}
            />
            <DropDownList
              label="Department"
              value={String(form.departmentId || '')}
              onChange={v =>
                setForm({
                  ...form,
                  departmentId: Number(v),
                  departmentName: mockDepartments.find(d => d.id === Number(v))
                    ?.name,
                })
              }
              data={[
                { value: '', label: 'All Departments' },
                ...mockDepartments.map(d => ({
                  value: String(d.id),
                  label: d.name,
                })),
              ]}
              textField="label"
              valueField="value"
            />
            <Switch
              label="Active"
              checked={form.isActive ?? true}
              onChange={v => setForm({ ...form, isActive: v })}
            />
          </FormGrid>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ open: false })}
            />
            <Button label="Save" onClick={save} />
          </div>
        </FormPopup>
      )}

      {/* Step modal */}
      {stepPopup.open && (
        <FormPopup
          visible
          onHide={() => setStepPopup({ open: false })}
          title={stepPopup.item ? 'Edit Step' : 'Add Step'}
          size="lg"
        >
          <FormGrid>
            <TextBox
              label="Step Name"
              value={stepForm.stepName || ''}
              onChange={v => setStepForm({ ...stepForm, stepName: v })}
              required
            />
            <NumberBox
              label="Step Sequence"
              value={
                stepForm.stepSequence ??
                workflowSteps(stepPopup.workflowId || 0).length + 1
              }
              onChange={v =>
                setStepForm({ ...stepForm, stepSequence: Number(v) })
              }
              min={1}
            />
            <DropDownList
              label="Approver Role"
              value={String(stepForm.approverRoleId || '')}
              onChange={v =>
                setStepForm({
                  ...stepForm,
                  approverRoleId: Number(v),
                  approverRoleName: mockRoles.find(r => r.id === Number(v))
                    ?.name,
                })
              }
              data={[
                { value: '', label: 'Select Role' },
                ...mockRoles.map(r => ({ value: String(r.id), label: r.name })),
              ]}
              textField="label"
              valueField="value"
            />
            <DropDownList
              label="Approver User (Optional)"
              value={String(stepForm.approverUserId || '')}
              onChange={v =>
                setStepForm({
                  ...stepForm,
                  approverUserId: Number(v),
                  approverUserName: mockUsers.find(u => u.id === Number(v))
                    ?.name,
                })
              }
              data={[
                { value: '', label: 'None' },
                ...mockUsers.map(u => ({ value: String(u.id), label: u.name })),
              ]}
              textField="label"
              valueField="value"
            />
            <Switch
              label="Mandatory Step"
              checked={stepForm.isMandatory ?? true}
              onChange={v => setStepForm({ ...stepForm, isMandatory: v })}
            />
            <NumberBox
              label="SLA (hours)"
              value={stepForm.slaHours ?? 48}
              onChange={v => setStepForm({ ...stepForm, slaHours: Number(v) })}
              min={1}
            />
            <NumberBox
              label="Escalation After (hours)"
              value={stepForm.escalationHours ?? 72}
              onChange={v =>
                setStepForm({ ...stepForm, escalationHours: Number(v) })
              }
              min={1}
            />
            <DropDownList
              label="Escalation Target Role"
              value={String(stepForm.escalationRoleId || '')}
              onChange={v =>
                setStepForm({ ...stepForm, escalationRoleId: Number(v) })
              }
              data={[
                { value: '', label: 'None' },
                ...mockRoles.map(r => ({ value: String(r.id), label: r.name })),
              ]}
              textField="label"
              valueField="value"
            />
          </FormGrid>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setStepPopup({ open: false })}
            />
            <Button label="Save" onClick={saveStep} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
