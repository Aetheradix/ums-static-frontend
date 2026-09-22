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
import { initialStatusMasters } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: CivilManagement.StatusMaster };

export default function StatusMaster() {
  const [data, setData] = useCivilStorage<CivilManagement.StatusMaster[]>(
    CIVIL_STORAGE_KEYS.STATUS_MASTERS,
    initialStatusMasters
  );

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const [statusType, setStatusType] = useState('');
  const [statusTypeCode, setStatusTypeCode] = useState('');
  const [status, setStatus] = useState('');

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const openCreate = () => {
    setStatusType('');
    setStatusTypeCode('');
    setStatus('');
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: CivilManagement.StatusMaster) => {
    setStatusType(item.statusType || item.module || '');
    setStatusTypeCode(item.statusTypeCode || item.code || '');
    setStatus(item.status || item.label || '');
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
    if (!statusType.trim()) {
      ToastService.error('Status Type is required.');
      return;
    }
    if (!statusTypeCode.trim()) {
      ToastService.error('Status Type Code is required.');
      return;
    }
    if (!status.trim()) {
      ToastService.error('Status is required.');
      return;
    }

    if (popup.mode === 'create') {
      const nextId = data.length + 1;
      const newItem: CivilManagement.StatusMaster = {
        statusMasterId: nextId,
        id: `SM-${Date.now().toString().slice(-4)}`,
        statusType: statusType.trim(),
        statusTypeCode: statusTypeCode.trim().toUpperCase(),
        status: status.trim(),
        module: statusType.trim(),
        code: statusTypeCode.trim().toUpperCase(),
        label: status.trim(),
        sequence: nextId,
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Status "${newItem.status}" created.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.statusMasterId === popup.item!.statusMasterId ||
          d.id === popup.item!.id
            ? {
                ...d,
                statusType: statusType.trim(),
                statusTypeCode: statusTypeCode.trim().toUpperCase(),
                status: status.trim(),
                module: statusType.trim(),
                code: statusTypeCode.trim().toUpperCase(),
                label: status.trim(),
              }
            : d
        )
      );
      ToastService.success('Status updated.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleToggleStatus = (item: CivilManagement.StatusMaster) => {
    setData(prev =>
      prev.map(d => {
        if (d.statusMasterId === item.statusMasterId || d.id === item.id) {
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
      title="Status Master"
      description="Manage status classifications and workflow status definitions across civil modules."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Masters', to: civilUrls.statusMaster },
        { label: 'Status Master' },
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
              field: 'statusType',
              header: 'Status Type',
              cell: (item: CivilManagement.StatusMaster) => (
                <span>{item.statusType || item.module}</span>
              ),
            },
            {
              field: 'statusTypeCode',
              header: 'Status Type Code',
              cell: (item: CivilManagement.StatusMaster) => (
                <span>{item.statusTypeCode || item.code}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status Name',
              cell: (item: CivilManagement.StatusMaster) => (
                <span>{item.status || item.label}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: CivilManagement.StatusMaster) => (
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
          popup.mode === 'edit' ? 'Edit Status Master' : 'Create Status Master'
        }
        subtitle={
          popup.mode === 'edit'
            ? 'Update the status master details.'
            : 'Fill in the details to add a new status master.'
        }
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <form onSubmit={handleSave}>
            <FormGrid columns={2}>
              <TextBox
                label="Status Type"
                placeholder="e.g. Tender, WorkOrder"
                value={statusType}
                onChange={setStatusType}
                maxLength={50}
                required
              />
              <TextBox
                label="Status Type Code"
                placeholder="e.g. TND_STATUS, WO_STATUS"
                value={statusTypeCode}
                onChange={setStatusTypeCode}
                maxLength={50}
                required
              />
              <TextBox
                label="Status"
                placeholder="e.g. Draft, Approved, Rejected"
                value={status}
                onChange={setStatus}
                maxLength={50}
                required
              />
            </FormGrid>
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
