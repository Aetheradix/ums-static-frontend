import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { mockAttempts, mockExams, mockStudentAnswers } from '../../data';

export default function Receipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find(e => e.id === Number(id));
  const attempt = mockAttempts.find(
    a =>
      a.examId === Number(id) && a.studentId === 8 && a.status === 'submitted'
  );
  const answers = attempt
    ? mockStudentAnswers.filter(a => a.attemptId === attempt.id)
    : [];
  const answeredCount = answers.filter(
    a => a.answerText && a.answerText.trim() !== ''
  ).length;

  if (!exam || !attempt) {
    return (
      <FormPage title="Receipt">
        <p className="text-gray-500">Submission receipt not found.</p>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Submission Receipt"
      description={`${exam.title} — ${exam.subjectName}`}
    >
      <FormCard title="Exam Summary">
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-green-800 mb-2">
              ✅ Submitted Successfully
            </p>
            <p>
              <strong>Student:</strong> {attempt.studentName} ({attempt.rollNo})
            </p>
            <p>
              <strong>Submitted At:</strong>{' '}
              {attempt.submittedAt
                ? new Date(attempt.submittedAt).toLocaleString()
                : '-'}
            </p>
            <p>
              <strong>Duration:</strong>{' '}
              {Math.round(
                (new Date(
                  attempt.endTime || attempt.submittedAt || ''
                ).getTime() -
                  new Date(attempt.startTime).getTime()) /
                  60000
              )}{' '}
              minutes
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border rounded p-3">
              <p className="text-gray-500">Questions Answered</p>
              <p className="text-xl font-bold">
                {answeredCount}/{answers.length}
              </p>
            </div>
            <div className="border rounded p-3">
              <p className="text-gray-500">Tab Switches</p>
              <p className="text-xl font-bold">{attempt.tabSwitchCount}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              label="Back to Dashboard"
              icon="home"
              variant="outlined"
              onClick={() =>
                navigate('/open-book-examination/student/dashboard')
              }
            />
            <Button
              label="View Results"
              icon="assessment"
              onClick={() => navigate('/open-book-examination/student/results')}
            />
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
