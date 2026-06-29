import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  TextArea,
  DropDownList,
  NumberBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type WorkOrder,
  initialWorkOrders,
  initialMaintenanceRequests,
} from '../../data';
import { estateUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: WorkOrder }
  | { mode: 'verify'; item: WorkOrder }
  | { mode: 'approve'; item: WorkOrder };

const PRIORITY_OPTIONS = [
  { name: 'Low', value: 'Low' },
  { name: 'Medium', value: 'Medium' },
  { name: 'High', value: 'High' },
  { name: 'Critical', value: 'Critical' },
];

const STATUS_OPTIONS = [
  { name: 'Pending', value: 'Pending' },
  { name: 'Verified', value: 'Verified' },
  { name: 'Approved', value: 'Approved' },
  { name: 'Completed', value: 'Completed' },
  { name: 'Rejected', value: 'Rejected' },
];

const EMPTY = {
  maintenanceRequestId: '',
  title: '',
  description: '',
  priority: 'Medium',
  scheduledDate: '',
  dueDate: '',
  estimatedHours: 0,
  costEstimate: 0,
  status: 'Pending',
  verifiedBy: '',
  approvedBy: '',
};

export default function WorkOrders() {
  const [data, setData] = useState<WorkOrder[]>(initialWorkOrders);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY);
  const [remarks, setRemarks] = useState('');
  const [personName, setPersonName] = useState('');

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
    setRemarks('');
    setPersonName('');
  }, []);

  const handleSave = () => {
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { id: `WO-${Date.now()}`, ...form } as unknown as WorkOrder,
      ]);
      ToastService.success('Work Order created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(w =>
          w.id === popup.item.id
            ? ({ ...w, ...form } as unknown as WorkOrder)
            : w
        )
      );
      ToastService.success('Work Order updated successfully.');
    }
    closePopup();
  };

  const handleVerify = () => {
    if (popup.mode === 'verify') {
      setData(prev =>
        prev.map(w =>
          w.id === popup.item.id
            ? {
                ...w,
                status: 'Verified',
                verifiedBy: personName || 'Sanjay Kumar',
              }
            : w
        )
      );
      ToastService.success('Work Order verified successfully.');
    }
    closePopup();
  };

  const handleApprove = () => {
    if (popup.mode === 'approve') {
      setData(prev =>
        prev.map(w =>
          w.id === popup.item.id
            ? {
                ...w,
                status: 'Approved',
                approvedBy: personName || 'Dr. R.K. Gupta',
              }
            : w
        )
      );
      ToastService.success('Work Order approved successfully.');
    }
    closePopup();
  };

  const handleReject = (item: WorkOrder) => {
    setData(prev =>
      prev.map(w => (w.id === item.id ? { ...w, status: 'Rejected' } : w))
    );
    ToastService.success('Work Order rejected.');
  };

  const handleComplete = (item: WorkOrder) => {
    setData(prev =>
      prev.map(w => (w.id === item.id ? { ...w, status: 'Completed' } : w))
    );
    ToastService.success('Work Order completed.');
  };

  const requestOptions = initialMaintenanceRequests
    .filter(r => r.status !== 'Completed')
    .map(r => ({
      name: `${r.id} — ${r.problemCategory} (${r.entityId})`,
      value: r.id,
    }));

  const openEdit = (item: WorkOrder) => {
    setForm({
      maintenanceRequestId: item.maintenanceRequestId,
      title: item.title,
      description: item.description,
      priority: item.priority,
      scheduledDate: item.scheduledDate,
      dueDate: item.dueDate,
      estimatedHours: item.estimatedHours,
      costEstimate: item.costEstimate,
      status: item.status,
      verifiedBy: item.verifiedBy,
      approvedBy: item.approvedBy,
    });
    setPopup({ mode: 'edit', item });
  };

  return (
    <FormPage
      title="Work Orders"
      description="Create, verify, approve, and track execution of major estate work orders."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Estate Management', to: estateUrls.portal },
        { label: 'Admin Portal', to: estateUrls.admin.portal },
        { label: 'Work Orders' },
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
            { field: 'id', header: 'WO ID', width: '100px' },
            { field: 'title', header: 'Work Order Title' },
            {
              field: 'priority',
              header: 'Priority',
              width: '100px',
              cell: (item: WorkOrder) => (
                <StatusBadge
                  label={item.priority}
                  variant={
                    item.priority === 'Critical' || item.priority === 'High'
                      ? 'rejected'
                      : 'neutral'
                  }
                />
              ),
            },
            {
              field: 'costEstimate',
              header: 'Cost (₹)',
              width: '110px',
              cell: (item: WorkOrder) => (
                <span>₹{item.costEstimate.toLocaleString()}</span>
              ),
            },
            { field: 'scheduledDate', header: 'Scheduled', width: '110px' },
            {
              field: 'status',
              header: 'Status',
              width: '130px',
              cell: (item: WorkOrder) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Completed'
                      ? 'approved'
                      : item.status === 'Approved'
                        ? 'approved'
                        : item.status === 'Verified'
                          ? 'pending'
                          : item.status === 'Rejected'
                            ? 'rejected'
                            : 'neutral'
                  }
                />
              ),
            },
            {
              header: 'Actions',
              width: '260px',
              cell: (item: WorkOrder) => (
                <div className="flex gap-2">
                  {item.status === 'Pending' && (
                    <>
                      <Button
                        label="Verify"
                        icon="check"
                        variant="outlined"
                        className="p-button-sm text-xs py-1"
                        onClick={() => setPopup({ mode: 'verify', item })}
                      />
                      <Button
                        label="Reject"
                        icon="times"
                        variant="outlined"
                        className="p-button-sm text-xs py-1 p-button-danger"
                        onClick={() => handleReject(item)}
                      />
                    </>
                  )}
                  {item.status === 'Verified' && (
                    <>
                      <Button
                        label="Approve"
                        icon="check"
                        variant="outlined"
                        className="p-button-sm text-xs py-1 p-button-success"
                        onClick={() => setPopup({ mode: 'approve', item })}
                      />
                      <Button
                        label="Reject"
                        icon="times"
                        variant="outlined"
                        className="p-button-sm text-xs py-1 p-button-danger"
                        onClick={() => handleReject(item)}
                      />
                    </>
                  )}
                  {item.status === 'Approved' && (
                    <Button
                      label="Complete"
                      icon="check-circle"
                      variant="outlined"
                      className="p-button-sm text-xs py-1 p-button-info"
                      onClick={() => handleComplete(item)}
                    />
                  )}
                  {item.status === 'Completed' && (
                    <span className="text-xs text-green-600 font-medium italic flex items-center gap-1">
                      <i className="pi pi-check" /> Verified & Approved
                    </span>
                  )}
                  {item.status === 'Rejected' && (
                    <span className="text-xs text-red-600 font-medium italic">
                      Rejected
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Work Order"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>

      {/* ── Create / Edit Work Order ── */}
      <FormPopup
        visible={popup.mode === 'create' || popup.mode === 'edit'}
        onHide={closePopup}
        title={
          popup.mode === 'create' ? 'Create Work Order' : 'Edit Work Order'
        }
        subtitle="Fill in work order scope, schedules, and estimates."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Linked Maintenance Request"
            data={requestOptions}
            textField="name"
            optionValue="value"
            value={form.maintenanceRequestId}
            onChange={v =>
              setForm(f => ({ ...f, maintenanceRequestId: String(v ?? '') }))
            }
            required
          />
          <TextBox
            label="Work Order Title"
            placeholder="e.g. Re-painting of Physics Lab"
            value={form.title}
            onChange={v => setForm(f => ({ ...f, title: v }))}
            required
          />
          <DropDownList
            label="Priority"
            data={PRIORITY_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.priority}
            onChange={v =>
              setForm(f => ({ ...f, priority: String(v ?? 'Medium') as any }))
            }
            required
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v =>
              setForm(f => ({ ...f, status: String(v ?? 'Pending') as any }))
            }
          />
          <TextBox
            label="Scheduled Date"
            placeholder="YYYY-MM-DD"
            value={form.scheduledDate}
            onChange={v => setForm(f => ({ ...f, scheduledDate: v }))}
            required
          />
          <TextBox
            label="Due Date"
            placeholder="YYYY-MM-DD"
            value={form.dueDate}
            onChange={v => setForm(f => ({ ...f, dueDate: v }))}
            required
          />
          <NumberBox
            label="Estimated Effort (Hours)"
            value={form.estimatedHours}
            onChange={v => setForm(f => ({ ...f, estimatedHours: v ?? 0 }))}
            required
          />
          <NumberBox
            label="Estimated Cost (₹)"
            value={form.costEstimate}
            onChange={v => setForm(f => ({ ...f, costEstimate: v ?? 0 }))}
            required
          />
          <TextArea
            label="Detailed Description / Scope"
            placeholder="Describe the full scope of work..."
            value={form.description}
            onChange={v => setForm(f => ({ ...f, description: v }))}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Save Work Order"
            variant="primary"
            onClick={handleSave}
          />
        </div>
      </FormPopup>

      {/* ── Verify Popup ── */}
      <FormPopup
        visible={popup.mode === 'verify'}
        onHide={closePopup}
        title="Verify Work Order"
        subtitle="Record verification checks and observations."
        size="default"
      >
        <FormGrid columns={1}>
          <TextBox
            label="Verified By (Personnel Name)"
            placeholder="Enter name, e.g. Sanjay Kumar"
            value={personName}
            onChange={setPersonName}
            required
          />
          <TextArea
            label="Verification Remarks"
            placeholder="Enter inspection notes..."
            value={remarks}
            onChange={setRemarks}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Confirm Verification"
            variant="primary"
            onClick={handleVerify}
          />
        </div>
      </FormPopup>

      {/* ── Approve Popup ── */}
      <FormPopup
        visible={popup.mode === 'approve'}
        onHide={closePopup}
        title="Approve Work Order"
        subtitle="Grant financial and operational approval to begin work order execution."
        size="default"
      >
        <FormGrid columns={1}>
          <TextBox
            label="Approved By (Authority Name)"
            placeholder="Enter authority name, e.g. Dr. R.K. Gupta"
            value={personName}
            onChange={setPersonName}
            required
          />
          <TextArea
            label="Approval Remarks / Sanction Notes"
            placeholder="Enter official remarks..."
            value={remarks}
            onChange={setRemarks}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Grant Approval"
            variant="primary"
            onClick={handleApprove}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
