import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { NumberBox, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { mockRetentionPolicies, type RetentionPolicy } from '../../data';

export default function RetentionPolicies() {
  const [data, setData] = useState(mockRetentionPolicies);
  const [popup, setPopup] = useState<{ open: boolean; item?: RetentionPolicy }>(
    { open: false }
  );
  const [form, setForm] = useState<Partial<RetentionPolicy>>({});

  const openCreate = () => {
    setForm({ recordType: '', retentionPeriodYears: 5, description: '' });
    setPopup({ open: true });
  };
  const openEdit = (item: RetentionPolicy) => {
    setForm({ ...item });
    setPopup({ open: true, item });
  };
  const save = () => {
    if (popup.item) {
      const idx = data.findIndex(d => d.id === popup.item!.id);
      if (idx !== -1) data[idx] = { ...data[idx], ...form } as RetentionPolicy;
    } else {
      data.push({
        ...form,
        id: Math.max(...data.map(d => d.id)) + 1,
      } as RetentionPolicy);
    }
    setData([...data]);
    setPopup({ open: false });
  };
  const remove = (id: number) => setData(data.filter(d => d.id !== id));

  const formatRetention = (years: number) =>
    years === 0 ? 'Permanent' : `${years} Years`;

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Admin' },
        { label: 'Retention Policies' },
      ]}
      title="Retention Policies"
      description="Configure document retention schedules"
    >
      <GridPanel
        title="Retention Policies"
        data={data}
        columns={
          [
            { field: 'recordType', header: 'Record Type' },
            {
              field: 'retentionPeriodYears',
              header: 'Retention Period',
              cell: (row: any) => (
                <span>{formatRetention(row.retentionPeriodYears)}</span>
              ),
            },
            { field: 'description', header: 'Description' },
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
        toolbar={<Button label="Add Policy" icon="add" onClick={openCreate} />}
      />
      {popup.open && (
        <FormPopup
          visible
          onHide={() => setPopup({ open: false })}
          title={popup.item ? 'Edit Policy' : 'Add Policy'}
          size="default"
        >
          <FormGrid>
            <TextBox
              label="Record Type"
              value={form.recordType || ''}
              onChange={v => setForm({ ...form, recordType: v })}
              required
            />
            <NumberBox
              label="Retention (Years)"
              value={form.retentionPeriodYears || 5}
              onChange={v => setForm({ ...form, retentionPeriodYears: v ?? 5 })}
              min={0}
              max={100}
            />
            <TextBox
              label="Description"
              value={form.description || ''}
              onChange={v => setForm({ ...form, description: v })}
            />
            {form.retentionPeriodYears === 0 && (
              <p className="text-xs text-blue-600">0 = Permanent retention</p>
            )}
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
