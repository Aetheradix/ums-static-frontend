import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useExamFeesQuery } from '../../../queries';
import ExamFeeForm from '../../../components/ExamFeeForm';

export default function FeeConfiguration() {
  const { data, isLoading } = useExamFeesQuery();
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditId] = useState<number | undefined>(undefined);

  const handleEdit = (id: number) => {
    setEditId(id);
    setShowPopup(true);
  };

  const handleClose = () => {
    setEditId(undefined);
    setShowPopup(false);
  };

  return (
    <FormPage
      title="Exam Fee Configuration"
      description="Configure program-wise examination fees"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search fee configurations..."
          toolbar={
            <Button
              label="Add Fee"
              icon="plus"
              onClick={() => setShowPopup(true)}
            />
          }
          columns={[
            { field: 'programName', header: 'Program' },
            { field: 'termNo', header: 'Term' },
            { field: 'termType', header: 'Term Type' },
            { field: 'applicableFromYear', header: 'Applicable From' },
            { field: 'applicableCycleName', header: 'Cycle' },
            {
              header: 'Status',
              cell: (item: Examination.ExamFeeItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.ExamFeeItem) => (
                <div className="flex gap-2">
                  <Button
                    icon="pencil"
                    variant="text"
                    tooltip="Edit Fee"
                    onClick={() => handleEdit(item.id)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
      {showPopup && (
        <FormPopup
          visible
          onHide={handleClose}
          title={editId ? 'Edit Exam Fee' : 'Add Exam Fee'}
          subtitle={
            editId
              ? 'Modify fee configuration'
              : 'Create a new fee configuration'
          }
        >
          <ExamFeeForm id={editId} onClose={handleClose} />
        </FormPopup>
      )}
    </FormPage>
  );
}
