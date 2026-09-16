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
import { initialSORChapters, initialSORTypes } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_CHAPTERS = 'civil_sor_chapters';
const STORAGE_TYPES = 'civil_sor_types';

export default function SORChapterMaster() {
  const [types] = useState<CivilManagement.SORType[]>(() => {
    const saved = localStorage.getItem(STORAGE_TYPES);
    return saved ? JSON.parse(saved) : initialSORTypes;
  });

  const [data, setData] = useState<CivilManagement.SORChapter[]>(() => {
    const saved = localStorage.getItem(STORAGE_CHAPTERS);
    return saved ? JSON.parse(saved) : initialSORChapters;
  });

  const [filterType, setFilterType] = useState<string>('ALL');

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.SORChapter;
  }>({ mode: 'closed' });

  const [formTypeId, setFormTypeId] = useState('');
  const [formChapterNo, setFormChapterNo] = useState('');
  const [formName, setFormName] = useState('');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_CHAPTERS, JSON.stringify(data));
  }, [data]);

  const filteredData = useMemo(() => {
    if (filterType === 'ALL') return data;
    return data.filter(d => d.sorTypeId === filterType);
  }, [data, filterType]);

  const openAdd = () => {
    setFormTypeId(types[0]?.id || '');
    setFormChapterNo('');
    setFormName('');
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.SORChapter) => {
    setFormTypeId(item.sorTypeId);
    setFormChapterNo(item.chapterNo);
    setFormName(item.name);
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formTypeId || !formChapterNo.trim() || !formName.trim()) {
      ToastService.error('SOR Type, Chapter No and Chapter Name are required.');
      return;
    }

    const typeObj = types.find(t => t.id === formTypeId);
    const typeName = typeObj?.name || '';

    if (popup.mode === 'add') {
      const newItem: CivilManagement.SORChapter = {
        id: `SCH-${Date.now().toString().slice(-4)}`,
        sorTypeId: formTypeId,
        sorTypeName: typeName,
        chapterNo: formChapterNo.trim(),
        name: formName.trim(),
        isActive: formActive,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(
        `Chapter "${newItem.chapterNo} - ${newItem.name}" created.`
      );
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                sorTypeId: formTypeId,
                sorTypeName: typeName,
                chapterNo: formChapterNo.trim(),
                name: formName.trim(),
                isActive: formActive,
              }
            : d
        )
      );
      ToastService.success(`Chapter updated successfully.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const next = !d.isActive;
          ToastService.info(`Chapter ${next ? 'Activated' : 'Deactivated'}.`);
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="SOR Chapter Master"
      description="Define chapters grouping related works under each SOR Classification (e.g. Earthwork, RCC, Brickwork)."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Masters' },
        { label: 'SOR Chapter' },
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
            label="Filter by SOR Type"
            data={[
              { label: 'All SOR Types', value: 'ALL' },
              ...types.map(t => ({
                label: `${t.code} - ${t.name}`,
                value: t.id,
              })),
            ]}
            textField="label"
            optionValue="value"
            value={filterType}
            onChange={val => setFilterType(val as string)}
          />
        </div>
        <Button
          label="Add SOR Chapter"
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
              field: 'sorTypeName',
              header: 'SOR Classification',
              cell: (item: CivilManagement.SORChapter) => (
                <span
                  className="civil-pill blue"
                  style={{ fontSize: '0.75rem' }}
                >
                  {item.sorTypeName ||
                    types.find(t => t.id === item.sorTypeId)?.name ||
                    item.sorTypeId}
                </span>
              ),
            },
            {
              field: 'chapterNo',
              header: 'Chapter No.',
              cell: (item: CivilManagement.SORChapter) => (
                <span
                  style={{
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontFamily: 'monospace',
                  }}
                >
                  Ch-{item.chapterNo}
                </span>
              ),
            },
            {
              field: 'name',
              header: 'Chapter Title / Trade',
              cell: (item: CivilManagement.SORChapter) => (
                <span style={{ fontWeight: 600 }}>{item.name}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.SORChapter) => (
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
              cell: (item: CivilManagement.SORChapter) => (
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
          searchPlaceholder="Search chapters..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'add' ? 'Add SOR Chapter' : 'Edit SOR Chapter'}
        subtitle="Group related civil items into functional chapters."
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
            label="SOR Classification (Type)"
            data={types.map(t => ({
              label: `${t.code} - ${t.name}`,
              value: t.id,
            }))}
            textField="label"
            optionValue="value"
            value={formTypeId}
            onChange={val => setFormTypeId(val as string)}
            required
          />
          <TextBox
            label="Chapter Number"
            placeholder="e.g. 01 or 02"
            value={formChapterNo}
            onChange={setFormChapterNo}
            required
          />
          <TextBox
            label="Chapter Title / Trade"
            placeholder="e.g. Plain & Reinforced Cement Concrete"
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
              label={popup.mode === 'add' ? 'Create Chapter' : 'Save Changes'}
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
