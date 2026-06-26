import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useSheetDistributionsQuery } from '../../../queries';
import SheetDistributionForm from '../../../components/SheetDistributionForm';

export default function SheetDistribution() {
  const { data, isLoading } = useSheetDistributionsQuery();
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
      title="Sheet Distribution"
      description="Distribute answer sheets to evaluators."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          toolbar={
            <Button
              label="New Distribution"
              icon="plus"
              variant="primary"
              onClick={() => setShowForm(true)}
            />
          }
          searchBox
          searchPlaceholder="Search..."
          columns={[
            { field: 'evaluator', header: 'Evaluator' },
            { field: 'subject', header: 'Subject' },
            { field: 'totalSheets', header: 'Sheets Assigned' },
            { field: 'assignedDate', header: 'Assigned Date' },
            {
              header: 'Status',
              cell: (item: Examination.SheetDistributionItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.SheetDistributionItem) => (
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
        title={editId ? 'Edit Distribution' : 'New Distribution'}
        subtitle={
          editId
            ? 'Modify answer sheet distribution'
            : 'Assign answer sheets to an evaluator'
        }
      >
        <SheetDistributionForm id={editId} onClose={handleClose} />
      </FormPopup>
    </FormPage>
  );
}
