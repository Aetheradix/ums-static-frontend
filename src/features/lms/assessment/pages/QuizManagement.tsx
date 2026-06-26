import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { DropDownList, TextBox } from 'shared/components/forms';
import { ToastService } from 'services';

const MOCK_DATA = [
  {
    id: 1,
    course: 'BCA',
    module: 'Programming Basics',
    quizName: 'C# Basics Quiz 1',
    totalMarks: 10,
    passingMarks: 5,
  },
];

export default function QuizManagement() {
  const [data] = useState(MOCK_DATA);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [questions, setQuestions] = useState<any[]>([
    { id: 1, text: '', options: '' },
  ]);

  const closePopup = () => {
    setPopup({ mode: 'closed' });
    setQuestions([{ id: 1, text: '', options: '' }]);
  };

  const handleSave = () => {
    ToastService.success(
      `Quiz ${popup.mode === 'create' ? 'created' : 'updated'} successfully`
    );
    closePopup();
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', options: '' }]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <FormPage
      title="Quiz Management"
      description="Create and manage quizzes for modules."
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          onEdit={item => {
            setPopup({ mode: 'edit', item });
            // Pre-fill a mock question for demonstration
            setQuestions([
              {
                id: 1,
                text: 'Q1. C# me int kis type ka datatype hai?',
                options: 'Value Type, Reference Type',
              },
            ]);
          }}
          columns={[
            { field: 'course', header: 'Course' },
            { field: 'module', header: 'Module' },
            { field: 'quizName', header: 'Quiz Name' },
            { field: 'totalMarks', header: 'Total Marks' },
            { field: 'passingMarks', header: 'Passing Marks' },
          ]}
          toolbar={
            <Button
              label="Create Quiz"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={popup.mode === 'create' ? 'Create Quiz' : 'Edit Quiz'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropDownList
            label="Course"
            defaultValue={popup.item?.course}
            textField="label"
            data={[{ label: 'BCA', value: 'BCA' }]}
            required
          />
          <DropDownList
            label="Module"
            defaultValue={popup.item?.module}
            textField="label"
            data={[
              { label: 'Programming Basics', value: 'Programming Basics' },
            ]}
            required
          />
          <div className="md:col-span-2">
            <TextBox
              label="Quiz Name"
              defaultValue={popup.item?.quizName}
              required
            />
          </div>
          <TextBox
            label="Total Marks"
            type="number"
            defaultValue={popup.item?.totalMarks}
            required
          />
          <TextBox
            label="Passing Marks"
            type="number"
            defaultValue={popup.item?.passingMarks}
            required
          />
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Questions</h4>
            <Button
              label="Add More"
              variant="outlined"
              icon="plus"
              size="small"
              onClick={addQuestion}
            />
          </div>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="p-4 border rounded bg-gray-50 flex flex-col gap-2 relative"
              >
                <div className="absolute top-2 right-2">
                  <Button
                    icon="trash"
                    variant="danger"
                    size="small"
                    onClick={() => removeQuestion(q.id)}
                  />
                </div>
                <TextBox
                  label={`Question ${index + 1}`}
                  defaultValue={q.text}
                  required
                />
                <TextBox
                  label="Options (Comma separated)"
                  defaultValue={q.options}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save Quiz" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
