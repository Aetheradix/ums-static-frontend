import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { mockExams, mockModerationRecords } from '../../data';

export default function Moderation() {
  const [data, setData] = useState(mockModerationRecords);
  const [examId, setExamId] = useState<string>('');
  const [reviewPopup, setReviewPopup] = useState<{
    open: boolean;
    id?: number;
  }>({ open: false });

  const examOptions = mockExams
    .filter(e => e.status === 'moderation')
    .map(e => ({ value: String(e.id), label: e.title }));
  const filtered = examId
    ? data.filter(r => r.examId === Number(examId))
    : data;

  const handleAction = (id: number, status: 'approved' | 'rejected') => {
    const idx = data.findIndex(r => r.id === id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], status, reviewedByName: 'Admin' };
      setData([...data]);
      setReviewPopup({ open: false });
    }
  };

  return (
    <FormPage
      title="Moderation Dashboard"
      description="Review flagged evaluations"
    >
      <GridPanel
        title="Moderation Records"
        data={filtered}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <DropDownList
            value={examId}
            onChange={v => setExamId(v as string)}
            data={[{ value: '', label: 'All Exams' }, ...examOptions]}
            textField="label"
            valueField="value"
          />
        }
        columns={
          [
            { field: 'studentName', header: 'Student' },
            { field: 'examTitle', header: 'Exam' },
            { field: 'flaggedByName', header: 'Flagged By' },
            {
              field: 'reason',
              header: 'Reason',
              cell: (row: { reason: string }) => (
                <span className="text-gray-600 max-w-xs truncate block">
                  {row.reason}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (row: { status: string }) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.status === 'approved' ? 'bg-green-100 text-green-800' : row.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {row.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (row: { id: number; status: string }) =>
                row.status === 'pending' ? (
                  <Button
                    label="Review"
                    icon="fact_check"
                    onClick={() => setReviewPopup({ open: true, id: row.id })}
                  />
                ) : (
                  <span>{row.status}</span>
                ),
            },
          ] as any
        }
      />
      {reviewPopup.open && (
        <FormPopup
          visible
          onHide={() => setReviewPopup({ open: false })}
          title="Review Moderation Flag"
        >
          <p className="text-sm text-gray-600 mb-4">
            Review the flagged evaluation and take action.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              label="Reject Flag"
              variant="outlined"
              onClick={() =>
                reviewPopup.id && handleAction(reviewPopup.id, 'rejected')
              }
            />
            <Button
              label="Approve Changes"
              onClick={() =>
                reviewPopup.id && handleAction(reviewPopup.id, 'approved')
              }
            />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
