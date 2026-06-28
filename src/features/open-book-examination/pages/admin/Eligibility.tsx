import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockEligibilityResults, mockExams } from '../../data';

export default function Eligibility() {
  const [examId, setExamId] = useState<string>('');
  const [ran, setRan] = useState(false);

  const examOptions = mockExams.map(e => ({
    value: String(e.id),
    label: e.title,
  }));
  const results = examId
    ? mockEligibilityResults.filter(r => r.examId === Number(examId))
    : [];
  const eligible = results.filter(r => r.overall === 'eligible');
  const ineligible = results.filter(r => r.overall === 'ineligible');

  return (
    <FormPage
      title="Eligibility Oversight"
      description="Verify student eligibility for exams"
    >
      <div className="flex gap-3 items-end mb-4">
        <DropDownList
          label="Select Exam"
          value={examId}
          onChange={v => {
            setExamId(v as string);
            setRan(false);
          }}
          data={examOptions}
          textField="label"
          valueField="value"
        />
        <Button
          label={ran ? 'Re-run Check' : 'Run Eligibility Check'}
          icon="play_arrow"
          onClick={() => setRan(true)}
          disabled={!examId}
        />
      </div>
      {ran && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Students"
              value={results.length}
              icon="people"
              colorScheme="blue"
            />
            <StatCard
              title="Eligible"
              value={eligible.length}
              icon="check_circle"
              colorScheme="green"
            />
            <StatCard
              title="Ineligible"
              value={ineligible.length}
              icon="cancel"
              colorScheme="red"
            />
          </div>
          <GridPanel
            title="Eligibility Results"
            data={results}
            dataKey="id"
            pagination={{ rows: 10 }}
            searchBox
            columns={
              [
                { field: 'studentName', header: 'Student' },
                { field: 'rollNo', header: 'Roll No' },
                {
                  field: 'attendancePct',
                  header: 'Attendance',
                  cell: (row: { attendancePct: number }) => (
                    <span>{row.attendancePct}%</span>
                  ),
                },
                { field: 'cgpa', header: 'CGPA' },
                {
                  field: 'feeCleared',
                  header: 'Fee',
                  cell: (row: { feeCleared: boolean }) => (
                    <span>{row.feeCleared ? '✅' : '❌'}</span>
                  ),
                },
                { field: 'backlogCount', header: 'Backlogs' },
                {
                  field: 'overall',
                  header: 'Status',
                  cell: (row: { overall: string }) => (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.overall === 'eligible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {row.overall}
                    </span>
                  ),
                },
                {
                  field: 'reason',
                  header: 'Reason',
                  cell: (row: { reason?: string }) => (
                    <span className="text-gray-500">{row.reason || '-'}</span>
                  ),
                },
              ] as any
            }
          />
        </>
      )}
    </FormPage>
  );
}
