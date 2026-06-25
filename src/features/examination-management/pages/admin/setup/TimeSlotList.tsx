import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useTimeSlotsQuery } from '../../../queries';
import TimeSlotForm from '../../../components/TimeSlotForm';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function TimeSlotList() {
  const { data, isLoading } = useTimeSlotsQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  return (
    <FormPage
      title="Time Slots"
      description="Manage examination time slots / shifts"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search time slots..."
          toolbar={
            <Button
              label="Create"
              icon="plus"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          columns={[
            { field: 'shiftName', header: 'Shift Name' },
            { field: 'reportingTime', header: 'Reporting Time' },
            { field: 'startTime', header: 'Start Time' },
            { field: 'endTime', header: 'End Time' },
            { field: 'sortOrder', header: 'Sort Order' },
            {
              header: 'Status',
              cell: (item: Examination.TimeSlotItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.TimeSlotItem) => (
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
          title="Create Time Slot"
          subtitle="Add a new examination time slot"
        >
          <TimeSlotForm onClose={() => setPopup({ mode: 'closed' })} />
        </FormPopup>
      )}
      {popup.mode === 'edit' && (
        <FormPopup
          visible
          onHide={() => setPopup({ mode: 'closed' })}
          title="Edit Time Slot"
          subtitle="Update time slot details"
        >
          <TimeSlotForm
            id={popup.id}
            onClose={() => setPopup({ mode: 'closed' })}
          />
        </FormPopup>
      )}
    </FormPage>
  );
}
