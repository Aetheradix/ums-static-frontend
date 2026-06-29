import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, TextArea, DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type WorkOrderTask,
  initialWorkOrderTasks,
  initialWorkOrders,
} from '../../data';
import { estateUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: WorkOrderTask };

const STATUS_OPTIONS = [
  { name: 'Pending', value: 'Pending' },
  { name: 'In Progress', value: 'In Progress' },
  { name: 'Completed', value: 'Completed' },
];

const EMPTY = {
  workOrderId: '',
  taskName: '',
  description: '',
  status: 'Pending',
  completedAt: '',
};

export default function WorkOrderTasks() {
  const [data, setData] = useState<WorkOrderTask[]>(initialWorkOrderTasks);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    const wo = initialWorkOrders.find(w => w.id === form.workOrderId);
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        {
          id: `WOT-${Date.now()}`,
          ...form,
          workOrderTitle: wo?.title || '',
          completedAt:
            form.status === 'Completed'
              ? new Date().toISOString().split('T')[0]
              : '',
        } as unknown as WorkOrderTask,
      ]);
      ToastService.success('Sub-task created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(t =>
          t.id === popup.item.id
            ? ({
                ...t,
                ...form,
                workOrderTitle: wo?.title || t.workOrderTitle,
                completedAt:
                  form.status === 'Completed'
                    ? new Date().toISOString().split('T')[0]
                    : '',
              } as unknown as WorkOrderTask)
            : t
        )
      );
      ToastService.success('Sub-task updated successfully.');
    }
    closePopup();
  };

  const openEdit = (item: WorkOrderTask) => {
    setForm({
      workOrderId: item.workOrderId,
      taskName: item.taskName,
      description: item.description,
      status: item.status,
      completedAt: item.completedAt,
    });
    setPopup({ mode: 'edit', item });
  };

  const workOrderOptions = initialWorkOrders.map(w => ({
    name: `${w.id} — ${w.title}`,
    value: w.id,
  }));

  return (
    <FormPage
      title="Work Order Tasks"
      description="Decompose work orders into smaller sub-tasks and track their completion progress."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Estate Management', to: estateUrls.portal },
        { label: 'Admin Portal', to: estateUrls.admin.portal },
        { label: 'Work Order Tasks' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            {
              cell: (_: unknown, option: { rowIndex: number }) => (
                <span className="font-semibold text-gray-700">
                  {option.rowIndex + 1}
                </span>
              ),
              width: '50px',
            },
            { field: 'id', header: 'Task ID', width: '110px' },
            { field: 'workOrderId', header: 'Work Order ID', width: '130px' },
            { field: 'workOrderTitle', header: 'Work Order Scope' },
            { field: 'taskName', header: 'Task Name', width: '220px' },
            {
              field: 'completedAt',
              header: 'Completed At',
              width: '120px',
              cell: (item: WorkOrderTask) => (
                <span>{item.completedAt || '—'}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              width: '130px',
              cell: (item: WorkOrderTask) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Completed'
                      ? 'approved'
                      : item.status === 'In Progress'
                        ? 'pending'
                        : 'neutral'
                  }
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Task"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={popup.mode === 'create' ? 'Create Sub-task' : 'Edit Sub-task'}
        subtitle="Fill in sub-task requirements."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Linked Work Order"
            data={workOrderOptions}
            textField="name"
            optionValue="value"
            value={form.workOrderId}
            onChange={v =>
              setForm(f => ({ ...f, workOrderId: String(v ?? '') }))
            }
            required
          />
          <TextBox
            label="Task Name"
            placeholder="e.g. Surface Scrape & Putty Application"
            value={form.taskName}
            onChange={v => setForm(f => ({ ...f, taskName: v }))}
            required
          />
          <DropDownList
            label="Execution Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: String(v ?? '') }))}
            required
          />
          <TextBox
            label="Completed Date"
            placeholder="YYYY-MM-DD (Auto-filled on completion)"
            value={form.completedAt}
            onChange={v => setForm(f => ({ ...f, completedAt: v }))}
            disabled={form.status !== 'Completed'}
          />
          <TextArea
            label="Description / Instructions"
            placeholder="Specify steps, materials, or special instructions..."
            value={form.description}
            onChange={v => setForm(f => ({ ...f, description: v }))}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save Task" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
