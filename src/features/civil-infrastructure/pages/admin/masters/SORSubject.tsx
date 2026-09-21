import { useMemo, useState } from 'react';
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
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../../civilStorage';
import {
  initialSORChapters,
  initialSORSubjects,
  initialSORTypes,
} from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

export default function SORSubjectMaster() {
  const [types] = useCivilStorage<CivilManagement.SORType[]>(
    CIVIL_STORAGE_KEYS.SOR_TYPES,
    initialSORTypes
  );

  const [chapters] = useCivilStorage<CivilManagement.SORChapter[]>(
    CIVIL_STORAGE_KEYS.SOR_CHAPTERS,
    initialSORChapters
  );

  const [data, setData] = useCivilStorage<CivilManagement.SORSubject[]>(
    CIVIL_STORAGE_KEYS.SOR_SUBJECTS,
    initialSORSubjects
  );

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.SORSubject;
  }>({ mode: 'closed' });

  const [formTypeId, setFormTypeId] = useState('');
  const [formChapterId, setFormChapterId] = useState('');
  const [formName, setFormName] = useState('');
  const [formRefCode, setFormRefCode] = useState('');
  const [formParagraph, setFormParagraph] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const filteredChapters = useMemo(() => {
    if (!formTypeId) return chapters;
    return chapters.filter(
      c => c.sorTypeId === formTypeId || (c as any).sorTypeCode === formTypeId
    );
  }, [chapters, formTypeId]);

  const selectedChapter = useMemo(() => {
    return chapters.find(
      c => c.id === formChapterId || (c as any).sorChapterId === formChapterId
    );
  }, [chapters, formChapterId]);

  const openAdd = () => {
    const defaultType = String(types[0]?.id || '');
    setFormTypeId(defaultType);
    const firstChap =
      chapters.find(c => String(c.sorTypeId) === defaultType) || chapters[0];
    setFormChapterId(String(firstChap?.id || ''));
    setFormName('');
    setFormRefCode('');
    setFormParagraph('');
    setFormDesc('');
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.SORSubject) => {
    setFormTypeId(
      String(item.sorTypeId || (item as any).sorTypeCode || types[0]?.id || '')
    );
    setFormChapterId(
      String(
        item.sorChapterId || (item as any).chapterId || chapters[0]?.id || ''
      )
    );
    setFormName(item.name || (item as any).subjectName || '');
    setFormRefCode(item.referenceCode || (item as any).refIsCode || '');
    setFormParagraph(item.paragraph || (item as any).newPara || '');
    setFormDesc(item.description || '');
    setPopup({ mode: 'edit', item });
  };

  const handleReset = () => {
    if (popup.mode === 'edit' && popup.item) {
      setFormTypeId(
        String(
          popup.item.sorTypeId ||
            (popup.item as any).sorTypeCode ||
            types[0]?.id ||
            ''
        )
      );
      setFormChapterId(
        String(
          popup.item.sorChapterId ||
            (popup.item as any).chapterId ||
            chapters[0]?.id ||
            ''
        )
      );
      setFormName(popup.item.name || (popup.item as any).subjectName || '');
      setFormRefCode(
        popup.item.referenceCode || (popup.item as any).refIsCode || ''
      );
      setFormParagraph(
        popup.item.paragraph || (popup.item as any).newPara || ''
      );
      setFormDesc(popup.item.description || '');
    } else {
      const defaultType = String(types[0]?.id || '');
      setFormTypeId(defaultType);
      const firstChap =
        chapters.find(c => String(c.sorTypeId) === defaultType) || chapters[0];
      setFormChapterId(String(firstChap?.id || ''));
      setFormName('');
      setFormRefCode('');
      setFormParagraph('');
      setFormDesc('');
    }
  };

  const handleSave = () => {
    if (!formChapterId || !formName.trim()) {
      ToastService.error('SOR Chapter and Subject Name are required.');
      return;
    }

    const chapObj = chapters.find(
      c => c.id === formChapterId || (c as any).sorChapterId === formChapterId
    );
    const chapName = chapObj?.name || (chapObj as any)?.chapterDesc || '';
    const chapNo = chapObj?.chapterNo || (chapObj as any)?.chapterNumber || '';
    const typeObj = types.find(
      t => t.id === formTypeId || t.code === formTypeId
    );
    const typeCode = typeObj?.code || 'SOR';

    if (popup.mode === 'add') {
      const newItem: CivilManagement.SORSubject = {
        id: `SSU-${Date.now().toString().slice(-4)}`,
        sorTypeId: formTypeId,
        sorTypeCode: typeCode,
        sorChapterId: formChapterId,
        sorChapterName: chapName,
        chapterNo: chapNo,
        chapterDescription: chapName,
        name: formName.trim(),
        referenceCode: formRefCode.trim() || undefined,
        paragraph: formParagraph.trim() || undefined,
        description: formDesc.trim() || undefined,
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(
        `SOR Subject "${newItem.name}" created successfully.`
      );
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                sorTypeId: formTypeId,
                sorChapterId: formChapterId,
                sorChapterName: chapName,
                chapterNo: chapNo,
                chapterDescription: chapName,
                name: formName.trim(),
                referenceCode: formRefCode.trim() || undefined,
                paragraph: formParagraph.trim() || undefined,
                description: formDesc.trim() || undefined,
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
          const current = d.isActive !== false;
          const next = !current;
          ToastService.info(`Subject ${next ? 'Activated' : 'Deactivated'}.`);
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="SOR Subject Master"
      description="Manage Schedule of Rates (SOR) subjects for civil infrastructure."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.externalMastersMenu },
        { label: 'SOR Subject' },
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
              cell: (item: CivilManagement.SORSubject) => {
                const chap = chapters.find(
                  c =>
                    c.id === item.sorChapterId ||
                    (c as any).sorChapterId === item.sorChapterId
                );
                const typ = types.find(
                  t => t.id === item.sorTypeId || t.id === chap?.sorTypeId
                );
                return (
                  <span>{typ?.code || (item as any).sorTypeCode || 'SOR'}</span>
                );
              },
            },
            {
              field: 'chapterNo',
              header: 'Chapter No',
              cell: (item: CivilManagement.SORSubject) => {
                const chap = chapters.find(
                  c =>
                    c.id === item.sorChapterId ||
                    (c as any).sorChapterId === item.sorChapterId
                );
                return (
                  <span>
                    {(item as any).chapterNo ||
                      chap?.chapterNo ||
                      (chap as any)?.chapterNumber ||
                      '01'}
                  </span>
                );
              },
            },
            {
              field: 'chapterDescription',
              header: 'Chapter Description',
              cell: (item: CivilManagement.SORSubject) => {
                const chap = chapters.find(
                  c =>
                    c.id === item.sorChapterId ||
                    (c as any).sorChapterId === item.sorChapterId
                );
                return (
                  <span>
                    {item.sorChapterName ||
                      (item as any).chapterDescription ||
                      chap?.name ||
                      (chap as any)?.chapterDesc ||
                      '—'}
                  </span>
                );
              },
            },
            {
              field: 'name',
              header: 'Subject Name',
              cell: (item: CivilManagement.SORSubject) => (
                <span style={{ fontWeight: 600, color: '#111827' }}>
                  {item.name || (item as any).subjectName || '—'}
                </span>
              ),
            },
            {
              field: 'description',
              header: 'Subject Description',
              cell: (item: CivilManagement.SORSubject) => (
                <span>{item.description || '—'}</span>
              ),
            },
            {
              field: 'referenceCode',
              header: 'Ref. IS Code',
              cell: (item: CivilManagement.SORSubject) => (
                <span>
                  {item.referenceCode || (item as any).refIsCode || 'N/A'}
                </span>
              ),
            },
            {
              field: 'paragraph',
              header: 'Paragraph',
              cell: (item: CivilManagement.SORSubject) => (
                <span>{item.paragraph || (item as any).newPara || 'N/A'}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.SORSubject) => (
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
              cell: (item: CivilManagement.SORSubject) => (
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
          searchPlaceholder="Search subjects..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add' ? 'Add New SOR Subject' : 'Edit SOR Subject'
        }
        subtitle="Manage subject details under SOR types and chapters."
        size="lg"
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
              onChange={val => {
                const newTypeId = val as string;
                setFormTypeId(newTypeId);
                const firstMatching = chapters.find(
                  c => c.sorTypeId === newTypeId
                );
                if (firstMatching) {
                  setFormChapterId(String(firstMatching.id || ''));
                }
              }}
              required
            />
            <DropDownList
              label="SOR Chapter"
              data={filteredChapters.map(c => ({
                label: `${c.chapterNo || (c as any).chapterNumber} — ${c.name || (c as any).chapterDesc}`,
                value: c.id,
              }))}
              textField="label"
              optionValue="value"
              value={formChapterId}
              onChange={val => setFormChapterId(val as string)}
              required
            />
          </div>

          <TextArea
            label="Chapter Description (Autofilled)"
            value={
              selectedChapter?.name ||
              (selectedChapter as any)?.chapterDesc ||
              (selectedChapter as any)?.description ||
              ''
            }
            rows={2}
            disabled
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem',
            }}
          >
            <TextBox
              label="Subject Name"
              placeholder="Enter subject name..."
              value={formName}
              onChange={setFormName}
              required
            />
            <TextBox
              label="Ref. IS Code"
              placeholder="e.g. IS 456:2000"
              value={formRefCode}
              onChange={setFormRefCode}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem',
            }}
          >
            <TextArea
              label="Subject Description"
              placeholder="Enter subject technical details..."
              value={formDesc}
              onChange={setFormDesc}
              rows={3}
            />
            <TextBox
              label="Paragraph"
              placeholder="e.g. Para 5.4"
              value={formParagraph}
              onChange={setFormParagraph}
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
