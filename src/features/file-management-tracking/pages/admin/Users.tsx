import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, Switch, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { InfoBanner } from '../../components';
import { mockDepartments, mockRoles, mockUsers, type User } from '../../data';

export default function Users() {
  const [data, setData] = useState(mockUsers);
  const [popup, setPopup] = useState<{ open: boolean; item?: User }>({
    open: false,
  });
  const [form, setForm] = useState<Partial<User>>({});

  const openCreate = () => {
    setForm({
      name: '',
      email: '',
      roleId: 7,
      roleName: 'Employee',
      isActive: true,
    });
    setPopup({ open: true });
  };
  const openEdit = (item: User) => setForm({ ...item });
  const save = () => {
    ToastService.success('Configuration saved successfully.');
    const role = mockRoles.find(r => r.id === form.roleId);
    const dept = mockDepartments.find(d => d.id === form.departmentId);
    const updated = {
      ...form,
      roleName: role?.name || '',
      departmentName: dept?.name || '',
    } as User;
    if (popup.item) {
      const idx = data.findIndex(d => d.id === popup.item!.id);
      if (idx !== -1) {
        data[idx] = { ...data[idx], ...updated };
        setPopup({ open: false });
      }
    } else {
      data.push({
        ...updated,
        id: Math.max(...data.map(d => d.id)) + 1,
        createdAt: new Date().toISOString().slice(0, 10),
      });
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
        { label: 'Users & Roles' },
      ]}
      title="Users & Roles"
      description="Manage FMTS users and role assignments"
    >
      <InfoBanner
        title="About Users & Roles"
        message="Manage user access controls, assign roles, and ensure secure permissions across the module."
      />
      <GridPanel
        title="Users"
        data={data}
        columns={
          [
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'roleName', header: 'Role' },
            {
              field: 'departmentName',
              header: 'Department',
              cell: (row: any) => <span>{row.departmentName || '—'}</span>,
            },
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
                    onClick={() => {
                      openEdit(row);
                      setPopup({ open: true, item: row });
                    }}
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
          <Button label="Add User" icon="person_add" onClick={openCreate} />
        }
      />
      {popup.open && (
        <FormPopup
          visible
          onHide={() => setPopup({ open: false })}
          title={popup.item ? 'Edit User' : 'Add User'}
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
              label="Email"
              value={form.email || ''}
              onChange={v => setForm({ ...form, email: v })}
            />
            <DropDownList
              label="Role"
              value={String(form.roleId || 7)}
              onChange={v => {
                const role = mockRoles.find(r => r.id === Number(v));
                setForm({
                  ...form,
                  roleId: Number(v),
                  roleName: role?.name || '',
                });
              }}
              data={mockRoles.map(r => ({
                value: String(r.id),
                label: r.name,
              }))}
              textField="label"
              valueField="value"
            />
            <DropDownList
              label="Department"
              value={String(form.departmentId || '')}
              onChange={v => {
                const dept = mockDepartments.find(d => d.id === Number(v));
                setForm({
                  ...form,
                  departmentId: Number(v),
                  departmentName: dept?.name,
                });
              }}
              data={[
                { value: '', label: 'None' },
                ...mockDepartments
                  .filter(d => d.isActive)
                  .map(d => ({ value: String(d.id), label: d.name })),
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
    </FormPage>
  );
}
