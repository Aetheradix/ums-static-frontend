import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, Tabs, FormPopup } from 'shared/new-components';
import { FileUpload } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import {
  mockQuizzes,
  mockQuizQuestions,
  mockAssignments,
  type Quiz,
  type Assignment,
} from '../../mocks';
import { learningUrls } from '../../urls';

type AssessTab = 'quizzes' | 'assignments';

export default function StudentAssessments() {
  const [activeTab, setActiveTab] = useState<AssessTab>('quizzes');
  const [quizzes] = useState<Quiz[]>(mockQuizzes);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);

  // Quiz Taker State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Assignment Upload State
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizScore(null);
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const submitQuiz = () => {
    const questions = mockQuizQuestions.filter(
      q => q.quizId === activeQuiz?.id
    );
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setQuizScore(correctCount);
    ToastService.success(
      `Quiz completed! You scored ${correctCount}/${questions.length}`
    );
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setQuizScore(null);
  };

  const handleUploadAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  const submitAssignment = () => {
    if (!selectedAssignment) return;
    setAssignments(prev =>
      prev.map(a =>
        a.id === selectedAssignment.id
          ? {
              ...a,
              status: 'Submitted',
              submittedDate: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );
    ToastService.success(
      `Assignment "${selectedAssignment.title}" submitted successfully!`
    );
    setSelectedAssignment(null);
  };

  return (
    <FormPage
      title="Assessments"
      description="Attempt assigned course quizzes and upload assignment materials."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Student Portal', to: learningUrls.student.portal },
        { label: 'Assessments' },
      ]}
    >
      <Tabs
        tabs={[
          { title: 'Available Quizzes', content: <></> },
          { title: 'Assignments', content: <></> },
        ]}
        activeIndex={activeTab === 'quizzes' ? 0 : 1}
        onTabChange={e =>
          setActiveTab(e.index === 0 ? 'quizzes' : 'assignments')
        }
      />

      <div className="mt-4">
        {activeTab === 'quizzes' ? (
          <FormCard title="Quizzes List">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-400 text-xxs font-bold uppercase tracking-wider">
                    <th className="py-2 px-3">Title</th>
                    <th className="py-2 px-3">Questions</th>
                    <th className="py-2 px-3">Time Limit</th>
                    <th className="py-2 px-3">Due Date</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700 font-medium">
                  {quizzes.map(q => (
                    <tr
                      key={q.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {q.title}
                      </td>
                      <td className="py-3 px-3">
                        {q.totalQuestions} Questions
                      </td>
                      <td className="py-3 px-3">{q.durationMinutes} mins</td>
                      <td className="py-3 px-3 text-red-500">{q.dueDate}</td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          label="Attempt Quiz"
                          variant="primary"
                          size="small"
                          onClick={() => startQuiz(q)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        ) : (
          <FormCard title="Homework & Assignments">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-400 text-xxs font-bold uppercase tracking-wider">
                    <th className="py-2 px-3">Title</th>
                    <th className="py-2 px-3">Points</th>
                    <th className="py-2 px-3">Due Date</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Grade</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700 font-medium">
                  {assignments.map(a => (
                    <tr
                      key={a.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-gray-900">
                          {a.title}
                        </div>
                        <div className="text-xxs text-gray-400 mt-0.5">
                          {a.description}
                        </div>
                      </td>
                      <td className="py-3 px-3">{a.totalPoints} pts</td>
                      <td className="py-3 px-3">{a.dueDate}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xxs font-bold ${
                            a.status === 'Graded'
                              ? 'bg-green-100 text-green-700'
                              : a.status === 'Submitted'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-800 font-semibold">
                        {a.grade || '-'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {a.status === 'Pending' ? (
                          <Button
                            label="Upload File"
                            variant="outlined"
                            size="small"
                            onClick={() => handleUploadAssignment(a)}
                          />
                        ) : (
                          <span className="text-xxs text-gray-400 font-bold">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        )}
      </div>

      {/* Quiz Taker Dialog */}
      {activeQuiz && (
        <FormPopup
          visible={true}
          onHide={closeQuiz}
          title={`Exam: ${activeQuiz.title}`}
          size="lg"
        >
          {quizScore === null ? (
            <div>
              {/* Question list */}
              {(() => {
                const questions = mockQuizQuestions.filter(
                  q => q.quizId === activeQuiz.id
                );
                if (questions.length === 0) {
                  return (
                    <div className="text-center py-6 text-gray-500 font-semibold text-xs">
                      No questions found in this mock exam database.
                    </div>
                  );
                }
                const q = questions[currentQuestionIndex];
                return (
                  <div>
                    <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg mb-4 text-xxs font-bold text-gray-500">
                      <span>
                        QUESTION {currentQuestionIndex + 1} OF{' '}
                        {questions.length}
                      </span>
                      <span className="text-indigo-600">
                        TIME REMAINING: 14:52
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-800 text-sm mb-4">
                      {q.questionText}
                    </h4>

                    <div className="space-y-2 mb-6">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex items-center gap-3 cursor-pointer transition-colors ${
                            answers[q.id] === oIdx
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xxs font-bold uppercase">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      <Button
                        label="Previous"
                        variant="outlined"
                        size="small"
                        disabled={currentQuestionIndex === 0}
                        onClick={() =>
                          setCurrentQuestionIndex(prev => prev - 1)
                        }
                      />
                      {currentQuestionIndex < questions.length - 1 ? (
                        <Button
                          label="Next Question"
                          variant="primary"
                          size="small"
                          disabled={answers[q.id] === undefined}
                          onClick={() =>
                            setCurrentQuestionIndex(prev => prev + 1)
                          }
                        />
                      ) : (
                        <Button
                          label="Submit Test"
                          variant="primary"
                          size="small"
                          disabled={answers[q.id] === undefined}
                          onClick={submitQuiz}
                        />
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            // Quiz Score Card Screen
            <div className="text-center py-6">
              <Icon name="verified" className="text-5xl text-green-500 mb-3" />
              <h3 className="text-lg font-bold text-gray-800">
                Quiz Completed!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Your responses have been processed.
              </p>

              <div className="my-6 bg-green-50 rounded-xl p-4 inline-block border border-green-100">
                <span className="text-xxs text-green-600 uppercase tracking-wider font-bold">
                  YOUR SCORE
                </span>
                <div className="text-3xl font-extrabold text-green-700 mt-1">
                  {quizScore} /{' '}
                  {
                    mockQuizQuestions.filter(q => q.quizId === activeQuiz.id)
                      .length
                  }
                </div>
                <span className="text-xxs text-green-600 font-bold block mt-1">
                  PASSED (Passing Score: 70%)
                </span>
              </div>

              <div className="flex justify-center">
                <Button
                  label="Close Review"
                  variant="outlined"
                  size="small"
                  onClick={closeQuiz}
                />
              </div>
            </div>
          )}
        </FormPopup>
      )}

      {/* Assignment Upload Dialog */}
      {selectedAssignment && (
        <FormPopup
          visible={true}
          onHide={() => setSelectedAssignment(null)}
          title={`Submit Assignment: ${selectedAssignment.title}`}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 text-xs">
                Instructions
              </h4>
              <p className="text-xxs text-gray-500 leading-relaxed mt-1">
                {selectedAssignment.description}
              </p>
            </div>

            <FileUpload label="Select Submission File (PDF, DOCX)" required />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setSelectedAssignment(null)}
              />
              <Button
                label="Submit Assignment"
                variant="primary"
                onClick={submitAssignment}
              />
            </div>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
