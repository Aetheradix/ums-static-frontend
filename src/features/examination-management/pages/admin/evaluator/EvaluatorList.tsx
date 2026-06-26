import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useEvaluatorsQuery } from '../../../queries';
import EvaluatorForm from '../../../components/EvaluatorForm';

export default function EvaluatorList() {
  const { data, isLoading } = useEvaluatorsQuery();
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
      title="Evaluator Management"
      description="Manage evaluators for answer sheet evaluation."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search evaluators..."
          toolbar={
            <Button
              label="Add Evaluator"
              icon="plus"
              variant="primary"
              onClick={() => setShowForm(true)}
            />
          }
          columns={[
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'role', header: 'Role' },
            { field: 'qualification', header: 'Qualification' },
            { field: 'subjects', header: 'Subjects Assigned' },
            {
              header: 'Status',
              cell: (item: Examination.EvaluatorItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.EvaluatorItem) => (
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
        title={editId ? 'Edit Evaluator' : 'Add Evaluator'}
        subtitle={
          editId ? 'Modify evaluator details' : 'Register a new evaluator'
        }
      >
        <EvaluatorForm id={editId} onClose={handleClose} />
      </FormPopup>
    </FormPage>
  );
}
