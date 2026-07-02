import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { ToastService } from 'services';
import { learningUrls } from '../../urls';

const INITIAL_QUESTIONS = [
  {
    id: 1,
    course: 'B.Tech Computer Science',
    type: 'Multiple Choice',
    difficulty: 'Easy',
    question: 'Which keyword is used to allocate memory dynamically in C++?',
  },
  {
    id: 2,
    course: 'B.Tech Computer Science',
    type: 'Multiple Choice',
    difficulty: 'Medium',
    question: 'What is the size of double data type in C++?',
  },
  {
    id: 3,
    course: 'B.Tech Computer Science',
    type: 'Descriptive',
    difficulty: 'Hard',
    question:
      'Explain the diamond problem in C++ and how virtualization solves it.',
  },
];

export default function QuestionBank() {
  const [data] = useState(INITIAL_QUESTIONS);
  const [popup, setPopup] = useState<{ mode: 'closed' | 'create' }>({
    mode: 'closed',
  });

  const handleSave = () => {
    ToastService.success('Question added to Bank.');
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Question Bank"
      description="Manage institutional database of quiz and exam questions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Teacher Portal', to: learningUrls.teacher.portal },
        { label: 'Assessment Management', to: learningUrls.teacher.assessment },
        { label: 'Question Bank' },
      ]}
    >
      <div className="flex justify-end mb-4">
        <Button
          label="Add New Question"
          icon="plus"
          variant="primary"
          onClick={() => setPopup({ mode: 'create' })}
        />
      </div>

      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          columns={[
            { field: 'course', header: 'Course' },
            { field: 'type', header: 'Question Type' },
            { field: 'difficulty', header: 'Difficulty' },
            { field: 'question', header: 'Question Text' },
          ]}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'create'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Add Question"
      >
        <div className="grid grid-cols-1 gap-4">
          <DropDownList
            label="Course"
            data={[
              { label: 'B.Tech Computer Science', value: 'BTECH' },
              { label: 'Bachelor of Computer Applications', value: 'BCA' },
            ]}
            textField="label"
            required
          />
          <DropDownList
            label="Question Type"
            data={[
              { label: 'Multiple Choice', value: 'MCQ' },
              { label: 'Descriptive', value: 'Descriptive' },
            ]}
            textField="label"
            required
          />
          <DropDownList
            label="Difficulty"
            data={[
              { label: 'Easy', value: 'Easy' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Hard', value: 'Hard' },
            ]}
            textField="label"
            required
          />
          <TextBox label="Question Text" required />
          <Button
            label="Save Question"
            variant="primary"
            className="w-full mt-2"
            onClick={handleSave}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
