import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import {
  mockConfidentialityLevels,
  mockFileCategories,
  mockFilePriorities,
  mockFiles,
  mockFileTypes,
  mockUsers,
  type File,
} from '../../data';
import { generateFileNumber } from '../../utils';

export default function PartFile() {
  const { parentId } = useParams();
  const navigate = useNavigate();
  const parent = mockFiles.find(f => f.id === Number(parentId));
  const [form, setForm] = useState<Partial<File>>({
    title: parent ? `Part File: ${parent.title}` : '',
    description: '',
    categoryId: parent?.categoryId || 1,
    priorityId: parent?.priorityId || 2,
    confidentialityId: parent?.confidentialityId || 1,
    fileTypeId: parent?.fileTypeId || 1,
  });

  if (!parent)
    return (
      <FormPage title="Part File">
        <FormCard title="Not Found">
          <div className="text-center text-gray-500 py-8">
            Parent file not found
          </div>
        </FormCard>
      </FormPage>
    );

  const user = mockUsers[9];
  const save = () => {
    const newId = Math.max(...mockFiles.map(f => f.id)) + 1;
    mockFiles.push({
      ...form,
      id: newId,
      fileNumber: generateFileNumber(parent.departmentId),
      quickAccessCode: `FMTS-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      categoryName:
        mockFileCategories.find(c => c.id === form.categoryId)?.name || '',
      priorityName:
        mockFilePriorities.find(p => p.id === form.priorityId)?.name || '',
      confidentialityName:
        mockConfidentialityLevels.find(c => c.id === form.confidentialityId)
          ?.name || '',
      fileTypeName:
        mockFileTypes.find(t => t.id === form.fileTypeId)?.title || '',
      departmentId: parent.departmentId,
      departmentName: parent.departmentName,
      currentStatus: 'Draft',
      parentFileId: parent.id,
      parentFileNumber: parent.fileNumber,
      createdBy: user.id,
      createdByName: user.name,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      isLocked: false,
      isAbeyance: false,
    } as File);
    navigate(`/file-management-tracking/employee/view/${parent.id}`);
  };

  return (
    <FormPage
      title="Create Part File"
      description={`Parent File: ${parent.fileNumber}`}
    >
      <FormCard title="Part File Details">
        <FormCard title="Parent File" className="mb-4 text-sm">
          {parent.fileNumber} — {parent.title}
        </FormCard>
        <FormGrid>
          <TextBox
            label="Title"
            value={form.title || ''}
            onChange={v => setForm({ ...form, title: v })}
            required
          />
          <TextArea
            label="Description"
            value={form.description || ''}
            onChange={v => setForm({ ...form, description: v })}
          />
          <DropDownList
            label="Category"
            value={String(form.categoryId || 1)}
            onChange={v => setForm({ ...form, categoryId: Number(v) })}
            data={mockFileCategories.map(c => ({
              value: String(c.id),
              label: c.name,
            }))}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="Priority"
            value={String(form.priorityId || 2)}
            onChange={v => setForm({ ...form, priorityId: Number(v) })}
            data={mockFilePriorities.map(p => ({
              value: String(p.id),
              label: p.name,
            }))}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="Confidentiality"
            value={String(form.confidentialityId || 1)}
            onChange={v => setForm({ ...form, confidentialityId: Number(v) })}
            data={mockConfidentialityLevels.map(c => ({
              value: String(c.id),
              label: c.name,
            }))}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="File Type"
            value={String(form.fileTypeId || 1)}
            onChange={v => setForm({ ...form, fileTypeId: Number(v) })}
            data={mockFileTypes.map(t => ({
              value: String(t.id),
              label: t.title,
            }))}
            textField="label"
            valueField="value"
          />
        </FormGrid>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(-1)}
          />
          <Button label="Create Part File" icon="alt_route" onClick={save} />
        </div>
      </FormCard>
    </FormPage>
  );
}
