import { useCallback, useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateDocumentOption from '../components/CreateDocumentOption';
import EditDocumentOption from '../components/EditDocumentOption';
import {
  useDocumentOptionsQuery,
  useDocumentOptionStatusMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useDocumentOptionsQuery();

  const { mutateAsync: toggleStatus } = useDocumentOptionStatusMutation();

  const [popup, setPopup] = useState<PopupState>({
    mode: 'closed',
  });

  const handleToggleStatus = async (
    item: Master.Employee.DocumentOptionsItem
  ) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Document Option"
      description="Manage the list of all document options in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Employee.DocumentOptionsItem[]}
          loading={isLoading}
          onEdit={documentOption =>
            setPopup({
              mode: 'edit',
              id: documentOption.id,
            })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            {
              field: 'name',
              header: 'Document Option',
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Employee.DocumentOptionsItem) => (
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
          title="Create Document Option"
          subtitle="Fill in the details to add a new document option."
        >
          <CreateDocumentOption onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Document Option"
          subtitle="Update the details of the document option."
        >
          {popup.mode === 'edit' && (
            <EditDocumentOption id={popup.id} onClose={closePopup} />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
