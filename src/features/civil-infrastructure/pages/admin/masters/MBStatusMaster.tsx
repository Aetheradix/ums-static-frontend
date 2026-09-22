import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../../civilStorage';
import { initialMBStatuses } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: CivilManagement.MBStatusMaster };

export default function MBStatusMaster() {
  const [data, setData] = useCivilStorage<CivilManagement.MBStatusMaster[]>(
    CIVIL_STORAGE_KEYS.MB_STATUSES,
    initialMBStatuses
  );

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const openCreate = () => {
    setName('');
    setDescription('');
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: CivilManagement.MBStatusMaster) => {
    setName(item.name || '');
    setDescription(item.description || '');
    setPopup({ mode: 'edit', item });
  };

  const handleReset = () => {
    if (popup.mode === 'edit' && popup.item) {
      openEdit(popup.item);
    } else {
      openCreate();
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      ToastService.error('Status Name is required.');
      return;
    }

    if (popup.mode === 'create') {
      const nextId = data.length + 1;
      const newItem: CivilManagement.MBStatusMaster = {
        measurementBookStatusId: nextId,
        id: `MBS-${Date.now().toString().slice(-4)}`,
        code: `MBS-${String(nextId).padStart(2, '0')}`,
        name: name.trim(),
        description: description.trim() || undefined,
        sequence: nextId,
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`MB Status "${newItem.name}" added.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.measurementBookStatusId === popup.item!.measurementBookStatusId ||
          d.id === popup.item!.id
            ? {
                ...d,
                name: name.trim(),
                description: description.trim() || undefined,
              }
            : d
        )
      );
      ToastService.success('MB Status updated.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleToggleStatus = (item: CivilManagement.MBStatusMaster) => {
    setData(prev =>
      prev.map(d => {
        if (
          d.measurementBookStatusId === item.measurementBookStatusId ||
          d.id === item.id
        ) {
          const next = !d.isActive;
          ToastService.info(`Status ${next ? 'Activated' : 'Deactivated'}.`);
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Measurement Book Status Master"
      description="Manage measurement book statuses (Draft, Verification Pending, Approved, Rejected, etc.) for civil engineering works."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Masters', to: civilUrls.mbStatusMaster },
        { label: 'Measurement Book Status' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={item => openEdit(item)}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Status Name' },
            {
              field: 'description',
              header: 'Description',
              cell: (item: CivilManagement.MBStatusMaster) => (
                <span>{item.description ? item.description : 'N/A'}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: CivilManagement.MBStatusMaster) => (
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
              onClick={openCreate}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'edit'
            ? 'Edit Measurement Book Status'
            : 'Create Measurement Book Status'
        }
        subtitle={
          popup.mode === 'edit'
            ? 'Update the measurement book status details.'
            : 'Fill in the details to add a new measurement book status.'
        }
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <form onSubmit={handleSave}>
            <TextBox
              label="Status Name"
              placeholder="Enter Status Name"
              value={name}
              onChange={setName}
              maxLength={100}
              required
            />
            <TextBox
              label="Description"
              placeholder="Enter Description"
              value={description}
              onChange={setDescription}
              maxLength={250}
            />
            <FormActions
              isEditMode={popup.mode === 'edit'}
              onSave={handleSave}
              onReset={handleReset}
            />
          </form>
        )}
      </FormPopup>
    </FormPage>
  );
}
