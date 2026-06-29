import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockEligibilityResults, mockExams } from '../../data';

export default function EligibilityAttendanceReport() {
  const [examFilter, setExamFilter] = useState<string>('all');
  const data =
    examFilter === 'all'
      ? mockEligibilityResults
      : mockEligibilityResults.filter(r => r.examId === Number(examFilter));

  return (
    <FormPage
      title="Eligibility & Attendance Report"
      description="View student eligibility status with attendance metrics"
    >
      <GridPanel
        title="Eligibility & Attendance"
        data={data}
        columns={[
          { field: 'studentName', header: 'Student' },
          { field: 'rollNo', header: 'Roll No' },
          { field: 'examTitle', header: 'Exam' },
          {
            field: 'attendancePct',
            header: 'Attendance %',
            cell: row => (
              <span
                className={
                  row.attendancePct >= 75 ? 'text-green-600' : 'text-red-600'
                }
              >
                {row.attendancePct}%
              </span>
            ),
          },
          { field: 'cgpa', header: 'CGPA' },
          {
            field: 'feeCleared',
            header: 'Fee Cleared',
            cell: row => <>{row.feeCleared ? 'Yes' : 'No'}</>,
          },
          { field: 'backlogCount', header: 'Backlogs' },
          {
            field: 'overall',
            header: 'Status',
            cell: row => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${row.overall === 'eligible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {row.overall}
              </span>
            ),
          },
          {
            field: 'reason',
            header: 'Reason',
            cell: row => (
              <span className="text-xs text-gray-500">{row.reason || '-'}</span>
            ),
          },
        ]}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <DropDownList
            value={examFilter}
            onChange={v => setExamFilter(v as string)}
            data={[
              { value: 'all', label: 'All Exams' },
              ...mockExams.map(e => ({ value: String(e.id), label: e.title })),
            ]}
            textField="label"
            valueField="value"
          />
        }
      />
    </FormPage>
  );
}
