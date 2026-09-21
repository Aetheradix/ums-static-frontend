import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../../civilStorage';
import { initialSORTypes } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

export default function SORTypeMaster() {
  const [data, setData] = useCivilStorage<CivilManagement.SORType[]>(
    CIVIL_STORAGE_KEYS.SOR_TYPES,
    initialSORTypes
  );

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.SORType;
  }>({ mode: 'closed' });

  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const openAdd = () => {
    setFormName('');
    setFormCode('');
    setFormDesc('');
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.SORType) => {
    setFormName(
      item.name || (item as any).type || (item as any).description || ''
    );
    setFormCode(item.code || '');
    setFormDesc((item as any).description || '');
    setPopup({ mode: 'edit', item });
  };

  const handleReset = () => {
    if (popup.mode === 'edit' && popup.item) {
      setFormName(
        popup.item.name ||
          (popup.item as any).type ||
          (popup.item as any).description ||
          ''
      );
      setFormCode(popup.item.code || '');
      setFormDesc((popup.item as any).description || '');
    } else {
      setFormName('');
      setFormCode('');
      setFormDesc('');
    }
  };

  const handleSave = () => {
    if (!formName.trim() || !formCode.trim()) {
      ToastService.error('Name and Code are required.');
      return;
    }

    if (popup.mode === 'add') {
      const newItem: CivilManagement.SORType = {
        id: `ST-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        code: formCode.trim().toUpperCase(),
        description: formDesc.trim(),
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`SOR Type "${newItem.name}" created successfully.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                name: formName.trim(),
                code: formCode.trim().toUpperCase(),
                description: formDesc.trim(),
              }
            : d
        )
      );
      ToastService.success(`SOR Type updated successfully.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const nextState = !d.isActive;
          ToastService.info(
            `SOR Type ${nextState ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: nextState };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="SOR Type Master"
      description="Manage Schedule of Rates (SOR) type registries for civil infrastructure."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.externalMastersMenu },
        { label: 'SOR Type' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'name',
              header: 'Name',
              cell: (item: CivilManagement.SORType) => (
                <span style={{ fontWeight: 600, color: '#111827' }}>
                  {item.name ||
                    (item as any).type ||
                    (item as any).description ||
                    item.code}
                </span>
              ),
            },
            {
              field: 'code',
              header: 'Code',
              cell: (item: CivilManagement.SORType) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                >
                  {item.code}
                </span>
              ),
            },
            {
              field: 'description',
              header: 'Description',
              cell: (item: CivilManagement.SORType) => (
                <span>{(item as any).description || item.name || 'N/A'}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.SORType) => (
                <button
                  type="button"
                  onClick={() => toggleStatus(String(item.id || ''))}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title="Click to toggle status"
                >
                  <StatusBadge
                    label={item.isActive !== false ? 'Active' : 'Inactive'}
                    variant={item.isActive !== false ? 'success' : 'neutral'}
                  />
                </button>
              ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: CivilManagement.SORType) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => openEdit(item)}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create"
              icon="plus"
              variant="primary"
              onClick={openAdd}
            />
          }
          searchBox
          searchPlaceholder="Search..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'add' ? 'Create SOR Type' : 'Edit SOR Type'}
        subtitle={
          popup.mode === 'add'
            ? 'Fill in the details to add a new SOR type.'
            : 'Update the SOR type details.'
        }
        size="md"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem',
            }}
          >
            <TextBox
              label="Name"
              placeholder="Enter SOR Type Name"
              value={formName}
              onChange={setFormName}
              required
            />
            <TextBox
              label="Code"
              placeholder="Enter Code (e.g. CIVIL)"
              value={formCode}
              onChange={setFormCode}
              required
            />
          </div>
          <TextBox
            label="Description"
            placeholder="Enter Description"
            value={formDesc}
            onChange={setFormDesc}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Reset"
              icon="times"
              variant="outlined"
              onClick={handleReset}
            />
            <Button
              label="Save"
              variant="primary"
              icon="save"
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
