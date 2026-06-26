import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox, Checkbox } from 'shared/components/forms';
import { FormCard, FormPage, FormPopup } from 'shared/new-components';
import {
  feedbackSessions,
  feedbackQuestions,
  feedbackAssignments,
  studentResponses,
} from '../../data';

export default function StudentFeedbackForm() {
  const { sessionId, responseId } = useParams<{
    sessionId: string;
    responseId: string;
  }>();
  const navigate = useNavigate();

  const session = feedbackSessions.find(s => s.id === sessionId);
  const studentResponse = studentResponses.find(r => r.id === responseId);
  const questions = feedbackQuestions.filter(
    q => q.templateId === session?.templateId
  );
  const assignment = feedbackAssignments.find(
    a =>
      a.course === studentResponse?.course &&
      a.faculty === studentResponse?.faculty
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {}
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!session || !studentResponse) {
    return (
      <FormPage title="Not Found" breadcrumbs={[]}>
        <FormCard>Session or feedback item not found.</FormCard>
      </FormPage>
    );
  }

  const totalSteps = questions.length;
  const currentQuestion = questions[currentStep];

  const updateResponse = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxToggle = (
    questionId: string,
    option: string,
    checked: boolean
  ) => {
    setResponses(prev => {
      const current = (prev[questionId] as string[]) || [];
      if (checked) return { ...prev, [questionId]: [...current, option] };
      return { ...prev, [questionId]: current.filter(o => o !== option) };
    });
  };

  const renderStarRating = (questionId: string) => {
    const val = Number(responses[questionId]) || 0;
    return (
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => updateResponse(questionId, String(star))}
            className={`text-3xl cursor-pointer transition-colors ${star <= val ? 'text-yellow-400' : 'text-gray-200'} hover:text-yellow-400`}
          >
            {star <= val ? '\u2605' : '\u2606'}
          </button>
        ))}
      </div>
    );
  };

  const renderQuestionInput = (q: (typeof questions)[0]) => {
    switch (q.questionType) {
      case 'Rating':
        return renderStarRating(q.id);
      case 'Yes/No':
        return (
          <div className="flex gap-4">
            {q.options.map(opt => (
              <label
                key={opt}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={responses[q.id] === opt}
                  onChange={() => updateResponse(q.id, opt)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'Text':
        return (
          <TextBox
            placeholder="Enter your answer..."
            value={(responses[q.id] as string) || ''}
            onChange={v => updateResponse(q.id, v)}
          />
        );
      case 'Paragraph':
        return (
          <TextArea
            placeholder="Write your suggestions here..."
            value={(responses[q.id] as string) || ''}
            onChange={v => updateResponse(q.id, v)}
            rows={4}
          />
        );
      case 'MCQ':
        return (
          <div className="flex flex-col gap-2">
            {q.options.map(opt => (
              <Checkbox
                key={opt}
                label={opt}
                checked={((responses[q.id] as string[]) || []).includes(opt)}
                onChange={v => handleCheckboxToggle(q.id, opt, v)}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const validateCurrent = () => {
    if (!currentQuestion?.isMandatory) return true;
    const val = responses[currentQuestion.id];
    return !(!val || (Array.isArray(val) && val.length === 0));
  };

  const handleNext = () => {
    if (!validateCurrent()) {
      ToastService.error(`Please answer: "${currentQuestion.question}"`);
      return;
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSaveDraft = () => {
    ToastService.success('Draft saved successfully.');
  };

  const handleSubmitClick = () => {
    for (const q of questions) {
      if (q.isMandatory) {
        const val = responses[q.id];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          ToastService.error(`Please answer: "${q.question}"`);
          const idx = questions.indexOf(q);
          setCurrentStep(idx);
          return;
        }
      }
    }
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setShowConfirm(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <FormPage
        title=""
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          {
            label: 'Student Feedback',
            to: '/student-feedback-management/student',
          },
          { label: 'Submitted' },
        ]}
      >
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
            &#10003;
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Thank You</h2>
          <p className="text-sm text-gray-500">
            Your feedback has been submitted successfully.
          </p>
          <Button
            label="Back to Dashboard"
            icon="arrow_back"
            variant="primary"
            onClick={() => navigate('/student-feedback-management/student')}
            className="mt-4"
          />
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title={session.sessionName}
      description=""
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Student Feedback',
          to: '/student-feedback-management/student',
        },
        { label: studentResponse.course },
      ]}
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <FormCard>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-6 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-800">Faculty:</span>{' '}
                {studentResponse.faculty}
              </div>
              <div>
                <span className="font-medium text-gray-800">Course:</span>{' '}
                {studentResponse.course}
              </div>
              <div>
                <span className="font-medium text-gray-800">Semester:</span>{' '}
                {assignment?.semester || '—'}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">
              {currentStep + 1} / {totalSteps} Questions
            </div>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{
                width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%`,
              }}
            />
          </div>

          {currentQuestion && (
            <div key={currentQuestion.id}>
              <h3 className="text-base font-medium mb-4 flex gap-2">
                <span className="text-gray-400">Q{currentStep + 1}.</span>
                <span>
                  {currentQuestion.question}
                  {currentQuestion.isMandatory && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </span>
              </h3>
              {renderQuestionInput(currentQuestion)}
            </div>
          )}
        </FormCard>

        <div className="flex justify-between items-center">
          <Button
            label="Previous"
            icon="arrow_back"
            variant="outlined"
            onClick={handlePrev}
            disabled={currentStep === 0}
          />
          <div className="flex gap-2">
            <Button
              label="Save Draft"
              icon="save"
              variant="outlined"
              onClick={handleSaveDraft}
            />
            {currentStep < totalSteps - 1 ? (
              <Button
                label="Next"
                icon="arrow_forward"
                variant="primary"
                onClick={handleNext}
              />
            ) : (
              <Button
                label="Submit"
                icon="send"
                variant="primary"
                onClick={handleSubmitClick}
              />
            )}
          </div>
        </div>
      </div>

      <FormPopup
        visible={showConfirm}
        onHide={() => setShowConfirm(false)}
        title="Confirm Submission"
        size="default"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setShowConfirm(false)}
            />
            <Button label="Submit" variant="primary" onClick={confirmSubmit} />
          </div>
        }
      >
        <div className="flex flex-col gap-3 py-2">
          <p className="text-sm text-gray-700">
            Are you sure you want to submit?
          </p>
          <p className="text-xs text-gray-500">
            You cannot modify your responses after submission.
          </p>
        </div>
      </FormPopup>
    </FormPage>
  );
}
