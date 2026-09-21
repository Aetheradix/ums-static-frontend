import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../../civilStorage';
import { initialWorkCategories } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: CivilManagement.WorkCategoryMaster };

export default function WorkCategoryMaster() {
  const [data, setData] = useCivilStorage<CivilManagement.WorkCategoryMaster[]>(
    CIVIL_STORAGE_KEYS.WORK_CATEGORIES,
    initialWorkCategories
  );

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const openCreate = () => {
    setCode('');
    setName('');
    setDescription('');
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: CivilManagement.WorkCategoryMaster) => {
    setCode(item.code || '');
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
    if (!code.trim()) {
      ToastService.error('Code is required.');
      return;
    }
    if (!name.trim()) {
      ToastService.error('Name is required.');
      return;
    }

    if (popup.mode === 'create') {
      const nextId = data.length + 1;
      const newItem: CivilManagement.WorkCategoryMaster = {
        workCategoryId: nextId,
        id: `WC-${Date.now().toString().slice(-4)}`,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || undefined,
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Work Category "${newItem.name}" created.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.workCategoryId === popup.item!.workCategoryId ||
          d.id === popup.item!.id
            ? {
                ...d,
                code: code.trim().toUpperCase(),
                name: name.trim(),
                description: description.trim() || undefined,
              }
            : d
        )
      );
      ToastService.success('Work Category updated.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleToggleStatus = (item: CivilManagement.WorkCategoryMaster) => {
    setData(prev =>
      prev.map(d => {
        if (d.workCategoryId === item.workCategoryId || d.id === item.id) {
          const next = !d.isActive;
          ToastService.info(
            `Work Category ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Work Category Master"
      description="Manage work category classifications for civil engineering works."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.workCategoryMaster },
        { label: 'Work Category' },
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
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            {
              field: 'description',
              header: 'Description',
              cell: (item: CivilManagement.WorkCategoryMaster) => (
                <span>{item.description ? item.description : 'N/A'}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: CivilManagement.WorkCategoryMaster) => (
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
          popup.mode === 'edit' ? 'Edit Work Category' : 'Create Work Category'
        }
        subtitle={
          popup.mode === 'edit'
            ? 'Update the work category details.'
            : 'Fill in the details to add a new work category.'
        }
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <form onSubmit={handleSave}>
            <FormGrid columns={2}>
              <TextBox
                label="Code"
                placeholder="Enter Code (e.g. BLD-CIV)"
                value={code}
                onChange={setCode}
                maxLength={50}
                required
              />
              <TextBox
                label="Name"
                placeholder="Enter Work Category Name"
                value={name}
                onChange={setName}
                maxLength={150}
                required
              />
            </FormGrid>
            <TextBox
              label="Description"
              placeholder="Enter Description"
              value={description}
              onChange={setDescription}
              maxLength={255}
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
