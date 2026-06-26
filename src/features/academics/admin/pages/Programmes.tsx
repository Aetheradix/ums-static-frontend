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
} from 'shared/new-components';
import { type Programme, programmes as initialData } from '../../data';
import { academicsUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Programme };

const MODE_OPTIONS = [
  { name: 'Regular', value: 'Regular' },
  { name: 'Distance', value: 'Distance' },
  { name: 'Online', value: 'Online' },
];

const LEVEL_OPTIONS = [
  { name: 'UG', value: 'UG' },
  { name: 'PG', value: 'PG' },
  { name: 'PhD', value: 'PhD' },
];

const EMPTY_FORM = {
  code: '',
  title: '',
  mode: '',
  level: '',
  totalCredits: '',
  duration: '',
  coordinator: '',
};

export default function Programmes() {
  const [data, setData] = useState<Programme[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: Programme) => {
    setForm({
      code: item.code,
      title: item.title,
      mode: item.mode,
      level: item.level,
      totalCredits: String(item.totalCredits),
      duration: item.duration,
      coordinator: item.coordinator,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: Programme = {
        id: String(Date.now()),
        code: form.code,
        title: form.title,
        mode: form.mode,
        level: form.level,
        totalCredits: Number(form.totalCredits),
        duration: form.duration,
        coordinator: form.coordinator,
        status: 'Active',
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Programme created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(p =>
          p.id === popup.item.id
            ? {
                ...p,
                code: form.code,
                title: form.title,
                mode: form.mode,
                level: form.level,
                totalCredits: Number(form.totalCredits),
                duration: form.duration,
                coordinator: form.coordinator,
              }
            : p
        )
      );
      ToastService.success('Programme updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Academic Programmes"
      description="Manage and configure academic programmes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Academic Management', to: academicsUrls.portal },
        { label: 'Admin Portal', to: academicsUrls.admin.portal },
        { label: 'Programmes' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
            },
            { field: 'code', header: 'Code' },
            { field: 'title', header: 'Programme Title' },
            { field: 'mode', header: 'Mode' },
            { field: 'level', header: 'Level' },
            { field: 'totalCredits', header: 'Total Credits' },
            { field: 'duration', header: 'Duration' },
            { field: 'coordinator', header: 'Coordinator' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: Programme) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'rejected'}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={popup.mode === 'create' ? 'Create Programme' : 'Edit Programme'}
        subtitle="Fill in the programme details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Programme Code"
            placeholder="e.g. BTCS"
            value={form.code}
            onChange={v => setForm(f => ({ ...f, code: v }))}
            required
          />
          <TextBox
            label="Programme Title"
            placeholder="e.g. B.Tech Computer Science"
            value={form.title}
            onChange={v => setForm(f => ({ ...f, title: v }))}
            required
          />
          <DropDownList
            label="Mode"
            data={MODE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Mode"
            value={form.mode}
            onChange={v => setForm(f => ({ ...f, mode: String(v ?? '') }))}
            required
          />
          <DropDownList
            label="Level"
            data={LEVEL_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Level"
            value={form.level}
            onChange={v => setForm(f => ({ ...f, level: String(v ?? '') }))}
            required
          />
          <TextBox
            label="Total Credits"
            placeholder="e.g. 160"
            value={form.totalCredits}
            onChange={v => setForm(f => ({ ...f, totalCredits: v }))}
            required
          />
          <TextBox
            label="Duration"
            placeholder="e.g. 4 Years"
            value={form.duration}
            onChange={v => setForm(f => ({ ...f, duration: v }))}
            required
          />
          <TextBox
            label="Coordinator"
            placeholder="Faculty coordinator name"
            value={form.coordinator}
            onChange={v => setForm(f => ({ ...f, coordinator: v }))}
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
