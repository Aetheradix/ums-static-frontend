import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox, TextBox, TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import {
  feedbackSessions,
  feedbackQuestions,
  feedbackAssignments,
} from '../../data';

export default function StudentFeedbackForm() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const session = feedbackSessions.find(s => s.id === sessionId);
  const questions = feedbackQuestions.filter(
    q => q.templateId === session?.templateId
  );
  const assignment = feedbackAssignments.find(
    a => a.templateId === session?.templateId
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {}
  );

  if (!session) {
    return (
      <FormPage title="Not Found" breadcrumbs={[]}>
        <FormCard>Session not found.</FormCard>
      </FormPage>
    );
  }

  const totalSteps = questions.length;
  const progress =
    totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;
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
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => updateResponse(questionId, String(star))}
            className={`text-2xl cursor-pointer transition-colors ${star <= val ? 'text-yellow-400' : 'text-gray-200'} hover:text-yellow-400`}
          >
            ★
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
            placeholder="Enter your detailed answer..."
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

  const handleNext = () => {
    if (currentQuestion?.isMandatory) {
      const val = responses[currentQuestion.id];
      if (!val || (Array.isArray(val) && val.length === 0)) {
        ToastService.error(`Please answer: "${currentQuestion.question}"`);
        return;
      }
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSubmit = () => {
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
    ToastService.success('Feedback submitted successfully. Thank you!');
    navigate('/student-feedback-management/student');
  };

  return (
    <FormPage
      title={session.sessionName}
      description="Answer the following questions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Student Feedback',
          to: '/student-feedback-management/student',
        },
        { label: 'Form' },
      ]}
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <FormCard>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              {assignment && (
                <>
                  {assignment.course} · {assignment.faculty}
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {totalSteps}
            </div>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {currentQuestion && (
            <div key={currentQuestion.id}>
              <h3 className="text-base font-medium mb-4 flex gap-2">
                <span>{currentStep + 1}.</span>
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

        <div className="flex justify-between">
          <Button
            label="Previous"
            icon="arrow_back"
            variant="outlined"
            onClick={handlePrev}
            disabled={currentStep === 0}
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
              onClick={handleSubmit}
            />
          )}
        </div>
      </div>
    </FormPage>
  );
}
