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
import CreateProgrammeModeOfEducation from '../components/CreateProgrammeModeOfEducation';
import EditProgrammeModeOfEducation from '../components/EditProgrammeModeOfEducation';
import {
  useProgrammeModeOfEducationActiveStatusMutation,
  useProgrammeModeOfEducationsQuery,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useProgrammeModeOfEducationsQuery();
  const { mutateAsync: toggleStatus } =
    useProgrammeModeOfEducationActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (
    item: Master.SubjectMaster.ProgrammeModeOfEducationItem
  ) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Programme Mode of Education"
      description="Manage the list of all Programme Mode of Educations in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={department => setPopup({ mode: 'edit', id: department.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (
                item: Master.SubjectMaster.ProgrammeModeOfEducationItem
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
          title="Create Programme Mode of Education"
          subtitle="Fill in the details to add a new Programme Mode of Education."
        >
          <CreateProgrammeModeOfEducation onClose={closePopup} />
        </FormPopup>
      ) : null}
      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Programme Mode of Education"
          subtitle="Update the details of the Programme Mode of Education."
        >
          {popup.mode === 'edit' && (
            <EditProgrammeModeOfEducation id={popup.id} onClose={closePopup} />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
