import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { NumberBox, TextArea } from 'shared/components/forms';
import { FormPage, FormPopup, GridPanel } from 'shared/new-components';
import type { RevaluationStatus } from '../../data';
import { mockResults, mockRevaluationRequests } from '../../data';
import { InfoBanner } from '../../components';

export default function RevaluationRequests() {
  const [data, setData] = useState(mockRevaluationRequests);
  const [selected, setSelected] = useState<(typeof data)[0] | null>(null);
  const [revisedMarks, setRevisedMarks] = useState(0);
  const [reviewNote, setReviewNote] = useState('');

  const handleUpdate = (id: number, status: RevaluationStatus) => {
    const idx = data.findIndex(r => r.id === id);
    if (idx === -1) return;
    data[idx] = {
      ...data[idx],
      status,
      revisedMarks: status === 'completed' ? revisedMarks : undefined,
      reviewedBy: 2,
      reviewedByName: 'Dr. Sharma',
      reviewedAt: new Date().toISOString(),
    };
    if (status === 'completed' && revisedMarks > 0) {
      const result = mockResults.find(r => r.id === data[idx].resultId);
      if (result) {
        result.totalMarksObtained = revisedMarks;
        result.percentage = (revisedMarks / result.totalMarks) * 100;
      }
    }
    setData([...data]);
    setSelected(null);
  };

  return (
    <FormPage
      title="Revaluation Requests"
      description="Review and process student revaluation requests"
    >
      <InfoBanner
        title="About Revaluation Requests"
        message="Review and process revaluation requests assigned to you by administrators. Re-assess the flagged answers and submit updated scores."
      />
      <GridPanel
        data={data}
        columns={[
          { field: 'studentName', header: 'Student' },
          { field: 'rollNo', header: 'Roll No' },
          { field: 'examTitle', header: 'Exam' },
          { field: 'currentMarks', header: 'Current' },
          { field: 'reason', header: 'Reason' },
          {
            field: 'status',
            header: 'Status',
            cell: row => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  row.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : row.status === 'under_review'
                      ? 'bg-blue-100 text-blue-700'
                      : row.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {row.status.replace(/_/g, ' ')}
              </span>
            ),
          },
          {
            field: 'id',
            header: 'Actions',
            cell: row => (
              <Button
                label="Review"
                icon="rate_review"
                onClick={() => {
                  setSelected(row);
                  setRevisedMarks(row.currentMarks);
                  setReviewNote('');
                }}
              />
            ),
          },
        ]}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
      />
      {selected && (
        <FormPopup
          visible
          onHide={() => setSelected(null)}
          title="Review Revaluation Request"
          size="default"
        >
          <div className="space-y-3">
            <p>
              <strong>Student:</strong> {selected.studentName} (
              {selected.rollNo})
            </p>
            <p>
              <strong>Exam:</strong> {selected.examTitle}
            </p>
            <p>
              <strong>Current Marks:</strong> {selected.currentMarks}
            </p>
            <p>
              <strong>Reason:</strong> {selected.reason}
            </p>
            <NumberBox
              label="Revised Marks"
              value={revisedMarks}
              onChange={v => setRevisedMarks(v ?? 0)}
              min={0}
            />
            <TextArea
              label="Review Notes"
              value={reviewNote}
              onChange={v => setReviewNote(v)}
            />
            <div className="flex justify-end gap-2">
              <Button
                label="Reject"
                variant="outlined"
                className="!border-red-500 !text-red-600"
                onClick={() => handleUpdate(selected.id, 'rejected')}
              />
              <Button
                label="Accept & Update"
                icon="check"
                onClick={() => handleUpdate(selected.id, 'completed')}
              />
              <Button
                label="Mark Under Review"
                icon="sync"
                variant="outlined"
                onClick={() => handleUpdate(selected.id, 'under_review')}
              />
            </div>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
