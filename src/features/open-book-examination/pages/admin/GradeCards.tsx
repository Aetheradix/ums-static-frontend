import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockExams, mockResults } from '../../data';

export default function GradeCards() {
  const [examId, setExamId] = useState<string>('');
  const [generated, setGenerated] = useState(false);

  const examOptions = mockExams
    .filter(e => e.status === 'result_published')
    .map(e => ({ value: String(e.id), label: e.title }));
  const results = examId
    ? mockResults.filter(r => r.examId === Number(examId))
    : [];

  return (
    <FormPage
      title="Grade Card Generator"
      description="Generate grade cards for published results"
    >
      <div className="flex gap-3 items-end mb-4">
        <DropDownList
          label="Select Exam"
          value={examId}
          onChange={v => {
            setExamId(v as string);
            setGenerated(false);
          }}
          data={examOptions}
          textField="label"
          valueField="value"
        />
        <Button
          label={generated ? 'Regenerate' : 'Generate Grade Cards'}
          icon="description"
          onClick={() => setGenerated(true)}
          disabled={!examId}
        />
      </div>
      {generated && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatCard
              title="Students"
              value={results.length}
              icon="people"
              colorScheme="blue"
            />
            <StatCard
              title="Generated"
              value={results.length}
              icon="check_circle"
              colorScheme="green"
            />
          </div>
          <GridPanel
            title="Grade Cards"
            data={results}
            dataKey="id"
            pagination={{ rows: 10 }}
            searchBox
            toolbar={<Button label="Download All (ZIP)" icon="file_download" />}
            columns={
              [
                { field: 'studentName', header: 'Student' },
                { field: 'rollNo', header: 'Roll No' },
                { field: 'subjectName', header: 'Subject' },
                {
                  field: 'grade',
                  header: 'Grade',
                  cell: (row: { grade: string }) => (
                    <span className="font-bold">{row.grade}</span>
                  ),
                },
                { field: 'gradePoint', header: 'Grade Point' },
                {
                  header: 'Actions',
                  cell: () => <Button icon="file_download" variant="text" />,
                },
              ] as any
            }
          />
        </>
      )}
    </FormPage>
  );
}
