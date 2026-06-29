import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import { FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { InfoBanner } from '../../components';
import { mockResults, mockRevaluationRequests } from '../../data';

export default function Revaluation() {
  const studentId = 8;
  const [data, setData] = useState(
    mockRevaluationRequests.filter(r => r.studentId === studentId)
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [reason, setReason] = useState('');

  const availableResults = mockResults.filter(
    r =>
      r.studentId === studentId &&
      !data.some(d => d.resultId === r.id) &&
      !r.isPassed
  );

  const handleSubmit = () => {
    if (!selectedResult || !reason) return;
    const result = mockResults.find(r => r.id === selectedResult);
    if (!result) return;
    mockRevaluationRequests.push({
      id: Math.max(...mockRevaluationRequests.map(r => r.id)) + 1,
      resultId: selectedResult,
      examId: result.examId,
      examTitle: result.examTitle,
      subjectName: result.subjectName,
      studentId,
      studentName: 'Rohan Mehta',
      rollNo: '2024001',
      currentMarks: result.totalMarksObtained,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setData([
      ...mockRevaluationRequests.filter(r => r.studentId === studentId),
    ]);
    setShowForm(false);
    setSelectedResult(null);
    setReason('');
  };

  return (
    <FormPage
      title="Revaluation Requests"
      description="Request revaluation of your exam answers"
    >
      <InfoBanner
        title="About Revaluation"
        message="Submit requests for revaluation if you believe there was an error in the grading of your exam. Track the status of your pending requests."
      />
      <GridPanel
        data={data}
        toolbar={
          availableResults.length > 0 ? (
            <Button
              label="New Request"
              icon="add"
              onClick={() => setShowForm(true)}
            />
          ) : undefined
        }
        columns={[
          { field: 'examTitle', header: 'Exam' },
          { field: 'currentMarks', header: 'Current Marks' },
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
            field: 'revisedMarks',
            header: 'Revised',
            cell: row => <span>{row.revisedMarks ?? '-'}</span>,
          },
          {
            field: 'reviewedAt',
            header: 'Reviewed',
            cell: row => (
              <span>
                {row.reviewedAt
                  ? new Date(row.reviewedAt).toLocaleDateString()
                  : '-'}
              </span>
            ),
          },
        ]}
        dataKey="id"
        searchBox
        pagination={{ rows: 10 }}
      />
      {showForm && (
        <FormPopup
          visible
          onHide={() => setShowForm(false)}
          title="New Revaluation Request"
          size="default"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Exam
              </label>
              <select
                className="w-full border rounded px-2 py-1.5 text-sm"
                value={selectedResult ?? ''}
                onChange={e => setSelectedResult(Number(e.target.value))}
              >
                <option value="">-- Select --</option>
                {availableResults.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.examTitle} (Current: {r.totalMarksObtained}/
                    {r.totalMarks})
                  </option>
                ))}
              </select>
            </div>
            <TextArea
              label="Reason for Revaluation"
              value={reason}
              onChange={v => setReason(v)}
              rows={4}
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowForm(false)}
              />
              <Button
                label="Submit Request"
                icon="send"
                onClick={handleSubmit}
                disabled={!selectedResult || !reason}
              />
            </div>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
