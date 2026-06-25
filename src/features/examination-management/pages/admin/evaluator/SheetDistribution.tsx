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
              cell: () => (
                <Button
                  icon="eye"
                  variant="text"
                  tooltip="View"
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
        title="New Distribution"
        subtitle="Assign answer sheets to an evaluator"
      >
        <SheetDistributionForm onClose={() => setShowForm(false)} />
      </FormPopup>
    </FormPage>
  );
}
