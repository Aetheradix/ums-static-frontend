import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import type { BloomLevel, Difficulty, QuestionType } from '../../data';
import { mockQuestions, mockSubjects } from '../../data';
import { InfoBanner } from '../../components';

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'mcq', label: 'Multiple Choice (MCQ)' },
  { value: 'true_false', label: 'True / False' },
  { value: 'fill_blanks', label: 'Fill in Blanks' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'long_answer', label: 'Long Answer' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'coding', label: 'Coding' },
  { value: 'matching', label: 'Matching' },
  { value: 'assertion_reason', label: 'Assertion-Reason' },
];

const bloomOptions = [
  { value: '1', label: 'L1 - Remember' },
  { value: '2', label: 'L2 - Understand' },
  { value: '3', label: 'L3 - Apply' },
  { value: '4', label: 'L4 - Analyze' },
  { value: '5', label: 'L5 - Evaluate' },
  { value: '6', label: 'L6 - Create' },
];

export default function QuestionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const existing = isEdit ? mockQuestions.find(q => q.id === Number(id)) : null;

  const [form, setForm] = useState({
    subjectId: existing?.subjectId || 1,
    type: existing?.type || ('mcq' as QuestionType),
    questionText: existing?.questionText || '',
    options: existing?.options || ['', '', '', ''],
    correctAnswer: existing?.correctAnswer || '0',
    marks: existing?.marks || 5,
    bloomLevel: existing?.bloomLevel || (2 as BloomLevel),
    difficulty: existing?.difficulty || ('medium' as Difficulty),
    topic: existing?.topic || '',
    status: existing?.status || ('active' as 'active' | 'inactive'),
  });

  const handleSave = () => {
    if (isEdit && existing) {
      Object.assign(existing, form);
    } else {
      mockQuestions.push({
        id: Math.max(...mockQuestions.map(q => q.id)) + 1,
        ...form,
        subjectName:
          mockSubjects.find(s => s.id === form.subjectId)?.name || '',
        mediaUrls: [],
        usageCount: 0,
        createdBy: 2,
        createdByName: 'Dr. Sharma',
        createdAt: new Date().toISOString().split('T')[0],
        version: 1,
      });
    }
    navigate('/open-book-examination/teacher/question-bank');
  };

  return (
    <FormPage
      title={isEdit ? 'Edit Question' : 'Create Question'}
      description="Add a new question to the bank"
    >
      <InfoBanner
        title="About Question Creation"
        message="Design individual questions for the question bank. Provide the question text, options (if applicable), marks, and define the correct answers."
      />
      <FormCard>
        <FormGrid>
          <DropDownList
            label="Subject"
            value={String(form.subjectId)}
            onChange={v => setForm({ ...form, subjectId: Number(v) })}
            data={mockSubjects
              .filter(s => s.isActive)
              .map(s => ({ value: String(s.id), label: s.name }))}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="Question Type"
            value={form.type}
            onChange={v => setForm({ ...form, type: v as QuestionType })}
            data={questionTypes}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="Bloom's Level"
            value={String(form.bloomLevel)}
            onChange={v =>
              setForm({ ...form, bloomLevel: Number(v) as BloomLevel })
            }
            data={bloomOptions}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="Difficulty"
            value={form.difficulty}
            onChange={v => setForm({ ...form, difficulty: v as Difficulty })}
            data={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
              { value: 'expert', label: 'Expert' },
            ]}
            textField="label"
            valueField="value"
          />
          <NumberBox
            label="Marks"
            value={form.marks}
            onChange={v => setForm({ ...form, marks: v ?? 0 })}
            min={1}
            max={50}
          />
          <TextBox
            label="Topic"
            value={form.topic}
            onChange={v => setForm({ ...form, topic: v })}
          />
        </FormGrid>
      </FormCard>
      <FormCard title="Question Details" className="mt-4">
        <TextArea
          label="Question Text"
          value={form.questionText}
          onChange={v => setForm({ ...form, questionText: v })}
          required
          rows={4}
        />
        {form.type === 'mcq' && (
          <div className="space-y-2 mt-3">
            {form.options?.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={form.correctAnswer === String(i)}
                  onChange={() =>
                    setForm({ ...form, correctAnswer: String(i) })
                  }
                />
                <TextBox
                  value={opt}
                  onChange={v => {
                    const opts = [...(form.options || [])];
                    opts[i] = v;
                    setForm({ ...form, options: opts });
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                />
              </div>
            ))}
          </div>
        )}
        {form.type === 'true_false' && (
          <div className="flex gap-4 mt-3">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="tf"
                checked={form.correctAnswer === 'true'}
                onChange={() => setForm({ ...form, correctAnswer: 'true' })}
              />{' '}
              True
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="tf"
                checked={form.correctAnswer === 'false'}
                onChange={() => setForm({ ...form, correctAnswer: 'false' })}
              />{' '}
              False
            </label>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() =>
              navigate('/open-book-examination/teacher/question-bank')
            }
          />
          <Button
            label={isEdit ? 'Update Question' : 'Create Question'}
            icon="save"
            onClick={handleSave}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
