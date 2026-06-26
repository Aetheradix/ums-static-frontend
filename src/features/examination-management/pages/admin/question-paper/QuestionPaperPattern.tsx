import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useQuestionPaperPatternsQuery } from '../../../queries';
import QuestionPaperPatternForm from '../../../components/QuestionPaperPatternForm';

export default function QuestionPaperPattern() {
  const { data, isLoading } = useQuestionPaperPatternsQuery();
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
      title="Question Paper Patterns"
      description="Define question paper patterns with MCQ/Short/Long distribution."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search..."
          toolbar={
            <Button
              label="New Pattern"
              icon="plus"
              variant="primary"
              onClick={() => setShowForm(true)}
            />
          }
          columns={[
            { field: 'subject', header: 'Subject' },
            { field: 'totalMarks', header: 'Total Marks' },
            { field: 'mcq', header: 'MCQ Marks' },
            { field: 'short', header: 'Short Answer' },
            { field: 'long', header: 'Long Answer' },
            {
              header: 'Status',
              cell: (item: Examination.QuestionPaperPatternItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.QuestionPaperPatternItem) => (
                <Button
                  icon="pencil"
                  variant="text"
                  tooltip="Edit"
                  onClick={() => handleEdit(item.id)}
                />
              ),
            },
          ]}
        />
      </FormCard>
      <FormPopup
        visible={showForm}
        onHide={handleClose}
        title={editId ? 'Edit Pattern' : 'New Pattern'}
        subtitle={
          editId
            ? 'Modify question paper pattern details'
            : 'Define question paper pattern'
        }
      >
        <QuestionPaperPatternForm id={editId} onClose={handleClose} />
      </FormPopup>
    </FormPage>
  );
}
