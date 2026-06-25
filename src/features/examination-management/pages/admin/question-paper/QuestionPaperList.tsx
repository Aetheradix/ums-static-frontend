import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useQuestionPapersQuery } from '../../../queries';
import QuestionPaperForm from '../../../components/QuestionPaperForm';

export default function QuestionPaperList() {
  const { data, isLoading } = useQuestionPapersQuery();
  const [showForm, setShowForm] = useState(false);

  return (
    <FormPage
      title="Question Paper Management"
      description="Add and manage question papers for examinations."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search..."
          toolbar={
            <Button
              label="Add Question Paper"
              icon="plus"
              variant="primary"
              onClick={() => setShowForm(true)}
            />
          }
          columns={[
            { field: 'examType', header: 'Exam Type' },
            { field: 'subject', header: 'Subject' },
            { field: 'course', header: 'Course' },
            { field: 'semester', header: 'Semester' },
            { field: 'year', header: 'Year' },
            {
              header: 'Status',
              cell: (item: Examination.QuestionPaperItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: () => (
                <Button
                  icon="eye"
                  variant="text"
                  tooltip="View/Download"
                  onClick={() => {}}
                />
              ),
            },
          ]}
        />
      </FormCard>
      <FormPopup
        visible={showForm}
        onHide={() => setShowForm(false)}
        title="Add Question Paper"
        subtitle="Upload a new question paper"
      >
        <QuestionPaperForm onClose={() => setShowForm(false)} />
      </FormPopup>
    </FormPage>
  );
}
