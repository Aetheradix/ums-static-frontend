import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, Switch, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type LeavePolicy,
  departments,
  leavePolicies as initialData,
} from '../../../mocks';
import { lmsUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: LeavePolicy };

const EMPLOYEE_TYPES = [
  { name: 'Faculty', value: 'Faculty' },
  { name: 'Non-Teaching', value: 'Non-Teaching' },
  { name: 'Contract', value: 'Contract' },
  { name: 'UG Student', value: 'UG Student' },
  { name: 'PG Student', value: 'PG Student' },
  { name: 'PhD Scholar', value: 'PhD Scholar' },
];

const CARRY_FORWARD_RULES = [
  { name: 'No Carry Forward', value: 'No carry forward' },
  { name: 'Up to 10 days EL', value: 'Up to 10 days EL' },
  { name: 'Up to 15 days EL', value: 'Up to 15 EL per year' },
  { name: 'Up to 30 days EL', value: 'Up to 30 EL per year' },
];

const EMPTY: Partial<LeavePolicy> = {
  policyName: '',
  department: 'All Departments',
  employeeType: 'Faculty',
  minService: '3 months',
  maxLeave: 30,
  carryForwardRule: 'No carry forward',
  sandwichRule: false,
  holidayRule: 'Holidays counted',
  status: 'Active',
};

export default function LeavePolicyMaster() {
  const [data, setData] = useState<LeavePolicy[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<LeavePolicy>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.policyName) {
      ToastService.error('Policy Name is required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as LeavePolicy,
      ]);
      ToastService.success('Leave policy created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as LeavePolicy)
            : d
        )
      );
      ToastService.success('Leave policy updated.');
    }
    close();
  };

  const deptOptions = ['All Departments', ...departments].map(d => ({
    name: d,
    value: d,
  }));

  return (
    <FormPage
      title="Leave Policy Master"
      description="Configure department and employee-type specific leave policies."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
        { label: 'Leave Policy' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'policyName', header: 'Policy Name' },
            { field: 'department', header: 'Department' },
            { field: 'employeeType', header: 'Employee Type' },
            { field: 'maxLeave', header: 'Max Leave' },
            {
              field: 'sandwichRule',
              header: 'Sandwich Rule',
              cell: (item: LeavePolicy) => (
                <span>{item.sandwichRule ? 'Yes' : 'No'}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: LeavePolicy) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'rejected'}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: LeavePolicy) => (
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
                      ToastService.success('Policy deleted.');
                    }}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Policy"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search policies..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create' ? 'Create Leave Policy' : 'Edit Leave Policy'
        }
        subtitle="Set leave entitlement rules for specific roles."
        size="xl"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Policy Name"
            placeholder="e.g. Faculty Leave Policy 2024"
            value={form.policyName ?? ''}
            onChange={v => setForm(f => ({ ...f, policyName: v }))}
            required
          />
          <DropDownList
            label="Department"
            data={deptOptions}
            textField="name"
            optionValue="value"
            value={form.department}
            onChange={v => setForm(f => ({ ...f, department: String(v) }))}
          />
          <DropDownList
            label="Employee Type"
            data={EMPLOYEE_TYPES}
            textField="name"
            optionValue="value"
            value={form.employeeType}
            onChange={v => setForm(f => ({ ...f, employeeType: String(v) }))}
          />
          <TextBox
            label="Minimum Service"
            placeholder="e.g. 3 months"
            value={form.minService ?? ''}
            onChange={v => setForm(f => ({ ...f, minService: v }))}
          />
          <TextBox
            label="Maximum Leave (days)"
            placeholder="e.g. 30"
            value={String(form.maxLeave ?? '')}
            onChange={v => setForm(f => ({ ...f, maxLeave: Number(v) }))}
          />
          <DropDownList
            label="Carry Forward Rule"
            data={CARRY_FORWARD_RULES}
            textField="name"
            optionValue="value"
            value={form.carryForwardRule}
            onChange={v =>
              setForm(f => ({ ...f, carryForwardRule: String(v) }))
            }
          />
          <TextBox
            label="Holiday Rule"
            placeholder="e.g. Holidays counted"
            value={form.holidayRule ?? ''}
            onChange={v => setForm(f => ({ ...f, holidayRule: v }))}
          />
          <Switch
            label="Sandwich Rule Applies"
            checked={form.sandwichRule ?? false}
            onChange={v => setForm(f => ({ ...f, sandwichRule: v }))}
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
