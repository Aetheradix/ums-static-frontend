import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox, DropDownList, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type FeedbackQuestion,
  feedbackQuestions as initialQuestions,
  feedbackTemplates,
} from '../../data';
import { feedbackUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create'; templateId?: string }
  | { mode: 'edit'; item: FeedbackQuestion }
  | { mode: 'view'; item: FeedbackQuestion }
  | { mode: 'clone'; item: FeedbackQuestion };

const QUESTION_TYPE_OPTIONS = [
  { name: 'Rating (1-5)', value: 'Rating' },
  { name: 'Yes/No', value: 'Yes/No' },
  { name: 'Text', value: 'Text' },
  { name: 'Paragraph', value: 'Paragraph' },
  { name: 'MCQ', value: 'MCQ' },
];

const CATEGORY_OPTIONS = [
  { name: 'Teaching', value: 'Teaching' },
  { name: 'Curriculum', value: 'Curriculum' },
  { name: 'Course Delivery', value: 'Course Delivery' },
  { name: 'Infrastructure', value: 'Infrastructure' },
  { name: 'Facilities', value: 'Facilities' },
  { name: 'Library', value: 'Library' },
  { name: 'Discipline', value: 'Discipline' },
  { name: 'General', value: 'General' },
];

const EMPTY_FORM = {
  question: '',
  category: '',
  questionType: '' as FeedbackQuestion['questionType'] | '',
  optionsText: '',
  ratingScale: 5,
  isMandatory: false,
  templateId: '',
  status: 'Active' as FeedbackQuestion['status'],
};

const templateOptions = feedbackTemplates
  .filter(t => t.status !== 'Archived')
  .map(t => ({ name: t.name, value: t.id }));

export default function QuestionBank() {
  const [data, setData] = useState<FeedbackQuestion[]>(initialQuestions);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm({
      ...EMPTY_FORM,
      templateId: templateOptions[0]?.value ?? '',
      category: CATEGORY_OPTIONS[0].value,
      questionType: 'Rating',
    });
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: FeedbackQuestion) => {
    setForm({
      question: item.question,
      category: item.category,
      questionType: item.questionType,
      optionsText: item.options.join('\n'),
      ratingScale: item.ratingScale,
      isMandatory: item.isMandatory,
      templateId: item.templateId,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const openClone = (item: FeedbackQuestion) => {
    setForm({
      question: item.question,
      category: item.category,
      questionType: item.questionType,
      optionsText: item.options.join('\n'),
      ratingScale: item.ratingScale,
      isMandatory: item.isMandatory,
      templateId: item.templateId,
      status: 'Active',
    });
    setPopup({ mode: 'clone', item });
  };

  const handleSave = () => {
    const options = form.optionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const qType = (form.questionType ||
      'Text') as FeedbackQuestion['questionType'];

    if (popup.mode === 'create' || popup.mode === 'clone') {
      const newItem: FeedbackQuestion = {
        id: String(Date.now()),
        templateId: form.templateId,
        question: form.question,
        category: form.category || 'General',
        questionType: qType,
        options:
          qType === 'Rating' ||
          qType === 'Yes/No' ||
          qType === 'Text' ||
          qType === 'Paragraph'
            ? []
            : options,
        ratingScale: form.ratingScale,
        isMandatory: form.isMandatory,
        status: 'Active',
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Question created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(q =>
          q.id === popup.item.id
            ? {
                ...q,
                templateId: form.templateId,
                question: form.question,
                category: form.category || 'General',
                questionType: qType,
                options:
                  qType === 'Rating' ||
                  qType === 'Yes/No' ||
                  qType === 'Text' ||
                  qType === 'Paragraph'
                    ? []
                    : options,
                ratingScale: form.ratingScale,
                isMandatory: form.isMandatory,
                status: form.status,
              }
            : q
        )
      );
      ToastService.success('Question updated successfully.');
    }
    closePopup();
  };

  const handleArchive = (item: FeedbackQuestion) => {
    setData(prev =>
      prev.map(q =>
        q.id === item.id ? { ...q, status: 'Archived' as const } : q
      )
    );
    ToastService.success('Question archived successfully.');
  };

  const getTemplateTitle = (tid: string) =>
    feedbackTemplates.find(t => t.id === tid)?.name ?? '—';
  const isOptionType = (t: string) => t === 'MCQ' || t === 'Yes/No';

  return (
    <FormPage
      title="Question Bank"
      description="Manage questions, categories, and answer types for feedback templates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Feedback Management', to: feedbackUrls.portal },
        { label: 'Admin Portal', to: feedbackUrls.admin.portal },
        { label: 'Question Bank' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search questions..."
          toolbar={
            <Button
              label="Add Question"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          columns={[
            {
              field: 'question',
              header: 'Question',
              cell: (item: FeedbackQuestion) => (
                <span className="text-sm">
                  {item.question.length > 50
                    ? `${item.question.slice(0, 50)}...`
                    : item.question}
                </span>
              ),
            },
            { field: 'category', header: 'Category' },
            { field: 'questionType', header: 'Type' },
            {
              field: 'ratingScale',
              header: 'Scale',
              cell: (item: FeedbackQuestion) => (
                <span className="text-sm">
                  {item.questionType === 'Rating'
                    ? `${item.ratingScale}-point`
                    : '—'}
                </span>
              ),
            },
            {
              header: 'Mandatory',
              cell: (item: FeedbackQuestion) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isMandatory ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500'}`}
                >
                  {item.isMandatory ? 'Yes' : 'No'}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (item: FeedbackQuestion) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              width: '200px',
              cell: (item: FeedbackQuestion) => (
                <div className="flex gap-1">
                  <Button
                    icon="eye"
                    label="View"
                    variant="outlined"
                    size="small"
                    onClick={() => setPopup({ mode: 'view', item })}
                  />
                  {item.status === 'Active' && (
                    <Button
                      icon="pencil"
                      label="Edit"
                      variant="outlined"
                      size="small"
                      onClick={() => openEdit(item)}
                    />
                  )}
                  <Button
                    icon="copy"
                    label="Clone"
                    variant="outlined"
                    size="small"
                    onClick={() => openClone(item)}
                  />
                  {item.status === 'Active' && (
                    <Button
                      icon="archive"
                      label="Archive"
                      variant="outlined"
                      size="small"
                      onClick={() => handleArchive(item)}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {(popup.mode === 'create' ||
        popup.mode === 'edit' ||
        popup.mode === 'clone') && (
        <FormPopup
          visible
          onHide={closePopup}
          title={
            popup.mode === 'create'
              ? 'Add Question'
              : popup.mode === 'edit'
                ? 'Edit Question'
                : 'Clone Question'
          }
          subtitle="Fill in the question details."
          size="lg"
        >
          <FormGrid columns={2}>
            <DropDownList
              label="Template"
              data={templateOptions}
              textField="name"
              optionValue="value"
              value={form.templateId}
              onChange={v =>
                setForm(f => ({ ...f, templateId: String(v ?? '') }))
              }
              required
            />
            <DropDownList
              label="Category"
              data={CATEGORY_OPTIONS}
              textField="name"
              optionValue="value"
              value={form.category}
              onChange={v =>
                setForm(f => ({ ...f, category: String(v ?? '') }))
              }
              required
            />
            <DropDownList
              label="Question Type"
              data={QUESTION_TYPE_OPTIONS}
              textField="name"
              optionValue="value"
              value={form.questionType}
              onChange={v =>
                setForm(f => ({
                  ...f,
                  questionType: String(
                    v ?? ''
                  ) as FeedbackQuestion['questionType'],
                }))
              }
              required
            />
            {form.questionType === 'Rating' && (
              <DropDownList
                label="Rating Scale"
                data={[
                  { name: '1-5', value: 5 },
                  { name: '1-10', value: 10 },
                ]}
                textField="name"
                optionValue="value"
                value={form.ratingScale}
                onChange={v =>
                  setForm(f => ({ ...f, ratingScale: Number(v) || 5 }))
                }
              />
            )}
            {form.status && popup.mode === 'edit' && (
              <DropDownList
                label="Status"
                data={[
                  { name: 'Active', value: 'Active' },
                  { name: 'Archived', value: 'Archived' },
                ]}
                textField="name"
                optionValue="value"
                value={form.status}
                onChange={v =>
                  setForm(f => ({
                    ...f,
                    status: String(v ?? 'Active') as FeedbackQuestion['status'],
                  }))
                }
              />
            )}
            <div className="col-span-2">
              <TextArea
                label="Question"
                placeholder="Enter the question text"
                value={form.question}
                onChange={v => setForm(f => ({ ...f, question: v }))}
                required
              />
            </div>
            {isOptionType(form.questionType) && (
              <div className="col-span-2">
                <TextArea
                  label="Options (one per line)"
                  placeholder="Option 1\nOption 2\nOption 3"
                  value={form.optionsText}
                  onChange={v => setForm(f => ({ ...f, optionsText: v }))}
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Checkbox
                label="Response Mandatory"
                checked={form.isMandatory}
                onChange={v => setForm(f => ({ ...f, isMandatory: v }))}
              />
            </div>
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button label="Save" variant="primary" onClick={handleSave} />
          </div>
        </FormPopup>
      )}

      {popup.mode === 'view' && (
        <FormPopup
          visible
          onHide={closePopup}
          title="View Question"
          subtitle="Question details."
          size="lg"
        >
          {(() => {
            const item = popup.item;
            return (
              <FormGrid columns={2}>
                <div>
                  <label className="form-field-label">Template</label>
                  <p className="text-sm font-medium mt-1">
                    {getTemplateTitle(item.templateId)}
                  </p>
                </div>
                <div>
                  <label className="form-field-label">Category</label>
                  <p className="text-sm font-medium mt-1">{item.category}</p>
                </div>
                <div>
                  <label className="form-field-label">Type</label>
                  <p className="text-sm font-medium mt-1">
                    {item.questionType}
                  </p>
                </div>
                {item.questionType === 'Rating' && (
                  <div>
                    <label className="form-field-label">Scale</label>
                    <p className="text-sm font-medium mt-1">
                      {item.ratingScale}-point
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="form-field-label">Question</label>
                  <p className="text-sm font-medium mt-1">{item.question}</p>
                </div>
                {item.options.length > 0 && (
                  <div className="col-span-2">
                    <label className="form-field-label">Options</label>
                    <ul className="list-disc list-inside text-sm mt-1 text-gray-700">
                      {item.options.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <label className="form-field-label">Mandatory</label>
                  <p className="text-sm font-medium mt-1">
                    {item.isMandatory ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <label className="form-field-label">Status</label>
                  <p className="text-sm font-medium mt-1">{item.status}</p>
                </div>
              </FormGrid>
            );
          })()}
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Close" variant="outlined" onClick={closePopup} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
