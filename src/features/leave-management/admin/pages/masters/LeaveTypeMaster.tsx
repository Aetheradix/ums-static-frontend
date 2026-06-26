import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, Switch, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type LeaveType, leaveTypes as initialData } from '../../../mocks';
import { lmsUrls } from '../../../urls';

type PopupState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; item: LeaveType } | { mode: 'view'; item: LeaveType };

const APPLICABLE_OPTIONS = [
  { name: 'All', value: 'All' },
  { name: 'Employee Only', value: 'Employee' },
  { name: 'Student Only', value: 'Student' },
];

const EMPTY: Partial<LeaveType> = {
  code: '', name: '', description: '', maxDays: 0,
  carryForward: false, halfDayAllowed: false,
  attachmentMandatory: false, requiresApproval: true,
  applicableFor: 'All', status: 'Active',
};

export default function LeaveTypeMaster() {
  const [data, setData] = useState<LeaveType[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<LeaveType>>(EMPTY);

  const close = useCallback(() => { setPopup({ mode: 'closed' }); setForm(EMPTY); }, []);

  const handleSave = () => {
    if (!form.code || !form.name) {
      ToastService.error('Leave Code and Name are required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [...prev, { ...form, id: String(Date.now()) } as LeaveType]);
      ToastService.success('Leave type created.');
    } else if (popup.mode === 'edit') {
      setData(prev => prev.map(d => d.id === (popup as any).item.id ? { ...d, ...form } as LeaveType : d));
      ToastService.success('Leave type updated.');
    }
    close();
  };

  const handleDelete = (item: LeaveType) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Leave type deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Leave Type Master"
      description="Create and manage leave types applicable to employees and students."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
        { label: 'Leave Types' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Leave Name' },
            { field: 'maxDays', header: 'Max Days' },
            {
              field: 'carryForward', header: 'Carry Forward',
              cell: (item: LeaveType) => <span>{item.carryForward ? 'Yes' : 'No'}</span>,
            },
            { field: 'applicableFor', header: 'Applicable For' },
            {
              field: 'status', header: 'Status',
              cell: (item: LeaveType) => (
                <StatusBadge label={item.status} variant={item.status === 'Active' ? 'approved' : 'rejected'} />
              ),
            },
            {
              field: 'id', header: 'Actions', sortable: false,
              cell: (item: LeaveType) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'view', item }); }} />
                  <Button size="small" label="" icon="pencil" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'edit', item }); }} />
                  <Button size="small" label="" icon="trash" variant="danger" onClick={() => handleDelete(item)} />
                </div>
              ),
            },
          ]}
          toolbar={<Button label="Add Leave Type" icon="plus" variant="primary" onClick={() => { setForm(EMPTY); setPopup({ mode: 'create' }); }} />}
          searchBox
          searchPlaceholder="Search leave types..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={popup.mode === 'create' ? 'Add Leave Type' : popup.mode === 'edit' ? 'Edit Leave Type' : 'View Leave Type'}
        subtitle="Configure leave type details and applicability."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox label="Leave Code" placeholder="e.g. CL" value={form.code ?? ''} onChange={v => setForm(f => ({ ...f, code: v }))} required disabled={isReadOnly} />
          <TextBox label="Leave Name" placeholder="e.g. Casual Leave" value={form.name ?? ''} onChange={v => setForm(f => ({ ...f, name: v }))} required disabled={isReadOnly} />
          <TextBox label="Maximum Days" placeholder="e.g. 12" value={String(form.maxDays ?? '')} onChange={v => setForm(f => ({ ...f, maxDays: Number(v) }))} disabled={isReadOnly} />
          <DropDownList label="Applicable For" data={APPLICABLE_OPTIONS} textField="name" optionValue="value" value={form.applicableFor} onChange={v => setForm(f => ({ ...f, applicableFor: v as any }))} disabled={isReadOnly} />
        </FormGrid>
        <TextArea label="Description" placeholder="Brief description of this leave type" value={form.description ?? ''} onChange={v => setForm(f => ({ ...f, description: v }))} disabled={isReadOnly} rows={2} />
        <FormGrid columns={2}>
          <Switch label="Carry Forward Allowed" checked={form.carryForward ?? false} onChange={v => setForm(f => ({ ...f, carryForward: v }))} disabled={isReadOnly} />
          <Switch label="Half Day Allowed" checked={form.halfDayAllowed ?? false} onChange={v => setForm(f => ({ ...f, halfDayAllowed: v }))} disabled={isReadOnly} />
          <Switch label="Attachment Mandatory" checked={form.attachmentMandatory ?? false} onChange={v => setForm(f => ({ ...f, attachmentMandatory: v }))} disabled={isReadOnly} />
          <Switch label="Requires Approval" checked={form.requiresApproval ?? true} onChange={v => setForm(f => ({ ...f, requiresApproval: v }))} disabled={isReadOnly} />
        </FormGrid>
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button label={popup.mode === 'create' ? 'Create' : 'Update'} variant="primary" icon="save" onClick={handleSave} />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
