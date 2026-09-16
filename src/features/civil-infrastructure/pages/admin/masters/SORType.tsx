import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { initialSORTypes } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_KEY = 'civil_sor_types';

export default function SORTypeMaster() {
  const [data, setData] = useState<CivilManagement.SORType[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialSORTypes;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.SORType;
  }>({ mode: 'closed' });

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const openAdd = () => {
    setFormCode('');
    setFormName('');
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.SORType) => {
    setFormCode(item.code);
    setFormName(item.name);
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formCode.trim() || !formName.trim()) {
      ToastService.error('SOR Type Code and Name are required.');
      return;
    }

    if (popup.mode === 'add') {
      const newItem: CivilManagement.SORType = {
        id: `ST-${Date.now().toString().slice(-4)}`,
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        isActive: formActive,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`SOR Type "${newItem.name}" added successfully.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                code: formCode.trim().toUpperCase(),
                name: formName.trim(),
                isActive: formActive,
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
      description="Define Schedule of Rates top-level classifications (e.g., Building, Roads, Electrical, Public Health)."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Masters' },
        { label: 'SOR Type' },
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
          label="Add SOR Type"
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
              header: 'SOR Type Code',
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
              field: 'name',
              header: 'Classification / Title',
              cell: (item: CivilManagement.SORType) => (
                <span style={{ fontWeight: 600 }}>{item.name}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.SORType) => (
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
              cell: (item: CivilManagement.SORType) => (
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
          searchPlaceholder="Search SOR types by code or name..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'add' ? 'Add SOR Type' : 'Edit SOR Type'}
        subtitle="Schedule of Rates top-level classification."
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
            label="SOR Type Code"
            placeholder="e.g. SOR-BLD"
            value={formCode}
            onChange={setFormCode}
            required
          />
          <TextBox
            label="Classification Title"
            placeholder="e.g. Building & Civil Works"
            value={formName}
            onChange={setFormName}
            required
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
              label={popup.mode === 'add' ? 'Create Type' : 'Save Changes'}
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
