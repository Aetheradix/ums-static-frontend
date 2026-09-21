import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../../civilStorage';
import { initialMandateDocuments } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

export default function MandateDocumentMaster() {
  const [data, setData] = useCivilStorage<CivilManagement.MandateDocument[]>(
    CIVIL_STORAGE_KEYS.MANDATE_DOCUMENTS,
    initialMandateDocuments
  );

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.MandateDocument;
  }>({ mode: 'closed' });

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formRequired, setFormRequired] = useState(false);
  const [formAllowMultiple, setFormAllowMultiple] = useState(false);

  const openAdd = () => {
    setFormName('');
    setFormDesc('');
    setFormRequired(false);
    setFormAllowMultiple(false);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.MandateDocument) => {
    setFormName(item.name || '');
    setFormDesc(item.description || '');
    setFormRequired(item.isRequired ?? item.isMandatory ?? false);
    setFormAllowMultiple(
      item.allowMultiple ?? item.allowMultipleFiles ?? false
    );
    setPopup({ mode: 'edit', item });
  };

  const handleReset = () => {
    if (popup.mode === 'edit' && popup.item) {
      setFormName(popup.item.name || '');
      setFormDesc(popup.item.description || '');
      setFormRequired(popup.item.isRequired ?? popup.item.isMandatory ?? false);
      setFormAllowMultiple(
        popup.item.allowMultiple ?? popup.item.allowMultipleFiles ?? false
      );
    } else {
      setFormName('');
      setFormDesc('');
      setFormRequired(false);
      setFormAllowMultiple(false);
    }
  };

  const handleSave = () => {
    if (!formName.trim()) {
      ToastService.error('Document Name is required.');
      return;
    }

    if (popup.mode === 'add') {
      const newItem: CivilManagement.MandateDocument = {
        id: `MD-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        description: formDesc.trim(),
        isRequired: formRequired,
        isMandatory: formRequired,
        allowMultiple: formAllowMultiple,
        allowMultipleFiles: formAllowMultiple,
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(
        `Mandate Document "${newItem.name}" added successfully.`
      );
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                name: formName.trim(),
                description: formDesc.trim(),
                isRequired: formRequired,
                isMandatory: formRequired,
                allowMultiple: formAllowMultiple,
                allowMultipleFiles: formAllowMultiple,
              }
            : d
        )
      );
      ToastService.success(`Mandate Document updated successfully.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (item: CivilManagement.MandateDocument) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === item.id) {
          const next = !d.isActive;
          ToastService.info(
            `Document "${d.name}" ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Mandate Document Master"
      description="Manage mandate documents for civil engineering works."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Campus Facilities', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Masters', to: civilUrls.adminMenu },
        { label: 'Mandate Document' },
      ]}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1rem',
        }}
      >
        <Button
          label="Create"
          icon="plus"
          variant="primary"
          onClick={openAdd}
        />
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'name',
              header: 'Name',
              sortable: true,
            },
            {
              field: 'description',
              header: 'Description',
              sortable: true,
            },
            {
              field: 'isRequired',
              header: 'Is Required',
              sortable: true,
              cell: (item: CivilManagement.MandateDocument) => (
                <span>
                  {item.isRequired || item.isMandatory ? 'Yes' : 'No'}
                </span>
              ),
            },
            {
              field: 'allowMultiple',
              header: 'Allow Multiple',
              sortable: true,
              cell: (item: CivilManagement.MandateDocument) => (
                <span>
                  {item.allowMultiple || item.allowMultipleFiles ? 'Yes' : 'No'}
                </span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.MandateDocument) => (
                <button
                  type="button"
                  onClick={() => toggleStatus(item)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title="Click to toggle status"
                >
                  <StatusBadge
                    label={item.isActive ? 'Active' : 'Inactive'}
                    variant={item.isActive ? 'success' : 'neutral'}
                  />
                </button>
              ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: CivilManagement.MandateDocument) => (
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
          searchBox
          searchPlaceholder="Search..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add'
            ? 'Create Mandate Document'
            : 'Edit Mandate Document'
        }
        subtitle={
          popup.mode === 'add'
            ? 'Fill in the details to add a new mandate document.'
            : 'Fill in the details to edit the mandate document.'
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
          <TextBox
            label="Name"
            placeholder="Enter Mandate Document Name"
            value={formName}
            onChange={setFormName}
            required
          />
          <TextArea
            label="Description"
            placeholder="Enter Description"
            value={formDesc}
            onChange={setFormDesc}
            rows={3}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
            }}
          >
            <Checkbox
              label="Is Required"
              checked={formRequired}
              onChange={setFormRequired}
            />
            <Checkbox
              label="Allow Multiple Files"
              checked={formAllowMultiple}
              onChange={setFormAllowMultiple}
            />
          </div>

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
