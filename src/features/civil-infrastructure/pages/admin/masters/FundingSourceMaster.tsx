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
import { initialFundingSources } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: CivilManagement.FundingSourceMaster };

export default function FundingSourceMaster() {
  const [data, setData] = useCivilStorage<
    CivilManagement.FundingSourceMaster[]
  >(CIVIL_STORAGE_KEYS.FUNDING_SOURCES, initialFundingSources);

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const openCreate = () => {
    setName('');
    setDescription('');
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: CivilManagement.FundingSourceMaster) => {
    setName(item.name || item.fundingSourceName || '');
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
      ToastService.error('Funding Source Name is required.');
      return;
    }

    if (popup.mode === 'create') {
      const nextId = data.length + 1;
      const newItem: CivilManagement.FundingSourceMaster = {
        fundingSourceId: nextId,
        id: `FS-${String(nextId).padStart(2, '0')}`,
        name: name.trim(),
        fundingSourceName: name.trim(),
        description: description.trim() || undefined,
        sourceType: 'UGC',
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(
        `Funding Source "${newItem.name}" added successfully.`
      );
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.fundingSourceId === popup.item!.fundingSourceId ||
          d.id === popup.item!.id
            ? {
                ...d,
                name: name.trim(),
                fundingSourceName: name.trim(),
                description: description.trim() || undefined,
              }
            : d
        )
      );
      ToastService.success('Funding Source updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleToggleStatus = (item: CivilManagement.FundingSourceMaster) => {
    setData(prev =>
      prev.map(d => {
        if (d.fundingSourceId === item.fundingSourceId || d.id === item.id) {
          const next = !d.isActive;
          ToastService.info(
            `Funding Source ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Funding Source Master"
      description="Manage funding sources (University Fund, UGC Grant, State/Central Govt, etc.) for civil infrastructure projects."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.fundingSourceMaster },
        { label: 'Funding Source' },
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
            {
              field: 'name',
              header: 'Funding Source Name',
              cell: (item: CivilManagement.FundingSourceMaster) => (
                <span>{item.name || item.fundingSourceName}</span>
              ),
            },
            {
              field: 'description',
              header: 'Description',
              cell: (item: CivilManagement.FundingSourceMaster) => (
                <span>{item.description ? item.description : 'N/A'}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: CivilManagement.FundingSourceMaster) => (
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
        size="lg"
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'edit'
            ? 'Edit Funding Source'
            : 'Create Funding Source'
        }
        subtitle={
          popup.mode === 'edit'
            ? 'Update the funding source details.'
            : 'Fill in the details to add a new funding source.'
        }
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <form onSubmit={handleSave}>
            <TextBox
              label="Funding Source Name"
              placeholder="Enter Funding Source Name (e.g. UGC Grant)"
              value={name}
              onChange={setName}
              maxLength={50}
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
