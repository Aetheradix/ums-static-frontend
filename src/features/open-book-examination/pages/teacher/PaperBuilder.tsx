import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormPage, FormPopup } from 'shared/new-components';
import { DifficultyBadge, QuestionTypeIcon } from '../../components';
import type { Difficulty, QuestionType } from '../../data';
import { mockExams, mockQuestionPapers, mockQuestions } from '../../data';
import { InfoBanner } from '../../components';

interface SectionBuilder {
  name: string;
  questionIds: number[];
  marksPerQuestion: number;
}

export default function PaperBuilder() {
  const { examId } = useParams();
  const exam = mockExams.find(e => e.id === Number(examId));
  const [sections, setSections] = useState<SectionBuilder[]>([
    { name: 'Part A', questionIds: [], marksPerQuestion: 2 },
    { name: 'Part B', questionIds: [], marksPerQuestion: 5 },
  ]);
  const [totalMarks] = useState(exam?.totalMarks || 50);
  const [showPreview, setShowPreview] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const allQuestions = mockQuestions.filter(
    q => q.subjectId === (exam?.courseId || 1)
  );
  const filtered =
    typeFilter === 'all'
      ? allQuestions
      : allQuestions.filter(q => q.type === typeFilter);

  const addToSection = (sectionIdx: number, questionId: number) => {
    const updated = [...sections];
    if (!updated[sectionIdx].questionIds.includes(questionId)) {
      updated[sectionIdx].questionIds.push(questionId);
      setSections(updated);
    }
  };

  const removeFromSection = (sectionIdx: number, questionId: number) => {
    const updated = [...sections];
    updated[sectionIdx].questionIds = updated[sectionIdx].questionIds.filter(
      id => id !== questionId
    );
    setSections(updated);
  };

  const calcTotal = () =>
    sections.reduce(
      (sum, s) => sum + s.questionIds.length * s.marksPerQuestion,
      0
    );

  const savePaper = () => {
    const blooms: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };
    sections.forEach(s =>
      s.questionIds.forEach(id => {
        const q = allQuestions.find(x => x.id === id);
        if (q) blooms[q.bloomLevel] = (blooms[q.bloomLevel] || 0) + 1;
      })
    );
    mockQuestionPapers.push({
      id: Math.max(...mockQuestionPapers.map(p => p.id)) + 1,
      examId: Number(examId),
      examTitle: exam?.title || '',
      subjectName: exam?.subjectName || '',
      totalMarks: calcTotal(),
      sections: sections.map(s => ({
        ...s,
        totalMarks: s.questionIds.length * s.marksPerQuestion,
      })),
      status: 'draft',
      bloomDistribution: blooms,
      createdAt: new Date().toISOString(),
    });
    setShowPreview(true);
  };

  return (
    <FormPage
      title={`Build Question Paper${exam ? ` — ${exam.title}` : ''}`}
      description="Select and arrange questions for the paper"
    >
      <InfoBanner
        title="About Paper Builder"
        message="Assemble the exam paper by selecting questions from the bank. Define sections, assign marks, and configure question randomization."
      />
      <div className="flex gap-6">
        <div className="w-1/3">
          <FormCard
            title="Question Bank"
            headerAction={
              <DropDownList
                value={typeFilter}
                onChange={v => setTypeFilter(v as string)}
                data={[
                  { value: 'all', label: 'All' },
                  ...[
                    'mcq',
                    'true_false',
                    'short_answer',
                    'long_answer',
                    'case_study',
                    'coding',
                  ].map(t => ({ value: t, label: t.replace(/_/g, ' ') })),
                ]}
                textField="label"
                valueField="value"
              />
            }
          >
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {filtered.map(q => (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 text-xs border-b"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <QuestionTypeIcon type={q.type as QuestionType} />
                    <span className="truncate">{q.questionText}</span>
                    <span className="font-mono ml-auto">({q.marks} marks)</span>
                    <DifficultyBadge level={q.difficulty as Difficulty} />
                  </div>
                </div>
              ))}
            </div>
          </FormCard>
        </div>
        <div className="w-2/3">
          <FormCard
            title="Paper Layout"
            headerAction={
              <div className="flex gap-2 items-center text-sm">
                <span>
                  Total: <strong>{calcTotal()}</strong>/{totalMarks} marks
                </span>
                <Button
                  label="Preview"
                  icon="visibility"
                  variant="outlined"
                  onClick={() => setShowPreview(true)}
                />
                <Button label="Save Paper" icon="save" onClick={savePaper} />
              </div>
            }
          >
            <div className="space-y-4">
              {sections.map((section, si) => (
                <div key={si} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TextBox
                      value={section.name}
                      onChange={v => {
                        const u = [...sections];
                        u[si].name = v;
                        setSections(u);
                      }}
                      className="w-40"
                    />
                    <span className="text-xs text-gray-500">
                      {section.questionIds.length} questions ×{' '}
                      {section.marksPerQuestion} marks ={' '}
                      {section.questionIds.length * section.marksPerQuestion}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filtered
                      .filter(q => !section.questionIds.includes(q.id))
                      .map(q => (
                        <button
                          key={q.id}
                          onClick={() => addToSection(si, q.id)}
                          className="px-2 py-1 text-xs border rounded hover:bg-blue-50"
                        >
                          + #{q.id}
                        </button>
                      ))}
                  </div>
                  <div className="mt-2 space-y-1">
                    {section.questionIds.map(qid => {
                      const q = allQuestions.find(x => x.id === qid);
                      return q ? (
                        <div
                          key={qid}
                          className="flex items-center justify-between p-1 text-xs bg-blue-50 rounded"
                        >
                          <span className="truncate">
                            #{qid} {q.questionText}
                          </span>
                          <button
                            onClick={() => removeFromSection(si, qid)}
                            className="text-red-500 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
              <Button
                label="+ Add Section"
                icon="add"
                variant="outlined"
                onClick={() =>
                  setSections([
                    ...sections,
                    {
                      name: `Part ${String.fromCharCode(65 + sections.length)}`,
                      questionIds: [],
                      marksPerQuestion: 5,
                    },
                  ])
                }
              />
            </div>
          </FormCard>
        </div>
      </div>
      {showPreview && (
        <FormPopup
          visible
          onHide={() => setShowPreview(false)}
          title="Question Paper Preview"
          size="xl"
        >
          {sections.map((s, i) => (
            <div key={i} className="mb-4">
              <h4 className="font-bold border-b pb-1 mb-2">
                {s.name} ({s.questionIds.length * s.marksPerQuestion} marks)
              </h4>
              {s.questionIds.map((qid, j) => {
                const q = allQuestions.find(x => x.id === qid);
                return q ? (
                  <div key={qid} className="mb-2 text-sm">
                    <span className="font-medium">{j + 1}.</span>{' '}
                    {q.questionText}
                    <span className="text-gray-400 ml-2">
                      [{q.marks} marks] [L{q.bloomLevel}]
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          ))}
          <div className="text-right text-sm text-gray-500 border-t pt-2">
            Total Marks: {calcTotal()}
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
