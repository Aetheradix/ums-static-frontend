import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FormPage,
  FormCard,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useTimetableQuery } from '../../../queries';
import TimetableEntryForm from '../../../components/TimetableEntryForm';

export default function TimetableManagement() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const { data, isLoading } = useTimetableQuery(sid);
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
      title="Timetable Management"
      description={`Examination timetable for session #${sid}`}
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          toolbar={
            <Button
              label="Add Entry"
              icon="plus"
              variant="primary"
              onClick={() => setShowPopup(true)}
            />
          }
          searchBox
          searchPlaceholder="Search subjects..."
          columns={[
            { field: 'subjectCode', header: 'Subject Code' },
            { field: 'subjectName', header: 'Subject Name' },
            { field: 'examDate', header: 'Exam Date' },
            { field: 'slotName', header: 'Shift' },
            { field: 'startTime', header: 'Start' },
            { field: 'endTime', header: 'End' },
            { field: 'centerName', header: 'Center' },
            {
              header: 'Actions',
              cell: (item: Examination.TimetableItem) => (
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
        visible={showPopup}
        onHide={handleClose}
        title={editId ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
        subtitle={editId ? 'Modify scheduled exam' : 'Schedule a new exam'}
      >
        <TimetableEntryForm id={editId} sessionId={sid} onClose={handleClose} />
      </FormPopup>
    </FormPage>
  );
}
