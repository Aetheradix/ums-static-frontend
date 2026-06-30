import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  Switch,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { InfoBanner } from '../../components';
import {
  mockConfidentialityLevels,
  mockDepartments,
  mockFileCategories,
  mockFilePriorities,
  mockFiles,
  mockFileTypes,
  mockUsers,
  type File,
} from '../../data';
import { generateFileNumber } from '../../utils';

export default function CreateFile() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<File>>({
    title: '',
    description: '',
    categoryId: 1,
    priorityId: 2,
    confidentialityId: 1,
    fileTypeId: 1,
    isConfidential: false,
    departmentId: 1,
  });
  const user = mockUsers[8];

  const previewFileNumber = useMemo(() => {
    if (!form.departmentId) return '';
    return generateFileNumber(form.departmentId);
  }, [form.departmentId]);

  const save = () => {
    ToastService.success('File created successfully.');
    const newId = Math.max(...mockFiles.map(f => f.id)) + 1;
    const dept = mockDepartments.find(d => d.id === form.departmentId);
    mockFiles.push({
      ...form,
      id: newId,
      fileNumber: previewFileNumber,
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
      departmentName: dept?.name || '',
      currentStatus: 'Draft',
      createdBy: user.id,
      createdByName: user.name,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      isLocked: false,
      isAbeyance: false,
    } as File);
    navigate('/file-management-tracking/employee/manage');
  };

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Employee' },
        { label: 'Create New File' },
      ]}
      title="Create New File"
      description="Fill in the details to create a new eFile"
    >
      <InfoBanner
        title="About Create New File"
        message="Initiate a brand new electronic file, assign its classification, and prepare its first notesheet."
      />
      <FormCard title="File Details">
        {previewFileNumber && (
          <FormCard title="File Number" className="mb-4 text-sm">
            {previewFileNumber}
          </FormCard>
        )}
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
            label="Department"
            value={String(form.departmentId || 1)}
            onChange={v => setForm({ ...form, departmentId: Number(v) })}
            data={mockDepartments
              .filter(d => d.isActive)
              .map(d => ({
                value: String(d.id),
                label: `${d.name} (${d.code})`,
              }))}
            textField="label"
            valueField="value"
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
          <Switch
            label="Confidential"
            checked={form.isConfidential ?? false}
            onChange={v => setForm({ ...form, isConfidential: v })}
          />
        </FormGrid>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() =>
              navigate('/file-management-tracking/employee/manage')
            }
          />
          <Button label="Create File" icon="add" onClick={save} />
        </div>
      </FormCard>
    </FormPage>
  );
}
