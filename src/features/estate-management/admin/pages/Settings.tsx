import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import {
  type SettingsMaster,
  initialExternalWallTypes,
  initialFoundationTypes,
  initialRoofTypes,
  initialSubstationTypes,
  initialStructureTypes,
  initialWindowTypes,
  initialDoorTypes,
  initialRailingTypes,
  initialBlocks,
  initialFloorLevels,
  initialFloorCategories,
  initialFlooringTypes,
  initialRoomTypes,
  initialHouseTypes,
  initialOpenAreaTypes,
  initialRoadTypes,
  initialFootpathTypes,
  initialCampusKeys,
} from '../../data';
import { estateUrls } from '../../urls';

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create'; category: string }
  | { mode: 'edit'; category: string; item: SettingsMaster };

const EMPTY = { name: '', status: 'Active' };

interface SettingsCategory {
  key: string;
  label: string;
  data: SettingsMaster[];
}

const CATEGORIES: SettingsCategory[] = [
  { key: 'campus', label: 'Campus Key', data: initialCampusKeys },
  {
    key: 'extWall',
    label: 'External Wall Types',
    data: initialExternalWallTypes,
  },
  {
    key: 'foundation',
    label: 'Foundation Types',
    data: initialFoundationTypes,
  },
  { key: 'roof', label: 'Roof Types', data: initialRoofTypes },
  {
    key: 'substation',
    label: 'Substation Types',
    data: initialSubstationTypes,
  },
  { key: 'structure', label: 'Structure Types', data: initialStructureTypes },
  { key: 'window', label: 'Window Types', data: initialWindowTypes },
  { key: 'door', label: 'Door Types', data: initialDoorTypes },
  { key: 'railing', label: 'Railing Types', data: initialRailingTypes },
  { key: 'block', label: 'Blocks', data: initialBlocks },
  { key: 'floorLevel', label: 'Floor Levels', data: initialFloorLevels },
  {
    key: 'floorCategory',
    label: 'Floor Categories',
    data: initialFloorCategories,
  },
  { key: 'flooring', label: 'Flooring Types', data: initialFlooringTypes },
  { key: 'room', label: 'Room Types', data: initialRoomTypes },
  { key: 'house', label: 'House Types', data: initialHouseTypes },
  { key: 'openArea', label: 'Open Area Types', data: initialOpenAreaTypes },
  { key: 'road', label: 'Road Types', data: initialRoadTypes },
  { key: 'footpath', label: 'Footpath Types', data: initialFootpathTypes },
];

export default function Settings() {
  const [allData, setAllData] = useState<Record<string, SettingsMaster[]>>(
    () => {
      const map: Record<string, SettingsMaster[]> = {};
      CATEGORIES.forEach(c => {
        map[c.key] = [...c.data];
      });
      return map;
    }
  );
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (popup.mode === 'create') {
      const cat = popup.category;
      setAllData(prev => ({
        ...prev,
        [cat]: [
          ...prev[cat],
          {
            id: String(Date.now()),
            name: form.name,
            status: form.status as 'Active' | 'Inactive',
          },
        ],
      }));
      ToastService.success('Record created successfully.');
    } else if (popup.mode === 'edit') {
      const cat = popup.category;
      setAllData(prev => ({
        ...prev,
        [cat]: prev[cat].map(i =>
          i.id === popup.item.id
            ? {
                ...i,
                name: form.name,
                status: form.status as 'Active' | 'Inactive',
              }
            : i
        ),
      }));
      ToastService.success('Record updated successfully.');
    }
    closePopup();
  };

  const openEdit = (category: string, item: SettingsMaster) => {
    setForm({ name: item.name, status: item.status });
    setPopup({ mode: 'edit', category, item });
  };

  const makeTab = (cat: SettingsCategory) => ({
    title: cat.label,
    content: (
      <FormCard>
        <GridPanel
          data={allData[cat.key]}
          onEdit={(item: SettingsMaster) => openEdit(cat.key, item)}
          columns={[
            {
              cell: (_: unknown, option: { rowIndex: number }) => (
                <span className="font-semibold text-gray-700">
                  {option.rowIndex + 1}
                </span>
              ),
              width: '50px',
            },
            { field: 'id', header: 'ID', width: '80px' },
            { field: 'name', header: 'Name' },
            {
              field: 'status',
              header: 'Status',
              width: '100px',
              cell: (item: SettingsMaster) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'rejected'}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add New"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create', category: cat.key });
              }}
            />
          }
          searchBox
        />
      </FormCard>
    ),
  });

  return (
    <FormPage
      title="Estate Settings"
      description="Configure master data for buildings, floors, rooms, and infrastructure components."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Estate Management', to: estateUrls.portal },
        { label: 'Admin Portal', to: estateUrls.admin.portal },
        { label: 'Settings' },
      ]}
    >
      <Tabs tabs={CATEGORIES.map(makeTab)} />

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={popup.mode === 'create' ? 'Add Record' : 'Edit Record'}
        subtitle="Enter the setting details."
        size="default"
      >
        <FormGrid columns={1}>
          <TextBox
            label="Name"
            placeholder="Enter name"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v =>
              setForm(f => ({ ...f, status: String(v ?? 'Active') }))
            }
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
