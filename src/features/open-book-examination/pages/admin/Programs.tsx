import { useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import { DropDownList, NumberBox, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import type { Program } from '../../data';
import { mockPrograms } from '../../data';
import { InfoBanner } from '../../components';

export default function Programs() {
  const [data, setData] = useState(mockPrograms);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    id?: number;
  }>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Program>>({});

  const openCreate = () => {
    setForm({
      name: '',
      code: '',
      durationYears: 4,
      departmentId: 1,
      departmentName: 'Computer Science',
      isActive: true,
    });
    setPopup({ mode: 'create' });
  };
  const openEdit = (item: Program) => {
    setForm({ ...item });
    setPopup({ mode: 'edit', id: item.id });
  };
  const save = () => {
    if (popup.mode === 'create') {
      data.push({
        ...(form as Program),
        id: Math.max(...data.map(d => d.id)) + 1,
      });
    } else if (popup.mode === 'edit' && popup.id) {
      const idx = data.findIndex(d => d.id === popup.id);
      if (idx !== -1) data[idx] = { ...data[idx], ...form } as Program;
    }
    setData([...data]);
    setPopup({ mode: 'closed' });
  };
  const remove = (id: number) => setData(data.filter(d => d.id !== id));
  const toggle = (item: Program) => {
    const idx = data.findIndex(d => d.id === item.id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], isActive: !item.isActive };
      setData([...data]);
    }
  };

  return (
    <FormPage title="Programs" description="Manage academic programs">
      <InfoBanner
        title="About Programs"
        message="Manage the various academic programs and degrees offered by the university. Define program structures, durations, and department affiliations."
      />
      <GridPanel
        title="Programs"
        data={data}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <Button label="Create Program" icon="plus" onClick={openCreate} />
        }
        columns={[
          {
            field: 'code',
            header: 'Code',
            cell: (row: Program) => (
              <span className="font-mono">{row.code}</span>
            ),
          },
          { field: 'name', header: 'Name' },
          {
            field: 'durationYears',
            header: 'Duration',
            cell: (row: Program) => <span>{row.durationYears}y</span>,
          },
          { field: 'departmentName', header: 'Department' },
          {
            field: 'isActive',
            header: 'Active',
            cell: (row: Program) => (
              <StatusButton value={row.isActive} onClick={() => toggle(row)} />
            ),
          },
          {
            field: 'id',
            header: 'Actions',
            cell: (row: Program) => (
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
          title={popup.mode === 'create' ? 'Create Program' : 'Edit Program'}
        >
          <FormGrid>
            <TextBox
              label="Program Name"
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
            <NumberBox
              label="Duration (years)"
              value={form.durationYears}
              onChange={v => setForm({ ...form, durationYears: v ?? 0 })}
              min={1}
              max={6}
            />
            <DropDownList
              label="Department"
              value={String(form.departmentId || 1)}
              onChange={v =>
                setForm({
                  ...form,
                  departmentId: Number(v),
                  departmentName: v === '1' ? 'Computer Science' : 'Other',
                })
              }
              data={[
                { value: '1', label: 'Computer Science' },
                { value: '2', label: 'Electronics' },
                { value: '3', label: 'Management' },
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
