import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  Checkbox,
  DatePicker,
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewGrid,
  StatusBadge,
} from 'shared/new-components';
import { formatCurrency } from 'shared/utils/currency';
import {
  CIVIL_STORAGE_KEYS,
  civilStorage,
  useCivilStorage,
} from '../../../civilStorage';
import {
  initialSORChapters,
  initialSORItemMasters,
  initialSORSubjects,
  initialSORTypes,
  type MockSORItem,
} from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: MockSORItem }
  | { mode: 'view'; item: MockSORItem };

const UNIT_OPTIONS = [
  { label: 'Cum (Cubic Meter)', value: 'Cum' },
  { label: 'Sqm (Square Meter)', value: 'Sqm' },
  { label: 'Rmt (Running Meter)', value: 'Rmt' },
  { label: 'MT (Metric Tonne)', value: 'MT' },
  { label: 'Kg (Kilogram)', value: 'Kg' },
  { label: 'Nos (Numbers)', value: 'Nos' },
  { label: 'Lump-sum', value: 'LS' },
  { label: 'Quintal', value: 'Qtl' },
  { label: 'Bags', value: 'Bags' },
];

export default function SORItemMaster() {
  const [items, setItems] = useCivilStorage<MockSORItem[]>(
    'civil_sor_item_masters',
    initialSORItemMasters
  );

  const [sorTypes] = useCivilStorage<CivilManagement.SORType[]>(
    CIVIL_STORAGE_KEYS.SOR_TYPES,
    initialSORTypes
  );

  const [sorChapters] = useCivilStorage<CivilManagement.SORChapter[]>(
    CIVIL_STORAGE_KEYS.SOR_CHAPTERS,
    initialSORChapters
  );

  const [sorSubjects] = useCivilStorage<CivilManagement.SORSubject[]>(
    CIVIL_STORAGE_KEYS.SOR_SUBJECTS,
    initialSORSubjects
  );

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Form State
  const [sorTypeId, setSorTypeId] = useState<number>(1);
  const [sorChapterId, setSorChapterId] = useState<number>(1);
  const [sorSubjectId, setSorSubjectId] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [subjectTitle, setSubjectTitle] = useState<string>('');
  const [serialNumber, setSerialNumber] = useState<string>('1.1');
  const [serialDescription, setSerialDescription] = useState<string>('');
  const [workDescription, setWorkDescription] = useState<string>('');
  const [numberOfCementBags, setNumberOfCementBags] = useState<number>(0);
  const [unit, setUnit] = useState<string>('Cum');
  const [rate, setRate] = useState<number>(0);
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isRateSet, setIsRateSet] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const saveItems = (newItems: MockSORItem[]) => {
    setItems(newItems);
    civilStorage.set(CIVIL_STORAGE_KEYS.SOR_ITEMS, newItems);
  };

  const handleSorTypeChange = (newTypeId: number) => {
    setSorTypeId(newTypeId);
    const availableChaps = sorChapters.filter(
      c => Number(c.sorTypeId) === newTypeId || Number(c.id) === newTypeId
    );
    if (availableChaps.length > 0) {
      const nextChapId = Number(
        availableChaps[0].id || availableChaps[0].sorChapterId
      );
      setSorChapterId(nextChapId);
      const availableSubs = sorSubjects.filter(
        s => Number(s.sorChapterId) === nextChapId
      );
      if (availableSubs.length > 0) {
        setSorSubjectId(
          Number(availableSubs[0].id || availableSubs[0].sorSubjectId)
        );
      }
    }
  };

  const handleSorChapterChange = (newChapId: number) => {
    setSorChapterId(newChapId);
    const chap = sorChapters.find(
      c => Number(c.id) === newChapId || Number(c.sorChapterId) === newChapId
    );
    if (chap && chap.sorTypeId && Number(chap.sorTypeId) !== sorTypeId) {
      setSorTypeId(Number(chap.sorTypeId));
    }
    const availableSubs = sorSubjects.filter(
      s => Number(s.sorChapterId) === newChapId
    );
    if (availableSubs.length > 0) {
      setSorSubjectId(
        Number(availableSubs[0].id || availableSubs[0].sorSubjectId)
      );
    }
  };

  const handleSorSubjectChange = (newSubId: number) => {
    setSorSubjectId(newSubId);
    const sub = sorSubjects.find(
      s => Number(s.id) === newSubId || Number(s.sorSubjectId) === newSubId
    );
    if (sub) {
      if (sub.sorChapterId && Number(sub.sorChapterId) !== sorChapterId) {
        setSorChapterId(Number(sub.sorChapterId));
      }
      if (sub.sorTypeId && Number(sub.sorTypeId) !== sorTypeId) {
        setSorTypeId(Number(sub.sorTypeId));
      }
      if (
        popup.mode === 'create' &&
        (!workDescription || workDescription.trim() === '')
      ) {
        setWorkDescription(sub.description || sub.name || '');
      }
    }
  };

  const openCreateModal = () => {
    const firstType = sorTypes[0]?.id ? Number(sorTypes[0].id) : 1;
    const firstChap = sorChapters[0]?.id ? Number(sorChapters[0].id) : 1;
    const firstSub = sorSubjects[0]?.id ? Number(sorSubjects[0].id) : 1;

    setSorTypeId(firstType);
    setSorChapterId(firstChap);
    setSorSubjectId(firstSub);
    setPageNumber(1);
    setSubjectTitle('');
    setSerialNumber('1.1');
    setSerialDescription('');
    setWorkDescription('');
    setNumberOfCementBags(0);
    setUnit('Cum');
    setRate(0);
    setEffectiveDate(new Date().toISOString().split('T')[0]);
    setIsRateSet(false);
    setPercentage(0);
    setPopup({ mode: 'create' });
  };

  const openEditModal = (item: MockSORItem) => {
    setSorTypeId(item.sorTypeId || 1);
    setSorChapterId(item.sorChapterId || 1);
    setSorSubjectId(item.sorSubjectId || 1);
    setPageNumber(item.pageNumber || 1);
    setSubjectTitle(item.subjectTitle || '');
    setSerialNumber(item.serialNumber || '1.1');
    setSerialDescription(item.serialDescription || '');
    setWorkDescription(item.workDescription || item.itemDescription || '');
    setNumberOfCementBags(item.numberOfCementBags || 0);
    setUnit(item.unit || 'Cum');
    setRate(item.rate || 0);
    setEffectiveDate(
      item.effectiveDate || new Date().toISOString().split('T')[0]
    );
    setIsRateSet(Boolean(item.isRateSet));
    setPercentage(item.percentage || 0);
    setPopup({ mode: 'edit', item });
  };

  const resetForm = () => {
    if (popup.mode === 'edit' && popup.item) {
      openEditModal(popup.item);
    } else {
      openCreateModal();
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!serialNumber.trim()) {
      ToastService.error('Serial No. is required.');
      return;
    }
    if (!workDescription.trim()) {
      ToastService.error('Work Description is required.');
      return;
    }
    if (!unit.trim()) {
      ToastService.error('Unit is required.');
      return;
    }
    if (!rate || rate <= 0) {
      ToastService.error('Rate must be greater than 0.');
      return;
    }

    const typeObj = sorTypes.find(
      t =>
        Number(t.id) === sorTypeId || Number((t as any).sorTypeId) === sorTypeId
    );
    const chapterObj = sorChapters.find(
      c =>
        Number(c.id) === sorChapterId ||
        Number((c as any).sorChapterId) === sorChapterId
    );
    const subjectObj = sorSubjects.find(
      s =>
        Number(s.id) === sorSubjectId ||
        Number((s as any).sorSubjectId) === sorSubjectId
    );

    const typeCode = typeObj?.code || 'PWD-B';
    const chapNo = chapterObj?.chapterNo || String(sorChapterId);
    const subName =
      subjectObj?.name || (subjectObj as any)?.subjectName || 'General';

    if (popup.mode === 'create') {
      const newItem: MockSORItem = {
        sorItemId: Date.now(),
        sorTypeId,
        sorTypeCode: typeCode,
        sorTypeName: typeObj?.name || 'Building Works',
        sorChapterId,
        chapterNo: chapNo,
        sorChapterName: chapterObj?.name || 'General',
        sorSubjectId,
        subjectName: subName,
        sorSubjectName: subName,
        sorCode: `SOR-${typeCode}-${chapNo}-${serialNumber.trim()}`,
        pageNumber,
        subjectTitle: subjectTitle.trim(),
        serialNumber: serialNumber.trim(),
        serialDescription: serialDescription.trim(),
        workDescription: workDescription.trim(),
        itemDescription: workDescription.trim(),
        numberOfCementBags,
        unit: unit.trim(),
        rate,
        effectiveDate,
        isRateSet,
        percentage: isRateSet ? percentage : 0,
        isActive: true,
      };
      saveItems([newItem, ...items]);
      ToastService.success('SOR Item created successfully.');
    } else if (popup.mode === 'edit' && popup.item) {
      const updated = items.map(i =>
        i.sorItemId === popup.item.sorItemId
          ? {
              ...i,
              sorTypeId,
              sorTypeCode: typeCode,
              sorTypeName: typeObj?.name || i.sorTypeName,
              sorChapterId,
              chapterNo: chapNo,
              sorChapterName: chapterObj?.name || i.sorChapterName,
              sorSubjectId,
              subjectName: subName,
              sorSubjectName: subName,
              sorCode: `SOR-${typeCode}-${chapNo}-${serialNumber.trim()}`,
              pageNumber,
              subjectTitle: subjectTitle.trim(),
              serialNumber: serialNumber.trim(),
              serialDescription: serialDescription.trim(),
              workDescription: workDescription.trim(),
              itemDescription: workDescription.trim(),
              numberOfCementBags,
              unit: unit.trim(),
              rate,
              effectiveDate,
              isRateSet,
              percentage: isRateSet ? percentage : 0,
            }
          : i
      );
      saveItems(updated);
      ToastService.success('SOR Item updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (item: MockSORItem) => {
    const updated = items.map(i =>
      i.sorItemId === item.sorItemId ? { ...i, isActive: !i.isActive } : i
    );
    saveItems(updated);
    ToastService.info(
      `SOR Item ${!item.isActive ? 'Activated' : 'Deactivated'}.`
    );
  };

  const filteredChapters = sorChapters.filter(
    c =>
      !sorTypeId ||
      Number(c.sorTypeId) === sorTypeId ||
      Number(c.id) === sorTypeId
  );

  const filteredSubjects = sorSubjects.filter(
    s => !sorChapterId || Number(s.sorChapterId) === sorChapterId
  );

  return (
    <FormPage
      title="Schedule of Rates (SOR)"
      description="Rates acting as the legal price baseline for engineering designs."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'SOR Masters', to: civilUrls.sorType },
        { label: 'Schedule of Rates (SOR)' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={items}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            {
              field: 'sorTypeCode',
              header: 'SOR Type',
              cell: (item: MockSORItem) => (
                <span>{item.sorTypeCode || item.sorTypeName || '—'}</span>
              ),
            },
            {
              field: 'chapterNo',
              header: 'Chapter No.',
              cell: (item: MockSORItem) => (
                <span>{item.chapterNo || item.sorChapterName || '—'}</span>
              ),
            },
            {
              field: 'serialNumber',
              header: 'Serial No.',
              cell: (item: MockSORItem) => (
                <span style={{ fontWeight: 600 }}>
                  {item.serialNumber || '—'}
                </span>
              ),
            },
            {
              field: 'subjectName',
              header: 'Subject Name',
              cell: (item: MockSORItem) => (
                <span>{item.subjectName || item.sorSubjectName || '—'}</span>
              ),
            },
            {
              field: 'unit',
              header: 'Unit',
              cell: (item: MockSORItem) => <span>{item.unit}</span>,
            },
            {
              field: 'rate',
              header: 'Rate (₹)',
              cell: (item: MockSORItem) => (
                <span>{formatCurrency(item.rate)}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: MockSORItem) => (
                <StatusButton
                  value={item.isActive !== false}
                  onClick={() => toggleStatus(item)}
                />
              ),
            },
            {
              header: 'Action',
              sortable: false,
              cell: (item: MockSORItem) => (
                <GridActionButtons
                  onView={() => setPopup({ mode: 'view', item })}
                  onEdit={() => openEditModal(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add SOR Item"
              icon="plus"
              variant="primary"
              onClick={openCreateModal}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        size="lg"
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'create'
            ? 'Add New SOR Item'
            : popup.mode === 'edit'
              ? 'Edit SOR Item'
              : 'SOR Item Details'
        }
        subtitle={
          popup.mode === 'view'
            ? 'View government-notified Schedule of Rates item details.'
            : 'Manage government-notified Schedule of Rates items.'
        }
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <form onSubmit={handleSave}>
            <FormGrid columns={2}>
              <DropDownList
                label="SOR Type"
                data={sorTypes.map(t => ({
                  label: t.name ? `${t.code} — ${t.name}` : t.code,
                  value: Number(t.id || (t as any).sorTypeId),
                }))}
                textField="label"
                optionValue="value"
                value={sorTypeId}
                onChange={v => handleSorTypeChange(Number(v))}
                required
              />
              <DropDownList
                label="SOR Chapter"
                data={filteredChapters.map(c => {
                  const chapNo = c.chapterNo
                    ? String(c.chapterNo).replace(/^ch-?/i, '')
                    : '';
                  const chapName = c.name || (c as any).chapterDesc || '';
                  return {
                    label: chapNo ? `Ch-${chapNo}: ${chapName}` : chapName,
                    value: Number(c.id || (c as any).sorChapterId),
                  };
                })}
                textField="label"
                optionValue="value"
                value={sorChapterId}
                onChange={v => handleSorChapterChange(Number(v))}
                required
              />
            </FormGrid>

            <FormGrid columns={2}>
              <DropDownList
                label="Subject Name"
                data={filteredSubjects.map(s => ({
                  label: s.name || (s as any).subjectName || '',
                  value: Number(s.id || (s as any).sorSubjectId),
                }))}
                textField="label"
                optionValue="value"
                value={sorSubjectId}
                onChange={v => handleSorSubjectChange(Number(v))}
                required
              />
              <NumberBox
                label="Page No."
                placeholder="e.g. 14"
                value={pageNumber}
                onChange={v => setPageNumber(Number(v) || 1)}
                required
              />
            </FormGrid>

            <FormGrid columns={2}>
              <TextBox
                label="Sub Title"
                placeholder="e.g. Section B"
                value={subjectTitle}
                onChange={setSubjectTitle}
                maxLength={200}
              />
              <TextBox
                label="Serial No."
                placeholder="e.g. 1.2"
                value={serialNumber}
                onChange={setSerialNumber}
                maxLength={50}
                required
              />
            </FormGrid>

            <FormGrid columns={1}>
              <TextArea
                label="Serial No. Description"
                placeholder="Enter serial number details..."
                value={serialDescription}
                onChange={setSerialDescription}
                rows={2}
              />
            </FormGrid>

            <FormGrid columns={1}>
              <TextArea
                label="Work Description"
                placeholder="Enter work details..."
                value={workDescription}
                onChange={setWorkDescription}
                rows={2}
                required
              />
            </FormGrid>

            <FormGrid columns={2}>
              <NumberBox
                label="No. of Items"
                placeholder="e.g. 5.5"
                value={numberOfCementBags}
                onChange={v => setNumberOfCementBags(Number(v) || 0)}
              />
              <DropDownList
                label="Unit"
                data={UNIT_OPTIONS}
                textField="label"
                optionValue="value"
                value={unit}
                onChange={v => setUnit(String(v))}
                required
              />
            </FormGrid>

            <FormGrid columns={2}>
              <NumberBox
                label="Rate (Rs)"
                placeholder="e.g. 450"
                value={rate}
                onChange={v => setRate(Number(v) || 0)}
                required
              />
              <DatePicker
                label="Effective Date"
                value={effectiveDate ? new Date(effectiveDate) : undefined}
                onChange={d =>
                  setEffectiveDate(
                    d
                      ? d.toISOString().split('T')[0]
                      : new Date().toISOString().split('T')[0]
                  )
                }
                required
              />
            </FormGrid>

            <FormGrid columns={2}>
              <div style={{ paddingTop: '1.75rem' }}>
                <Checkbox
                  label="Rate Set"
                  checked={isRateSet}
                  onChange={setIsRateSet}
                />
              </div>
              {isRateSet && (
                <NumberBox
                  label="Percentage (%)"
                  placeholder="e.g. 10"
                  value={percentage}
                  onChange={v => setPercentage(Number(v) || 0)}
                />
              )}
            </FormGrid>

            <FormActions
              isEditMode={popup.mode === 'edit'}
              onSave={handleSave}
              onReset={resetForm}
            />
          </form>
        )}

        {popup.mode === 'view' && popup.item && (
          <PreviewGrid
            columns={3}
            fields={[
              {
                label: 'SOR Type',
                value: popup.item.sorTypeCode || popup.item.sorTypeName || '—',
              },
              {
                label: 'Chapter No.',
                value: popup.item.chapterNo || popup.item.sorChapterName || '—',
              },
              {
                label: 'Subject Name',
                value:
                  popup.item.subjectName || popup.item.sorSubjectName || '—',
              },
              { label: 'Page No.', value: popup.item.pageNumber || '—' },
              { label: 'Sub Title', value: popup.item.subjectTitle || '-' },
              { label: 'Serial No.', value: popup.item.serialNumber || '—' },
              {
                label: 'Serial Description',
                value: popup.item.serialDescription || '-',
                fullWidth: true,
              },
              {
                label: 'Work Description',
                value:
                  popup.item.workDescription ||
                  popup.item.itemDescription ||
                  '-',
                fullWidth: true,
              },
              {
                label: 'No. of Items',
                value: popup.item.numberOfCementBags || '0',
              },
              { label: 'Unit', value: popup.item.unit },
              {
                label: 'Rate (₹)',
                value: formatCurrency(popup.item.rate),
              },
              {
                label: 'Effective Date',
                value: popup.item.effectiveDate
                  ? popup.item.effectiveDate.split('T')[0]
                  : '-',
              },
              {
                label: 'Rate Set',
                value: (
                  <StatusBadge
                    label={popup.item.isRateSet ? 'Yes' : 'No'}
                    variant={popup.item.isRateSet ? 'approved' : 'neutral'}
                  />
                ),
              },
              {
                label: 'Percentage (%)',
                value:
                  popup.item.isRateSet &&
                  popup.item.percentage !== null &&
                  popup.item.percentage !== undefined
                    ? `${popup.item.percentage}%`
                    : '-',
              },
              {
                label: 'Status',
                value: (
                  <StatusBadge
                    label={
                      popup.item.isActive !== false ? 'Active' : 'Inactive'
                    }
                    variant={
                      popup.item.isActive !== false ? 'approved' : 'rejected'
                    }
                  />
                ),
              },
            ]}
          />
        )}
      </FormPopup>
    </FormPage>
  );
}
