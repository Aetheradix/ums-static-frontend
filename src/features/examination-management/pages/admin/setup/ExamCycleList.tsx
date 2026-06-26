import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import ExamCycleForm from '../../../components/ExamCycleForm';
import { useExamCyclesQuery } from '../../../queries';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function ExamCycleList() {
  const { data, isLoading } = useExamCyclesQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  return (
    <FormPage
      title="Exam Cycles"
      description="Manage examination cycles (e.g., December, July)"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search cycles..."
          toolbar={
            <Button
              label="Create"
              icon="plus"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          columns={[
            { field: 'name', header: 'Name' },
            {
              field: 'month',
              header: 'Month',
              cell: (item: Examination.ExamCycleItem) => (
                <span>{MONTHS[item.month - 1] ?? item.month}</span>
              ),
            },
            { field: 'year', header: 'Year' },
            { field: 'sortOrder', header: 'Sort Order' },
            {
              header: 'Status',
              cell: (item: Examination.ExamCycleItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.ExamCycleItem) => (
                <Button
                  icon="pencil"
                  variant="text"
                  onClick={() => setPopup({ mode: 'edit', id: item.id })}
                />
              ),
            },
          ]}
        />
      </FormCard>
      {popup.mode === 'create' && (
        <FormPopup
          visible
          onHide={() => setPopup({ mode: 'closed' })}
          title="Create Exam Cycle"
          subtitle="Add a new examination cycle"
        >
          <ExamCycleForm onClose={() => setPopup({ mode: 'closed' })} />
        </FormPopup>
      )}
      {popup.mode === 'edit' && (
        <FormPopup
          visible
          onHide={() => setPopup({ mode: 'closed' })}
          title="Edit Exam Cycle"
          subtitle="Update examination cycle details"
        >
          <ExamCycleForm
            id={popup.id}
            onClose={() => setPopup({ mode: 'closed' })}
          />
        </FormPopup>
      )}
    </FormPage>
  );
}
