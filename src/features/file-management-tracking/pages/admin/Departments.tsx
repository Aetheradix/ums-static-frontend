import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Switch, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { InfoBanner } from '../../components';
import { mockDepartments, type Department } from '../../data';

export default function Departments() {
  const [data, setData] = useState(mockDepartments);
  const [popup, setPopup] = useState<{ open: boolean; item?: Department }>({
    open: false,
  });
  const [form, setForm] = useState<Partial<Department>>({});

  const openCreate = () => {
    setForm({ name: '', code: '', isActive: true });
    setPopup({ open: true });
  };
  const openEdit = (item: Department) => {
    setForm({ ...item });
    setPopup({ open: true, item });
  };
  const save = () => {
    ToastService.success('Configuration saved successfully.');
    if (popup.item) {
      const idx = data.findIndex(d => d.id === popup.item!.id);
      if (idx !== -1) data[idx] = { ...data[idx], ...form } as Department;
    } else {
      data.push({
        ...form,
        id: Math.max(...data.map(d => d.id)) + 1,
      } as Department);
    }
    setData([...data]);
    setPopup({ open: false });
  };
  const remove = (id: number) => setData(data.filter(d => d.id !== id));

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Admin' },
        { label: 'Departments' },
      ]}
      title="Departments"
      description="Manage departments and their mappings"
    >
      <InfoBanner
        title="About Departments"
        message="Maintain the organizational structure by managing departments and their hierarchical relationships."
      />
      <GridPanel
        title="Departments"
        data={data}
        columns={
          [
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            {
              field: 'isActive',
              header: 'Active',
              cell: (row: any) => (
                <StatusBadge
                  label={row.isActive ? 'Yes' : 'No'}
                  variant={row.isActive ? 'approved' : 'rejected'}
                />
              ),
            },
            {
              header: 'Actions',
              cell: (row: any) => (
                <div className="flex gap-1">
                  <Button
                    icon="pencil"
                    variant="text"
                    size="small"
                    onClick={() => openEdit(row)}
                  />
                  <Button
                    icon="trash"
                    variant="text"
                    size="small"
                    onClick={() => remove(row.id)}
                  />
                </div>
              ),
            },
          ] as any
        }
        dataKey="id"
        searchBox
        toolbar={
          <Button label="Add Department" icon="add" onClick={openCreate} />
        }
      />
      {popup.open && (
        <FormPopup
          visible
          onHide={() => setPopup({ open: false })}
          title={popup.item ? 'Edit Department' : 'Add Department'}
          size="default"
        >
          <FormGrid>
            <TextBox
              label="Name"
              value={form.name || ''}
              onChange={v => setForm({ ...form, name: v })}
              required
            />
            <TextBox
              label="Code"
              value={form.code || ''}
              onChange={v => setForm({ ...form, code: v })}
              required
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
    </FormPage>
  );
}
