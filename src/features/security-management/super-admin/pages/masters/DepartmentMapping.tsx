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
  StatusBadge,
} from 'shared/new-components';
import {
  type DepartmentMapping,
  departmentMappings as initialData,
  buildings,
  type Building,
} from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: DepartmentMapping }
  | { mode: 'view'; item: DepartmentMapping };
const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];
const DEPT_OPTIONS = [
  'Computer Science',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Administration',
  'Hostel Management',
  'Library',
  'Sports',
  'Finance',
].map(d => ({ name: d, value: d }));
const BUILDING_OPTIONS = buildings.map((b: Building) => ({
  name: b.buildingName,
  value: b.buildingName,
}));
const OFFICER_OPTIONS = [
  'Officer Rajesh Kumar',
  'Officer Priya Sharma',
  'Officer Amit Singh',
  'Officer Sunita Devi',
  'Officer Ravi Verma',
].map(o => ({ name: o, value: o }));
const EMPTY: Partial<DepartmentMapping> = {
  department: '',
  securityOfficer: '',
  building: '',
  contactNumber: '',
  status: 'Active',
};

export default function DepartmentMappingMaster() {
  const [data, setData] = useState<DepartmentMapping[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<DepartmentMapping>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.department || !form.securityOfficer) {
      ToastService.error('Department and Security Officer are required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as DepartmentMapping,
      ]);
      ToastService.success('Department mapping created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as DepartmentMapping)
            : d
        )
      );
      ToastService.success('Department mapping updated.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Department Mapping"
      description="Map departments to their assigned security officers and buildings."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Department Mapping' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'department', header: 'Department' },
            { field: 'securityOfficer', header: 'Security Officer' },
            { field: 'building', header: 'Building' },
            { field: 'contactNumber', header: 'Contact' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: DepartmentMapping) => (
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
              cell: (item: DepartmentMapping) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'view', item });
                    }}
                  />
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
                      ToastService.success('Deleted.');
                    }}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Mapping"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search department mappings..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Department Mapping'
            : popup.mode === 'edit'
              ? 'Edit Mapping'
              : 'View Mapping'
        }
        subtitle="Assign security officer and building to a department."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Department"
            data={DEPT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.department}
            onChange={v => setForm(f => ({ ...f, department: v as string }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Security Officer"
            data={OFFICER_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.securityOfficer}
            onChange={v =>
              setForm(f => ({ ...f, securityOfficer: v as string }))
            }
            disabled={isReadOnly}
          />
          <DropDownList
            label="Building"
            data={BUILDING_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.building}
            onChange={v => setForm(f => ({ ...f, building: v as string }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Contact Number"
            placeholder="e.g. 9876543210"
            value={form.contactNumber ?? ''}
            onChange={v => setForm(f => ({ ...f, contactNumber: v }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Create' : 'Update'}
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
