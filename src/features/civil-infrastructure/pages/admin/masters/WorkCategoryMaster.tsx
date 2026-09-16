import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { initialWorkCategories } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_KEY = 'civil_work_categories';

export default function WorkCategoryMaster() {
  const [data, setData] = useState<CivilManagement.WorkCategoryMaster[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialWorkCategories;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.WorkCategoryMaster;
  }>({ mode: 'closed' });

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const openAdd = () => {
    setFormCode('');
    setFormName('');
    setFormDesc('');
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.WorkCategoryMaster) => {
    setFormCode(item.code);
    setFormName(item.name);
    setFormDesc(item.description || '');
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formCode.trim() || !formName.trim()) {
      ToastService.error('Category Code and Category Name are required.');
      return;
    }

    if (popup.mode === 'add') {
      const newItem: CivilManagement.WorkCategoryMaster = {
        id: `WC-${Date.now().toString().slice(-4)}`,
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        description: formDesc.trim(),
        isActive: formActive,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Work Category "${newItem.name}" created.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                code: formCode.trim().toUpperCase(),
                name: formName.trim(),
                description: formDesc.trim(),
                isActive: formActive,
              }
            : d
        )
      );
      ToastService.success(`Work Category updated.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
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
      description="Define civil work classifications and workflow governance archetypes (Capital, Maintenance, Renewal, Strengthening, Deposit, Emergency)."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Masters' },
        { label: 'Work Category' },
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
          label="Add Work Category"
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
              field: 'code',
              header: 'Category Code',
              cell: (item: CivilManagement.WorkCategoryMaster) => (
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
              field: 'name',
              header: 'Category Title',
              cell: (item: CivilManagement.WorkCategoryMaster) => (
                <div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.WorkCategoryMaster) => (
                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
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
              header: 'Actions',
              sortable: false,
              cell: (item: CivilManagement.WorkCategoryMaster) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => openEdit(item)}
                  />
                  <Button
                    size="small"
                    label=""
                    icon={item.isActive ? 'lock' : 'unlock'}
                    variant="outlined"
                    onClick={() => toggleStatus(item.id)}
                  />
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search work categories..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add' ? 'Add Work Category' : 'Edit Work Category'
        }
        subtitle="Work category classification dictating regulatory lifecycle."
        size="md"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '0.5rem',
          }}
        >
          <TextBox
            label="Category Code"
            placeholder="e.g. NCC, MNT, REN"
            value={formCode}
            onChange={setFormCode}
            required
          />
          <TextBox
            label="Category Name"
            placeholder="e.g. New Capital Construction"
            value={formName}
            onChange={setFormName}
            required
          />
          <TextArea
            label="Description & Regulatory Scope"
            placeholder="Explain workflow routing and accounting criteria..."
            value={formDesc}
            onChange={setFormDesc}
            rows={3}
          />
          <DropDownList
            label="Status"
            data={[
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
            textField="label"
            optionValue="value"
            value={formActive ? 'true' : 'false'}
            onChange={val => setFormActive(val === 'true')}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label={popup.mode === 'add' ? 'Create Category' : 'Save Changes'}
              variant="primary"
              icon="check"
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
