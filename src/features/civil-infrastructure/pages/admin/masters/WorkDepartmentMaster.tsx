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
import { initialWorkDepartments } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: CivilManagement.WorkDepartmentMaster };

export default function WorkDepartmentMaster() {
  const [data, setData] = useCivilStorage<
    CivilManagement.WorkDepartmentMaster[]
  >(CIVIL_STORAGE_KEYS.WORK_DEPARTMENTS, initialWorkDepartments);

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const openCreate = () => {
    setName('');
    setDescription('');
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: CivilManagement.WorkDepartmentMaster) => {
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
      ToastService.error('Name is required.');
      return;
    }

    if (popup.mode === 'create') {
      const nextId = data.length + 1;
      const newItem: CivilManagement.WorkDepartmentMaster = {
        workDepartmentId: nextId,
        id: `WD-${Date.now().toString().slice(-4)}`,
        code: `WD-${String(nextId).padStart(2, '0')}`,
        name: name.trim(),
        description: description.trim() || undefined,
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Work Department "${newItem.name}" added.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.workDepartmentId === popup.item!.workDepartmentId ||
          d.id === popup.item!.id
            ? {
                ...d,
                name: name.trim(),
                description: description.trim() || undefined,
              }
            : d
        )
      );
      ToastService.success('Work Department updated.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleToggleStatus = (item: CivilManagement.WorkDepartmentMaster) => {
    setData(prev =>
      prev.map(d => {
        if (d.workDepartmentId === item.workDepartmentId || d.id === item.id) {
          const next = !d.isActive;
          ToastService.info(
            `Work Department ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Work Department Master"
      description="Manage work departments for civil engineering works."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Masters', to: civilUrls.workDepartmentMaster },
        { label: 'Work Department' },
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
            { field: 'name', header: 'Name' },
            {
              field: 'description',
              header: 'Description',
              cell: (item: CivilManagement.WorkDepartmentMaster) => (
                <span>{item.description ? item.description : 'N/A'}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: CivilManagement.WorkDepartmentMaster) => (
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
            ? 'Edit Work Department'
            : 'Create Work Department'
        }
        subtitle={
          popup.mode === 'edit'
            ? 'Update the work department details.'
            : 'Fill in the details to add a new work department.'
        }
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <form onSubmit={handleSave}>
            <TextBox
              label="Name"
              placeholder="Enter Work Department Name"
              value={name}
              onChange={setName}
              maxLength={150}
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
