import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormCard, FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockExams, mockResults } from '../../data';
import { InfoBanner } from '../../components';

type Step = 'select' | 'draft' | 'review' | 'published';

export default function ResultPublishing() {
  const [examId, setExamId] = useState<string>('');
  const [step, setStep] = useState<Step>('select');

  const examOptions = mockExams
    .filter(
      e =>
        e.status === 'moderation' ||
        e.status === 'result_draft' ||
        e.status === 'result_published'
    )
    .map(e => ({ value: String(e.id), label: e.title }));
  const results = examId
    ? mockResults.filter(r => r.examId === Number(examId))
    : [];
  const passed = results.filter(r => r.isPassed);
  const passPct =
    results.length > 0 ? Math.round((passed.length / results.length) * 100) : 0;

  const gradeDist = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'].map(g => ({
    grade: g,
    count: results.filter(r => r.grade === g).length,
  }));

  return (
    <FormPage
      title="Result Publishing"
      description="Generate, review, and publish exam results"
    >
      <InfoBanner
        title="About Result Publishing"
        message="Review finalized results before making them available to students. This serves as the final gateway to ensure all evaluations are complete and moderated before publication."
      />
      <div className="flex gap-3 items-end mb-4">
        <DropDownList
          label="Select Exam"
          value={examId}
          onChange={v => {
            setExamId(v as string);
            setStep('select');
          }}
          data={examOptions}
          textField="label"
          valueField="value"
        />
        {examId && step === 'select' && (
          <Button
            label="Generate Draft Results"
            icon="auto_awesome"
            onClick={() => setStep('draft')}
          />
        )}
      </div>
      {step === 'draft' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <StatCard
              title="Total Students"
              value={results.length}
              icon="people"
              colorScheme="blue"
            />
            <StatCard
              title="Passed"
              value={passed.length}
              icon="check_circle"
              colorScheme="green"
            />
            <StatCard
              title="Pass %"
              value={`${passPct}%`}
              icon="trending_up"
              colorScheme={passPct >= 60 ? 'green' : 'red'}
            />
          </div>
          <FormCard title="Grade Distribution">
            <div className="flex gap-3 flex-wrap">
              {gradeDist.map(g => (
                <div
                  key={g.grade}
                  className="text-center p-3 bg-gray-50 rounded-lg min-w-[60px]"
                >
                  <div className="text-lg font-bold">{g.grade}</div>
                  <div className="text-xs text-gray-500">
                    {g.count} students
                  </div>
                </div>
              ))}
            </div>
          </FormCard>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Back"
              variant="outlined"
              onClick={() => setStep('select')}
            />
            <Button
              label="Review & Publish"
              icon="upload"
              onClick={() => setStep('review')}
            />
          </div>
        </>
      )}
      {step === 'review' && (
        <GridPanel
          title="Review & Publish"
          data={results}
          dataKey="id"
          pagination={{ rows: 10 }}
          searchBox
          toolbar={
            <Button
              label="Publish Results"
              icon="upload"
              onClick={() => setStep('published')}
            />
          }
          columns={
            [
              { field: 'studentName', header: 'Student' },
              {
                field: 'totalMarksObtained',
                header: 'Marks',
                cell: (row: {
                  totalMarksObtained: number;
                  totalMarks: number;
                }) => (
                  <span>
                    {row.totalMarksObtained}/{row.totalMarks}
                  </span>
                ),
              },
              {
                field: 'percentage',
                header: '%',
                cell: (row: { percentage: number }) => (
                  <span>{row.percentage}%</span>
                ),
              },
              {
                field: 'grade',
                header: 'Grade',
                cell: (row: { grade: string }) => (
                  <span className="font-bold">{row.grade}</span>
                ),
              },
              {
                field: 'isPassed',
                header: 'Result',
                cell: (row: { isPassed: boolean }) => (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {row.isPassed ? 'Pass' : 'Fail'}
                  </span>
                ),
              },
            ] as any
          }
        />
      )}
      {step === 'published' && (
        <FormCard title="✅ Results Published Successfully">
          <p className="text-gray-600">
            Results have been published. Notifications sent to all students.
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              label="Back to Dashboard"
              icon="home"
              onClick={() => {
                setStep('select');
                setExamId('');
              }}
            />
            <Button label="Generate Grade Cards" icon="file" />
          </div>
        </FormCard>
      )}
    </FormPage>
  );
}
