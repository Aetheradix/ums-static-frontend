import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type Tender, tenders as initialData, projects } from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Tender }
  | { mode: 'view'; item: Tender };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));
const TENDER_TYPES = ['Open', 'Limited', 'Single Source'].map(v => ({
  name: v,
  value: v,
}));
const STATUSES = ['Draft', 'Published', 'Closed', 'Awarded', 'Cancelled'].map(
  v => ({ name: v, value: v })
);

const EMPTY: Partial<Tender> = {
  tenderNo: '',
  projectId: '',
  projectName: '',
  tenderType: 'Open',
  publishDate: '',
  closingDate: '',
  estimatedValue: 0,
  eligibility: '',
  remarks: '',
  status: 'Draft',
};

const statusVariant = (s: string) => {
  if (s === 'Awarded') return 'approved';
  if (s === 'Cancelled') return 'rejected';
  if (s === 'Published') return 'pending';
  return 'neutral';
};

export default function TenderManagement() {
  const [data, setData] = useState<Tender[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Tender>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.tenderNo) {
      ToastService.error('Tender Number is required.');
      return;
    }
    if (popup.mode === 'create') {
      const proj = projects.find(p => p.id === form.projectId);
      setData(prev => [
        ...prev,
        {
          ...form,
          id: String(Date.now()),
          projectName: proj?.name ?? '',
        } as Tender,
      ]);
      ToastService.success('Tender created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Tender) : d
        )
      );
      ToastService.success('Tender updated.');
    }
    close();
  };

  const handleDelete = (item: Tender) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Tender deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Tender Management"
      description="Manage the tender publication, bidding, and award process."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Tender Management' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'tenderNo', header: 'Tender No' },
            { field: 'projectName', header: 'Project' },
            { field: 'publishDate', header: 'Publish Date' },
            { field: 'closingDate', header: 'Closing Date' },
            {
              field: 'estimatedValue',
              header: 'Estimated Value',
              cell: (item: Tender) => (
                <span>₹{item.estimatedValue.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Tender) => (
                <StatusBadge
                  label={item.status}
                  variant={statusVariant(item.status)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Tender) => (
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
                    onClick={() => handleDelete(item)}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Tender"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search tenders..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Create Tender'
            : popup.mode === 'edit'
              ? 'Edit Tender'
              : 'View Tender'
        }
        subtitle="Tender details and eligibility criteria."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Tender Number"
            placeholder="e.g. TDR-2025-005"
            value={form.tenderNo ?? ''}
            onChange={v => setForm(f => ({ ...f, tenderNo: v }))}
            required
            disabled={isReadOnly}
          />
          <DropDownList
            label="Project"
            data={PROJECT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.projectId}
            onChange={v => setForm(f => ({ ...f, projectId: v as string }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={3}>
          <DropDownList
            label="Tender Type"
            data={TENDER_TYPES}
            textField="name"
            optionValue="value"
            value={form.tenderType}
            onChange={v => setForm(f => ({ ...f, tenderType: v as any }))}
            disabled={isReadOnly}
          />
          <DatePicker
            label="Publish Date"
            value={form.publishDate ? new Date(form.publishDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                publishDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
          <DatePicker
            label="Closing Date"
            value={form.closingDate ? new Date(form.closingDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                closingDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <TextBox
            label="Estimated Value (₹)"
            placeholder="e.g. 7500000"
            value={String(form.estimatedValue ?? '')}
            onChange={v => setForm(f => ({ ...f, estimatedValue: Number(v) }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={STATUSES}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Eligibility"
          placeholder="Eligibility criteria for contractors"
          value={form.eligibility ?? ''}
          onChange={v => setForm(f => ({ ...f, eligibility: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        <TextArea
          label="Remarks"
          placeholder="Additional remarks"
          value={form.remarks ?? ''}
          onChange={v => setForm(f => ({ ...f, remarks: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Create' : 'Update'}
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
