import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import {
  mockDAKReceipts,
  mockDepartments,
  mockUsers,
  type DAKReceipt,
} from '../../data';

export default function DakCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<DAKReceipt>>({
    senderName: '',
    subject: '',
    modeOfReceipt: 'Email',
  });
  const user = mockUsers[9];

  const save = () => {
    const seq = (mockDAKReceipts.length + 1).toString().padStart(5, '0');
    mockDAKReceipts.push({
      ...form,
      id: Math.max(...mockDAKReceipts.map(d => d.id)) + 1,
      diaryNumber: `DAK/2026/${seq}`,
      status: 'Registered',
      createdBy: user.id,
      createdByName: user.name,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      receivedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
    } as DAKReceipt);
    navigate('/file-management-tracking/employee/dak/list');
  };

  return (
    <FormPage
      title="Create DAK Receipt"
      description="Register a new incoming DAK (Diary & Dak)"
    >
      <FormCard title="DAK Details">
        <FormGrid>
          <TextBox
            label="Sender Name"
            value={form.senderName || ''}
            onChange={v => setForm({ ...form, senderName: v })}
            required
          />
          <TextBox
            label="Sender Contact"
            value={form.senderContact || ''}
            onChange={v => setForm({ ...form, senderContact: v })}
          />
          <TextBox
            label="Sender Address"
            value={form.senderAddress || ''}
            onChange={v => setForm({ ...form, senderAddress: v })}
          />
          <TextBox
            label="Subject"
            value={form.subject || ''}
            onChange={v => setForm({ ...form, subject: v })}
            required
          />
          <DropDownList
            label="Mode of Receipt"
            value={form.modeOfReceipt || 'Email'}
            onChange={v => setForm({ ...form, modeOfReceipt: v as any })}
            data={['Physical', 'Email', 'Post', 'Courier', 'Other'].map(m => ({
              value: m,
              label: m,
            }))}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="Assign Department"
            value={String(form.assignedDepartmentId || '')}
            onChange={v =>
              setForm({
                ...form,
                assignedDepartmentId: Number(v),
                assignedDepartmentName: mockDepartments.find(
                  d => d.id === Number(v)
                )?.name,
              })
            }
            data={[
              { value: '', label: 'None' },
              ...mockDepartments.map(d => ({
                value: String(d.id),
                label: d.name,
              })),
            ]}
            textField="label"
            valueField="value"
          />
          <TextArea
            label="Description"
            value={form.description || ''}
            onChange={v => setForm({ ...form, description: v })}
          />
        </FormGrid>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() =>
              navigate('/file-management-tracking/employee/dak/list')
            }
          />
          <Button label="Create DAK" icon="add" onClick={save} />
        </div>
      </FormCard>
    </FormPage>
  );
}
