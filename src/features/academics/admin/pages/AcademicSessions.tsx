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
import {
  type AcademicSession,
  academicSessions as initialData,
} from '../../data';
import { academicsUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: AcademicSession };

const TYPE_OPTIONS = [
  { name: 'Odd', value: 'Odd' },
  { name: 'Even', value: 'Even' },
  { name: 'Summer', value: 'Summer' },
];

const ACTIVE_OPTIONS = [
  { name: 'Yes', value: 'Yes' },
  { name: 'No', value: 'No' },
];

const EMPTY_FORM = {
  name: '',
  academicYear: '',
  type: '',
  startDate: '',
  endDate: '',
  isActive: 'Yes',
};

export default function AcademicSessions() {
  const [data, setData] = useState<AcademicSession[]>(initialData);
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

  const openEdit = (item: AcademicSession) => {
    setForm({
      name: item.name,
      academicYear: item.academicYear,
      type: item.type,
      startDate: item.startDate,
      endDate: item.endDate,
      isActive: item.isActive ? 'Yes' : 'No',
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: AcademicSession = {
        id: String(Date.now()),
        name: form.name,
        academicYear: form.academicYear,
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive === 'Yes',
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Academic session created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(s =>
          s.id === popup.item.id
            ? {
                ...s,
                name: form.name,
                academicYear: form.academicYear,
                type: form.type,
                startDate: form.startDate,
                endDate: form.endDate,
                isActive: form.isActive === 'Yes',
              }
            : s
        )
      );
      ToastService.success('Academic session updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Academic Sessions"
      description="Manage academic sessions and semester periods."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Academic Management', to: academicsUrls.portal },
        { label: 'Admin Portal', to: academicsUrls.admin.portal },
        { label: 'Academic Sessions' },
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
            { field: 'name', header: 'Session Name' },
            { field: 'academicYear', header: 'Academic Year' },
            { field: 'type', header: 'Type' },
            { field: 'startDate', header: 'Start Date' },
            { field: 'endDate', header: 'End Date' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: AcademicSession) => (
                <StatusBadge
                  label={item.isActive ? 'Active' : 'Inactive'}
                  variant={item.isActive ? 'approved' : 'neutral'}
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
        title={popup.mode === 'create' ? 'Create Session' : 'Edit Session'}
        subtitle="Fill in the academic session details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Session Name"
            placeholder="e.g. 2024-25 Odd Semester"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="Academic Year"
            placeholder="e.g. 2024-25"
            value={form.academicYear}
            onChange={v => setForm(f => ({ ...f, academicYear: v }))}
            required
          />
          <DropDownList
            label="Type"
            data={TYPE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Type"
            value={form.type}
            onChange={v => setForm(f => ({ ...f, type: String(v ?? '') }))}
            required
          />
          <DropDownList
            label="Is Active"
            data={ACTIVE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select"
            value={form.isActive}
            onChange={v =>
              setForm(f => ({ ...f, isActive: String(v ?? 'No') }))
            }
            required
          />
          <TextBox
            label="Start Date"
            placeholder="YYYY-MM-DD"
            value={form.startDate}
            onChange={v => setForm(f => ({ ...f, startDate: v }))}
            required
          />
          <TextBox
            label="End Date"
            placeholder="YYYY-MM-DD"
            value={form.endDate}
            onChange={v => setForm(f => ({ ...f, endDate: v }))}
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
