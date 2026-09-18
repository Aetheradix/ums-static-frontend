import { useEffect, useMemo, useState } from 'react';
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
import {
  CIVIL_STORAGE_KEYS,
  civilStorage,
  useCivilStorage,
} from '../../../civilStorage';
import { initialWorkCategories, initialWorkDepartments } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_DEPTS = CIVIL_STORAGE_KEYS.WORK_DEPARTMENTS;

export default function WorkDepartmentMaster() {
  const [categories] = useCivilStorage<CivilManagement.WorkCategoryMaster[]>(
    CIVIL_STORAGE_KEYS.WORK_CATEGORIES,
    initialWorkCategories
  );

  const [data, setData] = useState<CivilManagement.WorkDepartmentMaster[]>(
    () => {
      const saved = localStorage.getItem(STORAGE_DEPTS);
      return saved ? JSON.parse(saved) : initialWorkDepartments;
    }
  );

  const [filterCat, setFilterCat] = useState<string>('ALL');

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.WorkDepartmentMaster;
  }>({ mode: 'closed' });

  const [formCatId, setFormCatId] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    civilStorage.set(STORAGE_DEPTS, data);
  }, [data]);

  const filteredData = useMemo(() => {
    if (filterCat === 'ALL') return data;
    return data.filter(d => d.parentCategoryId === filterCat);
  }, [data, filterCat]);

  const openAdd = () => {
    setFormCatId(categories[0]?.id || '');
    setFormCode('');
    setFormName('');
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.WorkDepartmentMaster) => {
    setFormCatId(item.parentCategoryId || categories[0]?.id || '');
    setFormCode(item.code);
    setFormName(item.name);
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formCode.trim() || !formName.trim()) {
      ToastService.error('Department Code and Name are required.');
      return;
    }

    if (popup.mode === 'add') {
      const newItem: CivilManagement.WorkDepartmentMaster = {
        id: `WD-${Date.now().toString().slice(-4)}`,
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        parentCategoryId: formCatId,
        isActive: formActive,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Sub-Category / Dept "${newItem.name}" added.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                code: formCode.trim().toUpperCase(),
                name: formName.trim(),
                parentCategoryId: formCatId,
                isActive: formActive,
              }
            : d
        )
      );
      ToastService.success(`Sub-Category / Dept updated.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const next = !d.isActive;
          ToastService.info(
            `Department ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Work Department / Sub-Category Master"
      description="Manage civil sub-departments, executing divisions, and sub-categories under primary work categories."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.externalMastersMenu },
        { label: 'Work Department' },
      ]}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          gap: '1rem',
        }}
      >
        <div style={{ width: '320px' }}>
          <DropDownList
            label="Filter by Work Category"
            data={[
              { label: 'All Categories', value: 'ALL' },
              ...categories.map(c => ({ label: c.name, value: c.id })),
            ]}
            textField="label"
            optionValue="value"
            value={filterCat}
            onChange={val => setFilterCat(val as string)}
          />
        </div>
        <Button
          label="Add Department"
          icon="plus"
          variant="primary"
          onClick={openAdd}
        />
      </div>

      <FormCard>
        <GridPanel
          data={filteredData}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'code',
              header: 'Dept Code',
              cell: (item: CivilManagement.WorkDepartmentMaster) => (
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
              header: 'Department / Executing Sub-Division',
              cell: (item: CivilManagement.WorkDepartmentMaster) => (
                <span style={{ fontWeight: 600 }}>{item.name}</span>
              ),
            },
            {
              field: 'parentCategoryId',
              header: 'Parent Work Category',
              cell: (item: CivilManagement.WorkDepartmentMaster) => {
                const cat = categories.find(
                  c => c.id === item.parentCategoryId
                );
                return (
                  <span
                    className="civil-pill blue"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {cat?.name || 'All Categories'}
                  </span>
                );
              },
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.WorkDepartmentMaster) => (
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
              cell: (item: CivilManagement.WorkDepartmentMaster) => (
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
          searchPlaceholder="Search departments..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add'
            ? 'Add Department / Sub-Category'
            : 'Edit Department'
        }
        subtitle="Executing engineering division or sub-category."
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
          <DropDownList
            label="Parent Work Category"
            data={categories.map(c => ({ label: c.name, value: c.id }))}
            textField="label"
            optionValue="value"
            value={formCatId}
            onChange={val => setFormCatId(val as string)}
          />
          <TextBox
            label="Department / Sub-Category Code"
            placeholder="e.g. CIV, EST, ELE"
            value={formCode}
            onChange={setFormCode}
            required
          />
          <TextBox
            label="Department Name"
            placeholder="e.g. Civil Engineering Dept"
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
              label={
                popup.mode === 'add' ? 'Create Department' : 'Save Changes'
              }
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
