import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import StatusButton from 'shared/components/buttons/StatusButton';
import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateProgrammeSpecializationStructure from '../components/CreateProgrammeSpecializationStructure';
import EditProgrammeSpecializationStructure from '../components/EditProgrammeSpecializationStructure';
import {
  useProgrammeSpecializationStructureActiveStatusMutation,
  useProgrammeSpecializationStructuresQuery,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useProgrammeSpecializationStructuresQuery();
  const { mutateAsync: toggleStatus } =
    useProgrammeSpecializationStructureActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (
    item: Master.SubjectMaster.ProgrammeSpecializationStructureItem
  ) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Programme Specialization Structure"
      description="Manage the list of all programme specialization structures in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={item => setPopup({ mode: 'edit', id: item.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'semesterName', header: 'Semester' },
            { field: 'totalCredits', header: 'Total Credits' },
            { field: 'lectureStructure', header: 'Lecture Credits' },
            { field: 'tutorialStructure', header: 'Tutorial Credits' },
            { field: 'practicalStructure', header: 'Practical Credits' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (
                item: Master.SubjectMaster.ProgrammeSpecializationStructureItem
              ) => (
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
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>
      {popup.mode === 'create' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Create Programme Specialization Structure"
          subtitle="Fill in the details to add a new structure."
        >
          <CreateProgrammeSpecializationStructure onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Programme Specialization Structure"
          subtitle="Update the details of the programme specialization structure."
        >
          {popup.mode === 'edit' && (
            <EditProgrammeSpecializationStructure
              id={popup.id}
              onClose={closePopup}
            />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
