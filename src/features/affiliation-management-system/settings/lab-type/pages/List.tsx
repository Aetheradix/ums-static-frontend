import { useState } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { LAB_TYPE_DATA } from '../data';
import type { LabTypeItem } from '../data';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: LabTypeItem };

export default function List() {
  const [rows, setRows] = useState<LabTypeItem[]>(LAB_TYPE_DATA);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [labTypeName, setLabTypeName] = useState('');

  const closePopup = () => {
    setPopup({ mode: 'closed' });
    setLabTypeName('');
  };

  const openCreate = () => {
    setLabTypeName('');
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: LabTypeItem) => {
    setLabTypeName(item.labTypeName);
    setPopup({ mode: 'edit', item });
  };

  const isFormValid = labTypeName.trim().length > 0;

  const handleSave = () => {
    if (!isFormValid) return;

    if (popup.mode === 'create') {
      setRows(prev => [
        ...prev,
        {
          labTypeId: Math.max(0, ...prev.map(r => r.labTypeId)) + 1,
          labTypeName: labTypeName.trim(),
          isActive: true,
        },
      ]);
      ToastService.success('Lab type added successfully.');
    } else if (popup.mode === 'edit') {
      const editingId = popup.item.labTypeId;
      setRows(prev =>
        prev.map(r =>
          r.labTypeId === editingId
            ? { ...r, labTypeName: labTypeName.trim() }
            : r
        )
      );
      ToastService.success('Lab type updated successfully.');
    }
    closePopup();
  };

  const handleToggleStatus = (item: LabTypeItem) => {
    setRows(prev =>
      prev.map(r =>
        r.labTypeId === item.labTypeId ? { ...r, isActive: !r.isActive } : r
      )
    );
  };

  return (
    <FormPage
      title="Lab Types"
      description="Manage the laboratory types available in the college affiliation form."
    >
      <FormCard>
        <GridPanel
          data={rows}
          onEdit={openEdit}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '40px',
              sortable: false,
            },
            { field: 'labTypeName', header: 'Lab Type' },
            {
              cell: (item: LabTypeItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Lab Type"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
          searchFields={['labTypeName']}
        />
      </FormCard>

      {popup.mode !== 'closed' && (
        <FormPopup
          visible
          onHide={closePopup}
          title={popup.mode === 'create' ? 'Add Lab Type' : 'Edit Lab Type'}
          subtitle="Laboratory type shown in the affiliation form's lab dropdown."
          footer={
            <>
              <Button label="Cancel" variant="outlined" onClick={closePopup} />
              <Button
                label="Save"
                variant="primary"
                icon="save"
                disabled={!isFormValid}
                onClick={handleSave}
              />
            </>
          }
        >
          <div className="p-4">
            <FormGrid columns={1}>
              <TextBox
                label="Lab Type Name"
                placeholder="e.g. Chemistry Lab"
                value={labTypeName}
                onChange={val => setLabTypeName(val ?? '')}
                required
              />
            </FormGrid>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
