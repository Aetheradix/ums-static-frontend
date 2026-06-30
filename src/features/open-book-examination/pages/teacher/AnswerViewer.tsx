import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { mockAttempts, mockEvaluations, mockStudentAnswers } from '../../data';

export default function AnswerViewer() {
  const { attemptId } = useParams();
  const attempt = mockAttempts.find(a => a.id === Number(attemptId));
  const answers = mockStudentAnswers.filter(
    a => a.attemptId === Number(attemptId)
  );
  const [marks, setMarks] = useState<Record<number, number>>(
    Object.fromEntries(answers.map(a => [a.id, a.marksObtained || 0]))
  );
  const [remarks, setRemarks] = useState<Record<number, string>>(
    Object.fromEntries(answers.map(a => [a.id, a.remarks || '']))
  );
  const [submitDone, setSubmitDone] = useState(false);

  const totalObtained = Object.values(marks).reduce((a, b) => a + b, 0);
  const totalMax = answers.reduce((a, b) => a + b.maxMarks, 0);

  const submitEvaluation = () => {
    answers.forEach(a => {
      a.marksObtained = marks[a.id];
      a.remarks = remarks[a.id];
      a.evaluatedBy = 2;
      a.evaluatedByName = 'Dr. Sharma';
      a.evaluatedAt = new Date().toISOString();
    });
    const existing = mockEvaluations.find(
      e => e.attemptId === Number(attemptId)
    );
    if (existing) {
      existing.marksAwarded = totalObtained;
      existing.status = 'completed';
      existing.evaluatedAt = new Date().toISOString();
    } else {
      mockEvaluations.push({
        id: Math.max(...mockEvaluations.map(e => e.id)) + 1,
        attemptId: Number(attemptId),
        examId: attempt?.examId || 0,
        examTitle: attempt?.examTitle || '',
        studentId: attempt?.studentId || 0,
        studentName: attempt?.studentName || '',
        rollNo: attempt?.rollNo || '',
        totalMarks: totalMax,
        marksAwarded: totalObtained,
        evaluatedBy: 2,
        evaluatedByName: 'Dr. Sharma',
        evaluatedAt: new Date().toISOString(),
        status: 'completed',
      });
    }
    setSubmitDone(true);
  };

  if (!attempt) {
    return (
      <FormPage title="Answer Viewer">
        <p className="text-gray-500">Attempt not found.</p>
      </FormPage>
    );
  }

  return (
    <FormPage
      title={`Answer Viewer — ${attempt.studentName}`}
      description={`Roll No: ${attempt.rollNo} | Exam: ${attempt.examTitle}`}
    >
      <FormCard
        title="Student Answers"
        headerAction={
          <span className="text-sm font-medium">
            Score: {totalObtained}/{totalMax}
          </span>
        }
      >
        <div className="space-y-6">
          {answers.map(a => {
            return (
              <div key={a.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{a.questionText}</p>
                    <p className="text-xs text-gray-500">
                      Type: {a.questionType} | Max Marks: {a.maxMarks}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Marks:</label>
                    <input
                      type="number"
                      className="w-20 border rounded px-2 py-1 text-sm"
                      min={0}
                      max={a.maxMarks}
                      value={marks[a.id]}
                      onChange={e =>
                        setMarks({ ...marks, [a.id]: Number(e.target.value) })
                      }
                    />
                    <span className="text-xs text-gray-400">
                      / {a.maxMarks}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3 mb-2 text-sm whitespace-pre-wrap">
                  {a.answerText || (
                    <span className="text-gray-400 italic">
                      No answer provided
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">Remarks:</label>
                  <input
                    className="w-full border rounded px-2 py-1 text-sm mt-1"
                    value={remarks[a.id] || ''}
                    onChange={e =>
                      setRemarks({ ...remarks, [a.id]: e.target.value })
                    }
                    placeholder="Add remarks..."
                  />
                </div>
              </div>
            );
          })}
        </div>
        {submitDone ? (
          <div className="mt-4 p-3 bg-green-50 rounded text-sm text-green-800">
            Evaluation submitted successfully!
          </div>
        ) : (
          <div className="flex justify-end mt-4">
            <Button
              label="Submit Evaluation"
              icon="save"
              onClick={submitEvaluation}
            />
          </div>
        )}
      </FormCard>
    </FormPage>
  );
}
