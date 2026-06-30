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
import { FormGrid, FormPage, FormPopup } from 'shared/new-components';
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
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Admin' },
        { label: 'Workflow Management' },
      ]}
      title="Workflow Management"
      description="Design and manage approval chains for file processing"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Workflows" value={data.length} color="blue" />
        <KpiCard label="Active" value={activeCount} color="green" />
        <KpiCard label="Total Steps" value={totalSteps} color="purple" />
        <KpiCard label="Departments" value={deptCount} color="amber" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row items-center gap-4 mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex-1 w-full min-w-[200px] relative">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search workflows by name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full xl:w-auto">
          <DropDownList
            value={deptFilter}
            onChange={v => setDeptFilter(v as string)}
            data={[
              { value: 'all', label: 'All Departments' },
              ...[...new Set(data.map(w => w.departmentName || 'All'))].map(
                d => ({ value: d, label: d })
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
          <Button
            label="Add Workflow"
            icon="add"
            onClick={openCreate}
            className="shrink-0"
          />
        </div>
      </div>

      {/* Workflow Accordion List */}
      <div className="flex flex-col gap-4 mb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl text-gray-400">
            <Icon
              name="search_off"
              className="text-4xl text-gray-300 mb-3 block"
            />
            <p className="text-sm">No workflows match your filters.</p>
          </div>
        ) : (
          filtered.map(wf => {
            const isExpanded = expandedId === wf.id;
            const wfSteps = workflowSteps(wf.id);
            return (
              <div
                key={wf.id}
                className={`bg-white border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-blue-300 shadow-md rounded-2xl' : 'border-gray-200 shadow-sm rounded-xl hover:border-blue-200 hover:shadow'}`}
              >
                {/* Accordion Header */}
                <div
                  className={`flex flex-col lg:flex-row lg:items-center gap-4 p-4 md:p-5 cursor-pointer ${isExpanded ? 'bg-blue-50/30' : ''}`}
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('.actions-group'))
                      return;
                    setExpandedId(isExpanded ? null : wf.id);
                  }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-lg border ${wf.isActive ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                    >
                      <Icon
                        name={
                          wf.name.includes('Purchase')
                            ? 'shopping_cart'
                            : wf.name.includes('Leave')
                              ? 'logout'
                              : wf.name.includes('Student')
                                ? 'school'
                                : 'account_tree'
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {wf.name}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${wf.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${wf.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                          ></span>
                          {wf.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {wf.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-6 md:gap-8 shrink-0 border-t lg:border-t-0 border-gray-100 pt-3 lg:pt-0">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col lg:items-end">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                          Department
                        </span>
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                          <Icon
                            name="business"
                            className="text-[14px] text-blue-500"
                          />
                          {wf.departmentName || 'All'}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-gray-200 hidden lg:block"></div>
                      <div className="flex flex-col lg:items-end">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                          Steps
                        </span>
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                          <Icon
                            name="alt_route"
                            className="text-[14px] text-purple-500"
                          />
                          {wfSteps.length}
                        </span>
                      </div>
                    </div>

                    <div className="actions-group flex items-center gap-1 shrink-0 bg-white lg:bg-transparent rounded-lg border lg:border-none border-gray-100 p-1 lg:p-0 shadow-sm lg:shadow-none">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          openEdit(wf);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Icon name="edit" className="text-[15px]" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          duplicate(wf);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Icon name="file_copy" className="text-[15px]" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          remove(wf.id);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Icon name="delete" className="text-[15px]" />
                      </button>
                      <div
                        className="w-8 h-8 flex items-center justify-center text-gray-400 transition-transform duration-300"
                        style={{
                          transform: isExpanded
                            ? 'rotate(180deg)'
                            : 'rotate(0)',
                        }}
                      >
                        <Icon name="expand_more" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded State: Visual Stepper */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-blue-100 bg-slate-50/50 p-4 sm:p-6 md:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <Icon
                              name="linear_scale"
                              className="text-blue-600"
                            />
                            Approval Workflow Sequence
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Configure the sequential steps for this workflow's
                            lifecycle.
                          </p>
                        </div>
                        <Button
                          label="Add Step"
                          icon="add"
                          variant="outlined"
                          size="small"
                          onClick={() => openAddStep(wf.id)}
                          className="bg-white"
                        />
                      </div>

                      {wfSteps.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
                          <Icon
                            name="timeline"
                            className="text-4xl text-gray-300 mb-2 block"
                          />
                          <p className="text-sm text-gray-500 font-medium">
                            No steps defined yet.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Add a step to start building this workflow.
                          </p>
                        </div>
                      ) : (
                        <div className="relative pl-1 sm:pl-4">
                          {/* Vertical connecting line */}
                          <div className="absolute left-7 sm:left-10 top-6 bottom-6 w-0.5 bg-blue-200 rounded-full" />

                          <div className="space-y-6">
                            {wfSteps.map((s, idx) => {
                              const sla = mockSLAs.find(
                                sla => sla.workflowStepId === s.id
                              );
                              const escalations = mockEscalationRules.filter(
                                e => e.workflowStepId === s.id
                              );
                              return (
                                <div
                                  key={s.id}
                                  className="relative flex flex-col sm:flex-row items-start sm:items-stretch gap-4 sm:gap-6"
                                >
                                  {/* Sequence Node */}
                                  <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-white border-[3px] border-blue-100 flex items-center justify-center shadow-sm mx-auto sm:mx-0">
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s.isMandatory ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}
                                    >
                                      {s.stepSequence}
                                    </div>
                                  </div>

                                  {/* Step Content Card */}
                                  <div
                                    className={`flex-1 w-full bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow relative ${s.isMandatory ? 'border-gray-200' : 'border-gray-200 border-dashed'}`}
                                  >
                                    {/* Top Right Badges & Actions */}
                                    <div className="sm:absolute relative sm:top-4 sm:right-4 flex items-center justify-between sm:justify-end gap-3 mb-4 sm:mb-0">
                                      <div className="flex items-center gap-1.5">
                                        <span
                                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${s.isMandatory ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                          {s.isMandatory
                                            ? 'Required'
                                            : 'Optional'}
                                        </span>
                                        {idx === 0 && (
                                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">
                                            Start
                                          </span>
                                        )}
                                        {idx === wfSteps.length - 1 && (
                                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600">
                                            End
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-px h-4 bg-gray-200 hidden sm:block" />
                                        <div className="flex gap-0.5">
                                          <button
                                            onClick={() => openEditStep(s)}
                                            className="w-7 h-7 flex items-center justify-center rounded bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                          >
                                            <Icon
                                              name="edit"
                                              className="text-[14px]"
                                            />
                                          </button>
                                          <button
                                            onClick={() => removeStep(s.id)}
                                            className="w-7 h-7 flex items-center justify-center rounded bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                          >
                                            <Icon
                                              name="delete"
                                              className="text-[14px]"
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    <h5 className="text-base font-bold text-gray-900 mb-4">
                                      {s.stepName}
                                    </h5>

                                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                          <Icon
                                            name="badge"
                                            className="text-[18px]"
                                          />
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                            Assigned Role
                                          </p>
                                          <p className="text-sm font-medium text-gray-800">
                                            {s.approverRoleName || 'Any Role'}
                                          </p>
                                        </div>
                                      </div>
                                      {s.approverUserName && (
                                        <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                                            <Icon
                                              name="person"
                                              className="text-[18px]"
                                            />
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                              Specific User
                                            </p>
                                            <p className="text-sm font-medium text-gray-800">
                                              {s.approverUserName}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {sla && (
                                        <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                            <Icon
                                              name="timer"
                                              className="text-[18px]"
                                            />
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                              SLA Timeline
                                            </p>
                                            <p className="text-sm font-medium text-gray-800">
                                              {sla.expectedCompletionHours}{' '}
                                              hours
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {escalations.length > 0 && (
                                      <div className="mt-5 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                                        {escalations.map(e => (
                                          <div
                                            key={e.id}
                                            className="flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 px-3 py-1.5 rounded-md border border-rose-100"
                                          >
                                            <Icon
                                              name="warning"
                                              className="text-[15px]"
                                            />
                                            Escalates in {e.delayHours}h →{' '}
                                            {e.targetRoleName ||
                                              e.targetUserName ||
                                              'Overdue'}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 mt-4">
        <div className="text-xs text-gray-500 font-medium">
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
          <span className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
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

/* ── Sub-components ── */

const KPI_COLORS: Record<string, { bg: string; border: string; text: string }> =
  {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-700',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
    },
  };

function KpiCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  const c = KPI_COLORS[color] || KPI_COLORS.blue;
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition-transform hover:-translate-y-0.5 ${c.bg} ${c.border}`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wider mb-2 ${c.text} opacity-70`}
      >
        {label}
      </div>
      <div className={`text-3xl font-black tracking-tight ${c.text}`}>
        {value}
      </div>
    </div>
  );
}
