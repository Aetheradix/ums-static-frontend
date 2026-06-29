import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  TextBox,
  NumberBox,
  Switch,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type Road,
  initialRoads,
  initialRoadTypes,
  initialFootpathTypes,
} from '../../data';
import { estateUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Road };

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];
const activeOptions = (items: { name: string; status: string }[]) =>
  items
    .filter(i => i.status === 'Active')
    .map(i => ({ name: i.name, value: i.name }));

const EMPTY = {
  name: '',
  length: 0,
  width: 0,
  roadType: '',
  streetLights: false,
  footpath1Length: 0,
  footpath1Width: 0,
  footpath1Type: '',
  footpath2Length: 0,
  footpath2Width: 0,
  footpath2Type: '',
  status: 'Active',
};

export default function RoadsFootpaths() {
  const [data, setData] = useState<Road[]>(initialRoads);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { id: `RD-${Date.now()}`, ...form } as unknown as Road,
      ]);
      ToastService.success('Road added successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(r =>
          r.id === popup.item.id ? ({ ...r, ...form } as unknown as Road) : r
        )
      );
      ToastService.success('Road updated successfully.');
    }
    closePopup();
  };

  const openEdit = (item: Road) => {
    setForm({
      name: item.name,
      length: item.length,
      width: item.width,
      roadType: item.roadType,
      streetLights: item.streetLights,
      footpath1Length: item.footpath1Length,
      footpath1Width: item.footpath1Width,
      footpath1Type: item.footpath1Type,
      footpath2Length: item.footpath2Length,
      footpath2Width: item.footpath2Width,
      footpath2Type: item.footpath2Type,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  return (
    <FormPage
      title="Roads & Footpaths"
      description="Record and manage campus roads, footpaths, and street lighting."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Estate Management', to: estateUrls.portal },
        { label: 'Admin Portal', to: estateUrls.admin.portal },
        { label: 'Roads & Footpaths' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            {
              cell: (_: unknown, option: { rowIndex: number }) => (
                <span className="font-semibold text-gray-700">
                  {option.rowIndex + 1}
                </span>
              ),
              width: '50px',
            },
            { field: 'id', header: 'Road ID', width: '100px' },
            { field: 'name', header: 'Road Name' },
            { field: 'length', header: 'Length (Km)', width: '110px' },
            { field: 'width', header: 'Width (m)', width: '100px' },
            { field: 'roadType', header: 'Type', width: '160px' },
            {
              field: 'streetLights',
              header: 'Street Lights',
              width: '110px',
              cell: (item: Road) => (
                <StatusBadge
                  label={item.streetLights ? 'Yes' : 'No'}
                  variant={item.streetLights ? 'approved' : 'neutral'}
                />
              ),
            },
            {
              field: 'status',
              header: 'Status',
              width: '100px',
              cell: (item: Road) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'rejected'}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Road"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={popup.mode === 'create' ? 'Add Road' : 'Edit Road'}
        subtitle="Fill in road and footpath details."
        size="xl"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Road Name"
            placeholder="e.g. University Main Road"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <NumberBox
            label="Length (Km)"
            value={form.length}
            onChange={v => setForm(f => ({ ...f, length: v ?? 0 }))}
            required
          />
          <NumberBox
            label="Width (m)"
            value={form.width}
            onChange={v => setForm(f => ({ ...f, width: v ?? 0 }))}
            required
          />
          <DropDownList
            label="Road Type"
            data={activeOptions(initialRoadTypes)}
            textField="name"
            optionValue="value"
            value={form.roadType}
            onChange={v => setForm(f => ({ ...f, roadType: String(v ?? '') }))}
            required
          />
          <Switch
            label="Street Lights"
            checked={form.streetLights}
            onChange={v => setForm(f => ({ ...f, streetLights: v }))}
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
          />
        </FormGrid>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-2">Footpath 1</p>
          <FormGrid columns={3}>
            <NumberBox
              label="Length (m)"
              value={form.footpath1Length}
              onChange={v => setForm(f => ({ ...f, footpath1Length: v ?? 0 }))}
            />
            <NumberBox
              label="Width (m)"
              value={form.footpath1Width}
              onChange={v => setForm(f => ({ ...f, footpath1Width: v ?? 0 }))}
            />
            <DropDownList
              label="Footpath Type"
              data={activeOptions(initialFootpathTypes)}
              textField="name"
              optionValue="value"
              value={form.footpath1Type}
              onChange={v =>
                setForm(f => ({ ...f, footpath1Type: String(v ?? '') }))
              }
            />
          </FormGrid>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-2">Footpath 2</p>
          <FormGrid columns={3}>
            <NumberBox
              label="Length (m)"
              value={form.footpath2Length}
              onChange={v => setForm(f => ({ ...f, footpath2Length: v ?? 0 }))}
            />
            <NumberBox
              label="Width (m)"
              value={form.footpath2Width}
              onChange={v => setForm(f => ({ ...f, footpath2Width: v ?? 0 }))}
            />
            <DropDownList
              label="Footpath Type"
              data={activeOptions(initialFootpathTypes)}
              textField="name"
              optionValue="value"
              value={form.footpath2Type}
              onChange={v =>
                setForm(f => ({ ...f, footpath2Type: String(v ?? '') }))
              }
            />
          </FormGrid>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
