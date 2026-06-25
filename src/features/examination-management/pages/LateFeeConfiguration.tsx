import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useLateFeesQuery } from '../queries';
import LateFeeForm from '../components/LateFeeForm';

export default function LateFeeConfiguration() {
  const { data, isLoading } = useLateFeesQuery();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <FormPage
      title="Late Fee Rules"
      description="Configure late fee rules for examination fees"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search late fee rules..."
          toolbar={
            <Button
              label="Add Rule"
              icon="pi-plus"
              onClick={() => setShowPopup(true)}
            />
          }
          columns={[
            { field: 'programName', header: 'Program' },
            {
              field: 'termNo',
              header: 'Term',
              cell: (item: Examination.LateFeeItem) => (
                <span>
                  {item.termNo === 0 ? 'All Terms' : `Term ${item.termNo}`}
                </span>
              ),
            },
            { field: 'termType', header: 'Term Type' },
            { field: 'applicableFromYear', header: 'Applicable From' },
            {
              header: 'Status',
              cell: (item: Examination.LateFeeItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
          ]}
        />
      </FormCard>

      {showPopup && (
        <FormPopup
          visible
          onHide={() => setShowPopup(false)}
          title="Add Late Fee Rule"
          subtitle="Create a new late fee rule"
        >
          <LateFeeForm onClose={() => setShowPopup(false)} />
        </FormPopup>
      )}
    </FormPage>
  );
}
