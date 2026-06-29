import { useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import type { User } from '../../data';
import { mockUsers } from '../../data';
import { InfoBanner } from '../../components';

export default function Users() {
  const [data, setData] = useState(mockUsers);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    id?: number;
  }>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<User>>({});
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filtered =
    roleFilter === 'all' ? data : data.filter(u => u.role === roleFilter);

  const openCreate = () => {
    setForm({ name: '', email: '', role: 'student', isActive: true });
    setPopup({ mode: 'create' });
  };
  const openEdit = (item: User) => {
    setForm({ ...item });
    setPopup({ mode: 'edit', id: item.id });
  };
  const save = () => {
    if (popup.mode === 'create')
      data.push({
        ...(form as User),
        id: Math.max(...data.map(d => d.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0],
      });
    else if (popup.mode === 'edit' && popup.id) {
      const idx = data.findIndex(d => d.id === popup.id);
      if (idx !== -1) data[idx] = { ...data[idx], ...form } as User;
    }
    setData([...data]);
    setPopup({ mode: 'closed' });
  };
  const remove = (id: number) => setData(data.filter(d => d.id !== id));
  const toggle = (item: User) => {
    const idx = data.findIndex(d => d.id === item.id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], isActive: !item.isActive };
      setData([...data]);
    }
  };

  return (
    <FormPage title="Users" description="Manage system users">
      <InfoBanner
        title="About User Management"
        message="Manage all university accounts including students, teachers, and administrators. You can create new users, update their roles, assign departments, and activate or deactivate accounts as needed."
      />
      <GridPanel
        title="Users"
        data={filtered}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <>
            <DropDownList
              value={roleFilter}
              onChange={v => setRoleFilter(v as string)}
              data={[
                { value: 'all', label: 'All Roles' },
                { value: 'admin', label: 'Admin' },
                { value: 'teacher', label: 'Teacher' },
                { value: 'student', label: 'Student' },
                { value: 'controller_of_exams', label: 'Controller' },
              ]}
              textField="label"
              valueField="value"
            />
            <div className="flex">
              <Button
                label="Create User"
                icon="plus"
                onClick={openCreate}
                className="whitespace-nowrap"
              />
            </div>
          </>
        }
        columns={[
          { field: 'name', header: 'Name' },
          { field: 'email', header: 'Email' },
          {
            field: 'role',
            header: 'Role',
            cell: (row: User) => (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                {row.role.replace(/_/g, ' ')}
              </span>
            ),
          },
          {
            field: 'departmentName',
            header: 'Department',
            cell: (row: User) => <span>{row.departmentName || '-'}</span>,
          },
          {
            field: 'isActive',
            header: 'Active',
            cell: (row: User) => (
              <StatusButton value={row.isActive} onClick={() => toggle(row)} />
            ),
          },
          {
            field: 'id',
            header: 'Actions',
            cell: (row: User) => (
              <div className="flex gap-1">
                <Button
                  icon="pencil"
                  variant="text"
                  onClick={() => openEdit(row)}
                />
                <Button
                  icon="trash"
                  variant="text"
                  onClick={() => remove(row.id)}
                />
              </div>
            ),
          },
        ]}
      />
      {popup.mode !== 'closed' && (
        <FormPopup
          visible
          onHide={() => setPopup({ mode: 'closed' })}
          title={popup.mode === 'create' ? 'Create User' : 'Edit User'}
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
              required
            />
            <DropDownList
              label="Role"
              value={form.role || 'student'}
              onChange={v => setForm({ ...form, role: v as User['role'] })}
              data={[
                { value: 'admin', label: 'Admin' },
                { value: 'teacher', label: 'Teacher' },
                { value: 'student', label: 'Student' },
                { value: 'controller_of_exams', label: 'Controller of Exams' },
              ]}
              textField="label"
              valueField="value"
            />
            <TextBox
              label="Department"
              value={form.departmentName || ''}
              onChange={v => setForm({ ...form, departmentName: v })}
            />
          </FormGrid>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button label="Save" onClick={save} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
