import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type ApprovalHierarchy,
  approvalHierarchies as initialData,
} from '../../../mocks';
import { lmsUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ApprovalHierarchy };

const ROLE_OPTIONS = [
  { name: 'Student', value: 'Student' },
  { name: 'Assistant Professor', value: 'Assistant Professor' },
  { name: 'Associate Professor', value: 'Associate Professor' },
  { name: 'Professor / HOD', value: 'Professor / HOD' },
  { name: 'Administrative Staff', value: 'Administrative Staff' },
  { name: 'Lab Technician', value: 'Lab Technician' },
];

const APPROVER_OPTIONS = [
  {
    name: 'Class Teacher / Course Advisor',
    value: 'Class Teacher / Course Advisor',
  },
  { name: 'HOD', value: 'HOD' },
  { name: 'Dean', value: 'Dean' },
  { name: 'Registrar', value: 'Registrar' },
  { name: 'Vice Chancellor', value: 'Vice Chancellor' },
  { name: 'Section Head', value: 'Section Head' },
  { name: 'Admin Officer', value: 'Admin Officer' },
  { name: 'Lab Supervisor', value: 'Lab Supervisor' },
];

const EMPTY: Partial<ApprovalHierarchy> = {
  role: '',
  firstApprover: 'HOD',
  secondApprover: 'Dean',
  finalApprover: 'Registrar',
};

export default function ApprovalHierarchyMaster() {
  const [data, setData] = useState<ApprovalHierarchy[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<ApprovalHierarchy>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.role) {
      ToastService.error('Role is required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as ApprovalHierarchy,
      ]);
      ToastService.success('Approval hierarchy created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as ApprovalHierarchy)
            : d
        )
      );
      ToastService.success('Approval hierarchy updated.');
    }
    close();
  };

  return (
    <FormPage
      title="Approval Hierarchy Master"
      description="Configure multi-level approval workflows for each role."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
        { label: 'Approval Hierarchy' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'role', header: 'Role' },
            { field: 'firstApprover', header: '1st Approver' },
            { field: 'secondApprover', header: '2nd Approver' },
            { field: 'finalApprover', header: 'Final Approver' },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: ApprovalHierarchy) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
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
                    onClick={() => {
                      setData(prev => prev.filter(d => d.id !== item.id));
                      ToastService.success('Hierarchy deleted.');
                    }}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Hierarchy"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Approval Hierarchy'
            : 'Edit Approval Hierarchy'
        }
        subtitle="Set approvers for each level in the workflow."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Role"
            data={ROLE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Role"
            value={form.role}
            onChange={v => setForm(f => ({ ...f, role: String(v) }))}
            required
          />
          <TextBox
            label="First Approver"
            placeholder="e.g. HOD"
            value={form.firstApprover ?? ''}
            onChange={v => setForm(f => ({ ...f, firstApprover: v }))}
          />
          <DropDownList
            label="Second Approver"
            data={APPROVER_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.secondApprover}
            onChange={v => setForm(f => ({ ...f, secondApprover: String(v) }))}
          />
          <DropDownList
            label="Final Approver"
            data={APPROVER_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.finalApprover}
            onChange={v => setForm(f => ({ ...f, finalApprover: String(v) }))}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={close} />
          <Button
            label={popup.mode === 'create' ? 'Create' : 'Update'}
            variant="primary"
            icon="save"
            onClick={handleSave}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
