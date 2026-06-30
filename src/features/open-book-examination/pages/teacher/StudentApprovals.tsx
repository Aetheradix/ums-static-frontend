import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { mockMaterialApprovals, mockStudyMaterials } from '../../data';
import { InfoBanner } from '../../components';

export default function StudentApprovals() {
  const [data, setData] = useState(
    mockMaterialApprovals.filter(a => a.status === 'pending')
  );
  const [selected, setSelected] = useState<(typeof data)[0] | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const handleAction = (id: number, status: 'approved' | 'rejected') => {
    const idx = data.findIndex(a => a.id === id);
    if (idx === -1) return;
    data[idx] = {
      ...data[idx],
      status,
      reviewNote,
      reviewedBy: 2,
      reviewedAt: new Date().toISOString(),
    };
    setData([...data]);
    const mat = mockStudyMaterials.find(m => m.id === data[idx].materialId);
    if (mat) mat.status = status;
    setSelected(null);
    setReviewNote('');
  };

  const columns = [
    { field: 'materialTitle', header: 'Material' },
    { field: 'studentName', header: 'Student' },
    { field: 'rollNo', header: 'Roll No' },
    { field: 'examTitle', header: 'Exam' },
    { field: 'submittedAt', header: 'Submitted' },
    {
      field: 'status',
      header: 'Status',
      cell: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            row.status === 'approved'
              ? 'bg-green-100 text-green-700'
              : row.status === 'rejected'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <Button
          label="Review"
          icon="visibility"
          onClick={() => {
            setSelected(row);
            setReviewNote('');
          }}
        />
      ),
    },
  ] as any;

  return (
    <FormPage
      title="Student Material Approvals"
      description="Review and approve student-uploaded resources"
    >
      <InfoBanner
        title="About Student Approvals"
        message="Review and approve student registrations for your exams. Verify their eligibility before granting them access to the examination."
      />
      <GridPanel
        data={data}
        columns={columns}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        searchPlaceholder="Search approvals..."
      />
      {selected && (
        <FormPopup
          visible
          onHide={() => setSelected(null)}
          title="Review Material"
          size="default"
        >
          <div className="space-y-3">
            <p>
              <strong>Material:</strong> {selected.materialTitle}
            </p>
            <p>
              <strong>Student:</strong> {selected.studentName} (
              {selected.rollNo})
            </p>
            <p>
              <strong>Exam:</strong> {selected.examTitle}
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">
                Review Note
              </label>
              <textarea
                className="w-full border rounded p-2 text-sm"
                rows={3}
                value={reviewNote}
                onChange={e => setReviewNote(e.target.value)}
                placeholder="Add review comments..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                label="Reject"
                variant="outlined"
                className="!border-red-500 !text-red-600"
                onClick={() => handleAction(selected.id, 'rejected')}
              />
              <Button
                label="Approve"
                icon="check"
                onClick={() => handleAction(selected.id, 'approved')}
              />
            </div>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
