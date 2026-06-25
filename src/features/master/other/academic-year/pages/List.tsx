import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import StatusButton from 'shared/components/buttons/StatusButton';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateAcademicYear from '../components/CreateAcademicYear';
import {
  useAcademicYearsQuery,
  useAcademicYearStatusMutation,
} from '../queries';
import EditAcademicYear from '../components/EditAcademicYear';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useAcademicYearsQuery();
  const { mutateAsync: toggleStatus } = useAcademicYearStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.Other.AcademicYearItem) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Academic Year"
      description="Manage the list of all academic years in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Other.AcademicYearItem[]}
          loading={isLoading}
          onEdit={academicYear =>
            setPopup({ mode: 'edit', id: academicYear.id })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'session', header: 'Session' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Other.AcademicYearItem) => (
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
          title="Create Academic Year"
          subtitle="Fill in the details to add a new academic year."
        >
          <CreateAcademicYear onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Academic Year"
          subtitle="Update the details of the academic year."
        >
          {popup.mode === 'edit' && (
            <EditAcademicYear id={popup.id} onClose={closePopup} />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
