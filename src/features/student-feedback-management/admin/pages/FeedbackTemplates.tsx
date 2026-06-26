import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type FeedbackTemplate,
  type FeedbackQuestion,
  feedbackTemplates as initialData,
  feedbackQuestions as allQuestions,
} from '../../data';
import { feedbackUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: FeedbackTemplate };

type PreviewState =
  | { mode: 'closed' }
  | { mode: 'preview'; item: FeedbackTemplate };

const EMPTY_FORM = { name: '', status: 'Draft' as FeedbackTemplate['status'] };

const getQuestionsForTemplate = (templateId: string): FeedbackQuestion[] =>
  allQuestions.filter(q => q.templateId === templateId);

export default function FeedbackTemplates() {
  const [data, setData] = useState<FeedbackTemplate[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [preview, setPreview] = useState<PreviewState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);
  const closePreview = useCallback(() => setPreview({ mode: 'closed' }), []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };
  const openEdit = (item: FeedbackTemplate) => {
    setForm({ name: item.name, status: item.status });
    setPopup({ mode: 'edit', item });
  };
  const openPreview = (item: FeedbackTemplate) =>
    setPreview({ mode: 'preview', item });

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: FeedbackTemplate = {
        id: String(Date.now()),
        name: form.name,
        questionCount: 0,
        version: 1,
        status: 'Draft',
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Template created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(t =>
          t.id === popup.item.id
            ? {
                ...t,
                name: form.name,
                status: form.status,
                lastUpdated: new Date().toISOString().split('T')[0],
              }
            : t
        )
      );
      ToastService.success('Template updated successfully.');
    }
    closePopup();
  };

  const handlePublish = (item: FeedbackTemplate) => {
    setData(prev =>
      prev.map(t =>
        t.id === item.id
          ? {
              ...t,
              status: 'Published' as const,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : t
      )
    );
    ToastService.success('Template published successfully.');
  };

  return (
    <FormPage
      title="Feedback Templates"
      description="Create and manage reusable question templates for feedback sessions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Feedback Management', to: feedbackUrls.portal },
        { label: 'Admin Portal', to: feedbackUrls.admin.portal },
        { label: 'Templates' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search templates..."
          toolbar={
            <Button
              label="Create Template"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          columns={[
            { field: 'name', header: 'Template Name' },
            { field: 'questionCount', header: '# Questions' },
            { field: 'version', header: 'Version' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: FeedbackTemplate) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Published'
                      ? 'approved'
                      : item.status === 'Draft'
                        ? 'pending'
                        : 'rejected'
                  }
                />
              ),
            },
            { field: 'lastUpdated', header: 'Last Updated' },
            {
              header: 'Actions',
              width: '250px',
              cell: (item: FeedbackTemplate) => (
                <div className="flex gap-1">
                  <Button
                    icon="pencil"
                    label="Edit"
                    variant="outlined"
                    size="small"
                    onClick={() => openEdit(item)}
                  />
                  <Button
                    icon="file"
                    label="Preview"
                    variant="outlined"
                    size="small"
                    onClick={() => openPreview(item)}
                  />
                  {item.status === 'Draft' && (
                    <Button
                      icon="send"
                      label="Publish"
                      variant="outlined"
                      size="small"
                      onClick={() => handlePublish(item)}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {(popup.mode === 'create' || popup.mode === 'edit') && (
        <FormPopup
          visible
          onHide={closePopup}
          title={popup.mode === 'create' ? 'Create Template' : 'Edit Template'}
          subtitle="Fill in the template details."
          size="lg"
        >
          <FormGrid columns={2}>
            <TextBox
              label="Template Name"
              placeholder="e.g. Faculty Feedback Template"
              value={form.name}
              onChange={v => setForm(f => ({ ...f, name: v }))}
              required
            />
            {popup.mode === 'edit' && (
              <DropDownList
                label="Status"
                data={[
                  { name: 'Draft', value: 'Draft' },
                  { name: 'Published', value: 'Published' },
                  { name: 'Archived', value: 'Archived' },
                ]}
                textField="name"
                optionValue="value"
                value={form.status}
                onChange={v =>
                  setForm(f => ({
                    ...f,
                    status: String(v ?? 'Draft') as FeedbackTemplate['status'],
                  }))
                }
              />
            )}
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button label="Save" variant="primary" onClick={handleSave} />
          </div>
        </FormPopup>
      )}

      {preview.mode === 'preview' && (
        <FormPopup
          visible
          onHide={closePreview}
          title={`Preview: ${preview.item.name}`}
          subtitle={`${preview.item.questionCount} questions assigned`}
          size="xl"
        >
          {(() => {
            const questions = getQuestionsForTemplate(preview.item.id);
            return (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Version: </span>
                    <span className="font-medium">{preview.item.version}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status: </span>
                    <StatusBadge
                      label={preview.item.status}
                      variant={
                        preview.item.status === 'Published'
                          ? 'approved'
                          : preview.item.status === 'Draft'
                            ? 'pending'
                            : 'rejected'
                      }
                    />
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated: </span>
                    <span className="font-medium">
                      {preview.item.lastUpdated}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Questions: </span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Questions
                  </h4>
                  {questions.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {questions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-semibold text-gray-400 mt-0.5 min-w-5">
                              {idx + 1}.
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">
                                {q.question}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                                  {q.questionType}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                  {q.category}
                                </span>
                                {q.isMandatory && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
                                    Mandatory
                                  </span>
                                )}
                                {q.questionType === 'Rating' && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
                                    {q.ratingScale}-point
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-sm text-center py-6 bg-gray-50 rounded-lg">
                      No questions in this template. Add questions from the
                      Question Bank.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Close" variant="outlined" onClick={closePreview} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
