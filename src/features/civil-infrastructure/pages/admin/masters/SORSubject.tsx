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
import {
  initialSORChapters,
  initialSORSubjects,
  initialSORTypes,
} from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_SUBJECTS = CIVIL_STORAGE_KEYS.SOR_SUBJECTS;

export default function SORSubjectMaster() {
  const [types] = useCivilStorage<CivilManagement.SORType[]>(
    CIVIL_STORAGE_KEYS.SOR_TYPES,
    initialSORTypes
  );

  const [chapters] = useCivilStorage<CivilManagement.SORChapter[]>(
    CIVIL_STORAGE_KEYS.SOR_CHAPTERS,
    initialSORChapters
  );

  const [data, setData] = useState<CivilManagement.SORSubject[]>(() => {
    const saved = localStorage.getItem(STORAGE_SUBJECTS);
    return saved ? JSON.parse(saved) : initialSORSubjects;
  });

  const [filterChapter, setFilterChapter] = useState<string>('ALL');

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.SORSubject;
  }>({ mode: 'closed' });

  const [formChapterId, setFormChapterId] = useState('');
  const [formName, setFormName] = useState('');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    civilStorage.set(STORAGE_SUBJECTS, data);
  }, [data]);

  const filteredData = useMemo(() => {
    if (filterChapter === 'ALL') return data;
    return data.filter(d => d.sorChapterId === filterChapter);
  }, [data, filterChapter]);

  const openAdd = () => {
    setFormChapterId(chapters[0]?.id || '');
    setFormName('');
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.SORSubject) => {
    setFormChapterId(item.sorChapterId);
    setFormName(item.name);
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formChapterId || !formName.trim()) {
      ToastService.error('Chapter and Subject Name are required.');
      return;
    }

    const chapObj = chapters.find(c => c.id === formChapterId);
    const chapName = chapObj?.name || '';
    const typeId = chapObj?.sorTypeId || '';

    if (popup.mode === 'add') {
      const newItem: CivilManagement.SORSubject = {
        id: `SSU-${Date.now().toString().slice(-4)}`,
        sorChapterId: formChapterId,
        sorChapterName: chapName,
        sorTypeId: typeId,
        name: formName.trim(),
        isActive: formActive,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`SOR Subject "${newItem.name}" added successfully.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                sorChapterId: formChapterId,
                sorChapterName: chapName,
                sorTypeId: typeId,
                name: formName.trim(),
                isActive: formActive,
              }
            : d
        )
      );
      ToastService.success(`SOR Subject updated successfully.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const next = !d.isActive;
          ToastService.info(
            `SOR Subject ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="SOR Subject Master"
      description="Define specific item categories and subjects under each chapter (e.g., M25 RCC Columns, Excavation in hard rock)."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.externalMastersMenu },
        { label: 'SOR Subject' },
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
        <div style={{ width: '360px' }}>
          <DropDownList
            label="Filter by Chapter"
            data={[
              { label: 'All Chapters', value: 'ALL' },
              ...chapters.map(c => ({
                label: `Ch-${c.chapterNo}: ${c.name}`,
                value: c.id,
              })),
            ]}
            textField="label"
            optionValue="value"
            value={filterChapter}
            onChange={val => setFilterChapter(val as string)}
          />
        </div>
        <Button
          label="Add SOR Subject"
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
              field: 'sorChapterName',
              header: 'Chapter',
              cell: (item: CivilManagement.SORSubject) => {
                const chap = chapters.find(c => c.id === item.sorChapterId);
                return (
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    {chap
                      ? `Ch-${chap.chapterNo}: ${chap.name}`
                      : item.sorChapterName || item.sorChapterId}
                  </span>
                );
              },
            },
            {
              field: 'name',
              header: 'Subject / Scope',
              cell: (item: CivilManagement.SORSubject) => (
                <span style={{ fontWeight: 600, color: '#1f2937' }}>
                  {item.name}
                </span>
              ),
            },
            {
              field: 'sorTypeId',
              header: 'Classification',
              cell: (item: CivilManagement.SORSubject) => {
                const t = types.find(x => x.id === item.sorTypeId);
                return (
                  <span
                    className="civil-pill blue"
                    style={{ fontSize: '0.72rem' }}
                  >
                    {t?.code || 'SOR'}
                  </span>
                );
              },
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.SORSubject) => (
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
              cell: (item: CivilManagement.SORSubject) => (
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
          searchPlaceholder="Search SOR subjects..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'add' ? 'Add SOR Subject' : 'Edit SOR Subject'}
        subtitle="Specify item trade subject under a chapter."
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
            label="Chapter"
            data={chapters.map(c => ({
              label: `Ch-${c.chapterNo}: ${c.name} (${types.find(t => t.id === c.sorTypeId)?.code || ''})`,
              value: c.id,
            }))}
            textField="label"
            optionValue="value"
            value={formChapterId}
            onChange={val => setFormChapterId(val as string)}
            required
          />
          <TextBox
            label="Subject Title / Scope Description"
            placeholder="e.g. M25 Grade RCC in Columns and Slabs"
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
              label={popup.mode === 'add' ? 'Create Subject' : 'Save Changes'}
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
