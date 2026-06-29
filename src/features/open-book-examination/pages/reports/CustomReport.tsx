import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { mockExams, mockResults } from '../../data';

export default function CustomReport() {
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => setShowResult(true);

  const data =
    selectedExam === 'all'
      ? mockResults
      : mockResults.filter(r => r.examId === Number(selectedExam));

  return (
    <FormPage
      title="Custom Report Builder"
      description="Generate custom reports with selected parameters"
    >
      <FormCard title="Report Parameters">
        <div className="space-y-4">
          <DropDownList
            label="Select Exam"
            value={selectedExam}
            onChange={v => setSelectedExam(v as string)}
            data={[
              { value: 'all', label: 'All Exams' },
              ...mockExams.map(e => ({ value: String(e.id), label: e.title })),
            ]}
            textField="label"
            valueField="value"
          />
          <div className="flex gap-2">
            <Button
              label="Generate Report"
              icon="description"
              onClick={handleGenerate}
            />
            <Button
              label="Export CSV"
              icon="file_download"
              variant="outlined"
            />
          </div>
        </div>
      </FormCard>
      {showResult && (
        <GridPanel
          title="Report Output"
          data={data}
          columns={[
            { field: 'studentName', header: 'Student' },
            { field: 'examTitle', header: 'Exam' },
            {
              field: 'totalMarksObtained',
              header: 'Score',
              cell: row => (
                <>
                  {row.totalMarksObtained}/{row.totalMarks}
                </>
              ),
            },
            {
              field: 'percentage',
              header: 'Percentage',
              cell: row => <>{row.percentage.toFixed(1)}%</>,
            },
            {
              field: 'grade',
              header: 'Grade',
              cell: row => <span className="font-bold">{row.grade}</span>,
            },
            {
              field: 'isPassed',
              header: 'Status',
              cell: row => (
                <span
                  className={`px-2 py-0.5 rounded text-xs ${row.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {row.isPassed ? 'Pass' : 'Fail'}
                </span>
              ),
            },
          ]}
          dataKey="id"
          pagination={{ rows: 10 }}
          searchBox
        />
      )}
      {showResult && (
        <p className="text-xs text-gray-400 mt-2">{data.length} record(s)</p>
      )}
    </FormPage>
  );
}
