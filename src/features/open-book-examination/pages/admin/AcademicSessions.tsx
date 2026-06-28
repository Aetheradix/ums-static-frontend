import { useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import type { AcademicSession } from '../../data';
import { mockAcademicSessions } from '../../data';

export default function AcademicSessions() {
  const [data, setData] = useState(mockAcademicSessions);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    id?: number;
  }>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<AcademicSession>>({});

  const openCreate = () => {
    setForm({ name: '', startDate: '', endDate: '', isCurrent: false });
    setPopup({ mode: 'create' });
  };
  const openEdit = (item: AcademicSession) => {
    setForm({ ...item });
    setPopup({ mode: 'edit', id: item.id });
  };
  const save = () => {
    if (popup.mode === 'create') {
      const newItem: AcademicSession = {
        ...(form as AcademicSession),
        id: Math.max(...data.map(d => d.id)) + 1,
      };
      data.push(newItem);
    } else if (popup.mode === 'edit' && popup.id) {
      const idx = data.findIndex(d => d.id === popup.id);
      if (idx !== -1) data[idx] = { ...data[idx], ...form } as AcademicSession;
    }
    setData([...data]);
    setPopup({ mode: 'closed' });
  };
  const remove = (id: number) => {
    setData(data.filter(d => d.id !== id));
  };
  const toggleActive = (item: AcademicSession) => {
    const idx = data.findIndex(d => d.id === item.id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], isCurrent: !item.isCurrent };
      setData([...data]);
    }
  };

  return (
    <FormPage
      title="Academic Sessions"
      description="Manage academic years and sessions"
    >
      <GridPanel
        title="Academic Sessions"
        data={data}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <Button label="Create Session" icon="plus" onClick={openCreate} />
        }
        columns={[
          { field: 'name', header: 'Name' },
          { field: 'startDate', header: 'Start' },
          { field: 'endDate', header: 'End' },
          {
            field: 'isCurrent',
            header: 'Current',
            cell: (row: AcademicSession) => (
              <StatusButton
                value={row.isCurrent}
                onClick={() => toggleActive(row)}
              />
            ),
          },
          {
            field: 'id',
            header: 'Actions',
            cell: (row: AcademicSession) => (
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
          title={popup.mode === 'create' ? 'Create Session' : 'Edit Session'}
        >
          <FormGrid>
            <TextBox
              label="Session Name"
              value={form.name || ''}
              onChange={v => setForm({ ...form, name: v })}
              required
            />
            <TextBox
              label="Start Date"
              value={form.startDate || ''}
              onChange={v => setForm({ ...form, startDate: v })}
              placeholder="YYYY-MM-DD"
              required
            />
            <TextBox
              label="End Date"
              value={form.endDate || ''}
              onChange={v => setForm({ ...form, endDate: v })}
              placeholder="YYYY-MM-DD"
              required
            />
            <DropDownList
              label="Status"
              value={form.isCurrent ? 'true' : 'false'}
              onChange={v => setForm({ ...form, isCurrent: v === 'true' })}
              data={[
                { value: 'true', label: 'Current' },
                { value: 'false', label: 'Inactive' },
              ]}
              textField="label"
              valueField="value"
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
