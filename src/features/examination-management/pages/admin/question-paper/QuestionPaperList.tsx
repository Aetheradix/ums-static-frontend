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
  const [editId, setEditId] = useState<number | undefined>(undefined);

  const handleEdit = (id: number) => {
    setEditId(id);
    setShowForm(true);
  };

  const handleClose = () => {
    setEditId(undefined);
    setShowForm(false);
  };

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
              cell: (item: Examination.QuestionPaperItem) => (
                <div className="flex gap-2">
                  <Button
                    icon="pencil"
                    variant="text"
                    tooltip="Edit"
                    onClick={() => handleEdit(item.id)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
      <FormPopup
        visible={showForm}
        onHide={handleClose}
        title={editId ? 'Edit Question Paper' : 'Add Question Paper'}
        subtitle={
          editId
            ? 'Modify question paper details'
            : 'Upload a new question paper'
        }
      >
        <QuestionPaperForm id={editId} onClose={handleClose} />
      </FormPopup>
    </FormPage>
  );
}
