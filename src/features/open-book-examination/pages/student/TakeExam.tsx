import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPopup } from 'shared/new-components';
import { BookMaterialViewer, ExamLayout, ExamTimer } from '../../components';
import {
  mockAttempts,
  mockExams,
  mockQuestionPapers,
  mockQuestions,
  mockStudentAnswers,
  mockStudyMaterials,
} from '../../data';

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find(e => e.id === Number(id));
  const paper = mockQuestionPapers.find(p => p.examId === Number(id));
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showResources, setShowResources] = useState(false);

  const allQuestionIds = paper?.sections.flatMap(s => s.questionIds) || [];
  const sectionQuestions = paper?.sections[currentSection] || null;
  const sectionQList = sectionQuestions
    ? mockQuestions.filter(q => sectionQuestions.questionIds.includes(q.id))
    : [];

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = useCallback(() => {
    const attemptId = Math.max(...mockAttempts.map(a => a.id)) + 1;
    const attempt = {
      id: attemptId,
      examId: Number(id),
      examTitle: exam?.title || '',
      studentId: 8,
      studentName: 'Rohan Mehta',
      rollNo: '2024001',
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date().toISOString(),
      status: 'submitted' as const,
      tabSwitchCount: 0,
      autoSaveVersion: Object.keys(answers).length,
      submittedAt: new Date().toISOString(),
    };
    mockAttempts.push(attempt);

    allQuestionIds.forEach(qid => {
      const q = mockQuestions.find(q => q.id === qid);
      if (!q) return;
      mockStudentAnswers.push({
        id: Math.max(...mockStudentAnswers.map(a => a.id)) + 1,
        attemptId,
        questionId: qid,
        questionText: q.questionText,
        questionType: q.type,
        answerText: answers[qid] || '',
        marksObtained: undefined,
        maxMarks: q.marks,
        isFlagged: false,
      });
    });

    if (exam) {
      exam.status = 'submission';
    }
    setSubmitted(true);
    setShowSubmitConfirm(false);
  }, [answers, allQuestionIds, exam, id]);

  if (!exam || !paper) {
    return (
      <ExamLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Exam or question paper not found.</p>
        </div>
      </ExamLayout>
    );
  }

  if (submitted) {
    return (
      <ExamLayout>
        <div className="flex items-center justify-center h-full">
          <FormCard title="Exam Submitted" className="max-w-md">
            <div className="text-center space-y-4">
              <span className="text-6xl">✅</span>
              <p className="text-lg font-medium">
                Your exam has been submitted successfully!
              </p>
              <p className="text-sm text-gray-500">
                You can view your submission receipt for details.
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  label="View Receipt"
                  icon="receipt"
                  onClick={() =>
                    navigate(
                      `/open-book-examination/student/exam/${id}/receipt`
                    )
                  }
                />
                <Button
                  label="Go to Dashboard"
                  icon="home"
                  variant="outlined"
                  onClick={() =>
                    navigate('/open-book-examination/student/dashboard')
                  }
                />
              </div>
            </div>
          </FormCard>
        </div>
      </ExamLayout>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQCount = allQuestionIds.length;

  return (
    <ExamLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-white shrink-0">
        <div>
          <h1 className="text-lg font-bold">{exam.title}</h1>
          <p className="text-xs text-gray-500">
            {exam.subjectName} | {exam.totalMarks} marks
          </p>
        </div>
        <div className="flex items-center gap-4">
          {exam.isOpenBook && (
            <Button
              label="Resources"
              icon="menu_book"
              variant="outlined"
              onClick={() => setShowResources(true)}
            />
          )}
          <ExamTimer
            startTime={exam.startTime}
            endTime={`${exam.scheduledDate}T${exam.endTime}:00`}
            onExpire={handleSubmit}
          />
          <Button
            label="Submit"
            icon="check_circle"
            onClick={() => setShowSubmitConfirm(true)}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 border-r bg-gray-50 overflow-y-auto shrink-0 p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Questions ({answeredCount}/{totalQCount})
          </p>
          {paper.sections.map((s, si) => (
            <div key={si} className="mb-3">
              <button
                className={`text-xs font-medium mb-1 ${currentSection === si ? 'text-blue-600' : 'text-gray-600'}`}
                onClick={() => setCurrentSection(si)}
              >
                {s.name} ({s.questionIds.length} × {s.marksPerQuestion} marks)
              </button>
              <div className="flex flex-wrap gap-1">
                {s.questionIds.map((qid, qi) => {
                  const isAnswered =
                    answers[qid] !== undefined && answers[qid].trim() !== '';
                  return (
                    <button
                      key={qid}
                      className={`w-7 h-7 rounded text-xs font-medium ${
                        isAnswered
                          ? 'bg-green-500 text-white'
                          : 'bg-white border text-gray-600'
                      } ${currentSection === si ? '' : 'opacity-60'}`}
                      onClick={() => setCurrentSection(si)}
                    >
                      {qi + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {sectionQList.map((q, qi) => (
            <div key={q.id} className="mb-6 border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-sm">
                  {qi + 1}. {q.questionText}
                </p>
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  [{q.marks} marks]
                </span>
              </div>
              {q.type === 'mcq' && q.options && (
                <div className="space-y-1 ml-4">
                  {q.options.map((opt, oi) => (
                    <label
                      key={oi}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        checked={answers[q.id] === String(oi)}
                        onChange={() => handleAnswer(q.id, String(oi))}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.type === 'true_false' && (
                <div className="flex gap-4 ml-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      checked={answers[q.id] === 'true'}
                      onChange={() => handleAnswer(q.id, 'true')}
                    />{' '}
                    True
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      checked={answers[q.id] === 'false'}
                      onChange={() => handleAnswer(q.id, 'false')}
                    />{' '}
                    False
                  </label>
                </div>
              )}
              {(q.type === 'short_answer' || q.type === 'long_answer') && (
                <textarea
                  className="w-full border rounded p-2 text-sm mt-2"
                  rows={q.type === 'long_answer' ? 6 : 3}
                  value={answers[q.id] || ''}
                  onChange={e => handleAnswer(q.id, e.target.value)}
                  placeholder="Write your answer here..."
                />
              )}
              {q.type === 'coding' && (
                <textarea
                  className="w-full border rounded p-2 text-sm mt-2 font-mono bg-gray-50"
                  rows={8}
                  value={answers[q.id] || ''}
                  onChange={e => handleAnswer(q.id, e.target.value)}
                  placeholder="Write your code here..."
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resources Panel */}
      {showResources && (
        <div className="fixed right-0 top-16 bottom-16 w-80 bg-white border-l shadow-lg overflow-y-auto p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-sm">Resources</h3>
            <button
              onClick={() => setShowResources(false)}
              className="text-gray-400"
            >
              ✕
            </button>
          </div>
          <BookMaterialViewer
            materials={mockStudyMaterials.filter(
              m => m.examId === Number(id) && m.status === 'approved'
            )}
          />
        </div>
      )}

      {/* Submit Confirmation */}
      {showSubmitConfirm && (
        <FormPopup
          visible
          onHide={() => setShowSubmitConfirm(false)}
          title="Submit Exam"
          size="default"
        >
          <div className="space-y-3">
            <p>
              You have answered <strong>{answeredCount}</strong> out of{' '}
              <strong>{totalQCount}</strong> questions.
            </p>
            {answeredCount < totalQCount && (
              <p className="text-orange-600 text-sm">
                ⚠️ {totalQCount - answeredCount} question(s) unanswered.
              </p>
            )}
            <p className="text-sm text-gray-500">
              Once submitted, answers cannot be modified.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                label="Continue Exam"
                variant="outlined"
                onClick={() => setShowSubmitConfirm(false)}
              />
              <Button
                label="Submit Now"
                icon="check_circle"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </FormPopup>
      )}
    </ExamLayout>
  );
}
