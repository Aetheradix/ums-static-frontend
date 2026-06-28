import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { mockExams, mockStudyMaterials } from '../../data';

export default function Resources() {
  const [data, setData] = useState(
    mockStudyMaterials.filter(m => m.type === 'teacher')
  );
  const [examFilter, setExamFilter] = useState<string>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({
    examId: 1,
    title: '',
    category: 'Notes',
    fileUrl: '',
  });

  const filtered =
    examFilter === 'all'
      ? data
      : data.filter(m => m.examId === Number(examFilter));

  const remove = (id: number) => setData(data.filter(m => m.id !== id));

  const handleUpload = () => {
    mockStudyMaterials.push({
      id: Math.max(...mockStudyMaterials.map(m => m.id)) + 1,
      examId: form.examId,
      examTitle: mockExams.find(e => e.id === form.examId)?.title || '',
      uploadedBy: 2,
      uploaderName: 'Dr. Sharma',
      type: 'teacher',
      title: form.title,
      fileUrl: form.fileUrl,
      fileType: form.fileUrl.endsWith('.pdf') ? 'pdf' : 'link',
      fileSize: 0,
      category: form.category,
      isRestricted: true,
      status: 'approved',
      uploadedAt: new Date().toISOString(),
    });
    setData([...mockStudyMaterials.filter(m => m.type === 'teacher')]);
    setShowUpload(false);
    setForm({ examId: 1, title: '', category: 'Notes', fileUrl: '' });
  };

  const columns = [
    { field: 'title', header: 'Title' },
    { field: 'examTitle', header: 'Exam' },
    { field: 'category', header: 'Category' },
    { field: 'fileType', header: 'Type' },
    {
      field: 'isRestricted',
      header: 'Restricted',
      cell: (row: any) => <span>{row.isRestricted ? 'Yes' : 'No'}</span>,
    },
    {
      field: 'status',
      header: 'Status',
      cell: (row: any) => <span className="text-green-600">{row.status}</span>,
    },
    { field: 'uploadedAt', header: 'Uploaded' },
    {
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex gap-1">
          <Button icon="eye" variant="text" />
          <Button icon="trash" variant="text" onClick={() => remove(row.id)} />
        </div>
      ),
    },
  ] as any;

  return (
    <FormPage
      title="Study Resources"
      description="Upload and manage open book exam resources"
    >
      <GridPanel
        title="Study Resources"
        data={filtered}
        columns={columns}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        searchPlaceholder="Search resources..."
        toolbar={
          <div className="flex gap-2 items-center">
            <DropDownList
              value={examFilter}
              onChange={v => setExamFilter(v as string)}
              data={[
                { value: 'all', label: 'All Exams' },
                ...mockExams
                  .filter(e => e.isOpenBook)
                  .map(e => ({
                    value: String(e.id),
                    label: e.title,
                  })),
              ]}
              textField="label"
              valueField="value"
            />
            <Button
              label="Upload Resource"
              icon="upload"
              onClick={() => setShowUpload(true)}
            />
          </div>
        }
      />
      {showUpload && (
        <FormPopup
          visible
          onHide={() => setShowUpload(false)}
          title="Upload Resource"
          size="default"
        >
          <div className="space-y-4">
            <DropDownList
              label="Exam"
              value={String(form.examId)}
              onChange={v => setForm({ ...form, examId: Number(v) })}
              data={mockExams
                .filter(e => e.isOpenBook)
                .map(e => ({
                  value: String(e.id),
                  label: e.title,
                }))}
              textField="label"
              valueField="value"
            />
            <TextBox
              label="Title"
              value={form.title}
              onChange={v => setForm({ ...form, title: v })}
            />
            <DropDownList
              label="Category"
              value={form.category}
              onChange={v => setForm({ ...form, category: v as string })}
              data={[
                { value: 'Textbook', label: 'Textbook' },
                { value: 'Notes', label: 'Notes' },
                { value: 'Reference', label: 'Reference' },
                { value: 'Video', label: 'Video' },
              ]}
              textField="label"
              valueField="value"
            />
            <TextBox
              label="File URL / Link"
              value={form.fileUrl}
              onChange={v => setForm({ ...form, fileUrl: v })}
            />
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowUpload(false)}
              />
              <Button label="Upload" icon="upload" onClick={handleUpload} />
            </div>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
