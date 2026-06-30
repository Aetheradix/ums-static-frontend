import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox, NumberBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type OpenArea,
  initialOpenAreas,
  initialCampusKeys,
  initialOpenAreaTypes,
} from '../../data';
import { estateUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: OpenArea };

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];
const activeOptions = (items: { name: string; status: string }[]) =>
  items
    .filter(i => i.status === 'Active')
    .map(i => ({ name: i.name, value: i.name }));

const EMPTY = {
  campus: '',
  name: '',
  areaType: '',
  landmark: '',
  totalLandArea: 0,
  status: 'Active',
};

export default function OpenAreas() {
  const [data, setData] = useState<OpenArea[]>(initialOpenAreas);
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
        { id: `OA-${Date.now()}`, ...form } as unknown as OpenArea,
      ]);
      ToastService.success('Open area created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(o =>
          o.id === popup.item.id
            ? ({ ...o, ...form } as unknown as OpenArea)
            : o
        )
      );
      ToastService.success('Open area updated successfully.');
    }
    closePopup();
  };

  const openEdit = (item: OpenArea) => {
    setForm({
      campus: item.campus,
      name: item.name,
      areaType: item.areaType,
      landmark: item.landmark,
      totalLandArea: item.totalLandArea,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  return (
    <FormPage
      title="Open Areas"
      description="Manage gardens, parks, playgrounds, parking lots, and other open spaces."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Estate Management', to: estateUrls.portal },
        { label: 'Admin Portal', to: estateUrls.admin.portal },
        { label: 'Open Areas' },
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
            { field: 'id', header: 'Area ID', width: '100px' },
            { field: 'campus', header: 'Campus', width: '150px' },
            { field: 'name', header: 'Area Name' },
            { field: 'areaType', header: 'Type', width: '140px' },
            { field: 'landmark', header: 'Landmark', width: '180px' },
            { field: 'totalLandArea', header: 'Area (Sq.m)', width: '120px' },
            {
              field: 'status',
              header: 'Status',
              width: '100px',
              cell: (item: OpenArea) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'rejected'}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Open Area"
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
        title={popup.mode === 'create' ? 'Add Open Area' : 'Edit Open Area'}
        subtitle="Fill in the open area details."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Campus"
            data={activeOptions(initialCampusKeys)}
            textField="name"
            optionValue="value"
            value={form.campus}
            onChange={v => setForm(f => ({ ...f, campus: String(v ?? '') }))}
            required
          />
          <TextBox
            label="Area Name"
            placeholder="e.g. Central Botanical Garden"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <DropDownList
            label="Area Type"
            data={activeOptions(initialOpenAreaTypes)}
            textField="name"
            optionValue="value"
            value={form.areaType}
            onChange={v => setForm(f => ({ ...f, areaType: String(v ?? '') }))}
            required
          />
          <TextBox
            label="Landmark"
            placeholder="Nearby landmark"
            value={form.landmark}
            onChange={v => setForm(f => ({ ...f, landmark: v }))}
          />
          <NumberBox
            label="Total Land Area (Sq. m)"
            value={form.totalLandArea}
            onChange={v => setForm(f => ({ ...f, totalLandArea: v ?? 0 }))}
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
