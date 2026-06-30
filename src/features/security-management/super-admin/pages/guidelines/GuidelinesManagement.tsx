import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  TextArea,
  TextBox,
  DatePicker,
  FileUpload,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type Guideline, guidelines as initialData } from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Guideline }
  | { mode: 'view'; item: Guideline };

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Draft', value: 'Draft' },
  { name: 'Inactive', value: 'Inactive' },
];
const APPLICABLE_OPTIONS = ['All', 'Employee', 'Student', 'Staff'].map(a => ({
  name: a,
  value: a,
}));
const CATEGORY_OPTIONS = [
  'Fire & Safety',
  'Lab Safety',
  'Hostel Safety',
  'Harassment Prevention',
  'Cyber Security',
  'Natural Disaster',
  'General Safety',
].map(c => ({ name: c, value: c }));
const DEPT_OPTIONS = [
  'All',
  'Science',
  'Engineering',
  'Hostel Management',
  'ICC Cell',
  'IT Department',
  'Administration',
].map(d => ({ name: d, value: d }));

const EMPTY: Partial<Guideline> = {
  title: '',
  category: '',
  department: 'All',
  description: '',
  pdfUrl: '',
  videoUrl: '',
  applicableFor: 'All',
  effectiveDate: '',
  status: 'Active',
};

export default function GuidelinesManagement() {
  const [data, setData] = useState<Guideline[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Guideline>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.title || !form.category) {
      ToastService.error('Title and Category are required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as Guideline,
      ]);
      ToastService.success('Guideline created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Guideline) : d
        )
      );
      ToastService.success('Guideline updated successfully.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Guidelines Management"
      description="Create and manage university safety guidelines, SOPs and reference documents."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Guidelines' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'title', header: 'Title' },
            { field: 'category', header: 'Category' },
            { field: 'department', header: 'Department' },
            { field: 'applicableFor', header: 'Applicable For' },
            { field: 'effectiveDate', header: 'Effective Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Guideline) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Active'
                      ? 'approved'
                      : item.status === 'Draft'
                        ? 'pending'
                        : 'rejected'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Guideline) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'view', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'edit', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="trash"
                    variant="danger"
                    onClick={() => {
                      setData(prev => prev.filter(d => d.id !== item.id));
                      ToastService.success('Deleted.');
                    }}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Guideline"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search guidelines..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Guideline'
            : popup.mode === 'edit'
              ? 'Edit Guideline'
              : 'View Guideline'
        }
        subtitle="Configure safety guideline details and applicability."
        size="xl"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Title"
            placeholder="e.g. Fire Safety Guidelines"
            value={form.title ?? ''}
            onChange={v => setForm(f => ({ ...f, title: v }))}
            required
            disabled={isReadOnly}
          />
          <DropDownList
            label="Category"
            data={CATEGORY_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.category}
            onChange={v => setForm(f => ({ ...f, category: v as string }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Department"
            data={DEPT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.department}
            onChange={v => setForm(f => ({ ...f, department: v as string }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Applicable For"
            data={APPLICABLE_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.applicableFor}
            onChange={v => setForm(f => ({ ...f, applicableFor: v as any }))}
            disabled={isReadOnly}
          />
          <DatePicker
            label="Effective Date"
            value={
              form.effectiveDate ? new Date(form.effectiveDate) : undefined
            }
            onChange={date =>
              setForm(f => ({
                ...f,
                effectiveDate: date ? date.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
            disabled={isReadOnly}
          />
          {isReadOnly ? (
            <TextBox label="PDF Document" value={form.pdfUrl ?? ''} disabled />
          ) : (
            <FileUpload
              label="PDF Document"
              mode="file"
              accept="application/pdf"
              value={form.pdfUrl}
              onChange={file =>
                setForm(f => ({ ...f, pdfUrl: file ? file.name : '' }))
              }
            />
          )}
          <TextBox
            label="Video URL (Optional)"
            placeholder="https://youtube.com/..."
            value={form.videoUrl ?? ''}
            onChange={v => setForm(f => ({ ...f, videoUrl: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Description"
          placeholder="Detailed description of the guideline"
          value={form.description ?? ''}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          disabled={isReadOnly}
          rows={4}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={
                popup.mode === 'create'
                  ? 'Create Guideline'
                  : 'Update Guideline'
              }
              variant="primary"
              icon="save"
              onClick={handleSave}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
