import { useState } from 'react';
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
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../../civilStorage';
import { initialSORChapters, initialSORTypes } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

export default function SORChapterMaster() {
  const [types] = useCivilStorage<CivilManagement.SORType[]>(
    CIVIL_STORAGE_KEYS.SOR_TYPES,
    initialSORTypes
  );

  const [data, setData] = useCivilStorage<CivilManagement.SORChapter[]>(
    CIVIL_STORAGE_KEYS.SOR_CHAPTERS,
    initialSORChapters
  );

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.SORChapter;
  }>({ mode: 'closed' });

  const [formTypeId, setFormTypeId] = useState('');
  const [formChapterNo, setFormChapterNo] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const openAdd = () => {
    setFormTypeId(String(types[0]?.id || ''));
    setFormChapterNo('');
    setFormDesc('');
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.SORChapter) => {
    setFormTypeId(String(item.sorTypeId || (item as any).sorTypeCode || ''));
    setFormChapterNo(
      (item.chapterNo || (item as any).chapterNumber || '').replace(
        /^Ch-+/i,
        ''
      )
    );
    setFormDesc(
      item.name || (item as any).chapterDesc || (item as any).description || ''
    );
    setPopup({ mode: 'edit', item });
  };

  const handleReset = () => {
    if (popup.mode === 'edit' && popup.item) {
      setFormTypeId(
        String(popup.item.sorTypeId || (popup.item as any).sorTypeCode || '')
      );
      setFormChapterNo(
        (
          popup.item.chapterNo ||
          (popup.item as any).chapterNumber ||
          ''
        ).replace(/^Ch-+/i, '')
      );
      setFormDesc(
        popup.item.name ||
          (popup.item as any).chapterDesc ||
          (popup.item as any).description ||
          ''
      );
    } else {
      setFormTypeId(String(types[0]?.id || ''));
      setFormChapterNo('');
      setFormDesc('');
    }
  };

  const handleSave = () => {
    if (!formTypeId || !formChapterNo.trim() || !formDesc.trim()) {
      ToastService.error(
        'SOR Type, Chapter No and Chapter Description are required.'
      );
      return;
    }

    const typeObj = types.find(
      t => t.id === formTypeId || t.code === formTypeId
    );
    const typeCode = typeObj?.code || 'SOR';
    const typeName =
      typeObj?.name ||
      (typeObj as any)?.type ||
      (typeObj as any)?.description ||
      '';
    const cleanNo = formChapterNo.trim().replace(/^Ch-+/i, '');

    if (popup.mode === 'add') {
      const newItem: CivilManagement.SORChapter = {
        id: `SCH-${Date.now().toString().slice(-4)}`,
        sorTypeId: formTypeId,
        sorTypeCode: typeCode,
        sorTypeName: typeName,
        chapterNo: cleanNo,
        chapterNumber: cleanNo,
        name: formDesc.trim(),
        description: formDesc.trim(),
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(
        `SOR Chapter "${newItem.chapterNo} - ${newItem.name}" created successfully.`
      );
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                sorTypeId: formTypeId,
                sorTypeCode: typeCode,
                sorTypeName: typeName,
                chapterNo: cleanNo,
                chapterNumber: cleanNo,
                name: formDesc.trim(),
                description: formDesc.trim(),
              }
            : d
        )
      );
      ToastService.success(`SOR Chapter updated successfully.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const current = d.isActive !== false;
          const next = !current;
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
      description="Manage Schedule of Rates (SOR) chapters for civil infrastructure."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Masters', to: civilUrls.externalMastersMenu },
        { label: 'SOR Chapter' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'sorTypeCode',
              header: 'SOR Type',
              cell: (item: CivilManagement.SORChapter) => {
                const matched = types.find(
                  t =>
                    t.id === item.sorTypeId ||
                    t.code === item.sorTypeId ||
                    t.id === (item as any).sorTypeCode ||
                    t.code === (item as any).sorTypeCode
                );
                return (
                  <span>
                    {matched?.code || (item as any).sorTypeCode || 'SOR'}
                  </span>
                );
              },
            },
            {
              field: 'chapterNumber',
              header: 'Chapter No',
              cell: (item: CivilManagement.SORChapter) => {
                const cleanNo = (
                  item.chapterNo ||
                  (item as any).chapterNumber ||
                  ''
                ).replace(/^Ch-+/i, '');
                return <span>{cleanNo || '01'}</span>;
              },
            },
            {
              field: 'description',
              header: 'Chapter Description',
              cell: (item: CivilManagement.SORChapter) => (
                <span style={{ fontWeight: 500, color: '#111827' }}>
                  {item.name ||
                    (item as any).chapterDesc ||
                    (item as any).description ||
                    '—'}
                </span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.SORChapter) => (
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
              cell: (item: CivilManagement.SORChapter) => (
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
          searchPlaceholder="Search chapters..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'add' ? 'Create SOR Chapter' : 'Edit SOR Chapter'}
        subtitle={
          popup.mode === 'add'
            ? 'Fill in the details to add a new SOR chapter.'
            : 'Update the SOR chapter details.'
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
            <DropDownList
              label="SOR Type"
              data={types.map(t => ({
                label: `${t.code} — ${t.name || (t as any).type || (t as any).description || t.code}`,
                value: t.id,
              }))}
              textField="label"
              optionValue="value"
              value={formTypeId}
              onChange={val => setFormTypeId(val as string)}
              required
            />
            <TextBox
              label="Chapter No"
              placeholder="Enter Chapter No (e.g. CH-01)"
              value={formChapterNo}
              onChange={setFormChapterNo}
              required
            />
          </div>
          <TextBox
            label="Chapter Description"
            placeholder="Enter Chapter Description"
            value={formDesc}
            onChange={setFormDesc}
            required
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
