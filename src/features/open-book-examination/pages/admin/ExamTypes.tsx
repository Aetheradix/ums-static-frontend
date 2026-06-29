import { useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import { Switch, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import type { ExamType } from '../../data';
import { mockExamTypes } from '../../data';
import { InfoBanner } from '../../components';

export default function ExamTypes() {
  const [data, setData] = useState(mockExamTypes);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    id?: number;
  }>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<ExamType>>({});

  const openCreate = () => {
    setForm({
      name: '',
      weightage: 10,
      isActive: true,
      isOpenBookAllowed: false,
    });
    setPopup({ mode: 'create' });
  };
  const openEdit = (item: ExamType) => {
    setForm({ ...item });
    setPopup({ mode: 'edit', id: item.id });
  };
  const save = () => {
    if (popup.mode === 'create')
      data.push({
        ...(form as ExamType),
        id: Math.max(...data.map(d => d.id)) + 1,
      });
    else if (popup.mode === 'edit' && popup.id) {
      const idx = data.findIndex(d => d.id === popup.id);
      if (idx !== -1) data[idx] = { ...data[idx], ...form } as ExamType;
    }
    setData([...data]);
    setPopup({ mode: 'closed' });
  };
  const remove = (id: number) => setData(data.filter(d => d.id !== id));
  const toggleActive = (item: ExamType) => {
    const idx = data.findIndex(d => d.id === item.id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], isActive: !item.isActive };
      setData([...data]);
    }
  };

  return (
    <FormPage title="Exam Types" description="Configure types of examinations">
      <InfoBanner
        title="About Exam Types"
        message="Configure the different types of examinations offered (e.g., Midterm, Final, Quiz) and define their properties such as weightage and open-book allowances."
      />
      <GridPanel
        title="Exam Types"
        data={data}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <Button label="Create Exam Type" icon="plus" onClick={openCreate} />
        }
        columns={[
          { field: 'name', header: 'Name' },
          {
            field: 'weightage',
            header: 'Weightage',
            cell: (row: ExamType) => <span>{row.weightage}%</span>,
          },
          {
            field: 'isOpenBookAllowed',
            header: 'Open Book Allowed',
            cell: (row: ExamType) => (
              <span>{row.isOpenBookAllowed ? '✅' : '❌'}</span>
            ),
          },
          {
            field: 'isActive',
            header: 'Active',
            cell: (row: ExamType) => (
              <StatusButton
                value={row.isActive}
                onClick={() => toggleActive(row)}
              />
            ),
          },
          {
            field: 'id',
            header: 'Actions',
            cell: (row: ExamType) => (
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
          title={
            popup.mode === 'create' ? 'Create Exam Type' : 'Edit Exam Type'
          }
        >
          <FormGrid>
            <TextBox
              label="Name"
              value={form.name || ''}
              onChange={v => setForm({ ...form, name: v })}
              required
            />
            <TextBox
              label="Weightage (%)"
              value={String(form.weightage || '')}
              onChange={v => setForm({ ...form, weightage: Number(v) })}
            />
            <Switch
              label="Open Book Allowed"
              checked={form.isOpenBookAllowed || false}
              onChange={v => setForm({ ...form, isOpenBookAllowed: v })}
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
