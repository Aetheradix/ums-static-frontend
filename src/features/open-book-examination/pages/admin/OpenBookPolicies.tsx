import { useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import { Switch, TextArea, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import type { OpenBookPolicy } from '../../data';
import { mockPolicies } from '../../data';
import { InfoBanner } from '../../components';

export default function OpenBookPolicies() {
  const [data, setData] = useState(mockPolicies);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    id?: number;
  }>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<OpenBookPolicy>>({});

  const openCreate = () => {
    setForm({
      name: '',
      description: '',
      allowStudentUpload: false,
      autoApproval: false,
      secureViewerRequired: true,
      isActive: true,
    });
    setPopup({ mode: 'create' });
  };
  const openEdit = (item: OpenBookPolicy) => {
    setForm({ ...item });
    setPopup({ mode: 'edit', id: item.id });
  };
  const save = () => {
    if (popup.mode === 'create')
      data.push({
        ...(form as OpenBookPolicy),
        id: Math.max(...data.map(d => d.id)) + 1,
      });
    else if (popup.mode === 'edit' && popup.id) {
      const idx = data.findIndex(d => d.id === popup.id);
      if (idx !== -1) data[idx] = { ...data[idx], ...form } as OpenBookPolicy;
    }
    setData([...data]);
    setPopup({ mode: 'closed' });
  };
  const remove = (id: number) => setData(data.filter(d => d.id !== id));
  const toggle = (item: OpenBookPolicy) => {
    const idx = data.findIndex(d => d.id === item.id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], isActive: !item.isActive };
      setData([...data]);
    }
  };

  return (
    <FormPage
      title="Open Book Policies"
      description="Configure open book examination policies"
    >
      <InfoBanner
        title="About Open Book Policies"
        message="Establish and enforce the rules and guidelines specific to Open Book Examinations, such as allowed materials, plagiarism thresholds, and tab switching limits."
      />
      <GridPanel
        title="Open Book Policies"
        data={data}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <Button label="Create Policy" icon="plus" onClick={openCreate} />
        }
        columns={[
          { field: 'name', header: 'Name' },
          {
            field: 'allowStudentUpload',
            header: 'Student Upload',
            cell: (row: OpenBookPolicy) => (
              <span>{row.allowStudentUpload ? '✅' : '❌'}</span>
            ),
          },
          {
            field: 'autoApproval',
            header: 'Auto Approval',
            cell: (row: OpenBookPolicy) => (
              <span>{row.autoApproval ? '✅' : '❌'}</span>
            ),
          },
          {
            field: 'secureViewerRequired',
            header: 'Secure Viewer',
            cell: (row: OpenBookPolicy) => (
              <span>{row.secureViewerRequired ? '✅' : '❌'}</span>
            ),
          },
          {
            field: 'isActive',
            header: 'Active',
            cell: (row: OpenBookPolicy) => (
              <StatusButton value={row.isActive} onClick={() => toggle(row)} />
            ),
          },
          {
            field: 'id',
            header: 'Actions',
            cell: (row: OpenBookPolicy) => (
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
          title={popup.mode === 'create' ? 'Create Policy' : 'Edit Policy'}
        >
          <FormGrid columns={1}>
            <TextBox
              label="Policy Name"
              value={form.name || ''}
              onChange={v => setForm({ ...form, name: v })}
              required
            />
            <TextArea
              label="Description"
              value={form.description || ''}
              onChange={v => setForm({ ...form, description: v })}
            />
          </FormGrid>
          <FormGrid>
            <Switch
              label="Allow Student Upload"
              checked={form.allowStudentUpload || false}
              onChange={v => setForm({ ...form, allowStudentUpload: v })}
            />
            <Switch
              label="Auto Approval"
              checked={form.autoApproval || false}
              onChange={v => setForm({ ...form, autoApproval: v })}
            />
            <Switch
              label="Secure Viewer Required"
              checked={form.secureViewerRequired || false}
              onChange={v => setForm({ ...form, secureViewerRequired: v })}
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
