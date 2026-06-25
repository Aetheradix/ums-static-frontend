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
  type ProgrammeRecord,
  admissionQuotas,
  disciplines,
  examSchemes,
  programmeRecords as initialData,
  ugcDegrees,
} from '../../data';
import { programmeUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ProgrammeRecord };

const LEVEL_OPTIONS = [
  { name: 'UG', value: 'UG' },
  { name: 'PG', value: 'PG' },
  { name: 'PhD', value: 'PhD' },
];

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const EMPTY_FORM = {
  code: '',
  title: '',
  discipline: '',
  ugcDegree: '',
  level: '',
  duration: '',
  admissionQuota: '',
  examScheme: '',
  status: 'Active',
};

export default function Programmes() {
  const [data, setData] = useState<ProgrammeRecord[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const disciplineOptions = disciplines.map(d => ({
    name: d.name,
    value: d.name,
  }));
  const ugcDegreeOptions = ugcDegrees.map(u => ({
    name: u.name,
    value: u.name,
  }));
  const quotaOptions = admissionQuotas.map(q => ({
    name: q.name,
    value: q.name,
  }));
  const schemeOptions = examSchemes.map(s => ({ name: s.name, value: s.name }));

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: ProgrammeRecord) => {
    setForm({
      code: item.code,
      title: item.title,
      discipline: item.discipline,
      ugcDegree: item.ugcDegree,
      level: item.level,
      duration: item.duration,
      admissionQuota: item.admissionQuota,
      examScheme: item.examScheme,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: ProgrammeRecord = {
        id: String(Date.now()),
        ...form,
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Programme created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(p => (p.id === popup.item.id ? { ...p, ...form } : p))
      );
      ToastService.success('Programme updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Programmes"
      description="Manage academic programmes and their configurations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Programme Management', to: programmeUrls.portal },
        { label: 'Admin Portal', to: programmeUrls.admin.portal },
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
            { field: 'discipline', header: 'Discipline' },
            { field: 'ugcDegree', header: 'UGC Degree' },
            { field: 'level', header: 'Level' },
            { field: 'duration', header: 'Duration' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: ProgrammeRecord) => (
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
            label="Discipline"
            data={disciplineOptions}
            textField="name"
            optionValue="value"
            placeholder="Select Discipline"
            value={form.discipline}
            onChange={v =>
              setForm(f => ({ ...f, discipline: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="UGC Degree"
            data={ugcDegreeOptions}
            textField="name"
            optionValue="value"
            placeholder="Select UGC Degree"
            value={form.ugcDegree}
            onChange={v => setForm(f => ({ ...f, ugcDegree: String(v ?? '') }))}
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
            label="Duration"
            placeholder="e.g. 4 Years"
            value={form.duration}
            onChange={v => setForm(f => ({ ...f, duration: v }))}
            required
          />
          <DropDownList
            label="Admission Quota"
            data={quotaOptions}
            textField="name"
            optionValue="value"
            placeholder="Select Quota"
            value={form.admissionQuota}
            onChange={v =>
              setForm(f => ({ ...f, admissionQuota: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Exam Scheme"
            data={schemeOptions}
            textField="name"
            optionValue="value"
            placeholder="Select Scheme"
            value={form.examScheme}
            onChange={v =>
              setForm(f => ({ ...f, examScheme: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Status"
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
