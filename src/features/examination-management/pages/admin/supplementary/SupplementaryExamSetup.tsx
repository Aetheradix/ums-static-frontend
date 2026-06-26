import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useSupplementarySetupsQuery } from '../../../queries';
import SupplementarySessionForm from '../../../components/SupplementarySessionForm';

export default function SupplementaryExamSetup() {
  const { data, isLoading } = useSupplementarySetupsQuery();
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
      title="Supplementary Exam Setup"
      description="Configure rules and parameters for supplementary/backlog examination sessions."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          toolbar={
            <Button
              label="New Supplementary Session"
              icon="plus"
              variant="primary"
              onClick={() => setShowForm(true)}
            />
          }
          columns={[
            { field: 'sessionName', header: 'Session Name' },
            { field: 'maxSubjects', header: 'Max Backlog Subjects Allowed' },
            { field: 'feePerSubject', header: 'Fee per Subject (INR)' },
            {
              header: 'Status',
              cell: (item: Examination.SupplementarySessionItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.SupplementarySessionItem) => (
                <Button
                  icon="pencil"
                  variant="text"
                  tooltip="Edit Configuration"
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
        title={
          editId ? 'Edit Supplementary Session' : 'New Supplementary Session'
        }
        subtitle={
          editId
            ? 'Modify configuration'
            : 'Configure a new supplementary/backlog examination session'
        }
      >
        <SupplementarySessionForm id={editId} onClose={handleClose} />
      </FormPopup>
    </FormPage>
  );
}
