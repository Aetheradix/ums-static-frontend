import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { Switch, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { mockFileTypes, type FileType } from '../../data';

export default function FileTypes() {
  const [data, setData] = useState(mockFileTypes);
  const [popup, setPopup] = useState<{ open: boolean; item?: FileType }>({
    open: false,
  });
  const [form, setForm] = useState<Partial<FileType>>({});

  const openCreate = () => {
    setForm({ title: '', shortCode: '', description: '', isActive: true });
    setPopup({ open: true });
  };
  const openEdit = (item: FileType) => {
    setForm({ ...item });
    setPopup({ open: true, item });
  };
  const save = () => {
    if (popup.item) {
      const idx = data.findIndex(d => d.id === popup.item!.id);
      if (idx !== -1) data[idx] = { ...data[idx], ...form } as FileType;
    } else {
      data.push({
        ...form,
        id: Math.max(...data.map(d => d.id)) + 1,
      } as FileType);
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
        { label: 'File Types' },
      ]}
      title="File Types"
      description="Manage file type master data"
    >
      <GridPanel
        title="File Types"
        data={data}
        columns={
          [
            { field: 'title', header: 'Title' },
            { field: 'shortCode', header: 'Short Code' },
            { field: 'description', header: 'Description' },
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
          <Button label="Add File Type" icon="add" onClick={openCreate} />
        }
      />
      {popup.open && (
        <FormPopup
          visible
          onHide={() => setPopup({ open: false })}
          title={popup.item ? 'Edit File Type' : 'Create File Type'}
          size="default"
        >
          <FormGrid>
            <TextBox
              label="Title"
              value={form.title || ''}
              onChange={v => setForm({ ...form, title: v })}
              required
            />
            <TextBox
              label="Short Code"
              value={form.shortCode || ''}
              onChange={v => setForm({ ...form, shortCode: v })}
              required
            />
            <TextBox
              label="Description"
              value={form.description || ''}
              onChange={v => setForm({ ...form, description: v })}
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
