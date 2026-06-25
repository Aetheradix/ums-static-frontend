import { useCallback, useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateSubjectSpecialization from '../components/CreateSubjectSpecialization';
import EditSubjectSpecialization from '../components/EditSubjectSpecialization';
import {
  useSubjectSpecializationsQuery,
  useSubjectSpecializationStatusMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useSubjectSpecializationsQuery();

  const { mutateAsync: toggleStatus } =
    useSubjectSpecializationStatusMutation();

  const [popup, setPopup] = useState<PopupState>({
    mode: 'closed',
  });

  const handleToggleStatus = async (
    item: Master.Employee.SubjectSpecializationItem
  ) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Subject Specialization"
      description="Manage the list of all subject specializations in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Employee.SubjectSpecializationItem[]}
          loading={isLoading}
          onEdit={subjectSpecialization =>
            setPopup({
              mode: 'edit',
              id: subjectSpecialization.id,
            })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,

              width: '30px',
            },

            {
              field: 'name',
              header: 'Subject Specialization',
            },

            {
              field: 'isActive',

              header: 'Status',

              sortable: false,

              cell: (item: Master.Employee.SubjectSpecializationItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create"
              icon="plus"
              variant="primary"
              onClick={() =>
                setPopup({
                  mode: 'create',
                })
              }
            />
          }
          searchBox
        />
      </FormCard>

      {popup.mode === 'create' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Create Subject Specialization"
          subtitle="Fill in the details to add a new subject specialization."
        >
          <CreateSubjectSpecialization onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Subject Specialization"
          subtitle="Update the details of the subject specialization."
        >
          {popup.mode === 'edit' && (
            <EditSubjectSpecialization id={popup.id} onClose={closePopup} />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
