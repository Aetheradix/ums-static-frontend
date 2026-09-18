import { useState } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewGrid,
} from 'shared/new-components';
import {
  CIVIL_STORAGE_KEYS,
  civilStorage,
  useCivilStorage,
} from '../../../civilStorage';
import {
  initialSORItemMasters,
  initialSORTypes,
  initialSORChapters,
  initialSORSubjects,
  type MockSORItem,
} from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: MockSORItem }
  | { mode: 'view'; item: MockSORItem };

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
  const [formTypeId, setFormTypeId] = useState<number>(1);
  const [formChapterId, setFormChapterId] = useState<number>(1);
  const [formSubjectId, setFormSubjectId] = useState<number>(1);
  const [formCode, setFormCode] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formUnit, setFormUnit] = useState<string>('Cum');
  const [formRate, setFormRate] = useState<number>(0);

  const saveItems = (newItems: MockSORItem[]) => {
    setItems(newItems);
    civilStorage.set(CIVIL_STORAGE_KEYS.SOR_ITEMS, newItems);
  };

  const openCreateModal = () => {
    setFormTypeId(sorTypes[0]?.id ? Number(sorTypes[0].id) : 1);
    setFormChapterId(sorChapters[0]?.id ? Number(sorChapters[0].id) : 1);
    setFormSubjectId(sorSubjects[0]?.id ? Number(sorSubjects[0].id) : 1);
    setFormCode(`SOR-2024-${Date.now().toString().slice(-4)}`);
    setFormDescription('');
    setFormUnit('Cum');
    setFormRate(0);
    setPopup({ mode: 'create' });
  };

  const openEditModal = (item: MockSORItem) => {
    setFormTypeId(item.sorTypeId);
    setFormChapterId(item.sorChapterId);
    setFormSubjectId(item.sorSubjectId || 1);
    setFormCode(item.sorCode);
    setFormDescription(item.itemDescription);
    setFormUnit(item.unit);
    setFormRate(item.rate);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formCode.trim()) {
      ToastService.error('SOR Item Code is required.');
      return;
    }
    if (!formDescription.trim()) {
      ToastService.error('Item Description is required.');
      return;
    }
    if (!formUnit.trim()) {
      ToastService.error('Unit is required.');
      return;
    }
    if (!formRate || formRate <= 0) {
      ToastService.error('Rate must be greater than 0.');
      return;
    }

    const typeObj = sorTypes.find(
      t => Number(t.id) === formTypeId || t.id === String(formTypeId)
    );
    const chapterObj = sorChapters.find(
      c => Number(c.id) === formChapterId || c.id === String(formChapterId)
    );
    const subjectObj = sorSubjects.find(
      s => Number(s.id) === formSubjectId || s.id === String(formSubjectId)
    );

    if (popup.mode === 'create') {
      const newItem: MockSORItem = {
        sorItemId: Date.now(),
        sorTypeId: formTypeId,
        sorTypeName: typeObj?.name || 'Building Works (MP PWD SOR 2024)',
        sorChapterId: formChapterId,
        sorChapterName: chapterObj?.name || 'Earthwork & Excavation',
        sorSubjectId: formSubjectId,
        sorSubjectName: subjectObj?.name || 'General Site Clearance',
        sorCode: formCode,
        itemDescription: formDescription,
        unit: formUnit,
        rate: formRate,
        isActive: true,
      };
      saveItems([newItem, ...items]);
      ToastService.success('SOR Item created successfully.');
    } else if (popup.mode === 'edit' && popup.item) {
      const updated = items.map(i =>
        i.sorItemId === popup.item.sorItemId
          ? {
              ...i,
              sorTypeId: formTypeId,
              sorTypeName: typeObj?.name || i.sorTypeName,
              sorChapterId: formChapterId,
              sorChapterName: chapterObj?.name || i.sorChapterName,
              sorSubjectId: formSubjectId,
              sorSubjectName: subjectObj?.name || i.sorSubjectName,
              sorCode: formCode,
              itemDescription: formDescription,
              unit: formUnit,
              rate: formRate,
            }
          : i
      );
      saveItems(updated);
      ToastService.success('SOR Item updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleToggleStatus = (item: MockSORItem) => {
    const updated = items.map(i =>
      i.sorItemId === item.sorItemId ? { ...i, isActive: !i.isActive } : i
    );
    saveItems(updated);
    ToastService.success(
      `SOR Item marked ${!item.isActive ? 'Active' : 'Inactive'}.`
    );
  };

  return (
    <FormPage
      title="Schedule of Rates (SOR) Item Master"
      description="Manage statutory government-notified Schedule of Rates (SOR) line items, descriptions, standard units, and baseline rates."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.externalMastersMenu },
        { label: 'SOR Item Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={items}
          columns={[
            {
              field: 'sorItemId',
              header: '#',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
              width: '50px',
            },
            {
              field: 'sorCode',
              header: 'SOR Code',
              cell: (item: MockSORItem) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                  }}
                >
                  {item.sorCode}
                </span>
              ),
              width: '140px',
            },
            {
              field: 'sorTypeName',
              header: 'SOR Type',
              width: '160px',
            },
            {
              field: 'sorChapterName',
              header: 'Chapter',
              width: '160px',
            },
            {
              field: 'itemDescription',
              header: 'Description',
              cell: (item: MockSORItem) => (
                <span style={{ fontSize: '0.8125rem' }}>
                  {item.itemDescription.length > 80
                    ? `${item.itemDescription.substring(0, 80)}...`
                    : item.itemDescription}
                </span>
              ),
            },
            {
              field: 'unit',
              header: 'Unit',
              width: '70px',
            },
            {
              field: 'rate',
              header: 'Standard Rate (₹)',
              cell: (item: MockSORItem) => (
                <span style={{ fontWeight: 600, color: '#16a34a' }}>
                  ₹
                  {item.rate.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              ),
              width: '130px',
            },
            {
              field: 'isActive',
              header: 'Active',
              sortable: false,
              cell: (item: MockSORItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
              width: '80px',
            },
            {
              field: 'sorItemId',
              header: 'Actions',
              sortable: false,
              cell: (item: MockSORItem) => (
                <GridActionButtons
                  onView={() => setPopup({ mode: 'view', item })}
                  onEdit={() => openEditModal(item)}
                  viewTooltip="View SOR Item"
                  editTooltip="Edit SOR Item"
                />
              ),
              width: '100px',
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
          searchPlaceholder="Search SOR items by code or description..."
        />
      </FormCard>

      {/* Popups */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'create'
            ? 'Add New SOR Item'
            : popup.mode === 'edit'
              ? 'Edit SOR Item'
              : popup.mode === 'view' && popup.item
                ? `SOR Item — ${popup.item.sorCode}`
                : 'SOR Item'
        }
        subtitle="Government notified Schedule of Rates baseline line item."
        size="lg"
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <div>
            <FormGrid columns={3}>
              <DropDownList
                label="SOR Classification (Type) *"
                data={sorTypes.map(t => ({
                  label: `${t.code} — ${t.name}`,
                  value: Number(t.id) || t.id,
                }))}
                textField="label"
                optionValue="value"
                value={formTypeId}
                onChange={v => setFormTypeId(Number(v))}
                required
              />
              <DropDownList
                label="SOR Chapter *"
                data={sorChapters.map(c => ({
                  label: `Ch-${c.chapterNo}: ${c.name}`,
                  value: Number(c.id) || c.id,
                }))}
                textField="label"
                optionValue="value"
                value={formChapterId}
                onChange={v => setFormChapterId(Number(v))}
                required
              />
              <DropDownList
                label="SOR Subject *"
                data={sorSubjects.map(s => ({
                  label: s.name,
                  value: Number(s.id) || s.id,
                }))}
                textField="label"
                optionValue="value"
                value={formSubjectId}
                onChange={v => setFormSubjectId(Number(v))}
                required
              />
            </FormGrid>

            <div style={{ marginTop: '0.75rem' }}>
              <FormGrid columns={3}>
                <TextBox
                  label="SOR Item Code *"
                  placeholder="e.g. SOR-2024-01-005"
                  value={formCode}
                  onChange={setFormCode}
                  required
                />
                <TextBox
                  label="Unit of Measurement *"
                  placeholder="e.g. Cum, Sqm, MT, Kg"
                  value={formUnit}
                  onChange={setFormUnit}
                  required
                />
                <NumberBox
                  label="Government Standard Rate (₹) *"
                  placeholder="e.g. 5450.00"
                  value={formRate}
                  onChange={v => setFormRate(Number(v) || 0)}
                  mode="decimal"
                  required
                />
              </FormGrid>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <TextArea
                label="Detailed Specification & Description *"
                placeholder="Full government SOR item description including material grade, leads, equipment, and finishing specifications..."
                value={formDescription}
                onChange={setFormDescription}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label={
                  popup.mode === 'create' ? 'Save SOR Item' : 'Update SOR Item'
                }
                variant="primary"
                icon="save"
                onClick={handleSave}
              />
            </div>
          </div>
        )}

        {popup.mode === 'view' && popup.item && (
          <div>
            <PreviewGrid
              columns={2}
              fields={[
                { label: 'SOR Item Code', value: popup.item.sorCode },
                {
                  label: 'Classification / Type',
                  value: popup.item.sorTypeName || '—',
                },
                { label: 'Chapter', value: popup.item.sorChapterName || '—' },
                { label: 'Subject', value: popup.item.sorSubjectName || '—' },
                { label: 'Unit', value: popup.item.unit },
                {
                  label: 'Standard Rate',
                  value: `₹${popup.item.rate.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} per ${popup.item.unit}`,
                },
                {
                  label: 'Status',
                  value: popup.item.isActive ? 'Active' : 'Inactive',
                },
                {
                  label: 'Full Description',
                  value: popup.item.itemDescription,
                },
              ]}
            />
            <div className="flex justify-end mt-4">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
